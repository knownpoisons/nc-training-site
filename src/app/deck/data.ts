// ═══════════════════════════════════════════════════════════════════════════════
// DECK DATA — server-only reads over the same SupabaseStore the Slack loop uses.
// The Deck reviews; it does not operate. Everything here is a read.
// ═══════════════════════════════════════════════════════════════════════════════

import { getSupabaseServer } from "@/lib/supabase";
import { SupabaseStore } from "@/cockpit/store/supabase";
import { computeScoreboard, type Scoreboard } from "@/cockpit/ops/scoreboard";
import { mondayOf, sundayOf, compareDays } from "@/cockpit/cadence/dates";
import { localParts } from "@/cockpit/runtime";
import type { PipelineValue, Settings, StoreProspect } from "@/cockpit/store/types";

export interface DeckData {
  today: string;
  prospects: StoreProspect[];
  counts: Record<string, number>;
  pipeline: PipelineValue;
  queue: StoreProspect[];
  scoreboard: Scoreboard;
  settings: Settings;
  weekLabel: string;
}

const EMPTY: Omit<DeckData, "today"> = {
  prospects: [],
  counts: {},
  pipeline: { openValue: 0, openCount: 0, wonValue: 0, wonCount: 0, target: 700000 },
  queue: [],
  scoreboard: computeScoreboard({
    weekStart: "2026-01-05", weekEnd: "2026-01-11", today: "2026-01-05",
    programStart: "2026-01-05", touches: [], events: [], prospects: [],
  }),
  settings: { weeklyVolume: 6, briefHour: 7, nudgeHour: 14, timezone: "Pacific/Honolulu", streakWeeks: 0, bookingUrl: null },
  weekLabel: "",
};

export async function loadDeckData(): Promise<DeckData> {
  const db = getSupabaseServer();
  if (!db) return { today: "", ...EMPTY };
  const store = new SupabaseStore(db);

  const settings = await store.getSettings();
  const { day: today } = localParts(settings.timezone, new Date());

  const [roster, counts, pipeline, queue, data] = await Promise.all([
    listAllProspects(store),
    store.pipelineCounts(),
    store.getPipelineValue(),
    store.getQueuedLeads(10),
    store.getScoreboardData(),
  ]);

  const programStart =
    data.touches.reduce<string | null>((min, t) => (!min || compareDays(t.dueDate, min) < 0 ? t.dueDate : min), null) ??
    today;
  const scoreboard = computeScoreboard({
    ...data,
    weekStart: mondayOf(today),
    weekEnd: sundayOf(today),
    today,
    programStart,
    weeklyVolume: settings.weeklyVolume,
    annualTarget: pipeline.target,
  });

  return {
    today,
    prospects: roster,
    counts,
    pipeline,
    queue,
    scoreboard,
    settings,
    weekLabel: `${mondayOf(today)} – ${sundayOf(today)}`,
  };
}

/** All prospects, warmest first — the roster the Pipeline screen renders. */
async function listAllProspects(store: SupabaseStore): Promise<StoreProspect[]> {
  // getQueuedLeads is NEW-only; the pipeline table needs everyone.
  const db = getSupabaseServer()!;
  const { data, error } = await db
    .from("cockpit_prospects")
    .select("*")
    .order("score", { ascending: false, nullsFirst: false })
    .limit(200);
  if (error) throw new Error(`deck roster: ${error.message}`);
  // reuse the store's row mapper via a tiny fetch-by-id? No — map inline through
  // the store's public reads would N+1. The store's mapper is private, so map here
  // with the same field names it uses.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (data ?? []).map((r: any) => ({
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
    callBrief: r.call_brief ?? null,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
