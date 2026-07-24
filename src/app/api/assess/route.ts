import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { insertScorecardLead } from "@/lib/supabase";
import {
  renderScorecardEmailHTML,
  renderScorecardEmailText,
} from "@/lib/email/scorecard-email";
import type { ScoreResult } from "@/app/assess/logic";
import { DIMENSION_MAX, RAW_MAX } from "@/app/assess/questions";
import { programs } from "@/app/assess/programs";
import {
  buildTranscript,
  renderTranscript,
  writeLeadBrief,
} from "@/lib/scorecard-brief";
import { ingestScorecardCompleter } from "@/cockpit/engine-zero/scorecardIntake";

// Each third-party call is wrapped so one failure doesn't break the others.
// The user always gets `{ ok: true }` — we never bubble infra errors to them.

interface RequestBody {
  name: string;
  company?: string;
  email: string;
  result: ScoreResult;
  answers: unknown; // raw AnswerRecord[] for Supabase JSONB
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { name, company, email, result, answers } = body;

    if (!email || !result) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      "https://training.notcontent.ai";

    // Fire-and-collect all integrations in parallel. A completer also enters the
    // cockpit's reviewed queue as a HOT lead (best-effort — never blocks).
    const [supabaseRes, beehiivRes, emailRes, adminRes, slackRes, cockpitRes] =
      await Promise.allSettled([
        storeInSupabase({ name, email, result, answers }),
        subscribeToBeehiiv({ name, email, result }),
        sendResultEmail({ name, email, result, siteUrl }),
        notifyAdminByEmail({ name, company, email, result }),
        notifySlack({ name, company, email, result, answers }),
        ingestScorecardCompleter({
          name,
          email,
          tier: result.tier,
          scoreNormalized: result.normalizedScore,
          workType: result.workType,
        }),
      ]);

