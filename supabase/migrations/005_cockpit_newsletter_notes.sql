-- ═══════════════════════════════════════════════════════════════════════════════
-- GTM COCKPIT — newsletter content inbox (Phase 4: F7 enhancement)
-- Run in Supabase after 004. Idempotent.
--
-- Jem drops ideas/links/notes into #cockpit all month ("note ...", "idea ...").
-- Each lands here keyed by month (YYYY-MM). The monthly newsletter builder pulls
-- the month's notes and composes them into a fully-featured draft.
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.cockpit_newsletter_notes (
  id         uuid primary key default gen_random_uuid(),
  month      text not null,               -- 'YYYY-MM'
  text       text not null,
  url        text,
  created_at timestamptz not null default now()
);

create index if not exists cockpit_newsletter_notes_month_idx
  on public.cockpit_newsletter_notes (month, created_at);

alter table public.cockpit_newsletter_notes enable row level security;
-- Service role only.
