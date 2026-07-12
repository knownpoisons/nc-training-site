-- ═══════════════════════════════════════════════════════════════════════════════
-- GTM COCKPIT — CRM level-up (post-test upgrade)
-- Run in Supabase after 005. Idempotent.
--
-- Adds: deal values + revenue target (the F1 stakes line), call dates,
-- post-call follow-up touches (numbers 5–7), and a tiny pending-state table so
-- "replied 3 → paste their reply" and "call booked → what date?" can actually
-- consume the NEXT message instead of dead-ending.
-- ═══════════════════════════════════════════════════════════════════════════════

-- Deal economics: every prospect carries a value (defaults to the $50k anchor).
alter table public.cockpit_prospects add column if not exists deal_value numeric not null default 50000;
-- The booked call date, once Jem logs it.
alter table public.cockpit_prospects add column if not exists call_at date;

-- The revenue target the stakes line counts toward.
alter table public.cockpit_settings add column if not exists revenue_target numeric not null default 700000;

-- Touches 5–7 = post-call follow-up cadence (day 2 value, day 7 made-thing,
-- day 30 news hook). Widen the touch-number check.
alter table public.cockpit_touches drop constraint if exists cockpit_touches_touch_number_check;
alter table public.cockpit_touches add constraint cockpit_touches_touch_number_check
  check (touch_number between 1 and 7);

-- Single-row pending state: what the NEXT #cockpit message should be treated as.
create table if not exists public.cockpit_pending (
  id          int primary key default 1 check (id = 1),
  kind        text check (kind in ('reply_paste','call_date')),
  prospect_id uuid references public.cockpit_prospects(id) on delete set null,
  created_at  timestamptz not null default now()
);
insert into public.cockpit_pending (id, kind) values (1, null) on conflict (id) do nothing;

alter table public.cockpit_pending enable row level security;
-- Service role only, like the rest.
