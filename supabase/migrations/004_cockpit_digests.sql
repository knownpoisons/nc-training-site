-- ═══════════════════════════════════════════════════════════════════════════════
-- GTM COCKPIT — weekly lead digests (Phase 4: F11)
-- Run in Supabase after 003. Idempotent.
--
-- One row per Monday digest. `actions` is the ordered list of queued leads shown,
-- so "promote 1 3" / "bin 2" resolve to the leads posted that morning.
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.cockpit_digests (
  digest_date date primary key,
  slack_ts    text,
  actions     jsonb not null default '[]'::jsonb,
  posted_at   timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.cockpit_digests enable row level security;
-- Service role only.
