// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY STORE — in-memory CockpitStore for tests and local dry-runs.
// Deterministic: ids are sequential, no clock is read inside the store.
// ═══════════════════════════════════════════════════════════════════════════════

import { compareDays, type Day } from "../cadence/dates";
import { scheduleForProspect } from "../cadence/cadence";
import type { Stage } from "../cadence/types";
import type {
  BriefActionKind,
  CockpitStore,
  DueItem,
  EventType,
  NewLeadInput,
  NewProspectInput,
  NewsletterNote,
  SavedBrief,
  SavedDigest,
  ScoreboardData,
  Settings,
  StoreProspect,
  StoreTouch,
} from "./types";

const EMPTY_COUNTS: Record<Stage, number> = {
  NEW: 0,
  IN_SEQUENCE: 0,
  REPLIED: 0,
  CALL: 0,
  PROPOSAL: 0,
  WON: 0,
  LOST: 0,
  DORMANT: 0,
};

export class MemoryStore implements CockpitStore {
  private prospects = new Map<string, StoreProspect>();
  private touches = new Map<string, StoreTouch>();
  private briefs = new Map<Day, SavedBrief>();
  private digests = new Map<Day, SavedDigest>();
  private newsletterNotes = new Map<string, NewsletterNote[]>();
  events: Array<{ prospectId: string | null; type: EventType; payload: unknown; at: string }> = [];
  private settings: Settings = {
    weeklyVolume: 6,
    briefHour: 7,
    nudgeHour: 14,
    timezone: "Pacific/Honolulu",
    streakWeeks: 0,
  };
  private seq = 0;

  private nextId(prefix: string): string {
    this.seq += 1;
    return `${prefix}_${String(this.seq).padStart(4, "0")}`;
  }

  // ── test/seed helpers ────────────────────────────────────────────────────
  /** Insert a fully-formed prospect (test convenience). */
  seedProspect(p: Partial<StoreProspect> & { name: string; addedAt: Day }): StoreProspect {
    const prospect: StoreProspect = {
      id: p.id ?? this.nextId("prospect"),
      name: p.name,
      role: p.role ?? null,
      company: p.company ?? null,
      email: p.email ?? null,
      linkedinUrl: p.linkedinUrl ?? null,
      notes: p.notes ?? null,
      sourceEngine: p.sourceEngine ?? "outbound",
      track: p.track ?? null,
      stage: p.stage ?? "IN_SEQUENCE",
      paused: p.paused ?? false,
      addedAt: p.addedAt,
      resurfaceAt: p.resurfaceAt ?? null,
      score: p.score ?? null,
      tier: p.tier ?? null,
      sources: p.sources ?? [],
      consentLane: p.consentLane ?? "pipeline",
      dossier: p.dossier ?? null,
      openerAngle: p.openerAngle ?? null,
    };
    this.prospects.set(prospect.id, prospect);
    return prospect;
  }

  /** Seed a dated event (test convenience for the scoreboard). */
  seedEvent(prospectId: string, type: EventType, at: string): void {
    this.events.push({ prospectId, type, payload: {}, at });
  }

  /** Lay down a prospect's 4-touch schedule (test convenience). */
  seedSchedule(prospectId: string, addedAt: Day): StoreTouch[] {
    const created: StoreTouch[] = [];
    for (const t of scheduleForProspect(prospectId, addedAt)) {
      const touch: StoreTouch = {
        id: this.nextId("touch"),
        prospectId,
        touchNumber: t.touchNumber,
        dueDate: t.dueDate,
        sentAt: null,
        skippedCount: 0,
        draftText: null,
        channel: "linkedin",
        halted: false,
      };
      this.touches.set(touch.id, touch);
      created.push(touch);
    }
    return created;
  }

  setTouch(touchId: string, patch: Partial<StoreTouch>): void {
    const t = this.touches.get(touchId);
    if (t) this.touches.set(touchId, { ...t, ...patch });
  }

  allTouchesFor(prospectId: string): StoreTouch[] {
    return [...this.touches.values()].filter((t) => t.prospectId === prospectId);
  }

  // ── reads ────────────────────────────────────────────────────────────────
  async listDueItems(today: Day): Promise<DueItem[]> {
    const items: DueItem[] = [];

    for (const prospect of this.prospects.values()) {
      if (prospect.paused) continue;

      // A reply awaiting a response is an action in its own right.
      if (prospect.stage === "REPLIED") {
        items.push({ kind: "reply" as BriefActionKind, prospect, touch: null });
        continue; // its scheduled touches are halted anyway
      }

      if (prospect.stage !== "IN_SEQUENCE") continue;

      for (const touch of this.allTouchesFor(prospect.id)) {
        if (touch.sentAt || touch.halted) continue;
        if (compareDays(touch.dueDate, today) <= 0) {
          items.push({ kind: "touch", prospect, touch });
        }
      }
    }
    return items;
  }

