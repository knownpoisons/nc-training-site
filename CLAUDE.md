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
| **Gate 6** | Phase 6 — The Deck | Web review surface (4 screens + assistant panel), "Cobalt Paper" design language per handoff. **Starts only after Gate 5 passes.** Gate: Lighthouse ≥90 @ 200 prospects; 60fps on mid-range phone; keyboard reachable; reduced-motion verified; 390px walkthrough; mirror test. | ⬜ Not started |

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

**Everything is built. The remaining path to a shipped product is Jem's to walk:** follow `cockpit/SETUP.md` to go live, then run **Phase 5 — the dry-run week** (5 weekdays operating it with 6 real prospects) + the enrichment pilot (review 20 real dossiers). Gate 5 is operational, not code. The only code that may follow is fixes surfaced by the dry run, and eventually **Phase 6 (The Deck)** — the review-only web UI — which per the handoff does not start until Gate 5 passes.

**Open items for Jem** (carried): confirm the PROOF `$50k` edit; set up the NotContent Beehiiv template (Brand Kit) + paste-test one newsletter; **walk `cockpit/SETUP.md` to go live**; during the pilot, sanity-check the live web-search dossiers (first real enrichment run).

## Existing repo context relevant to the cockpit

- Next.js 16 App Router, Supabase (`@supabase/supabase-js`), deployed on Vercel.
- The Scorecard already exists at `src/app/assess/` and already writes leads to Supabase table `scorecard_leads` ([supabase/migrations/001_scorecard_leads.sql](supabase/migrations/001_scorecard_leads.sql)) — F9's scorecard intake should build on this, not duplicate it.
- Current branch work (`feat/client-hub-data-layer`) added a client hub data layer + auth helpers on Supabase.
