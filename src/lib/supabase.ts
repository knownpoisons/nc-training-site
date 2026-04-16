import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE SERVER CLIENT
// Used in API routes only. Reads SERVICE_ROLE_KEY — never exposed to the browser.
// Returns null if env vars are missing so callers can no-op gracefully.
// ═══════════════════════════════════════════════════════════════════════════════

let cached: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

// ─── Scorecard lead row shape (matches SQL migration) ─────────────────────────
export interface ScorecardLeadRow {
  name: string;
  email: string;
  tier: string;
  score_normalized: number;
  score_raw: number;
  adoption_score: number;
  readiness_score: number;
  blockers_score: number;
  stack_bucket: string;
  stack_count: number;
  stack_selections: string[];
  work_type: string | null;
  recommended_program: string;
  answers: unknown; // JSONB — full answer payload
}

export async function insertScorecardLead(
  row: ScorecardLeadRow
): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabaseServer();
  if (!client) {
    return { ok: false, error: "SUPABASE_NOT_CONFIGURED" };
  }
  const { error } = await client.from("scorecard_leads").insert(row);
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
