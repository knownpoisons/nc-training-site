// ═══════════════════════════════════════════════════════════════════════════════
// COCKPIT STORE — the data layer the Slack loop talks to.
//
// Everything above this line (brief, commands, nudge) depends only on this
// interface, never on Supabase directly. That is what lets Gate 2 run as a full
// automated round-trip against an in-memory store, and lets the same logic run
// live against Supabase with no code changes.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Day } from "../cadence/dates";
import type { Channel, SourceEngine, Stage, Track } from "../cadence/types";

/** A prospect as the store holds it — the cadence fields plus display detail. */
export interface StoreProspect {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  email: string | null;
  linkedinUrl: string | null;
  notes: string | null;
  sourceEngine: SourceEngine;
  track: Track | null;
  stage: Stage;
  paused: boolean;
  addedAt: Day;
  resurfaceAt: Day | null;
  // Engine Zero fields (present on queued leads)
  score?: number | null;
  tier?: "A" | "B" | "C" | null;
  sources?: string[];
  consentLane?: "pipeline" | "broadcast_only";
  dossier?: string | null;
  openerAngle?: string | null;
}

/** A touch as the store holds it (persisted id included). */
export interface StoreTouch {
  id: string;
  prospectId: string;
  touchNumber: number;
  dueDate: Day;
  sentAt: Day | null;
  skippedCount: number;
  draftText: string | null;
  channel: Channel;
  halted: boolean;
}

/** A brief action reference, persisted so "done 3" resolves to the 3rd action. */
export type BriefActionKind = "reply" | "touch";

export interface BriefActionRef {
  n: number; // 1-based position in the posted brief
  kind: BriefActionKind;
  prospectId: string;
  touchId: string | null; // set for touch actions
  touchNumber: number | null;
  label: string; // short human label, e.g. "Dana Lee · touch 2"
}

export interface SavedBrief {
  briefDate: Day;
  slackChannel: string | null;
  slackTs: string | null;
  actions: BriefActionRef[];
  postedAt: string | null; // ISO
  lastInteractionAt: string | null; // ISO — set on any inbound message
  nudgedAt: string | null; // ISO — set once when the nudge fires
}

export interface Settings {
  weeklyVolume: number;
  briefHour: number;
  nudgeHour: number;
  timezone: string;
  streakWeeks: number;
}

export type EventType =
  | "reply"
  | "call_booked"
  | "closed_won"
  | "closed_lost"
  | "skip"
  | "snooze"
  | "promote";

export interface NewProspectInput {
  name: string;
  role?: string | null;
  company?: string | null;
  email?: string | null;
  sourceEngine?: SourceEngine;
  track?: Track | null;
}

/** A queued lead from Engine Zero — created at stage NEW, never sequenced until
 *  Jem promotes it (F11). Carries the consent lane and score/tier. */
export interface NewLeadInput {
  name: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
  linkedinUrl: string | null;
  sourceEngine: SourceEngine;
  sources: string[];
  consentLane: "pipeline" | "broadcast_only";
  score: number;
  tier: "A" | "B" | "C";
  sourceDetail: Record<string, unknown>;
}

/**
 * The persistence contract. Two implementations: MemoryStore (tests/local) and
 * SupabaseStore (production). Logic modules receive one of these and never care
 * which.
 */
export interface CockpitStore {
  // ── reads ──────────────────────────────────────────────────────────────────
  /** Every action that could appear in today's brief: replies awaiting a
   *  response, plus touches due on or before `today` that are unsent, un-halted,
   *  and belong to a non-paused prospect. Uncapped and unordered — the brief
   *  builder orders and caps. */
  listDueItems(today: Day): Promise<DueItem[]>;
  getProspect(id: string): Promise<StoreProspect | null>;
  findProspectByName(name: string): Promise<StoreProspect | null>;
  pipelineCounts(): Promise<Record<Stage, number>>;
  getSettings(): Promise<Settings>;

  // ── brief lifecycle ──────────────────────────────────────────────────────
  saveBrief(brief: SavedBrief): Promise<void>;
  getBrief(briefDate: Day): Promise<SavedBrief | null>;
  recordInteraction(briefDate: Day, atIso: string): Promise<void>;
  markNudged(briefDate: Day, atIso: string): Promise<void>;

