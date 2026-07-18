// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY STORE — in-memory CockpitStore for tests and local dry-runs.
// Deterministic: ids are sequential, no clock is read inside the store.
// ═══════════════════════════════════════════════════════════════════════════════

import { compareDays, type Day } from "../cadence/dates";
import { followUpsFrom, scheduleForProspect } from "../cadence/cadence";
import type { Stage } from "../cadence/types";
import type {
  BriefActionKind,
  CockpitStore,
  DueItem,
  EventType,
  NewLeadInput,
  NewProspectInput,
  NewsletterNote,
  PendingKind,
  PendingState,
  PipelineValue,
  ProspectDetail,
  ProspectPatch,
  RosterEntry,
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
    bookingUrl: null,
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
      dealValue: p.dealValue ?? 50000,
      callAt: p.callAt ?? null,
      callBrief: p.callBrief ?? null,
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

      // IN_SEQUENCE = touches 1–4; CALL/PROPOSAL = post-call follow-ups (5–7).
      if (!["IN_SEQUENCE", "CALL", "PROPOSAL"].includes(prospect.stage)) continue;

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
        skippedCount: t.skippedCount,
      })),
      events,
      prospects: [...this.prospects.values()].map((p) => ({
        id: p.id,
        name: p.name,
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

  async getProspectDetail(prospectId: string): Promise<ProspectDetail | null> {
    const prospect = this.prospects.get(prospectId);
    if (!prospect) return null;
    const touches = this.allTouchesFor(prospectId).sort((a, b) => a.touchNumber - b.touchNumber);
    const events = this.events
      .filter((e) => e.prospectId === prospectId)
      .map((e) => ({ type: e.type, at: e.at, payload: e.payload }));
    return { prospect, touches, events };
  }

  async listRoster(limit: number): Promise<RosterEntry[]> {
    return [...this.prospects.values()]
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        name: p.name,
        company: p.company,
        role: p.role,
        stage: p.stage,
        tier: p.tier ?? null,
        score: p.score ?? null,
        sources: p.sources ?? [],
      }));
  }

  // ── CRM level-up ────────────────────────────────────────────────────────────
  private pending: PendingState | null = null;

  async getPending(): Promise<PendingState | null> {
    return this.pending ? { ...this.pending } : null;
  }
  async setPending(kind: PendingKind, prospectId: string): Promise<void> {
    this.pending = { kind, prospectId };
  }
  async clearPending(): Promise<void> {
    this.pending = null;
  }

  async appendNote(prospectId: string, line: string): Promise<void> {
    const p = this.prospects.get(prospectId);
    if (!p) return;
    const notes = p.notes ? `${p.notes}\n${line}` : line;
    this.prospects.set(prospectId, { ...p, notes });
  }

  async updateProspect(prospectId: string, patch: ProspectPatch): Promise<void> {
    const p = this.prospects.get(prospectId);
    if (!p) return;
    this.prospects.set(prospectId, {
      ...p,
      ...(patch.email !== undefined ? { email: patch.email } : {}),
      ...(patch.linkedinUrl !== undefined ? { linkedinUrl: patch.linkedinUrl } : {}),
      ...(patch.dealValue !== undefined ? { dealValue: patch.dealValue } : {}),
      ...(patch.callAt !== undefined ? { callAt: patch.callAt } : {}),
      ...(patch.callBrief !== undefined ? { callBrief: patch.callBrief } : {}),
      ...(patch.track !== undefined ? { track: patch.track } : {}),
      ...(patch.stage !== undefined ? { stage: patch.stage } : {}),
    });
  }

  async resurfaceDue(today: Day): Promise<number> {
    let n = 0;
    for (const p of this.prospects.values()) {
      if (p.stage === "DORMANT" && p.resurfaceAt && compareDays(p.resurfaceAt, today) <= 0) {
        // Back to the reviewed queue — Jem re-decides in the Monday digest.
        this.prospects.set(p.id, { ...p, stage: "NEW", resurfaceAt: null });
        await this.appendNote(p.id, `resurfaced ${today} after 90 days dormant`);
        n += 1;
      }
    }
    return n;
  }

  async getCallsForDay(day: Day): Promise<StoreProspect[]> {
    return [...this.prospects.values()].filter((p) => p.callAt === day);
  }

  async prospectsAwaitingDebrief(sinceDay: Day): Promise<StoreProspect[]> {
    return [...this.prospects.values()].filter(
      (p) => p.callAt != null && p.callAt >= sinceDay && !p.callBrief
    );
  }

  async scheduleFollowUps(prospectId: string, baseDay: Day): Promise<void> {
    const existing = new Set(this.allTouchesFor(prospectId).map((t) => t.touchNumber));
    for (const t of followUpsFrom(prospectId, baseDay)) {
      if (existing.has(t.touchNumber)) continue; // idempotent
      const touch: StoreTouch = {
        id: this.nextId("touch"),
        prospectId,
        touchNumber: t.touchNumber,
        dueDate: t.dueDate,
        sentAt: null,
        skippedCount: 0,
        draftText: null,
        channel: "email",
        halted: false,
      };
      this.touches.set(touch.id, touch);
    }
  }

  async getPipelineValue(): Promise<PipelineValue> {
    const open = ["REPLIED", "CALL", "PROPOSAL"];
    let openValue = 0, openCount = 0, wonValue = 0, wonCount = 0;
    for (const p of this.prospects.values()) {
      const v = p.dealValue ?? 50000;
      if (open.includes(p.stage)) { openValue += v; openCount += 1; }
      if (p.stage === "WON") { wonValue += v; wonCount += 1; }
    }
    return { openValue, openCount, wonValue, wonCount, target: 700000 };
  }
}
