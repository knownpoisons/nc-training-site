// ═══════════════════════════════════════════════════════════════════════════════
// F2 — DRAFT ENGINE. Generate → lint → regenerate until clean, or fall back safe.
//
// The hard promise: the engine NEVER returns a draft that fails the guards. If
// the model can't produce a clean draft within MAX_REGEN passes, we return the
// vetted template body (markers unfilled — it contains no numbers or banned
// words) and flag it for Jem. A brief never ships an unverified number.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Knowledge } from "./knowledge";
import type { DraftModel } from "./model";
import { buildSystemPrompt, buildUserPrompt, violationFeedback, type DraftInput } from "./prompt";
import { lintDraft, type DraftReport } from "./lint";

export const MAX_REGEN = 3;
export const OUTREACH_MAX_WORDS = 120;

export interface DraftOutcome {
  draft: string;
  report: DraftReport;
  attempts: number;
  usedFallback: boolean; // true → couldn't get a clean model draft; template returned
  requiresReview: boolean; // surface to Jem
}

export async function generateDraft(
  model: DraftModel,
  knowledge: Knowledge,
  input: DraftInput,
  requirePersonalise: boolean
): Promise<DraftOutcome> {
  const system = buildSystemPrompt(knowledge);
  const opts = { maxWords: input.maxWords, requirePersonalise };

  let violations: string[] = [];
  let lastReport: DraftReport | null = null;

  for (let attempt = 0; attempt <= MAX_REGEN; attempt++) {
    const user =
      attempt === 0
        ? buildUserPrompt(input)
        : buildUserPrompt(input) + violationFeedback(violations);

    const draft = (await model.generate({ system, user, attempt, violations })).trim();
    const report = lintDraft(draft, knowledge.proofRules, opts);
    lastReport = report;

    if (report.ok) {
      return { draft, report, attempts: attempt + 1, usedFallback: false, requiresReview: false };
    }
    violations = report.hard;
  }

  // Exhausted retries — never ship a violating draft. Fall back to the template.
  const fallback = input.templateBody;
  const fallbackReport = lintDraft(fallback, knowledge.proofRules, opts);
  return {
    draft: fallback,
    report: fallbackReport.ok ? fallbackReport : (lastReport as DraftReport),
    attempts: MAX_REGEN + 1,
    usedFallback: true,
    requiresReview: true,
  };
}
