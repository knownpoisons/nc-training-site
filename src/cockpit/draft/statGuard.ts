// ═══════════════════════════════════════════════════════════════════════════════
// STAT GUARD — hard gate. Every currency/percentage/multiplier in a draft must be
// cleared by PROOF.md. This is the guard the handoff calls non-negotiable: one
// unverified number in one email can kill a $50k deal.
//
// A token fails when it is:
//   • explicitly in PROOF.md's HARD-BANNED list ($8M, 96%, $280k, …), OR
//   • not present in PROOF.md's cleared region at all, OR
//   • a cleared number wearing a drift qualifier ("nearly $4M", "over 90%").
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DRIFT_QUALIFIERS,
  extractStatTokens,
  type ProofRules,
} from "./proof";

export interface StatViolation {
  token: string;
  reason: "banned" | "not-in-proof" | "drifted";
}

export function checkStats(draft: string, rules: ProofRules): StatViolation[] {
  const violations: StatViolation[] = [];
  const tokens = extractStatTokens(draft);

  for (const t of tokens) {
    if (rules.banned.has(t.canonical)) {
      violations.push({ token: t.raw, reason: "banned" });
      continue;
    }
    if (!rules.allowed.has(t.canonical)) {
      violations.push({ token: t.raw, reason: "not-in-proof" });
      continue;
    }
    // Cleared value, but check for a drift qualifier immediately before it.
    const preceding = draft.slice(Math.max(0, t.index - 24), t.index).toLowerCase();
    if (DRIFT_QUALIFIERS.some((q) => new RegExp(`\\b${q}\\s*$`).test(preceding))) {
      violations.push({ token: t.raw, reason: "drifted" });
    }
  }
  return violations;
}
