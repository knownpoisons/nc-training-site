// ═══════════════════════════════════════════════════════════════════════════════
// SCORECARD INTAKE — a scorecard completer becomes a HOT queued lead. Called
// best-effort from the existing /api/assess route; a failure here never affects
// the user's scorecard result. Lands stage NEW (reviewed queue), pipeline lane.
// ═══════════════════════════════════════════════════════════════════════════════

import { getSupabaseServer } from "@/lib/supabase";
import { SupabaseStore } from "../store/supabase";
import { ingest } from "./ingest";
import { scorecardToLead } from "./parse";

export interface ScorecardCompleter {
  name: string;
  email: string;
  tier?: string;
  scoreNormalized?: number;
  workType?: string | null;
  biggestIssue?: string | null;
}

export async function ingestScorecardCompleter(
  c: ScorecardCompleter
): Promise<{ ok: boolean; note?: string }> {
  const db = getSupabaseServer();
  if (!db) return { ok: true, note: "cockpit_skipped_env_missing" };

  const store = new SupabaseStore(db);
  const today = new Date().toISOString().slice(0, 10);
  const raw = scorecardToLead({
    name: c.name,
    email: c.email,
    tier: c.tier,
    score_normalized: c.scoreNormalized,
    work_type: c.workType ?? null,
    created_at: `${today}T00:00:00Z`,
    biggest_issue: c.biggestIssue ?? null,
  });
  const res = await ingest(store, [raw], today);
  return { ok: true, note: res.created ? "cockpit_lead_created" : "cockpit_lead_deduped" };
}
