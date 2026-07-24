// ═══════════════════════════════════════════════════════════════════════════════
// SCORECARD LEAD BRIEF
// Turns a completed scorecard into (a) the full Q&A transcript and (b) a short
// sales read — where the lead is and what Jeremy should do next.
//
// The read is written by Claude at submit time. If the API key is missing or the
// call fails, a deterministic fallback brief is used instead, so the Slack ping
// never arrives without a recommendation.
// ═══════════════════════════════════════════════════════════════════════════════

import { questions, DIMENSION_MAX } from "@/app/assess/questions";
import { programs } from "@/app/assess/programs";
import type { ScoreResult, AnswerRecord } from "@/app/assess/logic";
import { tierCopy } from "@/app/assess/tiers";

const MODEL = process.env.SCORECARD_BRIEF_MODEL ?? "claude-sonnet-5";

// ─── Answer transcript ────────────────────────────────────────────────────────

export interface AnsweredQuestion {
  id: number;
  question: string;
  answer: string;
  points: number | null; // null for unscored segmentation questions (Q6, Q7)
}

/** Narrow the untrusted `answers` payload to well-formed AnswerRecords. */
export function parseAnswers(raw: unknown): AnswerRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (a): a is AnswerRecord =>
      !!a &&
      typeof a === "object" &&
      typeof (a as AnswerRecord).questionId === "number" &&
      Array.isArray((a as AnswerRecord).indices)
  );
}

/**
 * Every question in scorecard order with the answer they gave. Questions they
 * skipped are omitted rather than shown blank.
 */
export function buildTranscript(raw: unknown): AnsweredQuestion[] {
  const answers = parseAnswers(raw);
  const out: AnsweredQuestion[] = [];

  for (const q of questions) {
    const a = answers.find((x) => x.questionId === q.id);
    if (!a) continue;

    const opts = a.indices.map((i) => q.options[i]).filter(Boolean);
    if (opts.length === 0) continue;

    const scored = opts.some((o) => o.dimension && o.dimension !== "none");

    out.push({
      id: q.id,
      question: q.text,
      answer: opts.map((o) => o.label).join(" · "),
      points: scored ? opts.reduce((sum, o) => sum + (o.points ?? 0), 0) : null,
    });
  }

  return out;
}

/** Slack-mrkdwn transcript, one line per question. */
export function renderTranscript(transcript: AnsweredQuestion[]): string {
  return transcript
    .map((t) => {
      const pts = t.points === null ? "" : `  _(${t.points} pts)_`;
      return `*Q${t.id}. ${t.question}*\n${t.answer}${pts}`;
    })
    .join("\n\n");
}

// ─── The sales read ───────────────────────────────────────────────────────────

