-- Two Palms AI Foundations: Time · Money · Pain form (opens after Session 1, due Fri 6 Nov 2026).
-- Answers are admin-only (Backstage). Service-role only: RLS on, no policies, so
-- nothing reads or writes it except the server. Run once in the Supabase SQL editor.

create table if not exists tp_tmp (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  name text not null,
  role text not null,
  role_other text,
  office text not null,
  office_other text,
  time text not null,
  time_hours text not null,
  money text not null,
  money_hours text not null,
  pain text not null,
  pain_hours text not null,
  tools text,
  dream text not null
);

alter table tp_tmp enable row level security;

create index if not exists tp_tmp_created_at_idx on tp_tmp (created_at desc);
