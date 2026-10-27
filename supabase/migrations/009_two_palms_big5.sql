-- Two Palms hub · Backstage "Big 5": the five jobs, their plans, and every to-do.
-- Service-role only (same pattern as tp_checklist). Run once in the SQL editor.
-- Claude edits rows here directly; the page reads them live, so no redeploy is needed.

create table if not exists tp_big5_jobs (
  id text primary key,                 -- scoping | timesheets | reporting | finance | tasks
  ord int not null,
  name text not null,
  owner text not null default 'TBC',
  co_owners text not null default 'TBC',
  runs_on text not null default 'TBC',
  hours text not null default 'TBC',
  done_looks_like text not null default 'TBC',
  deep_dive text not null default 'TBC', -- date as text; 'TBC' until confirmed
  open_questions text[] not null default '{}',
  status text not null default 'Not started'
    check (status in ('Not started','Intake','Planning','Building','Live')),
  stage int not null default -1,       -- -1 none yet; 0 Intake deep-dive, 1 Plan agreed, 2 Build, 3 Test with owner, 4 Live
  updated_at timestamptz not null default now()
);
alter table tp_big5_jobs enable row level security;

create table if not exists tp_big5_todos (
  id text primary key,
  list text not null,                  -- a job id, or 'micky' / 'jem'
  ord int not null default 0,
  task text not null,
  owner text not null default 'TBC',
  due text not null default 'TBC',     -- free text; 'TBC' until confirmed
  done boolean not null default false,
  done_by text,
  done_at timestamptz,
  created_at timestamptz not null default now()
);
alter table tp_big5_todos enable row level security;
create index if not exists tp_big5_todos_list on tp_big5_todos (list, ord);

-- Seed (from Jem's brief, 27 Oct 2026). Re-running does not overwrite edits.
insert into tp_big5_jobs (id, ord, name, owner, co_owners, runs_on, hours, done_looks_like, deep_dive, open_questions, status, stage) values
('scoping', 1, 'Scoping to flighting', 'Allyssa (AU) and Sam (EU)', 'Ed',
 'Barry the Budget Builder in Claude, the master scoping spreadsheet, Productive',
 'About two hours a week each side. Around 70% of the business is retainer.',
 'One quote template, plus a Claude Skill that drafts scopes and asks juniors the questions they miss, with approval thresholds built in.',
 'TBC', array['Time-based or output-based pricing?','Which quote style wins?'], 'Intake', 0),
('timesheets', 2, 'Timesheets', 'Micky (AU) and Sam (EU)', 'TBC',
 'Productive', 'TBC',
 'Near-automatic entry with no chasing.',
 'TBC', array['What decisions actually depend on per-job margin data?'], 'Intake', 0),
('reporting', 3, 'Retainer and project reporting', 'Steph Young (to confirm)', 'Fergus (client voice)',
 'Nothing standard today', 'TBC',
 'Designed once, then press a button for a consistent report.',
 'TBC', '{}', 'Not started', -1),
('finance', 4, 'Budgets, invoicing, recon', 'Ed and Sam', 'TBC',
 'Productive plus a finance tool (Xero, to confirm)', 'TBC', 'TBC',
 'TBC', '{}', 'Not started', -1),
('tasks', 5, 'Task management and client hygiene', 'Nikki now, then the new Group Account Director', 'Sam and Will (EU)',
 'Slack client channels, monday.com for Zambrero, Sam''s R&R docs', 'TBC',
 'Agents read email, Slack, Drive and Granola and surface tasks into each person''s daily briefing. No manual board updates.',
 'TBC', array['Personal to-do or client board: where does a task live?'], 'Not started', -1)
on conflict (id) do nothing;

insert into tp_big5_todos (id, list, ord, task, owner, due) values
('scoping-1', 'scoping', 1, 'Pick one quote template', 'Ed, Sam', 'TBC'),
('scoping-2', 'scoping', 2, 'Fix the influencer markup formula in the master sheet (20% to 5%)', 'Allyssa', 'TBC'),
('scoping-3', 'scoping', 3, 'Book the deep-dive', 'Jem', 'TBC'),
('timesheets-1', 'timesheets', 1, '"Why do we timesheet" workshop with Ed, Micky and Allyssa', 'Jem', 'TBC'),
('timesheets-2', 'timesheets', 2, 'Proof of concept: automate Jem''s own Productive timesheet', 'Jem', 'TBC'),
('reporting-1', 'reporting', 1, 'Confirm Steph as owner', 'Ed', 'TBC'),
('reporting-2', 'reporting', 2, 'Book the deep-dive', 'Jem', 'TBC'),
('finance-1', 'finance', 1, 'Confirm the finance tool', 'Ed', 'TBC'),
('finance-2', 'finance', 2, 'Book the deep-dive', 'Jem', 'TBC'),
('tasks-1', 'tasks', 1, 'Book the deep-dive', 'Jem', 'TBC'),
('micky-1', 'micky', 1, 'Claude Team invites to the full team', 'Micky', 'Fri 30 Oct'),
('micky-2', 'micky', 2, 'Sam and Ed migrate their existing Claude accounts', 'Sam, Ed', 'TBC'),
('micky-3', 'micky', 3, 'OpenAI API key and hosted connector set up', 'Micky', 'TBC'),
('micky-4', 'micky', 4, 'AI training Slack channel created, first post pinned, 3-day follow-up', 'Micky', 'TBC'),
('micky-5', 'micky', 5, 'Drive skills folder created and locked', 'Micky', 'TBC'),
('jem-1', 'jem', 1, 'AI policy: public version, plus the full version in Claude admin rules', 'Jem', 'TBC'),
('jem-2', 'jem', 2, 'Personalised onboarding prompt for each person', 'Jem', 'TBC'),
('jem-3', 'jem', 3, 'Fresh-account setup guide', 'Jem', 'TBC'),
('jem-4', 'jem', 4, 'IG Reply Assistant notes, and the rebuild session with Sam', 'Jem', 'TBC'),
('jem-5', 'jem', 5, 'Session 1', 'Jem', 'Mon 2 Nov')
on conflict (id) do nothing;
