-- ═══════════════════════════════════════════════════════════════════════════════
-- GTM COCKPIT — Phase 2 wave 1
-- Run in Supabase after 006. Idempotent.
--
-- Adds: the call-brief field (distilled from pasted Granola transcripts), the
-- call_debrief pending kind, and the booking link used in ask CTAs.
-- ═══════════════════════════════════════════════════════════════════════════════

-- Distilled call intelligence — feeds the post-call follow-up drafts.
alter table public.cockpit_prospects add column if not exists call_brief text;

-- Booking link offered in ask-stage CTAs (editable via `set booking <url>`).
alter table public.cockpit_settings add column if not exists booking_url text;
update public.cockpit_settings
  set booking_url = 'https://calendar.app.google/t363uRxBKHW53Ggr7'
  where id = 1 and booking_url is null;

-- New pending kind for the transcript paste.
alter table public.cockpit_pending drop constraint if exists cockpit_pending_kind_check;
alter table public.cockpit_pending add constraint cockpit_pending_kind_check
  check (kind in ('reply_paste','call_date','call_debrief'));

-- New event type: the captured call transcript.
alter table public.cockpit_events drop constraint if exists cockpit_events_type_check;
alter table public.cockpit_events add constraint cockpit_events_type_check
  check (type in ('reply','call_booked','closed_won','closed_lost','skip','snooze','promote','call_debrief'));