  async getProspect(id: string): Promise<StoreProspect | null> {
    return this.prospects.get(id) ?? null;
  }

  async findProspectByName(name: string): Promise<StoreProspect | null> {
    const needle = name.trim().toLowerCase();
    for (const p of this.prospects.values()) {
      if (p.name.toLowerCase() === needle) return p;
    }
    // fall back to a contains-match so "pause dana" finds "Dana Lee"
    for (const p of this.prospects.values()) {
      if (p.name.toLowerCase().includes(needle)) return p;
    }
    return null;
  }

  async pipelineCounts(): Promise<Record<Stage, number>> {
    const counts = { ...EMPTY_COUNTS };
    for (const p of this.prospects.values()) counts[p.stage] += 1;
    return counts;
  }

  async getSettings(): Promise<Settings> {
    return { ...this.settings };
  }

  // ── brief lifecycle ────────────────────────────────────────────────────
  async saveBrief(brief: SavedBrief): Promise<void> {
    this.briefs.set(brief.briefDate, { ...brief });
  }

  async getBrief(briefDate: Day): Promise<SavedBrief | null> {
    const b = this.briefs.get(briefDate);
    return b ? { ...b } : null;
  }

  async recordInteraction(briefDate: Day, atIso: string): Promise<void> {
    const b = this.briefs.get(briefDate);
    if (b) b.lastInteractionAt = atIso;
  }

  async markNudged(briefDate: Day, atIso: string): Promise<void> {
    const b = this.briefs.get(briefDate);
    if (b) b.nudgedAt = atIso;
  }

  // ── mutations ────────────────────────────────────────────────────────────
  async addProspect(input: NewProspectInput, addedAt: Day): Promise<StoreProspect> {
    const prospect = this.seedProspect({
      name: input.name,
      role: input.role ?? null,
      company: input.company ?? null,
      email: input.email ?? null,
      sourceEngine: input.sourceEngine ?? "outbound",
      track: input.track ?? null,
      stage: "IN_SEQUENCE",
      addedAt,
    });
    this.seedSchedule(prospect.id, addedAt);
    return prospect;
  }

  async createLead(input: NewLeadInput, addedAt: Day): Promise<StoreProspect> {
    // Stage NEW = queued. No schedule is laid down — leads are never sequenced
    // until Jem promotes them (F11). Consent lane is preserved verbatim.
    return this.seedProspect({
      name: input.name ?? "(unknown)",
      role: input.role,
      company: input.company,
      email: input.email,
      linkedinUrl: input.linkedinUrl,
      sourceEngine: input.sourceEngine,
      stage: "NEW",
      addedAt,
      score: input.score,
      tier: input.tier,
      sources: input.sources,
      consentLane: input.consentLane,
    });
  }

  async findProspectByEmail(email: string): Promise<StoreProspect | null> {
    const needle = email.trim().toLowerCase();
    for (const p of this.prospects.values()) {
      if ((p.email ?? "").toLowerCase() === needle) return p;
    }
    return null;
  }

  async markTouchSent(touchId: string, sentAt: Day): Promise<void> {
    this.setTouch(touchId, { sentAt });
  }

  async skipTouch(touchId: string): Promise<StoreTouch> {
    const t = this.touches.get(touchId);
    if (!t) throw new Error(`touch not found: ${touchId}`);
    const { applySkip } = await import("../cadence/cadence");
    const updated = applySkip({
      prospectId: t.prospectId,
      touchNumber: t.touchNumber,
      dueDate: t.dueDate,
      sentAt: t.sentAt,
      skippedCount: t.skippedCount,
    });
    this.setTouch(touchId, { dueDate: updated.dueDate, skippedCount: updated.skippedCount });
    return this.touches.get(touchId)!;
  }

  async snoozeTouch(touchId: string): Promise<StoreTouch> {
    const t = this.touches.get(touchId);
    if (!t) throw new Error(`touch not found: ${touchId}`);
    const { addDays, shiftWeekendToMonday } = await import("../cadence/dates");
    this.setTouch(touchId, { dueDate: shiftWeekendToMonday(addDays(t.dueDate, 1)) });
    return this.touches.get(touchId)!;
  }