const SYSTEM = [
  "You are briefing Jeremy Somers, who runs NotContent — AI training for enterprise",
  "creative teams. A prospect just completed his AI Readiness Scorecard. Write him a",
  "short internal read so he can pick up the phone.",
  "",
  "He sells exactly two things, nothing else:",
  `  1. Audit Workshop — ${programs.foundations.duration}, ${programs.foundations.pricing}. ${programs.foundations.tagline}`,
  `  2. The Operating Model — ${programs.transformation.duration}, ${programs.transformation.pricing}. ${programs.transformation.tagline}`,
  "",
  "Return EXACTLY five labelled sections in Slack mrkdwn, nothing before or after:",
  "",
  "*Where they are* — 2 sentences reading their actual answers, not the tier label.",
  "",
  "*Routing check* — the scorecard routes on tier alone, which overshoots and",
  "undershoots. Compare what it recommended against what their headcount (Q5),",
  "spend (Q8) and urgency (Q4) answers actually support, and say which of the two",
  "offers to actually lead with. A high score with a small team or low spend means",
  "lead with the Audit Workshop and let it size the real engagement. A low score",
  "with real budget and urgency can carry more than the tier suggests. If the",
  "routing genuinely fits, say so in one line and move on — do not manufacture a",
  "mismatch.",
  "",
  "*The opening line* — one sentence he can literally say, in quotes.",
  "",
  "*Next step* — one concrete action, naming which of the two offers to lead with.",
  "",
  "*Draft email* — a ready-to-send first outreach. Give a `Subject:` line, then the",
  "body inside a triple-backtick code block so he can copy it clean. Written as",
  "Jeremy in first person singular (I, not we). Short — 90 words of body at most.",
  "Reference something they actually answered so it can't read as a template. One",
  "clear ask at the end, and it should match the offer named in Next step. No",
  "pleasantries about hoping they're well, no 'circling back', no bullet lists.",
  "Sign off as Jeremy.",
  "",
  "Rules:",
  "- Use ONLY what is in the answers below. You know nothing else about this company.",
  "- Never invent headcount, budget, clients, industry, tooling or history.",
  "- No stats, dollar figures, percentages or client names — not one. This applies",
  "  to the email too: never cite a result, a named client or a number at them.",
  "- Quote their own words back where it sharpens the read.",
  "- Direct, lowercase-ish, no hype, no 'exciting opportunity'.",
  "- If their answers are thin, say so plainly rather than padding.",
].join("\n");

function buildUserPrompt(args: {
  name: string;
  company?: string;
  email: string;
  result: ScoreResult;
  transcript: AnsweredQuestion[];
}): string {
  const { name, company, email, result, transcript } = args;
  const tier = tierCopy[result.tier];

  return [
    `Prospect: ${name || "(no name given)"} <${email}>`,
    `Company: ${company || "(not given)"} — you know nothing about this company beyond its name.`,
    `Score: ${result.normalizedScore}/100 — ${result.tierLabel}`,
    `Tier means: ${tier.tagline}`,
    `Sub-scores: adoption ${result.dimensions.adoption}/${DIMENSION_MAX.adoption} (how far along + how much pain), ` +
      `buying intent ${result.dimensions.readiness}/${DIMENSION_MAX.readiness}, ` +
      `budget & blockers ${result.dimensions.blockers}/${DIMENSION_MAX.blockers}`,
    `Stack: ${result.stackCount} tools — Bucket ${result.stackBucket} (${result.stackBucket === "A" ? "light" : "deep"})`,
    `Work type: ${result.workType ?? "not given"}`,
    `Scorecard routes them to: ${programs[result.recommendedProgram].label} ` +
      `(${programs[result.recommendedProgram].pricing}, ${programs[result.recommendedProgram].duration}) ` +
      `— on tier alone. Sanity-check that against Q5 headcount, Q8 spend and Q4 urgency below.`,
    "",
    "Their answers, verbatim:",
    ...transcript.map((t) => `Q${t.id}. ${t.question}\n→ ${t.answer}`),
  ].join("\n");
}

/**
 * Deterministic brief. Used when Claude is unavailable — always produces
 * something actionable from the answers alone.
 */
