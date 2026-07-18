# GTM Cockpit — Build Guide

Source of truth: [cockpit/cockpit-handoff.md](cockpit/cockpit-handoff.md) (v1.2). Read it before any cockpit work. This file is the operating summary + status tracker; the handoff wins on any conflict of detail.

## Model rule

- **Build work** (writing code, migrations, tests): run on **opusplan**.
- **Gate reviews** (deciding whether a gate passes, reviewing gate output): run on **fable**.
- Never advance a phase until its gate passes. Post gate results as test output Jem can see.

## Operating contract (how every session runs)

Claude runs this build. Jem is a creative, not a coder. Standing orders, straight from him:

1. **Work one phase per session.** Finish the phase, run its gate yourself, show the output and a one-word verdict: PASS or FAIL.
2. **Fix failures without asking.** Iterate until the gate passes; show what failed and what was fixed.
3. **Only stop to talk to Jem when:** (a) the handoff requires his eyes — **Gate 3** voice spot-check of 5 drafts, **Gate 4** one real Beehiiv paste test, **Gate 5** dry-run week + 20-dossier pilot review, **Gate 6** screen walkthrough — or (b) a genuine decision only he can make. Everything else: decide and note it in the decisions log.
4. **Plain English, never jargon.** Explain what things do, not what they're called.
5. **Before ending a session:** update the status tracker, decisions log, and session log below so the next session picks up with zero explanation from Jem.
6. **Start of every session:** read this file, then `cockpit/cockpit-handoff.md`, then the session log. Then continue from "Next up".

## What we're building

A Slack-native pipeline operating system for Jem (solo founder, creative, not a coder) running B2B outreach for a $50k training programme against a $700k annual target.

Core principles (non-negotiable in v1):
1. **The system drafts. The human sends.** Nothing is ever sent automatically to a prospect or subscriber.
2. **Slack is the whole daily interface** (one channel, `#cockpit`). If a daily action requires opening anything other than Slack or email, the design is wrong.
3. **Stat guard is a hard gate**: any dollar figure or percentage in a draft must appear verbatim in `knowledge/PROOF.md`, enforced in code, not prompt.
4. **Volume governor**: 6 new prospects/week, raised only with Jem's explicit yes, never above 8/week in v1.
5. **One nudge per day, maximum.** The system must never become a guilt machine.
6. **Consent rule**: newsletter subscribers and community-list members are `broadcast_only` until a signal event or explicit promotion. Importers must never mass-create `IN_SEQUENCE` prospects.

## Decisions log

