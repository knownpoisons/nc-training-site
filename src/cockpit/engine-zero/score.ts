// ═══════════════════════════════════════════════════════════════════════════════
// F10 PASS 1 — free scoring for every lead (no web calls).
//
// Score = warmth (source, stacked) × fit (role seniority + org type) × recency,
// each normalised 0–1, multiplied, scaled to 0–100. Thresholds set the tier.
// Multiplicative on purpose: a warm lead with no fit is not Tier A. A lead that
// stacks 3+ sources is Tier A by definition (handoff rule).
// ═══════════════════════════════════════════════════════════════════════════════

import { SOURCE_WARMTH, type MergedLead } from "./types";

export type Tier = "A" | "B" | "C";

export interface Scored {
  score: number; // 0–100
  tier: Tier;
  warmth: number;
  fit: number;
  recency: number;
}

// Thresholds (calibrated so a senior, recent, multi-source lead lands A).
export const TIER_A_MIN = 45;
export const TIER_B_MIN = 20;

const SENIOR = /\b(founder|co-?founder|owner|ceo|chief|cxo|cmo|cco|cto|coo|president|partner|vp|vice president|head of|director|ecd|creative director)\b/i;
const MID = /\b(lead|manager|principal|senior)\b/i;
const ORG = /\b(agency|studio|brand|creative|design|marketing|media|advertising)\b/i;

function warmthScore(lead: MergedLead): number {
  // Stack sources: 1 - Π(1 - warmth_i). More sources → warmer, capped at 1.
  let cold = 1;
  for (const s of lead.sources) cold *= 1 - (SOURCE_WARMTH[s] ?? 0);
  return 1 - cold;
}

function fitScore(lead: MergedLead): number {
  const role = lead.role ?? "";
  let seniority = 0.35; // unknown role → middling, not zero
  if (SENIOR.test(role)) seniority = 1.0;
  else if (MID.test(role)) seniority = 0.6;

  const orgText = `${lead.company ?? ""} ${role}`;
  const org = ORG.test(orgText) ? 1.0 : 0.6; // creative-org signal is a bonus, not a gate
  return Math.min(1, seniority * 0.75 + org * 0.25);
}

function recencyScore(lead: MergedLead, today: string): number {
  if (!lead.engagementRecency) return 0.4; // unknown → soft default, never 0
  const days = daysBetween(lead.engagementRecency, today);
  if (days <= 30) return 1.0;
  if (days <= 90) return 0.8;
  if (days <= 365) return 0.55;
  return 0.3;
}

function daysBetween(a: string, b: string): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.abs(Math.round(ms / 86_400_000));
}

export function scoreLead(lead: MergedLead, today: string): Scored {
  const warmth = warmthScore(lead);
  const fit = fitScore(lead);
  const recency = recencyScore(lead, today);
  let score = Math.round(100 * warmth * fit * recency);

  // Hard rule: a lead stacking 3+ distinct sources is Tier A by definition.
  const multiSource = lead.sources.length >= 3;
  if (multiSource) score = Math.max(score, TIER_A_MIN);

  const tier: Tier = score >= TIER_A_MIN ? "A" : score >= TIER_B_MIN ? "B" : "C";
  return { score, tier, warmth, fit, recency };
}
