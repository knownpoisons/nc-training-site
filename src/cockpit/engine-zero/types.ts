// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE ZERO — types + source constants.
//
// Engine Zero fills the queue the cadence engine drains. Its hard rule: it feeds
// a REVIEWED queue (stage NEW), never the live sequence. Newsletter subs and the
// community list carry consent limits, encoded here so no importer can bypass
// them.
// ═══════════════════════════════════════════════════════════════════════════════

import type { SourceEngine } from "../cadence/types";

/** The intake sources (handoff Engine Zero table + the Gmail sent-mail mine). */
export type LeadSource = "scorecard" | "inbox" | "community" | "linkedin" | "beehiiv" | "gmail_sent";

export type ConsentLane = "pipeline" | "broadcast_only";

/** A normalised intake record, before dedupe/scoring. */
export interface RawLead {
  source: LeadSource;
  name: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
  linkedinUrl: string | null;
  consentLane: ConsentLane;
  /** Last engagement we can see (ISO date) — drives the recency score. */
  engagementRecency: string | null;
  /** Per-source metadata kept for scoring + later reference. */
  sourceDetail: Record<string, unknown>;
}

/** A lead after dedupe: one person, sources stacked. */
export interface MergedLead {
  name: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
  linkedinUrl: string | null;
  sources: LeadSource[]; // every source this person came from
  consentLane: ConsentLane; // the STRICTEST lane across sources
  engagementRecency: string | null; // most recent across sources
  sourceDetail: Record<string, unknown>;
}

// ─── Source warmth (handoff table) ────────────────────────────────────────────
export const SOURCE_WARMTH: Record<LeadSource, number> = {
  scorecard: 1.0, // HOT
  inbox: 0.75, // WARM (2-way history)
  community: 0.7, // WARM
  linkedin: 0.45, // SLIGHTLY WARM
  beehiiv: 0.15, // BROADCAST
  gmail_sent: 0.75, // WARM — Jem has written to them directly (2-way history)
};

// ─── Consent lane per source (hard-coded compliance) ──────────────────────────
// Newsletter subs consented to a newsletter, not 1:1 sequences → broadcast_only.
// Everything else may enter the pipeline (still individual, never a blast).
export const SOURCE_CONSENT: Record<LeadSource, ConsentLane> = {
  scorecard: "pipeline",
  inbox: "pipeline",
  community: "pipeline",
  linkedin: "pipeline",
  beehiiv: "broadcast_only",
  gmail_sent: "pipeline",
};

// ─── Coarse F6 scoreboard engine per source (fine detail lives in `sources`) ──
export const SOURCE_TO_ENGINE: Record<LeadSource, SourceEngine> = {
  scorecard: "outbound",
  inbox: "alumni",
  community: "list",
  linkedin: "outbound",
  beehiiv: "list",
  gmail_sent: "alumni",
};

/** The stricter of two consent lanes (broadcast_only wins). */
export function strictestConsent(a: ConsentLane, b: ConsentLane): ConsentLane {
  return a === "broadcast_only" || b === "broadcast_only" ? "broadcast_only" : "pipeline";
}
