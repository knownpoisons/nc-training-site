// ═══════════════════════════════════════════════════════════════════════════════
// DRAFT LINT — aggregate every F2 output rule into one verdict.
//
// HARD violations force a regenerate (banned words, unverified stats, over the
// word cap, a missing [PERSONALISE] marker when one is required — the system
// never fakes personal knowledge). WARNINGS are reported but don't block
// (British spelling, a doubled CTA) — the prompt already steers these and Jem
// sees them on the draft.
// ═══════════════════════════════════════════════════════════════════════════════

import { checkBannedWords } from "./bannedWords";
import { checkStats } from "./statGuard";
import type { ProofRules } from "./proof";

export interface DraftReport {
  ok: boolean; // no HARD violations
  hard: string[];
  warnings: string[];
  wordCount: number;
}

export interface LintOptions {
  maxWords: number; // 120 for outreach touches
  requirePersonalise: boolean;
}

// American → British, the spellings most likely to slip through.
const US_TO_UK: Record<string, string> = {
  organize: "organise", organized: "organised", organization: "organisation",
  color: "colour", colors: "colours", favorite: "favourite", center: "centre",
  optimize: "optimise", optimized: "optimised", realize: "realise",
  behavior: "behaviour", catalog: "catalogue", analyze: "analyse",
  maximize: "maximise", prioritize: "prioritise", personalize: "personalise",
  customization: "customisation", traveled: "travelled",
};

export function wordCount(text: string): number {
  // Don't count bracketed markers like [PERSONALISE …] toward the outreach length.
  const stripped = text.replace(/\[[^\]]*\]/g, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function hasPersonaliseMarker(text: string): boolean {
  return /\[personalise/i.test(text);
}

function americanSpellings(text: string): string[] {
  const hay = text.toLowerCase();
  const found: string[] = [];
  for (const us of Object.keys(US_TO_UK)) {
    if (new RegExp(`\\b${us}\\b`).test(hay)) found.push(`${us} → ${US_TO_UK[us]}`);
  }
  return found;
}

function doubledCta(text: string): boolean {
  const t = text.toLowerCase();
  // A scorecard *CTA* (a link / "two minutes" pitch), not just the word as
  // context — the scorecard follow-up lane references "the scorecard" by nature.
  const hasScorecardCta = /\[scorecard link\]|scorecard[^.?!]*\b(two|2)\s*minutes|take the scorecard/.test(t);
  const hasCall = /(15 minutes?|book a|two time|jump on a call|worth 15)/.test(t);
  return hasScorecardCta && hasCall;
}

export function lintDraft(
  draft: string,
  rules: ProofRules,
  opts: LintOptions
): DraftReport {
  const hard: string[] = [];
  const warnings: string[] = [];

  for (const b of checkBannedWords(draft)) hard.push(`banned ${b.category}: "${b.term}"`);
  for (const s of checkStats(draft, rules)) hard.push(`stat ${s.reason}: "${s.token}"`);

  const wc = wordCount(draft);
  if (wc > opts.maxWords) hard.push(`too long: ${wc} words (max ${opts.maxWords})`);

  if (opts.requirePersonalise && !hasPersonaliseMarker(draft)) {
    hard.push("missing [PERSONALISE] marker — draft may be faking personal knowledge");
  }

  const spellings = americanSpellings(draft);
  if (spellings.length) warnings.push(`American spelling: ${spellings.join(", ")}`);
  if (doubledCta(draft)) warnings.push("two CTAs (scorecard + call) — keep one");

  return { ok: hard.length === 0, hard, warnings, wordCount: wc };
}
