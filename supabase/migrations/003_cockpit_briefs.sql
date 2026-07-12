-- ═══════════════════════════════════════════════════════════════════════════════
-- GTM COCKPIT — briefs (Phase 2: Slack loop)
-- Run in Supabase after 002. Idempotent.
--
-- One row per day's Morning Brief. `actions` is the ordered list of action refs
-- so a reply like "done 3" resolves to the 3rd action posted that morning.
-- `last_interaction_at` and `nudged_at` drive the Nudge (F8): it fires only when
-- both are null, and sets `nudged_at` so it can never fire twice.
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.cockpit_briefs (
  brief_date          date primary key,
  slack_channel       text,
  slack_ts            text,
  actions             jsonb not null default '[]'::jsonb,
  posted_at           timestamptz,
  last_interaction_at timestamptz,
  nudged_at           timestamptz,
  created_at          timestamptz not null default now()
);

alter table public.cockpit_briefs enable row level security;
-- Service role only, matching the rest of the cockpit schema.