export function fallbackBrief(args: {
  name?: string;
  result: ScoreResult;
  transcript: AnsweredQuestion[];
}): string {
  const { name, result, transcript } = args;
  const answerFor = (id: number) =>
    transcript.find((t) => t.id === id)?.answer ?? null;

  const pain = answerFor(2);
  const urgency = answerFor(4);
  const headcount = answerFor(5);
  const spend = answerFor(8);
  const blockers = answerFor(9);
  const goal = answerFor(10);
  const routed = programs[result.recommendedProgram];

  const hot =
    !!urgency &&
    (urgency.startsWith("Critical") || urgency.startsWith("Urgent"));

  // Routing check — the tier alone can overshoot. A small team or a thin tool
  // budget won't carry an 8-week bespoke build regardless of how well they scored.
  const smallTeam = headcount === "5 or fewer";
  const lowSpend =
    spend === "Under $100" || spend === "$100–$500" || spend === "Honestly, we don't know";
  const overshoot =
    result.recommendedProgram === "transformation" && (smallTeam || lowSpend);
  const lead = overshoot ? programs.foundations : routed;

  const routingCheck = overshoot
    ? `Scorecard routes to ${routed.label} (${routed.pricing}), but they answered ` +
      [smallTeam ? `"${headcount}"` : null, lowSpend ? `"${spend}"` : null]
        .filter(Boolean)
        .join(" and ") +
      `. That won't carry it. Lead with ${programs.foundations.label} and let the audit size the real engagement.`
    : `${routed.label} fits what they answered on headcount and spend. No mismatch.`;

  // Blockers is multi-select — list the first two and count the rest, or the
  // sentence becomes unreadable for anyone who ticked everything.
  const blockerList = blockers ? blockers.split(" · ") : [];
  const blockerPhrase =
    blockerList.length === 0
      ? null
      : blockerList.length <= 2
        ? blockerList.map((b) => b.split(" — ")[0].toLowerCase()).join(" and ")
        : `${blockerList
            .slice(0, 2)
            .map((b) => b.split(" — ")[0].toLowerCase())
            .join(", ")} (+${blockerList.length - 2} more)`;

  const where = [
    `${result.tierLabel} at ${result.normalizedScore}/100.`,
    pain ? `Day to day: ${pain.toLowerCase()}.` : null,
    blockerPhrase ? `Blocked by ${blockerPhrase}.` : null,
    spend ? `Spending ${spend.toLowerCase()} a month on tools.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const opener = goal
    ? `You said success in 90 days looks like: ${goal.toLowerCase()} — talk me through what's in the way of that.`
    : `Talk me through where AI is actually landing in your team day to day.`;

  const next = hot
    ? `They flagged this as ${urgency!.toLowerCase()} — call this week. Lead with the ${lead.label}.`
    : `No hard deadline in their answers, so lead with the ${lead.label} and let it set the timeline.`;

  const emailBody = [
    `Hi${name ? ` ${name.split(" ")[0]}` : ""},`,
    ``,
    `Thanks for running the scorecard — you came out ${result.normalizedScore}/100, ${result.tierLabel.toLowerCase()}.`,
    ``,
    pain
      ? `The answer that stood out: ${pain.toLowerCase()}. That's usually a system problem rather than a skills one, and it doesn't fix itself as the team gets busier.`
      : `The pattern in your answers is a system problem rather than a skills one.`,
    ``,
    `Worth half an hour to talk through what's actually in the way? I'd start with the ${lead.label} — ${lead.duration.toLowerCase()}.`,
    ``,
    `Jeremy`,
  ].join("\n");

  return [
    `*Where they are*\n${where}`,
    `*Routing check*\n${routingCheck}`,
    `*The opening line*\n"${opener}"`,
    `*Next step*\n${next}`,
    `*Draft email*\nSubject: Your scorecard — ${result.tierLabel.toLowerCase()}\n\`\`\`\n${emailBody}\n\`\`\``,
    `_(auto-generated — Claude brief unavailable)_`,
  ].join("\n\n");
}

/** Ask Claude for the read. Falls back deterministically on any failure. */
export async function writeLeadBrief(args: {
  name: string;
  company?: string;
  email: string;
  result: ScoreResult;
  transcript: AnsweredQuestion[];
}): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return fallbackBrief(args);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1400,
        system: SYSTEM,
        messages: [{ role: "user", content: buildUserPrompt(args) }],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) throw new Error(`brief_${res.status}`);

    const json = (await res.json()) as {
      content: Array<{ type: string; text?: string }>;
    };
    const text = json.content
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("\n")
      .trim();

    return text || fallbackBrief(args);
  } catch (err) {
    console.error("[assess] brief failed, using fallback:", err);
    return fallbackBrief(args);
  }
}