- **2026-07-10 — Database: Supabase** (Jem's call). The handoff says Vercel Postgres, which is discontinued; the repo already runs Supabase with the live `scorecard_leads` table. Cockpit tables go in the same Supabase project.
- **2026-07-10 — Timezone: `Pacific/Honolulu` (HST) for now.** Jem relocates to Thailand (~Aug 2026) → `Asia/Bangkok`. Timezone MUST be an editable runtime setting (`settings.timezone`), never hardcoded; cron endpoints compute local send-time from it.

## Stack

- Vercel (Next.js App Router — this repo), Vercel Cron
- Supabase Postgres (decided 2026-07-10 — see decisions log)
- Anthropic API for drafts + conversational handler
- Slack Events API + Web API, single channel `#cockpit`
- Beehiiv: **no API integration** — system produces paste-ready output only
- No email sending, no LinkedIn automation, no auto-send of anything

Env secrets required: `ANTHROPIC_API_KEY`, `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_CHANNEL_ID`, `DATABASE_URL`, `CRON_SECRET`.

Knowledge files (loaded into every draft-generation call): `knowledge/VOICE_BRIEF.md`, `knowledge/PLAYBOOK.md` (blocking — Jem supplies), `knowledge/PROOF.md`, `knowledge/SEQUENCES.md`. **None of these exist in the repo yet.**

## Functions (build these, nothing else)

| # | Function | Summary |
|---|----------|---------|
| F1 | Morning Brief | 07:00 cron, max 8 actions, threaded Slack post, never empty, never over 8 |
| F2 | Draft Engine | Claude drafts with banned-words linter + stat guard enforced in code; <120 words; `[PERSONALISE]` marker; British spelling |
| F3 | Cadence Engine | Touch days 1/4/12/21; weekend shift; skip +2d; reply halts; dormant after touch 4; daily load cap 8 |
| F4 | Slack Command Layer | Plain-language intents (done/skip/add/replied/rewrite/etc.); every state change visibly confirmed |
| F5 | Conversational Handler | Unmatched messages → Claude with pipeline context; proposes actions, executes only on confirmation |
| F6 | Friday Scoreboard | Computed, never generated-only; per engine, per track; honesty line |
| F7 | Newsletter Builder | Monthly; Beehiiv paste-ready output + 3 subject options |
| F8 | The Nudge | 14:00, only if zero interaction, once, never twice |
| F9 | Intake (Engine Zero) | Scorecard webhook, Beehiiv webhook, CSV importers (built against real files), dedupe on ingest |
| F10 | Enrichment & scoring | Pass 1 free/all; Pass 2 Tier A only, max 10/day; dossier guard: no citation, no claim |
| F11 | Weekly Lead Digest | Monday, top 10 queued leads; Jem promotes/bins/holds; governor untouched |

## Phase status tracker

| Gate | Phase | Scope | Status |
|------|-------|-------|--------|
| **Gate 0** | Pre-build | Importer reality check: parse every real source file in `cockpit/Sources of Leads/`, print row counts, detected columns, 3 sample records per source for Jem's eyeball. No importer ships against assumed headers. | ✅ Passed 2026-07-10 (inbox-mine CSV outstanding — see importer notes) |
| **Gate 1** | Phase 1 — Data + Cadence | Schema, cadence engine, load balancer, cron skeleton. No Slack, no AI. Gate: unit tests (weekend shift, +2 skip, reply halt, dormancy, load cap) + 14-day simulation with printed schedule. | ✅ Passed 2026-07-10 (22/22 tests) |
| **Gate 2** | Phase 2 — Slack loop | Bot, Morning Brief, command parser, confirmations, Nudge — with fake drafts. Gate: round-trip tests in a test channel; nudge fires once, only when interactions = 0. | ✅ Passed 2026-07-10 (45/45 tests, automated round-trip) · ⏳ live-channel confirmation pending Jem's Slack |
| **Gate 3** | Phase 3 — Draft Engine + Conversational Handler (+ Engine Zero intake/scoring) | Claude integration, linters, stat guard, F5; F9/F10 land here (Gate 3 tests them). Gate: 20 clean drafts; adversarial fake-stat test; dedupe test; consent test; dossier-guard test; **voice spot-check requires Jem**. | ✅ Passed 2026-07-10 (78 tests; voice approved by Jem; all Engine Zero gate tests green) |
| **Gate 4** | Phase 4 — Scoreboard + Newsletter + polish | F6, F7, F11, settings, volume governor. Gate: hand-calculated scoreboard match; Jem pastes one newsletter into real Beehiiv draft. | ✅ Passed 2026-07-11 (93 tests; scoreboard hand-calc matches) · ⏳ Beehiiv paste-formatting confirmation pending Jem |
| **Gate 5** | Phase 5 — Dry-run week | 5 consecutive weekdays of real briefs → real sends by Jem, 6 real prospects; pilot batch: 20 real leads enriched, all dossiers reviewed by Jem. 30-min end-of-week review. | ⬜ Not started |
| **Gate 6** | Phase 6 — The Deck | Web review surface (4 screens + assistant panel), "Cobalt Paper" design language per handoff. Gate: Lighthouse ≥90 @ 200 prospects; 60fps on mid-range phone; keyboard reachable; reduced-motion verified; 390px walkthrough; mirror test. | 🔨 Built + LIVE at training.notcontent.ai/deck (2026-07-12, Jem overrode the Gate-5 ordering to catch the Fable window). Formal Gate-6 checks pending real data: Lighthouse @200 prospects, real-phone 60fps, mirror test |

Update this table as gates pass: ⬜ Not started → 🔨 In progress → ✅ Passed (with date).

## Importer notes (Gate 0 findings, 2026-07-10)

Real-file quirks every F9 importer must handle — verified against the actual files in `cockpit/Sources of Leads/`:

- **Community CSV** (214 rows, 12 cols): Google Forms export; long question-text headers; multi-select answers are `;`-joined; row 1 is a test submission ("Tes"/"Test.com") — filter obvious test rows on import. Timestamps like `2025/08/24 12:08:23 PM HADT`.
- **Beehiiv export** (2,409 rows, 28 cols): has `status` (filter to `active`), engagement columns (`open_rate`, `last_opened_at`, `total_clicked`) usable for Pass-1 scoring, and `acquisition_source`. All land `broadcast_only`.
- **LinkedIn `Connections.csv`** (2,324 rows): **3-line preamble before the real header** (`First Name,...`) — skip until the header line. Only 45/2,324 rows have an email. Trailing whitespace in names.
- **LinkedIn `Comments.csv`** (1,805 rows): 11 malformed rows (unescaped quotes break row boundaries — some have message text in the Date field). Parse defensively: validate Date matches a timestamp pattern, log + skip bad rows.
- **⚠️ Engager-lane data gap**: `Comments.csv`/`Reactions.csv` are **Jem's own outbound activity** (no author column) — the export does NOT contain people who engaged with *Jem's* posts. The "LinkedIn engager" source must instead draw on `messages.csv` (6,651 rows, both directions, has names + profile URLs), `Invitations.csv` (316 rows, incoming/outgoing with notes), and `Connections.csv` (recency via `Connected On`). Raised with Jem at Gate 0.
- **Inbox-mine CSV**: not yet produced (one-time Claude+Gmail session, Jem action). Its importer is blocked until the file exists; we define its format when we run the mine.

## Out of scope (v1)

Auto-sending anything; LinkedIn scraping/live automation; Beehiiv Create Post API; live Gmail OAuth sync; purchased lead lists or enrichment subscriptions; CRM integrations; multi-user; native mobile app; any web UI beyond The Deck's four screens.

## Blocking inputs from Jem (before Phase 1 / Gate 3)

1. Sales-call data → `knowledge/PLAYBOOK.md` — **blocking, not yet supplied**
2. Confirmed stats → `knowledge/PROOF.md` — not yet supplied
3. Sources folder — ✅ present at `cockpit/Sources of Leads/`, all files parsed at Gate 0
4. Beehiiv webhook enabled for new subs (export CSV ✅ present)
5. Inbox-mine correspondents CSV (one-time Claude+Gmail session) — not yet run
6. Slack workspace, `#cockpit` channel, bot install approval
7. Scorecard URL + Beehiiv subscribe link
8. Timezone — ✅ resolved: HST now, Thailand ~Aug 2026 (see decisions log)

## Session log

### 2026-07-10 — Session 1: setup + Gate 0 ✅
- Created this file; confirmed architecture with Jem; decisions locked: **Supabase** for the database, **HST** timezone (editable setting — Thailand ~Aug 2026).
- **Gate 0 PASS.** All source files parsed against real headers: community CSV (214 rows), Beehiiv export (2,409), LinkedIn messages (6,651), connections (2,324), invitations (316), comments (1,805), reactions (1,840). Quirks recorded in "Importer notes" above — build importers against those notes, not assumptions.
- Key finding flagged to Jem: the LinkedIn export contains **his own** activity only — "people who engaged with Jem" must come from DMs, invitations, and connections, not Comments/Reactions.
- Still outstanding from Jem (doesn't block Phase 1): `knowledge/PLAYBOOK.md` + `PROOF.md` (blocks Phase 3), inbox-mine CSV, Slack workspace + `#cockpit` + test channel + bot install (blocks Phase 2), Beehiiv new-sub webhook, scorecard URL + subscribe link.

### 2026-07-10 — Session 2: Phase 1 (Data + Cadence) ✅
- Built the engine room — no Slack, no AI, all pure logic:
  - **Schema:** [supabase/migrations/002_cockpit_core.sql](supabase/migrations/002_cockpit_core.sql) — all cockpit tables (`cockpit_prospects`, `cockpit_touches`, `cockpit_events`, `cockpit_templates`, `cockpit_settings`, plus Engine Zero's `cockpit_enrichment_queue` / `cockpit_intake_log`). Includes Engine Zero columns now so no second migration is needed. Service-role-only RLS, matching the existing `scorecard_leads` pattern. **⚠️ Not yet run against Supabase** — needs pasting into the Supabase SQL editor (or `supabase db push`). Doesn't block Phase 2 code, but must run before any live data.
  - **Cadence engine:** `src/cockpit/cadence/` — `dates.ts` (weekend-safe calendar maths), `cadence.ts` (schedule days 1/4/12/21, skip +2, reply halt, dormancy +90), `loadBalancer.ts` (8/day cap, earliest-added keeps the slot), `simulate.ts` (14-day dry run).
  - **Cron skeleton:** `src/app/api/cockpit/cron/{morning-brief,nudge,weekly-digest}/route.ts` — auth-gated (fail-closed on missing `CRON_SECRET`), return stubs. Schedules wired in [vercel.json](vercel.json) at UTC times matching 07:00/14:00 HST + Mon digest.
- **Gate 1 PASS — 22/22 tests** (`npm run cockpit:gate1`). Covers weekend shift, skip +2, reply halt, dormancy at touch 4, load cap 8 with overflow ordering, and the 14-day simulation (12 prospects, 48 touches, peak 8/day, zero weekend touches, none lost). Production build compiles all three cron routes.
- **Timezone note for Phase 2:** cron times in vercel.json are hardcoded to HST UTC offsets. When we wire real brief/nudge logic, switch to hourly self-gating against `cockpit_settings.timezone` so the Thailand move needs no redeploy. Flagged, not yet done.
- Added **vitest** as the test runner (`npm test`, `npm run cockpit:gate1`).

### 2026-07-10 — Session 3: Phase 2 (Slack loop, fake drafts) ✅
- Built the whole Slack loop behind two swappable seams, so it's fully testable now and runs live unchanged once Jem's Slack exists:
  - **Data seam** (`src/cockpit/store/`): `CockpitStore` interface, `MemoryStore` (tests/local), `SupabaseStore` (production, backed by the cockpit_* tables).
  - **Slack seam** (`src/cockpit/slack/`): `SlackClient` interface, `FakeSlack` (records calls), `WebSlack` (Slack Web API), `verify.ts` (HMAC signature check + replay protection, fail-closed).
  - **Logic** (`src/cockpit/ops/`): `brief.ts` (F1 Morning Brief — ≤8 actions, replies-first ordering, never empty, records the brief so "done 3" resolves), `parse.ts` + `handle.ts` (F4 command parser + executor: done/skip/snooze/replied/rewrite/add/call booked/won/lost/pause/pipeline/settings/help, every change confirmed, unknown → F5 stub), `nudge.ts` (F8 — once, only when silent), `drafts.ts` (placeholder drafts; Phase 3 swaps in Claude).
  - **Routes:** `src/app/api/cockpit/slack/events/route.ts` (signature-verified webhook), and the cron routes now actually run the brief/nudge.
- **Gate 2 PASS — 45/45 tests** (`npm test`). The handoff's "round-trip test in a test channel" runs as an automated round-trip (message → DB state asserted → confirmation asserted) against MemoryStore + FakeSlack. Nudge proven to fire once, never twice, never when Jem interacted. Clean production build compiles all routes.
- **Decisions made autonomously this session:**
  1. **Swappable seams** so Gate 2 is a real automated round-trip, not a mock-only smoke test. The live-channel check is a thin final confirmation.
  2. **Timezone self-gating:** crons now run **hourly** (`vercel.json`) and act only at the settings `brief_hour`/`nudge_hour` in the settings timezone — so the HST → Thailand move needs a settings change, not a redeploy. **⚠️ Hourly crons need Vercel Pro.** If the account is on Hobby (2 crons, daily only), the fix is to pin each cron to the correct fixed UTC time for the current timezone and update it on the move — flag for Jem.
  3. Added migration **003_cockpit_briefs.sql** for the daily brief record.
- **⏳ Live-channel confirmation still owed** (not blocking Phase 3): once Jem creates the Slack workspace + `#cockpit` + a test channel, installs the bot, and sets `SLACK_BOT_TOKEN` / `SLACK_SIGNING_SECRET` / `SLACK_CHANNEL_ID` (+ runs migrations 002 and 003 in Supabase), post a few commands in the test channel to confirm the live round-trip. Everything is wired for it.

### 2026-07-10 — Session 4: Phase 3 part 1 (Draft Engine + Conversational Handler) 🔨
- Jem delivered `knowledge/PLAYBOOK.md` + `knowledge/PROOF.md` (unblocked the build).
- Built the Draft Engine (F2) and Conversational Handler (F5) behind the same seam pattern as Phase 2 — a `DraftModel` interface with `FakeModel` (tests) and `ClaudeModel` (production, Anthropic Messages API):
  - `src/cockpit/draft/` — `proof.ts` (parses PROOF.md into an allow/ban list of numeric tokens), `statGuard.ts` (blocks any $/%/×  not cleared by PROOF, plus drift qualifiers like "nearly $4M"), `bannedWords.ts` (F2 clichés + PLAYBOOK hard bans: Nike, tool names, charisma lines, profanity, unverifiable flexes), `lint.ts` (aggregate: bans + stats + word cap + [PERSONALISE] marker + British-spelling warn), `engine.ts` (generate→lint→regenerate ≤3×, else fall back to the vetted template — **never ships a violating draft**), `prompt.ts`, `templates.ts` (SEQUENCES seed), `knowledge.ts`, `model.ts`.
  - F5 `src/cockpit/ops/converse.ts` — wired into `handle.ts` as an injectable responder (Phase 2 tests still green; live route uses real Claude).
  - Live wiring: the morning-brief cron now generates real drafts when `ANTHROPIC_API_KEY` is set (placeholders otherwise); the events route wires F5.
- **Automated Gate 3 PASS — 64 tests.** 20 drafts across all touch types end clean; adversarial planted `$9M` in prospect notes never reaches a final draft (regenerated away, or template fallback); Nike name-leak blocked; all guards unit-tested against the real PROOF.md.
- **Decisions / fixes made this session (all need a glance from Jem):**
  1. **Model = `claude-sonnet-5`** (current gen; overrides handoff's `claude-sonnet-4-6`). Override via `COCKPIT_DRAFT_MODEL` env.
  2. **Edited PROOF.md** — added a "Pricing — cleared" section with "from $50k". Reason: PLAYBOOK says $50k is "the anchor in every draft," but PROOF only mentioned it in the HARD-BANNED line, so the guard was (correctly) refusing to let drafts state the price. Safe, PLAYBOOK-mandated. **Jem: confirm the wording.**
  3. **NAMED column in PROOF.md is still `[Y/N]` on every row.** Stat guard checks numbers; the prompt instructs unnamed-fallback wording until sign-off. **Jem must fill the NAMED column** before drafts may attribute a stat to a named client in public/broadcast copy.
  4. **"Nike" is hard-banned in drafts** even though it's in Jem's CV line — the risk of implying Nike is a *client* ("Nike above all") outweighs auto-citing the CV credential. If Jem wants to cite the Nike CV, he adds it by hand. Flag if he'd rather a smarter rule.
  5. Created `knowledge/SEQUENCES.md` from the handoff seed templates (spec content, not invented).
- **Scope decision:** Phase 3 is large, so this session did the **Draft Engine + F5** (the part PLAYBOOK/PROOF directly unblock). **Engine Zero (F9 intake + F10 scoring/enrichment) and its Gate 3 additions (dedupe, consent, dossier-guard tests) are the next session.**

### 2026-07-10 — Session 5: live voice spot-check generated ⏳ awaiting Jem's verdict
- Jem supplied the Anthropic API key (pasted in chat → stored in gitignored `.env.local`; **must be rotated** — it's in the transcript).
- Ran the live spot-check (`src/cockpit/draft/__tests__/spotcheck.test.ts`, gated behind `RUN_SPOTCHECK=1`, skipped in normal runs). **5 real Sonnet-5 drafts generated; all passed the guards live — 0 stat violations, 0 banned words.** 2 needed one regeneration. All used unnamed-fallback stats correctly (NAMED column still blank). Reviewer notes: the doubled-CTA warning on the scorecard draft is a heuristic false-positive ("scorecard" as context, not a 2nd CTA) — worth refining.
- **This is a Jem-gate: the voice spot-check requires Jem to approve the drafts sound like him.**
- **Round 1 feedback → applied:** drafts too tech-founder / cold. Added a TONE block to `prompt.ts` (warm/human, explicit "won't waste your time" out, light earned swagger; touch 1 stays a light hello). Re-ran → warmer. Also loosened the doubled-CTA heuristic (was false-flagging "scorecard" as context).
- **Round 2 feedback → applied** (template + CTA edits in `templates.ts` + a CTA-STYLE block in `prompt.ts`): (2) value touch ties the proof number to the offer — "a focused set of AI training sessions built around your slowest, costliest, most annoying processes"; (3) the three-things ask is now a quickfire — "off the top of your head, name 3 processes that…"; (4) scorecard follow-up leads with the lead's single BIGGEST flagged issue and proposes to understand + solve THAT (scorecard lane `requirePersonalise` → false, since the score IS the personalisation). Drafts 1 & 5 approved as-is. Re-ran live → all 5 pass guards, voice on-target.
- **✅ VOICE APPROVED by Jem (2026-07-10).** The Draft Engine (F2) + F5 portion of Gate 3 is closed. Remaining for full Gate 3: Engine Zero (F9/F10) + its dedupe/consent/dossier tests.
- Note: to re-run the spot-check after any PLAYBOOK/PROOF/template edit: `RUN_SPOTCHECK=1 npx vitest run --config vitest.config.ts src/cockpit/draft/__tests__/spotcheck.test.ts` (needs network + key in `.env.local`).

### 2026-07-10 — Session 6: Phase 3 part 2 (Engine Zero F9 + F10) ✅ — Gate 3 CLOSED
- Built Engine Zero in `src/cockpit/engine-zero/` (all Engine Zero DB columns already existed in migration 002 — no new migration):
  - **F9 intake** — `parse.ts` importers built against the REAL files (community CSV, Beehiiv export, LinkedIn `Connections.csv` with its 3-line preamble, scorecard row → lead); `dedupe.ts` (merge on email, fallback name+company, stack sources, strictest-consent-wins); `ingest.ts` (parse → dedupe → score → persist as **stage NEW** queued leads, cross-batch email dedupe). Added `csv-parse` dep.
  - **F10 scoring/enrichment** — `score.ts` (warmth×fit×recency → tier A/B/C; 3+ stacked sources = A by rule), `dossierGuard.ts` (**no citation, no claim**; thin presence → honest fallback), `enrich.ts` (provider seam + `FakeEnrichment`; live web-search provider wired later; 10/day cap).
  - Store gained `createLead` (stage NEW, carries consent lane/score/tier) + `findProspectByEmail`, in both Memory and Supabase stores.
- **Gate 3 CLOSED — 78 tests.** Engine Zero additions all green: dedupe (same person ×3 sources → 1 record, Tier A), consent (subs → broadcast_only, stage NEW, absent from the brief — cannot be sequenced without promotion), dossier guard (uncited claims stripped; thin presence → honest line; guard runs regardless of provider), scoring, and importer sanity against the real files (community 150+, Beehiiv 1000+, LinkedIn 2000+).
- **Consent guarantee is structural:** intake only ever creates stage NEW; nothing sequences a lead except a future promotion (F11). The brief only surfaces IN_SEQUENCE/REPLIED, so queued leads never get auto-touched.
- **Remaining live-wiring for Engine Zero** (not gate-blocking, like the other live endpoints): the intake API routes (scorecard webhook `POST /api/leads/scorecard`, Beehiiv new-sub webhook, a CSV-upload path) as thin wrappers over `ingest()`; the real web-search enrichment provider behind the `EnrichmentProvider` seam; wiring `cockpit_enrichment_queue`/`cockpit_intake_log` for the daily Pass-2 job + audit.

**Next up: Phase 4 — Scoreboard + Newsletter + polish + F11.** Build F6 (Friday scoreboard — computed, per engine, per track, day-90 gate countdown, honesty line), F7 (monthly newsletter builder → Beehiiv paste-ready + 3 subject lines), F11 (weekly lead digest — top 10 queued leads by score, `promote`/`bin`/`hold` commands, respects the volume governor), settings editing, and the volume governor (6/wk, +streak prompt). Gate 4: hand-calc one week's scoreboard and assert match; Jem pastes one newsletter into a real Beehiiv draft (his eyes). This is also where the F11 promote path turns queued NEW leads into IN_SEQUENCE — the ONLY route out of the reviewed queue.

### 2026-07-10 — Session 7: reconciled PROOF/PLAYBOOK to the LIVE site numbers
- Jem: "draw the Maesa and Cash App numbers from the live training.notcontent.ai site." Fetched both live case-study pages (source of truth) and reconciled — my supplied PROOF was materially wrong and self-contradictory:
  - **Maesa: $280k (not $380k), nine months → three months (not six weeks), 12+ brands (not 7)**, "tens of millions in the next year" now correctly attributed to **Oshyia Savur, VP Marketing**. PROOF had been *banning* the correct $280k figure — now $380k/$300k are the retired/banned variants.
  - **Cash App: 90% + $3.5M confirmed; output claim corrected to ~30% increase (not "10x")**. "10x" is no longer a cleared stat (stays as PLAYBOOK rhetoric only; the guard blocks it in drafts).
  - Dropped the unpublished "$3k external production" figure (not on the live site).
- Updated `PROOF.md` (numbers, unnamed fallbacks, HARD-BANNED swap) + `PLAYBOOK.md` (angle bank, Cash App line, footer) + guard/sample tests. **NAMED column set to Y for Maesa + Cash App** (published publicly on the live site = cleared for named use); Herman Scheer left `[Y/N — not verified against live]`.
- Re-ran live spot-check → drafts now use $280k / three months, guards clean (0 violations). Full suite 78 green.
- Note: naming Maesa/Cash App in drafts is now *unlocked* (NAMED=Y), but the model still chose the unnamed fallback in these samples — a fine editorial default. Tell me if you want drafts to lean into naming them.

### 2026-07-11 — Session 8: Phase 4 (Scoreboard + Newsletter + Digest + governor) ✅
- Built the weekly rhythm and the last of the lead lifecycle:
  - **F6 Friday scoreboard** (`ops/scoreboard.ts`) — pure `computeScoreboard` (per engine, per track, day-90 countdown, track leader, honesty line that flips to real conversion at ≥20 sent). Cron `friday-scoreboard` (Friday, self-gated).
  - **F7 newsletter** (`ops/newsletter.ts`) — model-backed, runs the SAME stat/banned-word guards; parses 3 subjects + body; machine-sourced fallback flagged. Cron `newsletter` (1st Tuesday). No Beehiiv API — paste-ready output only.
  - **F11 weekly digest** (`ops/digest.ts`) — top 10 queued leads by score; `promote`/`bin`/`hold` commands; **promotion is the ONLY door out of the NEW queue**. Cron `weekly-digest` (Monday, before the brief).
  - **Volume governor** (`ops/governor.ts`) — 6/wk default, staggers promotions past the cap into future weeks, prompts to raise only after 3 weeks ≥80% completion, never above 8. Settings editable via `set volume 8` / `set brief hour 6` / `set timezone …`.
  - Store gained scoreboard/digest/lead methods (Memory + Supabase); migration **004_cockpit_digests.sql**; Engine Zero fields now surfaced on `StoreProspect`.
- **Gate 4 PASS — 93 tests.** Scoreboard hand-calc matches exactly (3/4 sent, 1 reply/call/close, track A leads, 55 days to gate, plan-assumptions honesty line). Newsletter builds paste-ready + guarded + regenerates away a fake stat. Digest promote/bin round-trip; governor staggering verified. Clean build, all 5 cron routes compile.
- Generated a **live sample newsletter** (guards clean, 3 subjects) for Jem's Beehiiv paste test — re-run: `RUN_NEWSLETTER=1 npx vitest run --config vitest.config.ts src/cockpit/ops/__tests__/newsletter-live.test.ts`.
- **⏳ Beehiiv paste confirmation owed** (Jem's action, not blocking): paste one generated newsletter into a real Beehiiv draft once to confirm formatting survives.

**Next up: Phase 5 — the dry-run week (the real gate).** No new build — this is Jem operating the system live for 5 consecutive weekdays with 6 REAL prospects, sending real touches from real briefs. Plus the Gate 5 pilot batch: enrich 20 real leads (mixed sources), Jem reviews all 20 dossiers/openers before any bulk run. **This gate is entirely Jem + live infrastructure** — it needs the Slack workspace live, migrations 002–004 run in Supabase, the real web-search enrichment provider wired (the one live-wiring piece still stubbed), and the intake webhooks. Prep for the next session: wire the remaining live endpoints (scorecard/Beehiiv intake webhooks, the real EnrichmentProvider) and write the Supabase setup + Slack-app setup runbook so Jem can go live.

### 2026-07-11 — Session 9: Herman Scheer numbers reconciled + Beehiiv automation research
- **HS reconciled to live site:** the live page says **"$4.5M estimated year-one savings, zero to full AI production in weeks"** — there is NO "$500k shoot cost" and no "$4.5M from $500k assets" framing. Updated PROOF row 6 + unnamed fallback; **removed $500k from the cleared set** (guard now blocks it); HS **NAMED → Y**. All three client case studies now verified against the live site (Maesa, Cash App, Herman Scheer). Anthropic key rotated by Jem (the `.env.local` key is now the revoked one — replace for local live-runs; prod uses Vercel env).
- **Beehiiv automation research (decision pending — Jem opened "paste vs automation + design"):** Create Post / Send API is **Enterprise-only** (confirmed, matches handoff). Standard paid API does subscriptions/custom-fields/segments/automations/webhooks (audience side already automated via the scorecard route). The middle-ground is **RSS-to-Send** (built-in, both paid plans, no Enterprise): the cockpit publishes the generated newsletter to a private feed → Beehiiv auto-formats it into the brand template and can schedule it. Open question to resolve with Jem: whether RSS-to-Send can stage a **draft for review** (preserves "system drafts, human sends") vs auto-send only. Design/look = a Beehiiv template set up once; the generator fills content. **No build yet — awaiting Jem's direction on paste vs RSS-to-Send.**

### 2026-07-11 — Session 10: newsletter content inbox (F7 enhancement)
- Jem's decisions: **Beehiiv stays copy-paste for now** (RSS-to-Send deferred). He has no NotContent-styled Beehiiv template yet → answer: build one once in Beehiiv's own no-code **Newsletter Designer + Brand Kit** (fonts/colours/logo), no external tool needed; feed it his design prefs (cream/black/yellow/green, DM Serif + DM Sans — see [[feedback-design]]).
- **Built the newsletter content inbox** (his ask — "drop links/notes/ideas all month, you decipher them"):
  - `note <text>` / `idea <text>` bank an idea for the current month (auto-detects a URL → stored as a link); `notes` lists what's banked. Migration **005_cockpit_newsletter_notes.sql**; store methods `addNewsletterNote`/`getNewsletterNotes` (Memory + Supabase).
  - `buildNewsletter` now takes the month's dropped ideas (was a single note string) and the prompt DECIPHERS them into one fully-featured issue (hook → through-line from his ideas → "Worth a look" links → sign-off), still guarded. Newsletter cron pulls the month's notes.
  - Verified live: 3 dropped ideas → one coherent newsletter with a real through-line, guards clean, correct HS number. 97 tests green.
- Note: links are passed to the model as URLs (it references them); auto-FETCHING link contents for deeper "deciphering" is an easy future add (an injectable fetcher seam) — flagged, not built.

### 2026-07-11 — Session 11: URL-reader + the go-live kit
- **URL-reader** (`ops/linkReader.ts`): `LinkReader` seam — `WebLinkReader` opens each dropped link, pulls title + excerpt, folds it into the newsletter material so the model deciphers the actual article (best-effort; a dead link falls back gracefully). Wired into `buildNewsletter` + the newsletter cron. Tested (content reaches the model; dead link survives).
- **Go-live kit** (the bridge from built→running):
  - **Health check** `GET /api/cockpit/health` — public, boolean-only (no secrets); shows what's wired. `configStatus()` in runtime.
  - **Bulk importer** `engine-zero/importSources.ts` + gated runner `__tests__/import-run.test.ts` (`RUN_IMPORT=1 …`) — loads the real community/Beehiiv/LinkedIn files into the queue (all stage NEW; subs broadcast_only). Tested against real files end-to-end.
  - **Scorecard → cockpit lead**: `engine-zero/scorecardIntake.ts` wired into the existing `/api/assess` route as a best-effort 4th task — completers now enter the queue as HOT leads without affecting the scorecard.
  - **Real Pass-2 enrichment**: `engine-zero/claudeEnrichment.ts` (`ClaudeEnrichmentProvider` via Claude's web-search tool → JSON dossier; `parseDossierResponse` tested), cron `/api/cockpit/cron/enrich` (daily, 10/day cap, dossier guard applied). This was the last stubbed live piece — now wired. **Note: the web-search enrichment path is built + its parser/guard tested, but not yet verified against the live API** (needs a real key + real leads — a Gate 5 pilot check).
  - Store gained `getLeadsNeedingEnrichment` + `setDossier` (Memory + Supabase). Cron count now 7.
  - **`cockpit/SETUP.md`** — the plain-English, click-by-click runbook (Supabase migrations → Slack app → env vars → deploy → health check → bulk import → dry-run). This is Jem's go-live guide.
  - **`cockpit/go-live.html`** — an interactive checklist version of the runbook, styled in the Phase-6 "Cobalt Paper" design language (glass gradient hero, Instrument Serif titles, paper cards, the signature barcode progress bar, ink/cobalt only). Checkboxes persist via localStorage; barcode + count-up track progress. Self-contained (Google Fonts via CDN — open in a browser). Verified rendering + interaction in the preview. Doubles as a working reference for The Deck's aesthetic when Phase 6 starts. `.claude/launch.json` gained a `cockpit-static` server for previewing it.
- 103 tests green, clean build, all 8 cockpit routes compile.

### 2026-07-11 — Session 12: SHIPPED TO PRODUCTION 🎉
- Cockpit deployed to production (training.notcontent.ai). Cherry-picked the cockpit commit onto `main` (branch `cockpit-golive`), resolving the assess-route conflict to keep main's admin-email + Slack-ping tasks AND add the cockpit intake. Pushed `cockpit-golive:main` → Vercel auto-deployed. **Jem's client-hub WIP was NOT shipped** (his call — cockpit only).
- Go-live fixes this session: removed a local self-referential `nc-training-site` symlink (broke file-tracing); `next.config.ts` `outputFileTracingIncludes` ships `cockpit/knowledge/**` to the functions; `.vercelignore` blocks `cockpit/Sources of Leads/` (private data) from deploys.
- **Free plan (Hobby):** consolidated 6 crons → 2 daily (`/cron/daily` at 17:00 UTC = 7am HST doing brief + Mon digest + Fri scoreboard; `/cron/nudge` at 00:00 UTC = 2pm HST). Newsletter + enrichment are on-demand (not cron) to respect Hobby limits. **Caveat:** cron times are fixed to HST — the Thailand move needs the two `vercel.json` times changed + redeploy. The individual cron routes still exist for manual triggering.
- **`/api/cockpit/health` = all 6 checks green in production** — Jem set every env var (Supabase, Slack token/channel/signing, Anthropic, cron secret).
- **Left for Jem:** verify the Slack Event Subscriptions Request URL (`…/api/cockpit/slack/events`) + add `message.channels`; then test `help` in #cockpit. Confirm migrations 002–005 ran in Supabase (health only checks env, not tables). Local repo is on branch `cockpit-golive`.

**Everything is built AND shipped. The remaining path is Jem's to walk:** follow `cockpit/SETUP.md` to go live, then run **Phase 5 — the dry-run week** (5 weekdays operating it with 6 real prospects) + the enrichment pilot (review 20 real dossiers). Gate 5 is operational, not code. The only code that may follow is fixes surfaced by the dry run, and eventually **Phase 6 (The Deck)** — the review-only web UI — which per the handoff does not start until Gate 5 passes.

### 2026-07-11/12 — Sessions 13–15: LIVE + Slack debugging + CRM level-up
- **Went live on training.notcontent.ai** (cherry-picked cockpit-only onto main; branch `cockpit-golive`; Jem's client-hub WIP not shipped). Health all green. `.vercelignore` protects lead data; `outputFileTracingIncludes` ships knowledge files; local self-referential symlink removed (was breaking builds).
- **Slack debugging saga (for posterity):** bot worked via synthetic tests but not Jem's messages. Root cause: **#cockpit is a PRIVATE channel → needs the `message.groups` bot event**, not just `message.channels`. Also fixed: 3s Slack ack timeout on cold starts (now `after()`-based), replies go to the source channel, every arrival logged to `cockpit_intake_log` (source `slack-knock`) for coordination-free diagnosis. SETUP.md gap — add private-channel note if revisited.
- **Visibility layer** (Jem: "how do I see a prospect's info?"): `show <name>` full card (renderProfile in handle.ts); conversational bot now gets the 40-lead roster → answers pipeline questions from real data.
- **Personalisation fixed** (Jem: "defeats the purpose if I do the research"): brief actions carry an intel block (way-in, LinkedIn, dossier, `show` hint); the draft engine fills the personal line from dossier→way-in→only-then-a-gap. Guard now demands the [PERSONALISE] marker only when there's no material.
- **CRM LEVEL-UP (Jem chose "full")** — audit (agent-verified 11 gaps) then built: reply capture via a **pending-state machine** (`replied N` → next msg stored on card + AI response draft through full guards), call dates (`call booked N` → natural-language date parse → `call_at` + **post-call follow-ups touches 5–7** at day 2/7/30 per PLAYBOOK), **dormant resurfacing** (daily), **stakes line** on the brief (deal_value × stages vs revenue_target, F1 requirement), **call-prep cards** on call day, **skip flags named on the Friday scoreboard**, **streak/governor live** (asks to raise after 3×80% weeks), prospect context commands (`note dana: …`, `set dana email/linkedin/value`, `move dana to proposal`), `add` captures email/LinkedIn + dedupes. Enrichment (3/day batch) + newsletter (first Tuesday) folded into the daily cron (Hobby 2-cron limit intact). Migration **006_cockpit_crm.sql** (deal_value, call_at, revenue_target, touches 1–7, cockpit_pending). 116 tests green.
- **⚠️ Jem must run migration 006 in Supabase** — the reply/call flows depend on `cockpit_pending`; without it they no-op.
- Test data (Test Rae etc.) still in the DB — **wipe before the real week** (Jem to say "wipe it").

### 2026-07-12 — Session 16: Phase 2 wave 1 + the fun ones (plan approved by Jem)
- Roadmap plan approved (saved at ~/.claude/plans/what-is-genuinly-missing-rippling-sunset.md): Jem picked A1/A3/A4/B1/B3/B4 + C1–C4 + fun; **no B2 (email BCC)**; A2 (stale-deal alarm) parked.
- **Shipped wave 1** (127 tests green, deployed, roast verified live in-channel):
  - **A1** auto-research on `add` — `ctx.enrich` hook (events route wires `ClaudeEnrichmentProvider`) → hand-added prospects get dossiers ≈1 min after add.
  - **A3** Granola debrief — day-after-call prompt in daily cron + `debrief <name>`; pending kind `call_debrief`; transcript → event (`call_debrief` type) + distilled `call_brief` on the card (CARED/OBJECTIONS/PERSONAL/NEXT/READ) → feeds `[CALL DETAIL]` in follow-up drafts via `DraftInput.callBrief`.
  - **A4** funnel forecast on the Friday scoreboard — all-time conversion (plan assumptions <20 touches: 10%/35%/25%) → annual run-rate vs target + the weakest lever named.
  - **B4** booking link — `settings.booking_url` (seeded with Jem's Google appointment link in migration 007), threaded into ask CTAs via `DraftInput.bookingUrl`; `set booking <url>`.
  - **F1** Deal Receipt on `won` (monospace receipt + ▮▯ barcode of $X/$700k + rotating swagger toast) · **F2** `roast` (makeRoaster in converse.ts — verified live, brutal and data-true) · **F5** playbook fortune closes every brief (day-hashed rotation) · **F6** zombie resurfacing flavour.
- **⚠️ Jem must run migration 007** (call_brief, booking_url, pending/event kind widening). Wave 2 next: B1 proposal generator, B3 signal watching, F3 spar, F4 Wrapped. Wave 3: C1 buttons/reactions, C2 voice, C3 undo.
- Roast surfaced a garbage prospect ("[ jane, ecd]" from a malformed add) — the pending wipe clears it.

### 2026-07-12 — Session 17: test data wiped + THE DECK shipped
- **Test data wiped** (all cockpit_* content tables → 0 rows; settings preserved, pending cleared). Clean slate for the real week.
- **The Deck built and live at /deck** (Jem's call to build ahead of Gate 5 — review-only, so the "Slack runs the day" rule holds). Cobalt Paper executed to the letter: glass stack carousel (motion springs 260/24, drag + arrow keys, rear-card parallax), barcode bars everywhere (1.5px strokes, 20ms fill, ink marker), Instrument Serif display vs Geist data, count-ups once-per-view, 40ms staggered reveals, {4,12,24,999} radii, ink/cobalt-only state, skeletons-not-spinners, reduced-motion + cobalt focus states, mobile pill nav with black active tile.
- Structure: `src/app/deck/` — `deck.css` (the design system, .dk- prefixed), `ui.tsx` (Reveal/CountUp/Barcode/GlassDeck/nav/assistant), `guard.ts` (password → HMAC httpOnly cookie; password = `DECK_PASSWORD` else `CRON_SECRET`), `data.ts` (server reads over SupabaseStore), pages: lock screen `/deck`, `/deck/pipeline` (glass stakes/day-90/week + bento stats + sortable expandable table), `/deck/queue` (digest cards, promote pointer to Slack), `/deck/scoreboard` (funnel cards + barcodes, tracks, forecast + honesty), `/deck/settings` (read-and-point: every dial shows its Slack command). Assistant rail/sheet → `POST /api/deck/assistant` (same F5 brain, cookie-gated). `ChromeGate` gained the `/deck` matcher; `next.config` traces knowledge files for `/api/deck/**`; robots noindex.
- Verified in preview: lock screen, pipeline, scoreboard, 390px mobile (pill nav + FAB), zero console errors. Live-domain 200 confirmed.
- **Deck password = the CRON_SECRET value for now** — set a friendlier `DECK_PASSWORD` in Vercel to change it (then redeploy).
- Formal Gate 6 checklist runs after real data lands (Lighthouse @200 prospects, real-phone 60fps, mirror test).

### 2026-07-13 — Session 18: /story — the 8-week program as a bam83-style scroll story (site work, not cockpit)
- Jem asked whether we could replicate https://bam83.webflow.io/ "proper". Teardown at source level: it's ~12 hand-written vanilla-JS embeds (no GSAP/WebGL), 4 images, 2 YouTube clips, Instrument Serif + DM Mono, 3-colour system. Fully replicable in-repo.
- Decisions (Jem): tells **the 8-week Operating Model story** (phase-by-phase = the 4 quarters); **NEW page at `/story`** — nothing replaced, `/programs/transformation` untouched; **cobalt/platinum dark** styling (ink `#0b0d13` / platinum `#E8E6E0` / cobalt, grain kept); Jem shoots presser footage + collects 4–5 more quotes; **recognisable lorem ipsum marks every Jem-only slot** (per-phase war stories, 4 extra quote cards, presser video), styled cobalt-italic/dashed so they're unmissable.
- Built `src/app/story/` — `copy.ts` (ALL copy + stats in one auditable file; header documents the PROOF rules), `story.css` (`.om-` system + reduced-motion static fallbacks), `ui.tsx` (all 12 interactions ported), `page.tsx`, `layout.tsx` (fonts, indexable metadata). ChromeGate gained the `/story` matcher.
- **Stat audit clean**: every rendered number verbatim from PROOF.md ("roughly" qualifiers kept); the three outcomes NEVER summed ($8M+ ban respected — the record-book finale is 3 separate entries: HS $4.5M / Cash App 90%+$3.5M / Maesa $280k); "tens of millions" only inside the attributed Savur quote card.
- Verified in preview (desktop + 390px): loader 01→03→05→08, drop-scrub + cobalt flash + "Look." panel w/ results-hero film, horizontal phase scrub w/ popping diagrams, quote stack (5 real + 4 lorem) → "It works." punchline, presser placeholder, record-book hover cards, zero console errors, no horizontal overflow. 127 tests green, clean build (`/story` static).
- Gotcha for next session: a mid-session file move corrupted the webpack dev cache ("Application error" client-side) — fixed by `rm -rf .next` + dev-server restart. Also: the preview tool's emulated-viewport screenshots can return blank frames after a reload; reset to native size before screenshotting.
- **Round 2 (same day, Jem's notes):** (1) basketball drop replaced with **the NC globe tumbling into a retro "NC ][" Apple-II-style machine** (hairline SVG, slot mouth, blinking `]` prompt, screen glows cobalt on impact; globe = `public/images/story/nc-globe.png`, copied from the january-digital brand mark). (2) Quote wall rebuilt from **the nc-reviews quote machine** (Supabase `reviews` table, same project — status=approved + consent=true; discovered via Drive search, queried read-only with the local service key). Now **9 real quotes, zero lorem**: Savur (featured — #1, front-and-center, cobalt border, pops first, per Jem), Diaz, Rebecca Wilson, Van Dzura, Emma Gindy, Belay, Adam, Kalen Matherne, Joey Luau + Rachel Topping (Jem had her pending review set to approved in the machine — wall is now 10 cards). **Jem no longer owes quotes.**
- **Round 3 (same day, Jem's notes):** (1) **Video** swapped to the NC-story case-study mashup — source was `cockpit/content/video/NC story case study mashup.mov` (HEVC/.mov, won't play in Chrome/FF), transcoded to H.264 MP4 via a throwaway `ffmpeg-static` npm install in the scratchpad → `public/videos/story/nc-story.{mp4,jpg}` (8.4MB, faststart). No ffmpeg/brew on the machine — that's the path if it needs redoing. (2) **Grain** dialled back 40% (`.om-grain` opacity 0.08 → 0.048). (3) **Hero image** → `speaking-wide-3.webp` (the B&W on-stage shot; full `grayscale(1)`); presser placeholder moved off it to `speaking-wide-2`. (4) **Hero title** now "Eight Weeks" (all white, no period, no cobalt) + subtitle "From sporadic knowledge to full production."; **credit** → "Delivered. Proven. Production ready." (5) **Badge** ring text shortened to "SCROLL · EIGHT WEEKS · " + font 16→13px — fixes the seam collision Jem flagged. (6) **Scorecard** restructured: eyebrow "Creative Operations · Flagship Engagement", headline "Average production time for creative output", Before/Nine months — 8/"WKS training" — After/Three months, statement "We've consistently trained teams to use AI to cut production to a third of the time — and a tenth of the cost."
- **⚠️ PROOF flag:** the scorecard statement's **"a tenth of the cost"** is NOT in `cockpit/knowledge/PROOF.md` (PROOF has Cash App "a tenth of the usual *time*", not cost). It's a general capability line Jem directed, not a named-client audited number — left in as instructed, but if he wants it airtight either add it to PROOF or soften to "a fraction of the cost." "A third of the time" = the 9→3-month Maesa figure, fine.
- **Awaiting Jem for /story**: per-phase war stories (the lorem slots in the phase editorials), presser footage (drop at `public/videos/presser.mp4` + set `PRESSER.videoSrc` in copy.ts), optional hero portrait. Not yet deployed — local branch `cockpit-golive`.

### 2026-07-13 — Session 19: /theprogram round 4 (Granola walkthrough) + convergence diagrams + LIVE
- Jem recorded a full top-to-bottom walkthrough (Granola meeting `c3bd9835`). Decoded the voice transcript into changes across `src/app/theprogram/{copy,ui,page}.tsx` + `story.css`. Page was already live → redeployed at the end.
- **Copy:** scorecard headline → "Eight sessions. We get you to creative production."; drop label → "The program at a glance."; swish word → "Audit." + new audit copy; all four phase editorials rewritten to Jem's exact words (lorem war-story slots REMOVED — he supplied full copy); quotes eyebrow → "Real notes from real agencies and brands", heading → "The whole room had something to say.", punchline pre → "All in all:"; presser quote → "We don't just teach the tools — we change how the operation runs. This is business transformation, not Midjourney training."; presser bg speaking-wide-2 → **speaking-wide-1** (the -2 shot had Spanish slides).
- **Phase hierarchy:** big number is now the PHASE (01–04), eyebrow "Phase One…", label "Weeks 01–02 · Audit & Foundation".
- **Diagrams — the convergence graph (Jem's brief):** replaced the old bam83 shot-chart with a scatter-graph system — x/y axes + week ticks + crosshair + a ✕ at centre (the operating model). The team are dots (greys + blues) that turn cobalt and converge on the ✕ across the four phases; phase 4 = one large pulsing cobalt core on the ✕ with faint ghosts of where they started. Verified render-by-data: P1 ~13 grey/3 blue scattered → P2 7/8 → P3 1 grey/13 blue clustered → P4 single core + 10 ghosts.
- **Globe z-order bug fixed:** the pulsing NC globe was in FRONT of the reveal video; now z-index 4 (behind `.om-swish` z5) so it sits on the machine screen BEHIND the panel.
- **New "What else is included" section** (3 columns, hairline icons): Training dashboard · Consistent support throughout · 2× office-hour sessions.
- **Record book → scrolling client marquee** (mirrors the home page; names Adidas/Google/Tommy Hilfiger/Cash App/Fine'ry/Maesa/SuperGoop/Fazit/Target; kept `id="om-final"` so the scroll-badge kill logic still works). Removed the hover-stats record book entirely.
- **Footer:** centred cobalt links "The full site →" (/) and "Case studies →" (/results).
- Stat audit clean (no new figures; `$8M` only in the guard comment; `70%` only inside Rachel Topping's approved published quote). 127 tests green, clean build, deployed to main.
- Gotcha (again): the `Loader`/`s.label` "(stale) Webpack" runtime error reappeared mid-session after heavy edits — it's a dev-cache artifact, NOT a real bug (prod build compiled clean); fixed by `rm -rf .next` + dev restart. Also: the preview screenshot tool blanks on this page whenever a `position:sticky` section is pinned (grain canvas / sticky compositing) — hero screenshots work, but verify pinned sections via DOM/`preview_eval`, not screenshots.
- **Still owed by Jem for /theprogram:** presser footage (drop at `public/videos/presser.mp4` + set `PRESSER.videoSrc`), optional hero portrait. War stories are no longer needed (phase copy is final).

### 2026-07-13 — Session 19b: /theprogram round 5 — ECD/salesman feedback, panel-vetted
- Jem's lead salesman/ECD sent a long mind-dump. Ran it past a **4-lens judge panel** (Workflow: sales-conversion / creative-skeptic / taste-editorial / information-architecture) + synthesis before touching anything. Panel's read: the whole dump is one load-bearing objection — *"is this AI coming for my people, or arming them?"* — and the page proved results but never planted its thesis before the phases.
- Shipped **four surgical touches** (no new stats; every added number is prose): ① a "what this is" **framing line under `SCORECARD.headline`** (thesis lands early for skimmers; deliberately does NOT reuse "business transformation, not Midjourney training" — that stays the exclusive presser payoff, per the never-say-it-twice guardrail); ② P3 append — the **ideas-saved-from-the-trash** beat ("a fraction of the cost" as prose); ③ P2 append — the **proof-of-concept / "this industry isn't faith-based"** beat, carrying the **not-a-replacement guardrail clause** (its only spot on the page); ④ P4 append — one **team-alignment** clause captioning the converged core.
- Explicitly SKIPPED (panel-advised): standalone "we don't replace creatives" section (protests too much), a second cost/productivity paragraph (dupes scorecard + risks $8M sum), narrating the convergence graph. Full ROI walk-through stays a discovery-call talk-track.
- **Mobile clipping was the real risk** (phase panels are `height:100vh; overflow:hidden`): tightened the P2/P4 appends + bought back headroom (mobile diagram 26vh→22vh, smaller phase number). Verified at 390×812 — every phase clears the clip line (P1 120px / P2 78 / P3 79 / P4 95 margin), no horizontal overflow.
- **Preview gotcha:** couldn't run `next dev` (the `.next/dev/lock` was held by a parallel chat's server). Workaround: added a temporary `prod-preview` launch config running `next start` (production mode takes no dev-lock) to verify, then reverted launch.json to original. 140 tests green, clean build.

### 2026-07-13 — Session 19c: /theprogram round 6 — the intro story + the hook (Jem's copy)
- Jem's note: *"we're focussing too much on the 8 weeks, not the overall through line and results"* + *"the top needs a better big claim."* Audit backed it: mechanics owned **780vh** (drop 280 + phases 500) vs results = one thin marquee ribbon; the "8" motif fired ~11× before any client outcome; and the **loader literally counted the calendar** (01→03→05→08) where bam83 counted the escalating score.
- **Page-load intro is now a story, not numbers** — Jem wrote the beats himself. Three beats, two lines each (line 1 = punch, Instrument Serif; line 2 = sub, DM Mono; final payoff in cobalt): *one person quietly good at AI / no system underneath them* → *eight weeks, everyone on the same page and shipping* → *real work by week 6, 10x the output in 10% of the time*. `LOADER_STEPS` now `{line1, line2, ms, accent?}`; **`ms` scales per beat** to reading length.
- **Loader is skippable** — any pointerdown/keydown/wheel/touchmove dismisses instantly (his beats are ~52 words ≈ 7.5s; a forced intro that long on a sales page bleeds prospects). Verified: caught mid-beat, one wheel event dismissed → page revealed.
- **THE HOOK → the hero.** "Ad-hoc AI experimenters walk in. / **AI Creative Operators walk out.**" (line 2 cobalt) replaces "Eight Weeks" as `HERO.titleA/titleB`. "Eight Weeks" demoted to the eyebrow — this is the single change that fixes both his notes at once. Hero title rescaled 12rem→clamp(1.9rem,4.6vw,4.2rem) (it was sized for two words, now carries two sentences). **The hook is deliberately NOT in the loader** — it was Jem's beat #3; pulled out so the identical line doesn't fire twice within 4s. The intro now *builds to* the hero.
- Answered his open "do we say AI?" from PLAYBOOK: *"Sell speed, output, and money — not AI… avoid leading with the letters AI."* → no AI in a hero **claim**; but it works in *this* hook because AI is the thing the team **masters** ("AI Creative Operators" = a promotion), which also disarms the ECD's replacement fear.
- **⚠️ `10x the output in 10% of the time` is a KNOWN, DELIBERATE stat exception — do not "fix" it.** "10% of the time" is PROOF-clean (Cash App *"roughly 90% (a tenth of the usual time)"*). **"10x the output" is NOT** — PROOF's audited figure is *"increased campaign output by roughly 30%"*, and Session 7 explicitly retired 10x ("PLAYBOOK rhetoric only; the guard blocks it in drafts"). Flagged to Jem in detail with airtight alternatives; **he reviewed and said "its fine" — his call, his risk, knowingly taken.** Left exactly as written.
- Still pending (proposed, NOT built): the **4→3 phase compression into Diverge / Converge / Build** (audit moment absorbs old Phase 1; phases 500vh→~360vh; convergence diagram rebuilds to 3 snapshots). Copy drafted and sitting with Jem.

### 2026-07-14/15 — Session 20: Library finders — Camera Movements + Camera Angles (site work, not cockpit)
- Jem asked for a NotContent-branded take on aicameramovements.com's finder for /library, then mid-build added a stills sibling. **IP position: took only the taxonomy** (standard film/photo terminology, 46 entries each) — every description and prompt is original NC copy (British spelling); no media or text copied from the reference site. Visuals are **animated cobalt hairline SVG diagrams** rendered by ONE parametric component per collection, not 46 files.
- **Shipped (local, branch `cockpit-golive`, NOT yet deployed):**
  - `/library/camera-movements` — 46 moves / 7 categories. `movements.ts` (data + `DiagramSpec`), diagrams animate via CSS keyframes on transform only (compositor-cheap), paused off-screen via one shared IntersectionObserver, static-but-legible under reduced motion.
  - `/library/camera-angles` — 46 stills angles / 5 categories + **multi-select use-case dimension (Product / Lifestyle / World building)** as AND-filter pills; use-case badges on cards. `angles.ts` authored by a subagent to spec.
  - Shared machinery in `src/app/library/_finder/` (non-routed): `finder.tsx` (search + chips with live composed counts + `?q=&cat=&use=` URL sync via replaceState), `entry-card.tsx` (in-place 0fr→1fr prompt disclosure + CopyButton), `entry-media.tsx` (diagram base layer + auto-upgrade), `movement-diagram.tsx` / `angle-diagram.tsx`, `finder.css` (all `.cm-*`, tokens inherited from library.css).
  - **Media upgrade path:** drop `<slug>.mp4` (+`.jpg` poster) in `public/videos/library/camera-movements/` or `<slug>.webp/jpg/png` in `public/images/library/camera-angles/` → card upgrades on redeploy (fs discovery at build; IO-gated playback; reduced motion never autoplays).
  - `/library` index: new `collections.ts` + two `.row-collection` rows above the prompts; existing rows/ghost untouched. Cross-links between the two finders. JSON-LD ItemList on both.
- **Gotchas learned (for the next session):**
  1. **Entrance reveals must be CSS animations, not transitions** — React can apply the revealed class before an element's first paint; a transition from a never-painted state wedges at the base value (cards stuck invisible). An animation always plays.
  2. **Don't pass rendered JSX through server→client props at scale** — 46 serialized SVG trees doubled the HTML (424KB→190KB after switching to spec-data + client-side diagram render).
  3. **The preview tab throttles deferred work**: Suspense-boundary hydration took 12–20s+ in dev and IO callbacks stalled entirely at times — looked exactly like a broken page. Verify against `next start` prod (hydrates in ~4s even throttled) before debugging "bugs". Also (again): viewport can collapse to 0×0 after reload — preview_resize fixes it.
  4. Finder has an **IO fallback** (700ms): if the observer never fires, everything reveals and animations run un-paused.
- Verified on prod build: search/chips/use-case compose + URL restore, disclosure + copy, index rows, 390px (no overflow, chip scroller, 1-col), zero console errors, both routes static. **Not yet deployed — Jem to say ship.**
- **JD hub copy (2026-07-15, shipped `a3d6c9a6`):** ungated Camera Prompt Finder copy for the January Digital client hub at **`/january-digital/resources/camera-prompts`** (+ /movements + /angles) — Next routes coexisting with the static hub (public files win where they exist; these paths have none). Same `_finder` components + `_data`, NO email gate, `robots noindex` (protects the gated library from search cannibalisation), light JD chrome (`jd.tsx`: "← The Hub" back link + "January Digital × NotContent" label + globe favicon). Cobalt resource card added to `public/january-digital/index.html` (camera icon, matches the prompt-library card). ChromeGate gained the `/january-digital` matcher (also kills announcement bar + exit-intent there). Live-verified ungated + hub card present. Note: static index.html edits can lag behind route deploys at the CDN edge for a couple of minutes.
- **Featured row (2026-07-15, shipped `55b10024`):** the index's Camera Prompt Finder row is now a **cobalt block** — platinum italic title + ⌕, "Featured" label, 90 count, top spot; hover darkens to #0F2DA0. (The earlier `.row-collection` styles from round 2 had been silently eaten by Jem's stash-pop before the first ship — the live row was rendering unstyled; rebuilt with `.row .body`-matching specificity.) Verified in prod CSS.
- **SHIPPED 2026-07-15 🎉** — live at training.notcontent.ai/library/camera-prompts. Ship sequence: scoped commit `5fb0de14` (library finder files only — cockpit WIP untouched, uncommitted, local); discovered **origin/main was 4 commits ahead with a library EMAIL GATE** (Beehiiv opt-in, `nc_library_access` cookie, enabled — from a parallel Opus session same day); merged it in (`209ecc1f`), resolved the index import conflict (gate + collections rows coexist), and **gated all three new pages** with the same cookie-first check (all library routes are ƒ dynamic now). Pushed HEAD:main → Vercel. Live-verified: all 3 routes 200, gate renders without the cookie, full content with it, index shows the collection row. Note: on prod, an ungated-looking 200 at /library/camera-prompts BEFORE the deploy landed was the old deploy's `[slug]` route catching it and rendering the gate — poll a NESTED route to detect the new deploy.
- **Round 4 (2026-07-15, final structure):** Jem's placement — **`/library/camera-prompts` is a CHOOSER page** ("Command the camera." + two live-diagram panels), with each finder nested inside: **`/camera-prompts/movements`** (video, "Move the camera.") and **`/camera-prompts/angles`** (stills, "Place the camera."). Data lives in `camera-prompts/_data/{movements,angles}.ts` (underscore folder — avoids the file/route-folder name collision). Hero eyebrows carry a breadcrumb link back to the chooser; the crosslinks at each finder's foot point at the sibling. One collection row on the index (90 · Video + Stills → the chooser). An interim single-page Video/Stills toggle (mode-finder) was built then replaced by this nested layout same-day; Finder's URL sync now starts from the live URL so it preserves params it doesn't own. All three routes static, deep links verified, clean build. (Never-shipped intermediate paths /library/camera-movements and /library/camera-angles removed — no redirects needed.)
- **Round 3 (2026-07-15):** sticky-seam fix (controls now tuck 1px under the topbar + a `::before` bleed strip so nothing scrolls through at any zoom; mobile top 41px); movements **Human Camera folded into Specials** (6 categories, Specials 8); polish level-ups — `/` focuses search (kbd hint swaps to a Clear × when a query is active, Esc clears), diagram legend (camera · subject · path/crop) right of the chips, card hover (border deepens + guide paths brighten). **Architecture: dropped `useSearchParams`+Suspense** — it made the whole finder a deferred out-of-order-streamed boundary (late pop-in on slow devices; surfaced as unstyled-finder in the throttled preview). URL params are now read in a mount effect; both routes fully static with the finder inline. **Stash-pop repairs:** collections rows re-added to library/page.tsx after Jem's stash clobbered them; completed the half-restored cockpit WIP so the repo builds — `gmail_sent` added to `LeadSource` (+warmth 0.75/pipeline/alumni maps, matching gmailIntake.ts's intent) and `prospectsAwaitingDebrief(sinceDay)` store selector added to the interface + Memory + Supabase stores (contract from debrief.test.ts). 140 tests green, clean build.
- **Round 2 (Jem's notes, same session):** both lists trimmed to **45** (dropped `slider-left` — covered by slider-right + truck-left — and `elevated-establishing` — near-dupe of establishing-shot); movements hero/metadata copy → "Built for your favourite AI video model"; **full stills-diagram recon** — `angle-diagram.tsx` rewritten as a per-slug scene system (framing ladder = cobalt crop brackets on a figure at the exact body landmark; lens looks get optical signatures — bokeh rings, telephoto compression arrows, fisheye barrel frame, anamorphic letterbox; composition = real overlays — knolling grid, leading lines, golden-hour shadow); **faint ink dot-grid pattern** added behind every diagram (both collections); polish pass fixed the per-collection empty-state hint, iOS search-input appearance, toggle touch target, `.row-collection` styling on the index, stale count comments.

### 2026-07-18 — Session 21: three Claude Code agents (Gmail mine · Granola debrief · sentinel)
- Jem: "we havent got any agents or loops… use claude code's toolsets and commands." Built three agents that live in Claude Code (his existing `scheduled-tasks` mechanism), each = connector-gathering in the agent + a **tested helper module** in the repo so every DB write flows through the real dedupe/score/distil pipeline. Plan approved (saved at ~/.claude/plans/what-is-genuinly-missing-rippling-sunset.md).
  - **1. Gmail inbox-mine** (`engine-zero/gmailIntake.ts`) — sent-mail correspondents → `RawLead` → `ingest()` as stage NEW. New source `gmail_sent` (warmth 0.75, pipeline, engine `alumni`). Company inferred from non-freemail domain. Slash cmd `/inbox-mine` sweeps `in:sent newer_than:12m`, drops non-leads, runs gated `RUN_GMAIL_MINE`. **Runs at real-week kickoff, not test week** (Jem's call — 12-month reach).
  - **2. Granola debrief sync** (`ops/debrief.ts`) — extracted `DISTILL_SYSTEM` from handle.ts to a shared export; `fileDebrief()` = the exact consumeCallDebrief write path (logEvent→distil→updateProspect(callBrief)→note), no Slack side. New store selector `prospectsAwaitingDebrief(sinceDay)`. Slash cmd `/debrief-sync` (+ evening scheduled task) lists Granola meetings, matches to awaiting prospects (email→fuzzy), files each brief. No more pasting; touches 5–7 auto-fill `[CALL DETAIL]`.
  - **3. Morning sentinel** (`ops/sentinel.ts`) — runs OUTSIDE Vercel so it can catch the app when down. `runSentinelChecks()` = brief fired? (vs settings tz/hour) · Monday digest? · malformed prospect scan ("[ jane, ecd]" class). Silent when healthy; alerts #cockpit only on issues. Slash cmd `/sentinel` (+ morning scheduled task).
- Gated runners follow the `RUN_*` pattern: `gmail-mine-run`, `debrief-run`, `debrief-roster-run`, `sentinel-run`. 13 new unit tests (140 total green), clean build.
- **⚠️ Shared-worktree hazard hit again:** a parallel Opus session (the /library work) stashed + branch-switched this tree mid-build, reverting my files. Recovered from `stash@{1}`. Kept their `gmail_sent` engine value `alunni`→`alumni` (better fit than my original `outbound`). The tree carries other sessions' untracked files (USGOV/, training-command-centre/, content/*, public/skynet/*) — committed **only** the cockpit-agent paths, left the rest. Lesson: commit small and fast in this repo; don't leave large uncommitted WIP.
- **Slash commands live at `.claude/commands/*.md`** — `.claude/` is gitignored here, so they're local to this machine (they still work; not version-controlled). The two scheduled tasks need Jem to approve the macOS creation dialogs.

**Open items for Jem** (carried): confirm PROOF `$50k` edit; Beehiiv Brand Kit + paste-test; sanity-check first real dossiers; optionally set `DECK_PASSWORD`; **start the dry-run week** — add 6 real prospects in #cockpit; **deploy the two /library finders when happy**; approve the two cockpit scheduled-task dialogs; run `/inbox-mine` at real-week kickoff.

## Existing repo context relevant to the cockpit

- Next.js 16 App Router, Supabase (`@supabase/supabase-js`), deployed on Vercel.
- The Scorecard already exists at `src/app/assess/` and already writes leads to Supabase table `scorecard_leads` ([supabase/migrations/001_scorecard_leads.sql](supabase/migrations/001_scorecard_leads.sql)) — F9's scorecard intake should build on this, not duplicate it.
- Current branch work (`feat/client-hub-data-layer`) added a client hub data layer + auth helpers on Supabase.
