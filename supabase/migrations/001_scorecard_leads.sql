-- ═══════════════════════════════════════════════════════════════════════════════
-- NotContent Training — scorecard lead store
-- Run this in your Supabase project SQL editor (Dashboard → SQL → New query)
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.scorecard_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Lead
  name text not null,
  email text not null,

  -- Tier + score
  tier text not null,                  -- starting_line | two_speed | capable_but_exposed | at_frontier
  score_normalized int not null,       -- 0–100
  score_raw int not null,              -- 0–96

  -- Dimension sub-scores
  adoption_score int not null,         -- 0–30
  readiness_score int not null,        -- 0–40
  blockers_score int not null,         -- 0–26

  -- Stack audit (Q7)
  stack_bucket text not null,          -- A | B
  stack_count int not null,            -- # of real tool selections (excludes "none")
  stack_selections jsonb not null,     -- array of tool ids

  -- Segmentation (Q6) + recommendation
  work_type text,                      -- brand | performance | retail | agency
  recommended_program text not null,   -- foundations | accelerator | transformation

  -- Full answer payload (for later analysis, retraining, etc.)
  answers jsonb not null
);

-- Helpful indexes for future reporting
create index if not exists scorecard_leads_created_at_idx on public.scorecard_leads (created_at desc);
create index if not exists scorecard_leads_tier_idx on public.scorecard_leads (tier);
create index if not exists scorecard_leads_email_idx on public.scorecard_leads (email);

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- Lock down by default. Inserts only happen via the service role key (API route).
alter table public.scorecard_leads enable row level security;

-- No public read/write policies. Service role bypasses RLS, which is the intended path.
-- Add policies later if you want Supabase dashboards to read it with an anon key.
