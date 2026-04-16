import { questions, DIMENSION_MAX, RAW_MAX, type Option, type Question } from "./questions";
import type { Program } from "./programs";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type Tier =
  | "starting_line"
  | "two_speed"
  | "capable_but_exposed"
  | "at_frontier";

export type StackBucket = "A" | "B";

export interface DimensionScores {
  adoption: number;
  readiness: number;
  blockers: number;
}

/**
 * Per-question answer record. Indices are 0-based into question.options.
 * - Single-select questions: `indices` has one entry.
 * - Multi-select & stack questions: `indices` has N entries.
 */
export interface AnswerRecord {
  questionId: number;
  indices: number[];
}

export interface ScoreResult {
  dimensions: DimensionScores;
  rawScore: number; // 0–96
  normalizedScore: number; // 0–100, rounded
  tier: Tier;
  tierLabel: string;
  stackBucket: StackBucket;
  stackCount: number;
  stackSelections: string[]; // tool ids
  workType: string | null; // Q6 segmentation tag
  recommendedProgram: Program;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORING
// ═══════════════════════════════════════════════════════════════════════════════

export function computeDimensions(answers: AnswerRecord[]): DimensionScores {
  const scores: DimensionScores = { adoption: 0, readiness: 0, blockers: 0 };

  for (const answer of answers) {
    const q = questions.find((x) => x.id === answer.questionId);
    if (!q) continue;

    for (const idx of answer.indices) {
      const opt = q.options[idx];
      if (!opt) continue;
      if (opt.dimension === "adoption") scores.adoption += opt.points;
      else if (opt.dimension === "readiness") scores.readiness += opt.points;
      else if (opt.dimension === "blockers") scores.blockers += opt.points;
    }
  }

  // Clamp per dimension max (defensive — shouldn't trigger with correct data)
  scores.adoption = Math.min(scores.adoption, DIMENSION_MAX.adoption);
  scores.readiness = Math.min(scores.readiness, DIMENSION_MAX.readiness);
  scores.blockers = Math.min(scores.blockers, DIMENSION_MAX.blockers);

  return scores;
}

export function computeRawScore(dims: DimensionScores): number {
  return dims.adoption + dims.readiness + dims.blockers;
}

export function normalize(raw: number): number {
  return Math.round((raw / RAW_MAX) * 100);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIER
// ═══════════════════════════════════════════════════════════════════════════════

const TIER_LABELS: Record<Tier, string> = {
  starting_line: "STARTING LINE",
  two_speed: "TWO-SPEED",
  capable_but_exposed: "CAPABLE BUT EXPOSED",
  at_frontier: "AT THE FRONTIER",
};

export function getTier(normalizedScore: number): Tier {
  if (normalizedScore <= 30) return "starting_line";
  if (normalizedScore <= 55) return "two_speed";
  if (normalizedScore <= 79) return "capable_but_exposed";
  return "at_frontier";
}

export function getTierLabel(tier: Tier): string {
  return TIER_LABELS[tier];
}

// ═══════════════════════════════════════════════════════════════════════════════
// STACK AUDIT (Q7)
// ═══════════════════════════════════════════════════════════════════════════════

/** Tools that, on their own, still put a team in Bucket A (image-only stacks). */
const BUCKET_A_ONLY_TOOLS = new Set(["midjourney", "adobe_firefly"]);

export function computeStackAudit(
  selections: string[]
): { bucket: StackBucket; count: number; selections: string[] } {
  // Filter out "none" sentinel from count
  const real = selections.filter((id) => id !== "none");
  const hasNone = selections.includes("none");

  // Bucket A conditions:
  //  - "None yet" selected
  //  - Total real selections ≤ 4
  //  - Only Midjourney and/or Firefly
  const onlyBucketAImageTools =
    real.length > 0 && real.every((id) => BUCKET_A_ONLY_TOOLS.has(id));

  if (hasNone || real.length <= 4 || onlyBucketAImageTools) {
    return { bucket: "A", count: real.length, selections };
  }
  return { bucket: "B", count: real.length, selections };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRAM RECOMMENDATION (tier → program)
// ═══════════════════════════════════════════════════════════════════════════════

const TIER_TO_PROGRAM: Record<Tier, Program> = {
  starting_line: "foundations",
  two_speed: "accelerator",
  capable_but_exposed: "transformation",
  at_frontier: "transformation",
};

export function getProgramForTier(tier: Tier): Program {
  return TIER_TO_PROGRAM[tier];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORCHESTRATION
// ═══════════════════════════════════════════════════════════════════════════════

export function computeResult(answers: AnswerRecord[]): ScoreResult {
  const dims = computeDimensions(answers);
  const rawScore = computeRawScore(dims);
  const normalizedScore = normalize(rawScore);
  const tier = getTier(normalizedScore);

  // Q6 segmentation tag
  const q6Answer = answers.find((a) => a.questionId === 6);
  const q6 = questions.find((q) => q.id === 6);
  let workType: string | null = null;
  if (q6Answer && q6 && q6Answer.indices[0] != null) {
    workType = q6.options[q6Answer.indices[0]]?.tag ?? null;
  }

  // Q7 stack audit
  const q7Answer = answers.find((a) => a.questionId === 7);
  const q7 = questions.find((q) => q.id === 7);
  let stackSelections: string[] = [];
  if (q7Answer && q7) {
    stackSelections = q7Answer.indices
      .map((i) => q7.options[i]?.toolId)
      .filter((id): id is string => !!id);
  }
  const stackAudit = computeStackAudit(stackSelections);

  return {
    dimensions: dims,
    rawScore,
    normalizedScore,
    tier,
    tierLabel: getTierLabel(tier),
    stackBucket: stackAudit.bucket,
    stackCount: stackAudit.count,
    stackSelections: stackAudit.selections,
    workType,
    recommendedProgram: getProgramForTier(tier),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export function getQuestionById(id: number): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function optionLabelsFor(q: Question, indices: number[]): string[] {
  return indices.map((i) => q.options[i]?.label).filter(Boolean) as string[];
}

/** Build a human-readable answer summary for email/PDF payloads. */
export function buildAnswerSummary(
  answers: AnswerRecord[]
): Array<{ question: string; answer: string }> {
  const out: Array<{ question: string; answer: string }> = [];
  for (const a of answers) {
    const q = getQuestionById(a.questionId);
    if (!q) continue;
    const labels = optionLabelsFor(q, a.indices);
    out.push({ question: q.text, answer: labels.join(" · ") || "—" });
  }
  return out;
}

// Re-export Option so results page can keep importing from one place.
export type { Option };
