-- ═══════════════════════════════════════════════════════════════════════════════
-- GTM COCKPIT: archive the untouched NEW queue (cold outbound stopped, 5 Nov 2026)
--
-- RUN on production on 5 Nov 2026 at 13:59 UTC, on Jem's go for the exact
-- count below ("Go, archive 4,838"). It was run in the Supabase SQL editor
-- from commit 625ad947. Only this header has changed since: the SQL is the same.
-- Result: ARCHIVED 4838, IN_SEQUENCE 5, LOST 5, total still 4848. Checked
-- again through the API at 14:00 UTC.
-- Where: Supabase Dashboard, SQL, New query. Paste the whole file.
--
-- What it does
--   1. Schema: adds stage 'ARCHIVED' and two columns, archived_at and
--      archived_from_stage. Changes no rows.
--   2. Data: moves every untouched NEW prospect to ARCHIVED and records when,
--      and which stage it came from. Deletes nothing. Clears no field.
--
-- Why a new stage and not an existing one
--   DORMANT is not an archive: resurfaceDue() moves DORMANT rows back to NEW
--     once resurface_at arrives, and DORMANT means "four touches, no reply".
--   LOST means closed lost or binned from the digest. These rows were never
--     contacted, so LOST would be a false record.
--   paused only hides due touches. A paused NEW row still shows in the digest
--     and still gets enriched.
--   Every queue reader in the deployed code filters on stage = 'NEW'
--     (getQueuedLeads, getLeadsNeedingEnrichment), and resurfaceDue() only
--     reads DORMANT. So ARCHIVED rows drop out of the digest, the enrichment
--     job and resurfacing with no code change and no deploy.
--   The email dedupe (listExistingEmails, findProspectByEmail) reads all
--     stages, so a later import will not re-create an archived person.
--
-- Counts before the run, read from production on 5 Nov 2026 at 13:13 UTC
--   cockpit_prospects total   4848
--   NEW                       4838   (2478 pipeline lane, 2360 broadcast_only)
--   IN_SEQUENCE                  5   (kept, exported to Zoidberg people.json)
--   LOST                         5   (kept as they are, binned from the digest)
--   all other stages             0
--   touches marked sent 0, reply events 0, call briefs 0, call dates 0
--
-- Rows the data step changes: 4838. All of them are stage NEW with no touch
-- row, no event, no call date and no call brief.
--
-- Safety
--   The data step counts what it changed. If that is not exactly 4838 it
--   raises an error and the whole file rolls back, schema included.
--   Running the file a second time changes 0 rows and says so.
--   The drop/add of the stage check assumes the Postgres default name
--   cockpit_prospects_stage_check (the same pattern as 006 and 007). If the
--   live name differs, the old check stays, the update fails on it and
--   nothing changes.
--
-- Dry run (read only), the same filter as the update:
--   select count(*)
--     from public.cockpit_prospects p
--    where p.stage = 'NEW'
--      and p.call_brief is null
--      and p.call_at is null
--      and not exists (select 1 from public.cockpit_touches t where t.prospect_id = p.id)
--      and not exists (select 1 from public.cockpit_events  e where e.prospect_id = p.id);
--
-- Undo (puts every archived row back where it came from):
--   update public.cockpit_prospects
--      set stage = archived_from_stage, archived_at = null, archived_from_stage = null
--    where stage = 'ARCHIVED';
-- ═══════════════════════════════════════════════════════════════════════════════

begin;

-- ─── 1. Schema (changes no rows) ──────────────────────────────────────────────
alter table public.cockpit_prospects add column if not exists archived_at timestamptz;
alter table public.cockpit_prospects add column if not exists archived_from_stage text;

alter table public.cockpit_prospects drop constraint if exists cockpit_prospects_stage_check;
alter table public.cockpit_prospects add constraint cockpit_prospects_stage_check
  check (stage in ('NEW','IN_SEQUENCE','REPLIED','CALL','PROPOSAL','WON','LOST','DORMANT','ARCHIVED'));

-- ─── 2. Data: archive the untouched NEW rows (expected: 4838) ─────────────────
do $$
declare
  expected constant int := 4838;
  n int;
begin
  update public.cockpit_prospects p
     set stage = 'ARCHIVED',
         archived_at = now(),
         archived_from_stage = p.stage
   where p.stage = 'NEW'
     and p.call_brief is null
     and p.call_at is null
     and not exists (select 1 from public.cockpit_touches t where t.prospect_id = p.id)
     and not exists (select 1 from public.cockpit_events  e where e.prospect_id = p.id);
  get diagnostics n = row_count;

  if n = 0 then
    raise notice 'Archive: 0 rows changed. Already archived, nothing to do.';
  elsif n <> expected then
    raise exception 'Archive stopped: % rows matched, expected %. Nothing was changed. Re-count and get a new go.', n, expected;
  else
    raise notice 'Archive: % rows moved from NEW to ARCHIVED.', n;
  end if;
end $$;

commit;

-- ─── 3. Check (read only). Expected: ARCHIVED 4838, IN_SEQUENCE 5, LOST 5 ─────
select stage, count(*) as prospects
  from public.cockpit_prospects
 group by stage
 order by stage;
