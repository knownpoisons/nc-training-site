// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE STORE — the production CockpitStore, backed by the cockpit_* tables.
//
// Same interface as MemoryStore, so every logic module (brief, commands, nudge)
// runs unchanged against live data. This is exercised live once the tables are
// created and the Slack workspace exists; the Gate 2 automated round-trip runs
// against MemoryStore.
// ═══════════════════════════════════════════════════════════════════════════════

import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, shiftWeekendToMonday, type Day } from "../cadence/dates";
import { applySkip, followUpsFrom, scheduleForProspect } from "../cadence/cadence";
import type { Stage } from "../cadence/types";
import type {
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

// ─── row ⇆ domain mappers ─────────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
function toProspect(r: any): StoreProspect {
  return {
    id: r.id,
    name: r.name,
    role: r.role ?? null,
    company: r.company ?? null,
    email: r.email ?? null,
    linkedinUrl: r.linkedin_url ?? null,
    notes: r.notes ?? null,
    sourceEngine: r.source_engine,
    track: r.track ?? null,
    stage: r.stage,
    paused: r.paused,
    addedAt: (r.added_at as string).slice(0, 10),
    resurfaceAt: r.resurface_at ? (r.resurface_at as string).slice(0, 10) : null,
    score: r.score ?? null,
    tier: r.tier ?? null,
    sources: r.sources ?? [],
    consentLane: r.consent_lane ?? "pipeline",
    dossier: r.dossier ?? null,
    openerAngle: r.opener_angle ?? null,
    dealValue: r.deal_value != null ? Number(r.deal_value) : 50000,
    callAt: r.call_at ? (r.call_at as string).slice(0, 10) : null,
  };
}

function toTouch(r: any): StoreTouch {
  return {
    id: r.id,
    prospectId: r.prospect_id,
    touchNumber: r.touch_number,
    dueDate: (r.due_date as string).slice(0, 10),
    sentAt: r.sent_at ? (r.sent_at as string).slice(0, 10) : null,
    skippedCount: r.skipped_count,
    draftText: r.draft_text ?? null,
    channel: r.channel,
    halted: !!r.halted_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export class SupabaseStore implements CockpitStore {
  constructor(private db: SupabaseClient) {}

  async listDueItems(today: Day): Promise<DueItem[]> {
    const { data: prospects, error } = await this.db
      .from("cockpit_prospects")
      .select("*")
      .eq("paused", false)
      .in("stage", ["IN_SEQUENCE", "REPLIED", "CALL", "PROPOSAL"]);
    if (error) throw new Error(`listDueItems prospects: ${error.message}`);

    const items: DueItem[] = [];
    const inSeq: StoreProspect[] = [];
    for (const row of prospects ?? []) {
      const p = toProspect(row);
      if (p.stage === "REPLIED") items.push({ kind: "reply", prospect: p, touch: null });
      else inSeq.push(p);
    }

    if (inSeq.length > 0) {
      const ids = inSeq.map((p) => p.id);
      const { data: touches, error: tErr } = await this.db
        .from("cockpit_touches")
        .select("*")
        .in("prospect_id", ids)
        .is("sent_at", null)
        .is("halted_at", null)
        .lte("due_date", today);
      if (tErr) throw new Error(`listDueItems touches: ${tErr.message}`);
      const byId = new Map(inSeq.map((p) => [p.id, p]));
      for (const row of touches ?? []) {
        const t = toTouch(row);
        const p = byId.get(t.prospectId);
        if (p) items.push({ kind: "touch", prospect: p, touch: t });
      }
    }
    return items;
  }

  async getProspect(id: string): Promise<StoreProspect | null> {
    const { data, error } = await this.db.from("cockpit_prospects").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`getProspect: ${error.message}`);
    return data ? toProspect(data) : null;
  }

  async findProspectByName(name: string): Promise<StoreProspect | null> {
    const { data, error } = await this.db
      .from("cockpit_prospects")
      .select("*")
      .ilike("name", `%${name.trim()}%`)
      .order("added_at", { ascending: true })
      .limit(1);
    if (error) throw new Error(`findProspectByName: ${error.message}`);
    return data && data[0] ? toProspect(data[0]) : null;
  }

  async pipelineCounts(): Promise<Record<Stage, number>> {
    const { data, error } = await this.db.from("cockpit_prospects").select("stage");
    if (error) throw new Error(`pipelineCounts: ${error.message}`);
    const counts = { ...EMPTY_COUNTS };
    for (const r of data ?? []) counts[(r as { stage: Stage }).stage] += 1;
    return counts;
  }

  async getSettings(): Promise<Settings> {
    const { data, error } = await this.db.from("cockpit_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(`getSettings: ${error.message}`);
    return {
      weeklyVolume: data?.weekly_volume ?? 6,
      briefHour: data?.brief_hour ?? 7,
      nudgeHour: data?.nudge_hour ?? 14,
      timezone: data?.timezone ?? "Pacific/Honolulu",
      streakWeeks: data?.streak_weeks ?? 0,
    };
  }

  async saveBrief(brief: SavedBrief): Promise<void> {
    const { error } = await this.db.from("cockpit_briefs").upsert(
      {
        brief_date: brief.briefDate,
        slack_channel: brief.slackChannel,
        slack_ts: brief.slackTs,
        actions: brief.actions,
        posted_at: brief.postedAt,
        last_interaction_at: brief.lastInteractionAt,
        nudged_at: brief.nudgedAt,
      },
      { onConflict: "brief_date" }
    );
    if (error) throw new Error(`saveBrief: ${error.message}`);
  }

  async getBrief(briefDate: Day): Promise<SavedBrief | null> {
    const { data, error } = await this.db
      .from("cockpit_briefs")
      .select("*")
      .eq("brief_date", briefDate)
      .maybeSingle();
    if (error) throw new Error(`getBrief: ${error.message}`);
    if (!data) return null;
    return {
      briefDate: (data.brief_date as string).slice(0, 10),
      slackChannel: data.slack_channel ?? null,
      slackTs: data.slack_ts ?? null,
      actions: data.actions ?? [],
      postedAt: data.posted_at ?? null,
      lastInteractionAt: data.last_interaction_at ?? null,
      nudgedAt: data.nudged_at ?? null,
    };
  }

  async recordInteraction(briefDate: Day, atIso: string): Promise<void> {
    // Only set it once (first interaction wins) so we know the channel woke up.
    const { error } = await this.db
      .from("cockpit_briefs")
      .update({ last_interaction_at: atIso })
      .eq("brief_date", briefDate)
      .is("last_interaction_at", null);
    if (error) throw new Error(`recordInteraction: ${error.message}`);
  }

  async markNudged(briefDate: Day, atIso: string): Promise<void> {
    const { error } = await this.db
      .from("cockpit_briefs")
      .update({ nudged_at: atIso })
      .eq("brief_date", briefDate);
    if (error) throw new Error(`markNudged: ${error.message}`);
  }

  async addProspect(input: NewProspectInput, addedAt: Day): Promise<StoreProspect> {
    const { data, error } = await this.db
      .from("cockpit_prospects")
      .insert({
        name: input.name,
        role: input.role ?? null,
        company: input.company ?? null,
        email: input.email ?? null,
        source_engine: input.sourceEngine ?? "outbound",
        track: input.track ?? null,
        stage: "IN_SEQUENCE",
        added_at: addedAt,
      })
      .select("*")
      .single();
    if (error) throw new Error(`addProspect: ${error.message}`);
    const prospect = toProspect(data);

    const rows = scheduleForProspect(prospect.id, addedAt).map((t) => ({
      prospect_id: prospect.id,
      touch_number: t.touchNumber,
      due_date: t.dueDate,
      channel: "linkedin",
    }));
    const { error: tErr } = await this.db.from("cockpit_touches").insert(rows);
    if (tErr) throw new Error(`addProspect touches: ${tErr.message}`);
    return prospect;
  }

  async createLead(input: NewLeadInput, addedAt: Day): Promise<StoreProspect> {
    const { data, error } = await this.db
      .from("cockpit_prospects")
      .insert({
        name: input.name ?? "(unknown)",
        email: input.email,
        company: input.company,
        role: input.role,
        linkedin_url: input.linkedinUrl,
        source_engine: input.sourceEngine,
        stage: "NEW", // queued — never sequenced until promoted (F11)
        added_at: addedAt,
        sources: input.sources,
        consent_lane: input.consentLane,
        score: input.score,
        tier: input.tier,
        source_detail: input.sourceDetail,
      })
      .select("*")
      .single();
    if (error) throw new Error(`createLead: ${error.message}`);
    return toProspect(data);
  }

  async findProspectByEmail(email: string): Promise<StoreProspect | null> {
    const { data, error } = await this.db
      .from("cockpit_prospects")
      .select("*")
      .ilike("email", email.trim())
      .limit(1);
    if (error) throw new Error(`findProspectByEmail: ${error.message}`);
    return data && data[0] ? toProspect(data[0]) : null;
  }

  async markTouchSent(touchId: string, sentAt: Day): Promise<void> {
    const { error } = await this.db
      .from("cockpit_touches")
      .update({ sent_at: sentAt })
      .eq("id", touchId);
    if (error) throw new Error(`markTouchSent: ${error.message}`);
  }

  async skipTouch(touchId: string): Promise<StoreTouch> {
    const current = await this.getTouch(touchId);
    if (!current) throw new Error(`skipTouch: touch not found ${touchId}`);
    const updated = applySkip(current);
    const { data, error } = await this.db
      .from("cockpit_touches")
      .update({ due_date: updated.dueDate, skipped_count: updated.skippedCount })
      .eq("id", touchId)
      .select("*")
      .single();
    if (error) throw new Error(`skipTouch: ${error.message}`);
    return toTouch(data);
  }

  async snoozeTouch(touchId: string): Promise<StoreTouch> {
    const current = await this.getTouch(touchId);
    if (!current) throw new Error(`snoozeTouch: touch not found ${touchId}`);
    const next = shiftWeekendToMonday(addDays(current.dueDate, 1));
    const { data, error } = await this.db
      .from("cockpit_touches")
      .update({ due_date: next })
      .eq("id", touchId)
      .select("*")
      .single();
    if (error) throw new Error(`snoozeTouch: ${error.message}`);
    return toTouch(data);
  }

  async setDraft(touchId: string, text: string): Promise<void> {
    const { error } = await this.db.from("cockpit_touches").update({ draft_text: text }).eq("id", touchId);
    if (error) throw new Error(`setDraft: ${error.message}`);
  }

  async setStage(prospectId: string, stage: Stage, resurfaceAt: Day | null = null): Promise<void> {
    const { error } = await this.db
      .from("cockpit_prospects")
      .update({ stage, resurface_at: resurfaceAt })
      .eq("id", prospectId);
    if (error) throw new Error(`setStage: ${error.message}`);
  }

  async setPaused(prospectId: string, paused: boolean): Promise<void> {
    const { error } = await this.db.from("cockpit_prospects").update({ paused }).eq("id", prospectId);
    if (error) throw new Error(`setPaused: ${error.message}`);
  }

  async haltRemainingTouches(prospectId: string): Promise<void> {
    const { error } = await this.db
      .from("cockpit_touches")
      .update({ halted_at: new Date().toISOString() })
      .eq("prospect_id", prospectId)
      .is("sent_at", null);
    if (error) throw new Error(`haltRemainingTouches: ${error.message}`);
  }

  async logEvent(
    prospectId: string | null,
    type: EventType,
    payload: unknown = {},
    atIso?: string
  ): Promise<void> {
    const row: Record<string, unknown> = { prospect_id: prospectId, type, payload };
    if (atIso) row.created_at = atIso;
    const { error } = await this.db.from("cockpit_events").insert(row);
    if (error) throw new Error(`logEvent: ${error.message}`);
  }

  private async getTouch(touchId: string): Promise<StoreTouch | null> {
    const { data, error } = await this.db.from("cockpit_touches").select("*").eq("id", touchId).maybeSingle();
    if (error) throw new Error(`getTouch: ${error.message}`);
    return data ? toTouch(data) : null;
  }

  // ── Phase 4 ────────────────────────────────────────────────────────────────
  async getScoreboardData(): Promise<ScoreboardData> {
    const [touchesRes, eventsRes, prospectsRes] = await Promise.all([
      this.db.from("cockpit_touches").select("prospect_id, due_date, sent_at, skipped_count"),
      this.db.from("cockpit_events").select("prospect_id, type, created_at"),
      this.db.from("cockpit_prospects").select("id, name, source_engine, track"),
    ]);
    if (touchesRes.error) throw new Error(`scoreboard touches: ${touchesRes.error.message}`);
    if (eventsRes.error) throw new Error(`scoreboard events: ${eventsRes.error.message}`);
    if (prospectsRes.error) throw new Error(`scoreboard prospects: ${prospectsRes.error.message}`);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return {
      touches: (touchesRes.data ?? []).map((t: any) => ({
        prospectId: t.prospect_id,
        dueDate: (t.due_date as string).slice(0, 10),
        sentAt: t.sent_at ? (t.sent_at as string).slice(0, 10) : null,
        skippedCount: t.skipped_count ?? 0,
      })),
      events: (eventsRes.data ?? [])
        .filter((e: any) => e.prospect_id && e.created_at)
        .map((e: any) => ({ prospectId: e.prospect_id, type: e.type, at: (e.created_at as string).slice(0, 10) })),
      prospects: (prospectsRes.data ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        sourceEngine: p.source_engine,
        track: p.track ?? null,
      })),
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  async getQueuedLeads(limit: number): Promise<StoreProspect[]> {
    const { data, error } = await this.db
      .from("cockpit_prospects")
      .select("*")
      .eq("stage", "NEW")
      .order("score", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) throw new Error(`getQueuedLeads: ${error.message}`);
    return (data ?? []).map(toProspect);
  }

  async promoteLead(prospectId: string, addedAt: Day, reason: string): Promise<void> {
    const { error } = await this.db
      .from("cockpit_prospects")
      .update({ stage: "IN_SEQUENCE", added_at: addedAt, promoted_at: new Date().toISOString(), promoted_reason: reason })
      .eq("id", prospectId);
    if (error) throw new Error(`promoteLead: ${error.message}`);
    const rows = scheduleForProspect(prospectId, addedAt).map((t) => ({
      prospect_id: prospectId,
      touch_number: t.touchNumber,
      due_date: t.dueDate,
      channel: "linkedin",
    }));
    const { error: tErr } = await this.db.from("cockpit_touches").insert(rows);
    if (tErr) throw new Error(`promoteLead touches: ${tErr.message}`);
    await this.logEvent(prospectId, "promote", { reason });
  }

  async binLead(prospectId: string, reason: string): Promise<void> {
    const { error } = await this.db
      .from("cockpit_prospects")
      .update({ stage: "LOST", notes: `binned: ${reason}` })
      .eq("id", prospectId);
    if (error) throw new Error(`binLead: ${error.message}`);
  }

  async countPromotedInWeek(weekStart: Day, weekEnd: Day): Promise<number> {
    const { count, error } = await this.db
      .from("cockpit_prospects")
      .select("id", { count: "exact", head: true })
      .in("stage", ["IN_SEQUENCE", "REPLIED", "CALL", "PROPOSAL", "WON"])
      .gte("added_at", weekStart)
      .lte("added_at", weekEnd);
    if (error) throw new Error(`countPromotedInWeek: ${error.message}`);
    return count ?? 0;
  }

  async saveDigest(digest: SavedDigest): Promise<void> {
    const { error } = await this.db.from("cockpit_digests").upsert(
      { digest_date: digest.digestDate, slack_ts: digest.slackTs, actions: digest.actions, posted_at: digest.postedAt },
      { onConflict: "digest_date" }
    );
    if (error) throw new Error(`saveDigest: ${error.message}`);
  }

  async getDigest(digestDate: Day): Promise<SavedDigest | null> {
    const { data, error } = await this.db
      .from("cockpit_digests")
      .select("*")
      .eq("digest_date", digestDate)
      .maybeSingle();
    if (error) throw new Error(`getDigest: ${error.message}`);
    if (!data) return null;
    return {
      digestDate: (data.digest_date as string).slice(0, 10),
      slackTs: data.slack_ts ?? null,
      actions: data.actions ?? [],
      postedAt: data.posted_at ?? null,
    };
  }

  async addNewsletterNote(month: string, text: string, url: string | null, atIso: string): Promise<void> {
    const { error } = await this.db
      .from("cockpit_newsletter_notes")
      .insert({ month, text, url, created_at: atIso });
    if (error) throw new Error(`addNewsletterNote: ${error.message}`);
  }

  async getNewsletterNotes(month: string): Promise<NewsletterNote[]> {
    const { data, error } = await this.db
      .from("cockpit_newsletter_notes")
      .select("text, url, created_at")
      .eq("month", month)
      .order("created_at", { ascending: true });
    if (error) throw new Error(`getNewsletterNotes: ${error.message}`);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return (data ?? []).map((r: any) => ({ text: r.text, url: r.url ?? null, createdAt: r.created_at }));
  }

  async getLeadsNeedingEnrichment(limit: number): Promise<StoreProspect[]> {
    const { data, error } = await this.db
      .from("cockpit_prospects")
      .select("*")
      .eq("stage", "NEW")
      .eq("tier", "A")
      .is("dossier", null)
      .order("score", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) throw new Error(`getLeadsNeedingEnrichment: ${error.message}`);
    return (data ?? []).map(toProspect);
  }

  async setDossier(prospectId: string, dossier: string, openerAngle: string | null): Promise<void> {
    const { error } = await this.db
      .from("cockpit_prospects")
      .update({ dossier, opener_angle: openerAngle })
      .eq("id", prospectId);
    if (error) throw new Error(`setDossier: ${error.message}`);
  }

  async getProspectDetail(prospectId: string): Promise<ProspectDetail | null> {
    const prospect = await this.getProspect(prospectId);
    if (!prospect) return null;
    const [touchesRes, eventsRes] = await Promise.all([
      this.db.from("cockpit_touches").select("*").eq("prospect_id", prospectId).order("touch_number"),
      this.db.from("cockpit_events").select("type, created_at, payload").eq("prospect_id", prospectId).order("created_at"),
    ]);
    if (touchesRes.error) throw new Error(`getProspectDetail touches: ${touchesRes.error.message}`);
    if (eventsRes.error) throw new Error(`getProspectDetail events: ${eventsRes.error.message}`);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return {
      prospect,
      touches: (touchesRes.data ?? []).map(toTouch),
      events: (eventsRes.data ?? []).map((e: any) => ({ type: e.type, at: e.created_at, payload: e.payload })),
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  async listRoster(limit: number): Promise<RosterEntry[]> {
    const { data, error } = await this.db
      .from("cockpit_prospects")
      .select("id, name, company, role, stage, tier, score, sources")
      .order("score", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) throw new Error(`listRoster: ${error.message}`);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (data ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      company: p.company ?? null,
      role: p.role ?? null,
      stage: p.stage,
      tier: p.tier ?? null,
      score: p.score ?? null,
      sources: p.sources ?? [],
    }));
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  // ── CRM level-up ────────────────────────────────────────────────────────────
  async getPending(): Promise<PendingState | null> {
    const { data, error } = await this.db.from("cockpit_pending").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(`getPending: ${error.message}`);
    if (!data?.kind || !data?.prospect_id) return null;
    return { kind: data.kind, prospectId: data.prospect_id };
  }

  async setPending(kind: PendingKind, prospectId: string): Promise<void> {
    const { error } = await this.db
      .from("cockpit_pending")
      .upsert({ id: 1, kind, prospect_id: prospectId, created_at: new Date().toISOString() });
    if (error) throw new Error(`setPending: ${error.message}`);
  }

  async clearPending(): Promise<void> {
    const { error } = await this.db.from("cockpit_pending").update({ kind: null, prospect_id: null }).eq("id", 1);
    if (error) throw new Error(`clearPending: ${error.message}`);
  }

  async appendNote(prospectId: string, line: string): Promise<void> {
    const p = await this.getProspect(prospectId);
    if (!p) return;
    const notes = p.notes ? `${p.notes}\n${line}` : line;
    const { error } = await this.db.from("cockpit_prospects").update({ notes }).eq("id", prospectId);
    if (error) throw new Error(`appendNote: ${error.message}`);
  }

  async updateProspect(prospectId: string, patch: ProspectPatch): Promise<void> {
    const map: Record<string, unknown> = {};
    if (patch.email !== undefined) map.email = patch.email;
    if (patch.linkedinUrl !== undefined) map.linkedin_url = patch.linkedinUrl;
    if (patch.dealValue !== undefined) map.deal_value = patch.dealValue;
    if (patch.callAt !== undefined) map.call_at = patch.callAt;
    if (patch.track !== undefined) map.track = patch.track;
    if (patch.stage !== undefined) map.stage = patch.stage;
    if (!Object.keys(map).length) return;
    const { error } = await this.db.from("cockpit_prospects").update(map).eq("id", prospectId);
    if (error) throw new Error(`updateProspect: ${error.message}`);
  }

  async resurfaceDue(today: Day): Promise<number> {
    const { data, error } = await this.db
      .from("cockpit_prospects")
      .select("id, notes")
      .eq("stage", "DORMANT")
      .lte("resurface_at", today);
    if (error) throw new Error(`resurfaceDue: ${error.message}`);
    for (const r of data ?? []) {
      const note = `resurfaced ${today} after 90 days dormant`;
      const notes = r.notes ? `${r.notes}\n${note}` : note;
      const { error: uErr } = await this.db
        .from("cockpit_prospects")
        .update({ stage: "NEW", resurface_at: null, notes })
        .eq("id", r.id);
      if (uErr) throw new Error(`resurfaceDue update: ${uErr.message}`);
    }
    return (data ?? []).length;
  }

  async getCallsForDay(day: Day): Promise<StoreProspect[]> {
    const { data, error } = await this.db.from("cockpit_prospects").select("*").eq("call_at", day);
    if (error) throw new Error(`getCallsForDay: ${error.message}`);
    return (data ?? []).map(toProspect);
  }

  async scheduleFollowUps(prospectId: string, baseDay: Day): Promise<void> {
    const { data: existing, error: exErr } = await this.db
      .from("cockpit_touches")
      .select("touch_number")
      .eq("prospect_id", prospectId);
    if (exErr) throw new Error(`scheduleFollowUps: ${exErr.message}`);
    const have = new Set((existing ?? []).map((t) => t.touch_number));
    const rows = followUpsFrom(prospectId, baseDay)
      .filter((t) => !have.has(t.touchNumber))
      .map((t) => ({ prospect_id: prospectId, touch_number: t.touchNumber, due_date: t.dueDate, channel: "email" }));
    if (!rows.length) return;
    const { error } = await this.db.from("cockpit_touches").insert(rows);
    if (error) throw new Error(`scheduleFollowUps insert: ${error.message}`);
  }

  async getPipelineValue(): Promise<PipelineValue> {
    const [{ data: rows, error }, settings] = await Promise.all([
      this.db.from("cockpit_prospects").select("stage, deal_value").in("stage", ["REPLIED", "CALL", "PROPOSAL", "WON"]),
      this.getSettingsRow(),
    ]);
    if (error) throw new Error(`getPipelineValue: ${error.message}`);
    let openValue = 0, openCount = 0, wonValue = 0, wonCount = 0;
    for (const r of rows ?? []) {
      const v = r.deal_value != null ? Number(r.deal_value) : 50000;
      if (r.stage === "WON") { wonValue += v; wonCount += 1; }
      else { openValue += v; openCount += 1; }
    }
    return { openValue, openCount, wonValue, wonCount, target: settings.revenueTarget };
  }

  private async getSettingsRow(): Promise<{ revenueTarget: number }> {
    const { data } = await this.db.from("cockpit_settings").select("revenue_target").eq("id", 1).maybeSingle();
    return { revenueTarget: data?.revenue_target != null ? Number(data.revenue_target) : 700000 };
  }

  async updateSettings(patch: Partial<Settings>): Promise<Settings> {
    const map: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.weeklyVolume !== undefined) map.weekly_volume = patch.weeklyVolume;
    if (patch.briefHour !== undefined) map.brief_hour = patch.briefHour;
    if (patch.nudgeHour !== undefined) map.nudge_hour = patch.nudgeHour;
    if (patch.timezone !== undefined) map.timezone = patch.timezone;
    if (patch.streakWeeks !== undefined) map.streak_weeks = patch.streakWeeks;
    const { error } = await this.db.from("cockpit_settings").update(map).eq("id", 1);
    if (error) throw new Error(`updateSettings: ${error.message}`);
    return this.getSettings();
  }
}