  // ── mutations from commands ──────────────────────────────────────────────
  /** Create a prospect AND lay down its 4-touch schedule via the cadence engine. */
  addProspect(input: NewProspectInput, addedAt: Day): Promise<StoreProspect>;
  /** Create a QUEUED lead (stage NEW, no schedule) from Engine Zero intake. */
  createLead(input: NewLeadInput, addedAt: Day): Promise<StoreProspect>;
  /** Find a lead by email (dedupe against existing DB records on ingest). */
  findProspectByEmail(email: string): Promise<StoreProspect | null>;
  markTouchSent(touchId: string, sentAt: Day): Promise<void>;
  skipTouch(touchId: string): Promise<StoreTouch>;
  snoozeTouch(touchId: string): Promise<StoreTouch>;
  setDraft(touchId: string, text: string): Promise<void>;
  setStage(prospectId: string, stage: Stage, resurfaceAt?: Day | null): Promise<void>;
  setPaused(prospectId: string, paused: boolean): Promise<void>;
  /** Halt every unsent touch on a prospect (used when a reply arrives). */
  haltRemainingTouches(prospectId: string): Promise<void>;
  logEvent(prospectId: string | null, type: EventType, payload?: unknown, atIso?: string): Promise<void>;

  // ── Phase 4: scoreboard + digest ─────────────────────────────────────────
  /** All touches/events/prospects for the Friday scoreboard (F6). */
  getScoreboardData(): Promise<ScoreboardData>;
  /** Top-N queued leads (stage NEW) by score desc, for the Monday digest (F11). */
  getQueuedLeads(limit: number): Promise<StoreProspect[]>;
  /** Promote a queued lead: NEW → IN_SEQUENCE + lay down its source-matched schedule. */
  promoteLead(prospectId: string, addedAt: Day, reason: string): Promise<void>;
  /** Discard a queued lead (bin from the digest). */
  binLead(prospectId: string, reason: string): Promise<void>;
  /** How many prospects entered a sequence in [weekStart, weekEnd] — volume governor. */
  countPromotedInWeek(weekStart: Day, weekEnd: Day): Promise<number>;
  saveDigest(digest: SavedDigest): Promise<void>;
  getDigest(digestDate: Day): Promise<SavedDigest | null>;
  updateSettings(patch: Partial<Settings>): Promise<Settings>;

  // ── Newsletter content inbox (F7) ────────────────────────────────────────
  /** Save a dropped idea/link for a month (YYYY-MM). */
  addNewsletterNote(month: string, text: string, url: string | null, atIso: string): Promise<void>;
  /** All notes dropped for a month, oldest first. */
  getNewsletterNotes(month: string): Promise<NewsletterNote[]>;

  // ── Engine Zero Pass-2 enrichment (F10) ──────────────────────────────────
  /** Tier-A queued leads without a dossier yet (for the daily enrichment job). */
  getLeadsNeedingEnrichment(limit: number): Promise<StoreProspect[]>;
  /** Save an enrichment dossier + opener angle onto a lead. */
  setDossier(prospectId: string, dossier: string, openerAngle: string | null): Promise<void>;

  // ── Visibility: profiles + roster (F4 `show`, F5 questions) ───────────────
  /** A prospect with its full touch schedule + event history. */
  getProspectDetail(prospectId: string): Promise<ProspectDetail | null>;
  /** A compact snapshot of everyone, for the conversational handler's context. */
  listRoster(limit: number): Promise<RosterEntry[]>;
}

export interface ProspectDetail {
  prospect: StoreProspect;
  touches: StoreTouch[];
  events: Array<{ type: EventType; at: string; payload: unknown }>;
}

export interface RosterEntry {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  stage: Stage;
  tier: "A" | "B" | "C" | null;
  score: number | null;
  sources: string[];
}

export interface NewsletterNote {
  text: string;
  url: string | null;
  createdAt: string;
}

/** Raw data the scoreboard computation needs (date-only where relevant). */
export interface ScoreboardData {
  touches: Array<{ prospectId: string; dueDate: Day; sentAt: Day | null }>;
  events: Array<{ prospectId: string; type: EventType; at: Day }>;
  prospects: Array<{ id: string; sourceEngine: SourceEngine; track: Track | null }>;
}

export interface DigestActionRef {
  n: number;
  prospectId: string;
  label: string;
}
export interface SavedDigest {
  digestDate: Day;
  slackTs: string | null;
  actions: DigestActionRef[];
  postedAt: string | null;
}

/** A raw candidate for the brief, before ordering/capping. */
export interface DueItem {
  kind: BriefActionKind;
  prospect: StoreProspect;
  touch: StoreTouch | null; // null for reply items
}
