// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT ASSEMBLY — build the system + user prompt for one draft.
// System carries the standing rules (voice, angle, PLAYBOOK, PROOF, hard bans);
// user carries this specific touch (template, prospect record, prior context).
// On a regeneration pass, the previous violations are appended so the model
// fixes exactly what failed.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Knowledge } from "./knowledge";
import type { StoreProspect } from "../store/types";

export interface DraftInput {
  prospect: Pick<StoreProspect, "name" | "role" | "company" | "notes" | "linkedinUrl">;
  touchNumber: number;
  lane: string;
  templateBody: string;
  priorTouches?: string[];
  replyText?: string | null;
  maxWords: number;
  /** How this lead reached Jem (their signup/list/scorecard) — always true, safe
   *  to reference for the personal line even with no web research. */
  wayIn?: string | null;
  /** Enrichment dossier — cited facts about who they are (may be null / honest-thin). */
  dossier?: string | null;
  /** Suggested opener angle from enrichment. */
  openerAngle?: string | null;
  /** Distilled call brief (what they cared about, objections, next step) —
   *  fills the [CALL DETAIL] markers in post-call follow-ups. */
  callBrief?: string | null;
  /** Jem's booking link — offer it in ask-stage CTAs alongside two times. */
  bookingUrl?: string | null;
}

export function buildSystemPrompt(k: Knowledge): string {
  return [
    "You are the draft engine for NotContent, writing 1:1 outreach as Jeremy Somers (Jem).",
    "You draft; a human sends. Write ONE message only.",
    "",
    "Absolute rules, enforced in code after you — breaking them wastes a regeneration:",
    "• Numbers: use ONLY figures that appear in the PROOF file below. No dollar",
    "  figure, percentage, or multiplier may appear unless it is in PROOF. Never",
    "  invent, round, or drift a number (no 'nearly', 'over', 'more than').",
    "• Client attribution: until a stat is cleared as NAMED, use the UNNAMED",
    "  fallback wording from PROOF (e.g. 'a beauty holding company'), not the",
    "  client's name.",
    "• Never write: banned sales clichés, tool names or seat costs, unsigned/NDA",
    "  client names (Nike above all), charisma-only lines, or profanity.",
    `• Under ${"120"} words. One CTA. British spelling. Sentence case.`,
    "",
    "═══ PERSONALISATION — do the research so Jem doesn't have to ═══",
    "Fill the opening personal line yourself, from what you're given, in this order:",
    "1. If a DOSSIER with a cited fact is provided, open with a specific, human line",
    "   built from it (e.g. their launch, hire, or post). Do NOT leave a gap.",
    "2. Else, use their WAY IN — how they reached Jem (took the scorecard, signed",
    "   up to the community, connected on LinkedIn). Always true, always safe.",
    "3. ONLY if you have neither, keep a literal [PERSONALISE — what to look for]",
    "   marker as a gap. Never invent a detail. Better an honest gap than a fake fact.",
    "Never fabricate a campaign, hire, or opinion you weren't given.",
    "",
    "═══ TONE (how Jem wants these to land) ═══",
    "• Warm and human first — a talented mate reaching out, NOT a tech founder",
    "  pitching. Kill startup-founder cadence ('teams like yours', 'at that",
    "  point', 'in motion', 'let's unpack'). Contractions, a real voice, easy.",
    "• Respect their time out loud — give an easy, no-pressure out every time",
    "  ('no stress if the timing's off', 'won't chase you on this'). The 'I'm",
    "  not here to waste your time' energy is the whole posture.",
    "• Carry a light, playful overconfidence — earned swagger said with a wink,",
    "  never arrogant. The work backs it up, so don't oversell it; undersell it",
    "  and let the number do the bragging.",
    "• Touch 1 stays light and human — a genuine hello, not a stat dump. Save the",
    "  heavy proof for the value touch.",
    "",
    "═══ CTA STYLE ═══",
    "• The three-things ask is a quickfire, not a formal question: 'quick one, off",
    "  the top of your head — name 3 processes that take the most time, cost the",
    "  most, and annoy you the most'. Then: 'I'll tell you which we can automate,",
    "  and which we can't.' Keep the 'which we can't' — it is load-bearing.",
    "• When you cite a proof number, tie it to the offer: a focused set of AI",
    "  training sessions built around their slowest, costliest, most annoying",
    "  processes. The number earns the offer; don't oversell it.",
    "• For scorecard leads: lead with their single biggest flagged issue and",
    "  propose to understand it and solve THAT — not a generic 15-minute chat.",
    "",
    "═══ PLAYBOOK (voice + angle + what never gets written) ═══",
    k.playbook,
    "",
    "═══ PROOF (the only numbers you may use) ═══",
    k.proof,
  ].join("\n");
}

export function buildUserPrompt(input: DraftInput): string {
  const p = input.prospect;
  const lines: string[] = [];
  lines.push(`Write touch ${input.touchNumber} (${input.lane} lane) to this prospect.`);
  lines.push("");
  lines.push("PROSPECT");
  lines.push(`• Name: ${p.name}`);
  if (p.role) lines.push(`• Role: ${p.role}`);
  if (p.company) lines.push(`• Company: ${p.company}`);
  if (p.linkedinUrl) lines.push(`• LinkedIn: ${p.linkedinUrl}`);
  if (input.wayIn) lines.push(`• Way in (how they reached Jem): ${input.wayIn}`);
  if (input.dossier) lines.push(`• Dossier (cited research): ${input.dossier}`);
  if (input.openerAngle) lines.push(`• Suggested opener angle: ${input.openerAngle}`);
  if (input.callBrief) lines.push(`• Call brief (from their last call — use for [CALL DETAIL]): ${input.callBrief}`);
  if (input.bookingUrl) lines.push(`• Booking link (offer in ask CTAs instead of asking for availability): ${input.bookingUrl}`);
  if (p.notes) lines.push(`• Notes: ${p.notes}`);
  if (input.priorTouches?.length) {
    lines.push("• Prior touches sent:");
    for (const t of input.priorTouches) lines.push(`   – ${t}`);
  }
  if (input.replyText) lines.push(`• Their reply: ${input.replyText}`);
  lines.push("");
  lines.push("TEMPLATE (adapt in Jem's voice; keep the shape and the markers):");
  lines.push(input.templateBody);
  lines.push("");
  lines.push(`Return only the message body, under ${input.maxWords} words.`);
  return lines.join("\n");
}

/** Appended to the user prompt on a regeneration pass. */
export function violationFeedback(violations: string[]): string {
  return [
    "",
    "Your previous draft was rejected by the automated checks:",
    ...violations.map((v) => `• ${v}`),
    "Rewrite fixing exactly these. Do not introduce new numbers.",
  ].join("\n");
}
