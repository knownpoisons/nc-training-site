-- Two Palms hub: intake answers + Backstage checklist ticks.
-- Service-role only (same pattern as scorecard_leads). Run once in the SQL editor.

create table if not exists tp_intake (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  name text,
  entity text,
  role text,
  clients text,
  ai_today text,
  tools text[] default '{}',
  confidence int,
  time_wasters text,
  one_win text,
  one_fail text,
  want text
);
alter table tp_intake enable row level security;

create table if not exists tp_checklist (
  id text primary key,
  done boolean not null default false,
  done_by text,
  done_at timestamptz
);
alter table tp_checklist enable row level security;
