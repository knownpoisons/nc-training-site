import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { insertScorecardLead } from "@/lib/supabase";
import {
  renderScorecardEmailHTML,
  renderScorecardEmailText,
} from "@/lib/email/scorecard-email";
import type { ScoreResult } from "@/app/assess/logic";

// Each third-party call is wrapped so one failure doesn't break the others.
// The user always gets `{ ok: true }` — we never bubble infra errors to them.

interface RequestBody {
  name: string;
  email: string;
  result: ScoreResult;
  answers: unknown; // raw AnswerRecord[] for Supabase JSONB
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { name, email, result, answers } = body;

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

    // Fire-and-collect all three integrations in parallel.
    const [supabaseRes, beehiivRes, emailRes] = await Promise.allSettled([
      storeInSupabase({ name, email, result, answers }),
      subscribeToBeehiiv({ name, email, result }),
      sendResultEmail({ name, email, result, siteUrl }),
    ]);

    logSettledResult("supabase", supabaseRes);
    logSettledResult("beehiiv", beehiivRes);
    logSettledResult("resend", emailRes);

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
