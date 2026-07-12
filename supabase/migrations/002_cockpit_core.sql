-- ═══════════════════════════════════════════════════════════════════════════════
-- GTM COCKPIT — core schema (Phase 1: Data + Cadence)
-- Run in Supabase: Dashboard → SQL → New query. Safe to re-run (idempotent).
--
-- This is the pipeline database: who we're talking to (prospects), what's due
-- and when (touches), what happened (events), the message templates, and the
-- single settings row. Engine Zero columns (tier/score/dossier/consent) are
-- included now so no second migration is needed later.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── prospects ────────────────────────────────────────────────────────────────
create table if not exists public.cockpit_prospects (
  id            uuid primary key default gen_random_uuid(),
  added_at      timestamptz not null default now(),

  -- Identity
  name          text not null,
  role          text,
  company       text,
  linkedin_url  text,
  email         text,
  notes         text,

  -- Pipeline position
  source_engine text not null default 'outbound'
                  check (source_engine in ('partner','outbound','alumni','list','press')),
  track         text check (track in ('A','B')),
  stage         text not null default 'NEW'
                  check (stage in ('NEW','IN_SEQUENCE','REPLIED','CALL','PROPOSAL','WON','LOST','DORMANT')),
  paused        boolean not null default false,

  -- When a prospect goes DORMANT, this is when they resurface (added_at + 90d)
  resurface_at  timestamptz,

  -- ─── Engine Zero (lead sourcing/enrichment/scoring) ───
  tier            text check (tier in ('A','B','C')),
  score           numeric,
  dossier         text,
  opener_angle    text,
  source_detail   jsonb not null default '{}'::jsonb,   -- per-source metadata
  sources         text[] not null default '{}',         -- stacks across sources
  consent_lane    text not null default 'pipeline'
                    check (consent_lane in ('pipeline','broadcast_only')),
  promoted_at     timestamptz,
  promoted_reason text
);

create index if not exists cockpit_prospects_stage_idx    on public.cockpit_prospects (stage);
create index if not exists cockpit_prospects_added_at_idx  on public.cockpit_prospects (added_at);
create index if not exists cockpit_prospects_email_idx     on public.cockpit_prospects (lower(email));
create index if not exists cockpit_prospects_resurface_idx on public.cockpit_prospects (resurface_at);

-- ─── touches ──────────────────────────────────────────────────────────────────
create table if not exists public.cockpit_touches (
  id            uuid primary key default gen_random_uuid(),
  prospect_id   uuid not null references public.cockpit_prospects(id) on delete cascade,
  touch_number  int not null check (touch_number between 1 and 4),
  due_date      date not null,
  sent_at       timestamptz,
  skipped_count int not null default 0,
  draft_text    text,
  channel       text not null default 'linkedin' check (channel in ('linkedin','email')),
  -- A touch that a reply/dormancy cancelled is marked halted (not deleted, for history)
  halted_at     timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists cockpit_touches_due_idx      on public.cockpit_touches (due_date);
create index if not exists cockpit_touches_prospect_idx on public.cockpit_touches (prospect_id);
-- One row per (prospect, touch number)
create unique index if not exists cockpit_touches_prospect_touch_uidx
  on public.cockpit_touches (prospect_id, touch_number);

-- ─── events ───────────────────────────────────────────────────────────────────
create table if not exists public.cockpit_events (
  id          uuid primary key default gen_random_uuid(),
  prospect_id uuid references public.cockpit_prospects(id) on delete cascade,
  type        text not null
                check (type in ('reply','call_booked','closed_won','closed_lost','skip','snooze','promote')),
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists cockpit_events_prospect_idx on public.cockpit_events (prospect_id);
create index if not exists cockpit_events_type_idx     on public.cockpit_events (type);

-- ─── templates ────────────────────────────────────────────────────────────────
create table if not exists public.cockpit_templates (
  id           uuid primary key default gen_random_uuid(),
  touch_number int not null,
  lane         text not null check (lane in ('cold','warm','alumni','scorecard','community','inbox','engager')),
  body         text not null,
  updated_at   timestamptz not null default now()
);

-- ─── enrichment queue (Engine Zero, F10) ──────────────────────────────────────
create table if not exists public.cockpit_enrichment_queue (
  id           uuid primary key default gen_random_uuid(),
  prospect_id  uuid not null references public.cockpit_prospects(id) on delete cascade,
  pass         int not null check (pass in (1,2)),
  status       text not null default 'queued' check (status in ('queued','running','done','failed')),
  attempts     int not null default 0,
  completed_at timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists cockpit_enrichment_status_idx on public.cockpit_enrichment_queue (status);

-- ─── intake log (Engine Zero, F9) ─────────────────────────────────────────────
create table if not exists public.cockpit_intake_log (
  id            uuid primary key default gen_random_uuid(),
  source        text not null,
  raw_payload   jsonb not null default '{}'::jsonb,
  dedupe_result text,
  created_at    timestamptz not null default now()
);

-- ─── settings (single row) ────────────────────────────────────────────────────
create table if not exists public.cockpit_settings (
  id            int primary key default 1 check (id = 1),
  weekly_volume int  not null default 6,
  brief_hour    int  not null default 7,       -- local hour, 0–23
  nudge_hour    int  not null default 14,
  timezone      text not null default 'Pacific/Honolulu',
  streak_weeks  int  not null default 0,
  updated_at    timestamptz not null default now()
);

-- Seed the single settings row if absent.
insert into public.cockpit_settings (id)
values (1)
on conflict (id) do nothing;

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Everything is service-role only (API routes). No anon access.
alter table public.cockpit_prospects        enable row level security;
alter table public.cockpit_touches          enable row level security;
alter table public.cockpit_events           enable row level security;
alter table public.cockpit_templates        enable row level security;
alter table public.cockpit_enrichment_queue enable row level security;
alter table public.cockpit_intake_log       enable row level security;
alter table public.cockpit_settings         enable row level security;
-- Service role bypasses RLS. Add policies later if The Deck reads with anon key.
