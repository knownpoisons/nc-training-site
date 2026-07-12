// ═══════════════════════════════════════════════════════════════════════════════
// COCKPIT CADENCE — shared types.
// These mirror the Supabase schema (002_cockpit_core.sql) but hold only the
// fields the scheduling logic needs. The engine is pure: no database, no clock.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Day } from "./dates";

export type Stage =
  | "NEW"
  | "IN_SEQUENCE"
  | "REPLIED"
  | "CALL"
  | "PROPOSAL"
  | "WON"
  | "LOST"
  | "DORMANT";

export type SourceEngine = "partner" | "outbound" | "alumni" | "list" | "press";
export type Track = "A" | "B";
export type Channel = "linkedin" | "email";

export interface Prospect {
  id: string;
  addedAt: Day; // the day the prospect entered the sequence
  stage: Stage;
  paused?: boolean;
}

export interface Touch {
  prospectId: string;
  touchNumber: number; // 1..4
  dueDate: Day;
  sentAt?: Day | null;
  skippedCount: number;
  /** Set when a reply or dormancy cancels a still-unsent touch. */
  halted?: boolean;
}