  async setDraft(touchId: string, text: string): Promise<void> {
    this.setTouch(touchId, { draftText: text });
  }

  async setStage(prospectId: string, stage: Stage, resurfaceAt: Day | null = null): Promise<void> {
    const p = this.prospects.get(prospectId);
    if (p) this.prospects.set(prospectId, { ...p, stage, resurfaceAt });
  }

  async setPaused(prospectId: string, paused: boolean): Promise<void> {
    const p = this.prospects.get(prospectId);
    if (p) this.prospects.set(prospectId, { ...p, paused });
  }

  async haltRemainingTouches(prospectId: string): Promise<void> {
    for (const t of this.allTouchesFor(prospectId)) {
      if (!t.sentAt) this.setTouch(t.id, { halted: true });
    }
  }

  async logEvent(
    prospectId: string | null,
    type: EventType,
    payload: unknown = {},
    atIso?: string
  ): Promise<void> {
    this.events.push({ prospectId, type, payload, at: atIso ?? `event_${this.events.length}` });
  }

  // ── Phase 4 ────────────────────────────────────────────────────────────────
  async getScoreboardData(): Promise<ScoreboardData> {
    const asDay = (s: string): Day | null => (/^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null);
    const events: ScoreboardData["events"] = [];
    for (const e of this.events) {
      const at = asDay(e.at);
      if (at && e.prospectId) events.push({ prospectId: e.prospectId, type: e.type, at });
    }
    return {
      touches: [...this.touches.values()].map((t) => ({
        prospectId: t.prospectId,
        dueDate: t.dueDate,
        sentAt: t.sentAt,
      })),
      events,
      prospects: [...this.prospects.values()].map((p) => ({
        id: p.id,
        sourceEngine: p.sourceEngine,
        track: p.track,
      })),
    };
  }

  async getQueuedLeads(limit: number): Promise<StoreProspect[]> {
    return [...this.prospects.values()]
      .filter((p) => p.stage === "NEW")
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, limit);
  }

  async promoteLead(prospectId: string, addedAt: Day, reason: string): Promise<void> {
    const p = this.prospects.get(prospectId);
    if (!p) throw new Error(`promoteLead: not found ${prospectId}`);
    // The sequence starts on the promotion day; lay down its schedule.
    this.prospects.set(prospectId, { ...p, stage: "IN_SEQUENCE", addedAt });
    this.seedSchedule(prospectId, addedAt);
    await this.logEvent(prospectId, "promote", { reason });
  }

  async binLead(prospectId: string, reason: string): Promise<void> {
    const p = this.prospects.get(prospectId);
    if (p) this.prospects.set(prospectId, { ...p, stage: "LOST", notes: `binned: ${reason}` });
  }

  async countPromotedInWeek(weekStart: Day, weekEnd: Day): Promise<number> {
    let n = 0;
    for (const p of this.prospects.values()) {
      if (p.stage !== "NEW" && p.stage !== "LOST" && p.stage !== "DORMANT") {
        if (compareDays(p.addedAt, weekStart) >= 0 && compareDays(p.addedAt, weekEnd) <= 0) n += 1;
      }
    }
    return n;
  }

  async saveDigest(digest: SavedDigest): Promise<void> {
    this.digests.set(digest.digestDate, { ...digest });
  }

  async getDigest(digestDate: Day): Promise<SavedDigest | null> {
    const d = this.digests.get(digestDate);
    return d ? { ...d } : null;
  }

  async updateSettings(patch: Partial<Settings>): Promise<Settings> {
    this.settings = { ...this.settings, ...patch };
    return { ...this.settings };
  }

  async addNewsletterNote(month: string, text: string, url: string | null, atIso: string): Promise<void> {
    const list = this.newsletterNotes.get(month) ?? [];
    list.push({ text, url, createdAt: atIso });
    this.newsletterNotes.set(month, list);
  }

  async getNewsletterNotes(month: string): Promise<NewsletterNote[]> {
    return [...(this.newsletterNotes.get(month) ?? [])];
  }

  async getLeadsNeedingEnrichment(limit: number): Promise<StoreProspect[]> {
    return [...this.prospects.values()]
      .filter((p) => p.stage === "NEW" && p.tier === "A" && !p.dossier)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, limit);
  }

  async setDossier(prospectId: string, dossier: string, openerAngle: string | null): Promise<void> {
    const p = this.prospects.get(prospectId);
    if (p) this.prospects.set(prospectId, { ...p, dossier, openerAngle });
  }
}