    logSettledResult("supabase", supabaseRes);
    logSettledResult("beehiiv", beehiivRes);
    logSettledResult("resend", emailRes);
    logSettledResult("admin-email", adminRes);
    logSettledResult("slack", slackRes);
    logSettledResult("cockpit", cockpitRes);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[assess] fatal:", err);
    // Always 200 — the user has already seen their result client-side.
    return NextResponse.json({ ok: true });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE — primary lead store
// ═══════════════════════════════════════════════════════════════════════════════
async function storeInSupabase(args: {
  name: string;
  email: string;
  result: ScoreResult;
  answers: unknown;
}): Promise<{ ok: boolean; note?: string }> {
  const { name, email, result, answers } = args;
  const insert = await insertScorecardLead({
    name,
    email,
    tier: result.tier,
    score_normalized: result.normalizedScore,
    score_raw: result.rawScore,
    adoption_score: result.dimensions.adoption,
    readiness_score: result.dimensions.readiness,
    blockers_score: result.dimensions.blockers,
    stack_bucket: result.stackBucket,
    stack_count: result.stackCount,
    stack_selections: result.stackSelections,
    work_type: result.workType,
    recommended_program: result.recommendedProgram,
    answers,
  });
  if (!insert.ok) {
    if (insert.error === "SUPABASE_NOT_CONFIGURED") {
      return { ok: true, note: "supabase_skipped_env_missing" };
    }
    throw new Error(insert.error ?? "supabase_error");
  }
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BEEHIIV — keep list-building, pass rich custom fields
// ═══════════════════════════════════════════════════════════════════════════════
async function subscribeToBeehiiv(args: {
  name: string;
  email: string;
  result: ScoreResult;
}): Promise<{ ok: boolean; note?: string }> {
  const { name, email, result } = args;
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    return { ok: true, note: "beehiiv_skipped_env_missing" };
  }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: false,
        utm_source: "ai-readiness-scorecard",
        utm_medium: "organic",
        custom_fields: [
          { name: "first_name", value: name ?? "" },
          { name: "ai_score", value: String(result.normalizedScore) },
          { name: "ai_tier", value: result.tier },
          { name: "stack_bucket", value: result.stackBucket },
          { name: "stack_count", value: String(result.stackCount) },
          { name: "work_type", value: result.workType ?? "" },
          { name: "recommended_program", value: result.recommendedProgram },
        ],
        tags: [
          "ai-scorecard",
          `tier-${result.tier}`,
          `bucket-${result.stackBucket}`,
          `program-${result.recommendedProgram}`,
        ],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`beehiiv_${res.status}: ${errText.slice(0, 200)}`);
  }
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESEND — transactional result email
// ═══════════════════════════════════════════════════════════════════════════════
async function sendResultEmail(args: {
  name: string;
  email: string;
  result: ScoreResult;
  siteUrl: string;
}): Promise<{ ok: boolean; note?: string }> {
  const { name, email, result, siteUrl } = args;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL; // e.g. "Jeremy Somers <jeremy@notcontent.ai>"

  if (!apiKey || !from) {
    return { ok: true, note: "resend_skipped_env_missing" };
  }

  const resend = new Resend(apiKey);
  const html = renderScorecardEmailHTML({ name, result, siteUrl });
  const text = renderScorecardEmailText({ name, result, siteUrl });

  const sendRes = await resend.emails.send({
    from,
    to: email,
    subject: `${name}, your AI Readiness Scorecard — ${result.normalizedScore}/100`,
    html,
    text,
    replyTo: process.env.RESEND_REPLY_TO ?? undefined,
  });

  if (sendRes.error) {
    throw new Error(`resend: ${sendRes.error.message}`);
  }
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN NOTIFICATION — email Jeremy every new lead so he can follow up
// Reply-To is set to the LEAD so a reply goes straight to the prospect.
// ═══════════════════════════════════════════════════════════════════════════════
async function notifyAdminByEmail(args: {
  name: string;
  company?: string;
  email: string;
  result: ScoreResult;
}): Promise<{ ok: boolean; note?: string }> {
  const { name, company, email, result } = args;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.LEAD_NOTIFY_EMAIL ?? "getcontent@notcontent.ai";

  if (!apiKey || !from) {
    return { ok: true, note: "admin_email_skipped_env_missing" };
  }

  const resend = new Resend(apiKey);
  const rows: Array<[string, string]> = [
    ["Name", name || "—"],
    ["Company", company || "—"],
    ["Email", email],
    ["Score", `${result.normalizedScore}/100`],
    ["Tier", result.tier],
    ["Recommended program", result.recommendedProgram],
    ["Work type", result.workType ?? "—"],
    ["Tool stack", `${result.stackCount} tools (${result.stackBucket})`],
    ["Adoption / Readiness / Blockers", `${result.dimensions.adoption} / ${result.dimensions.readiness} / ${result.dimensions.blockers}`],
  ];

  const textBody =
    `New AI Readiness Scorecard lead — follow up:\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nReply to this email to respond directly to ${name || email}.`;

  const htmlBody =
    `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px">` +
    `<h2 style="margin:0 0 4px;font-weight:600">New Scorecard lead</h2>` +
    `<p style="margin:0 0 16px;color:#555">Reply to this email to respond directly to ${name || email}.</p>` +
    `<table style="border-collapse:collapse;width:100%;font-size:14px">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;font-weight:500">${v}</td></tr>`
      )
      .join("") +
    `</table></div>`;

  const sendRes = await resend.emails.send({
    from,
    to,
    replyTo: email, // reply goes to the prospect, not to Jeremy's own inbox
    subject: `New lead: ${name || email} — ${result.normalizedScore}/100 (${result.tier})`,
    html: htmlBody,
    text: textBody,
  });

  if (sendRes.error) {
    throw new Error(`admin_email: ${sendRes.error.message}`);
  }
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLACK — instant lead ping via Incoming Webhook
// ═══════════════════════════════════════════════════════════════════════════════
/** Slack section blocks cap at 3000 chars — split long text across blocks. */
function chunkForSlack(text: string, limit = 2800): string[] {
  if (text.length <= limit) return [text];
  const chunks: string[] = [];
  let current = "";
  for (const para of text.split("\n\n")) {
    if (current && current.length + para.length + 2 > limit) {
      chunks.push(current);
      current = para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function notifySlack(args: {
  name: string;
  company?: string;
  email: string;
  result: ScoreResult;
  answers: unknown;
}): Promise<{ ok: boolean; note?: string }> {
  const { name, company, email, result, answers } = args;
  const webhook = process.env.SLACK_WEBHOOK_URL;

  if (!webhook) {
    return { ok: true, note: "slack_skipped_env_missing" };
  }

  const transcript = buildTranscript(answers);
  const brief = await writeLeadBrief({
    name,
    company,
    email,
    result,
    transcript,
  });

  const who = [name || email, company].filter(Boolean).join(" · ");
  const summary = `New Scorecard lead: ${who} — ${result.normalizedScore}/100 (${result.tierLabel})`;
  const program = programs[result.recommendedProgram];

  const blocks: unknown[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `🎯 ${result.normalizedScore}/100 — ${result.tierLabel}`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Name:*\n${name || "—"}` },
        { type: "mrkdwn", text: `*Company:*\n${company || "—"}` },
        { type: "mrkdwn", text: `*Email:*\n<mailto:${email}|${email}>` },
        {
          type: "mrkdwn",
          text: `*Score:*\n${result.normalizedScore}/100 (raw ${result.rawScore}/${RAW_MAX})`,
        },
        { type: "mrkdwn", text: `*Tier:*\n${result.tierLabel}` },
        {
          type: "mrkdwn",
          text: `*Stack:*\n${result.stackCount} tools · Bucket ${result.stackBucket} (${result.stackBucket === "A" ? "light" : "deep"})`,
        },
        { type: "mrkdwn", text: `*Work type:*\n${result.workType ?? "—"}` },
        {
          type: "mrkdwn",
          text: `*Routes to:*\n${program.label} — ${program.pricing}`,
        },
        {
          type: "mrkdwn",
          text:
            `*Sub-scores:*\n` +
            `Adoption ${result.dimensions.adoption}/${DIMENSION_MAX.adoption} · ` +
            `Intent ${result.dimensions.readiness}/${DIMENSION_MAX.readiness} · ` +
            `Budget ${result.dimensions.blockers}/${DIMENSION_MAX.blockers}`,
        },
      ],
    },
    { type: "divider" },
    ...chunkForSlack(brief).map((text) => ({
      type: "section",
      text: { type: "mrkdwn", text },
    })),
    { type: "divider" },
    {
      type: "section",
      text: { type: "mrkdwn", text: "*📋 What they actually answered*" },
    },
    ...chunkForSlack(renderTranscript(transcript)).map((text) => ({
      type: "section",
      text: { type: "mrkdwn", text },
    })),
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `via training.notcontent.ai/assess  ·  reply straight to <mailto:${email}|${email}>`,
        },
      ],
    },
  ];

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: summary, // fallback for notifications/previews
      blocks,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`slack_${res.status}: ${errText.slice(0, 200)}`);
  }
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
function logSettledResult(
  label: string,
  r: PromiseSettledResult<{ ok: boolean; note?: string }>
) {
  if (r.status === "fulfilled") {
    if (r.value.note) {
      console.log(`[assess] ${label}: ${r.value.note}`);
    } else {
      console.log(`[assess] ${label}: ok`);
    }
  } else {
    console.error(`[assess] ${label} FAILED:`, r.reason);
  }
}
