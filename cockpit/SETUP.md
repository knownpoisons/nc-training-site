# Cockpit — Go-Live Setup

Plain-English, click-by-click. You're wiring up four things: **the database**, **Slack**, **your keys**, and then **switching it on**. Budget ~45 minutes. You don't need to write any code — you'll copy/paste values and run two or three commands I've spelled out exactly.

At any point you can check progress by opening this in your browser:
`https://<your-site>/api/cockpit/health` — it shows a green/red list of what's wired.

---

## Step 1 — The database (Supabase) · ~10 min

Your site already uses Supabase, so you have an account. The cockpit needs 5 tables added.

1. Go to **supabase.com** → your project → **SQL Editor** (left sidebar) → **New query**.
2. In your code, open the folder `supabase/migrations/`. Run these **in order**, one at a time — for each file: open it, copy everything, paste into the SQL editor, click **Run**. Wait for "Success" before the next.
   - `001_scorecard_leads.sql` (you may already have this — running again is safe)
   - `002_cockpit_core.sql`
   - `003_cockpit_briefs.sql`
   - `004_cockpit_digests.sql`
   - `005_cockpit_newsletter_notes.sql`
3. That's the database done. Every file is safe to re-run if you're unsure.

You'll also need two values from Supabase for Step 3 (**Settings → API**):
- **Project URL** (looks like `https://abcd.supabase.co`)
- **service_role key** (the secret one — NOT the anon key)

---

## Step 2 — Slack · ~15 min

This creates the bot that lives in your `#cockpit` channel.

1. In Slack, create a channel called **#cockpit** (and a second one, **#cockpit-test**, for trying things safely).
2. Go to **api.slack.com/apps** → **Create New App** → **From scratch**. Name it "Cockpit", pick your workspace.
3. **Bot permissions:** left sidebar → **OAuth & Permissions** → scroll to **Scopes → Bot Token Scopes** → add these:
   `chat:write`, `reactions:write`, `channels:history`, `channels:read`, `groups:history` (the last one only if #cockpit is private).
4. **Install:** top of the same page → **Install to Workspace** → Allow. Copy the **Bot User OAuth Token** (starts with `xoxb-`) — that's your `SLACK_BOT_TOKEN`.
5. **Signing secret:** left sidebar → **Basic Information** → **App Credentials** → copy **Signing Secret** — that's your `SLACK_SIGNING_SECRET`.
6. **Let the bot hear you:** left sidebar → **Event Subscriptions** → toggle **On**. In **Request URL** paste:
   `https://<your-site>/api/cockpit/slack/events` — it should say "Verified" (do Step 3 + deploy first if it doesn't). Then under **Subscribe to bot events** add `message.channels` (and `message.groups` if private). **Save Changes**, and reinstall if Slack asks.
7. **Invite the bot** into #cockpit: in the channel, type `/invite @Cockpit`.
8. **Channel ID:** in Slack, click the #cockpit channel name → scroll to the bottom of the popup → copy the **Channel ID** (looks like `C0123ABCD`) — that's your `SLACK_CHANNEL_ID`.

---

## Step 3 — Your keys (environment variables) · ~10 min

These go in **two** places: Vercel (for the live site) and, only if you want to run the bulk import from your laptop, a local file.

**In Vercel:** your project → **Settings → Environment Variables**. Add each of these (name on the left, value on the right), for Production:

| Name | Value |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | the service_role key from Step 1 |
| `NEXT_PUBLIC_SUPABASE_URL` | the Project URL from Step 1 (you may already have this) |
| `SLACK_BOT_TOKEN` | the `xoxb-…` token from Step 2 |
| `SLACK_SIGNING_SECRET` | the signing secret from Step 2 |
| `SLACK_CHANNEL_ID` | the `C…` channel id from Step 2 |
| `ANTHROPIC_API_KEY` | your Anthropic key (the freshly-rotated one) |
| `CRON_SECRET` | make up a long random string — this protects the scheduled jobs |

**On your laptop (only for the one-time lead import):** create a file called `.env.local` in the project root with the same values (this file is private and never committed). At minimum it needs `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `ANTHROPIC_API_KEY`.

---

## Step 4 — Switch it on · ~2 min

Deploy the site (push to your main branch, or in Vercel click **Redeploy**). The scheduled jobs (morning brief, nudge, Monday digest, Friday scoreboard, monthly newsletter, daily enrichment) turn on automatically — they're already configured in `vercel.json`.

---

## Step 5 — Check it's all green

Open `https://<your-site>/api/cockpit/health` in your browser. You want every line `true` and `"ready": true`. If something's `false`, revisit that step above.

Then test the round-trip in **#cockpit-test**: type `help` — the bot should reply with the command list. If it does, Slack is wired. 🎉

---

## Step 6 — Load your leads (one time)

This reads your community list, subscribers, and LinkedIn connections into the reviewed queue. Run it from your laptop (needs the `.env.local` from Step 3):

```
RUN_IMPORT=1 npx vitest run --config vitest.config.ts src/cockpit/engine-zero/__tests__/import-run.test.ts
```

It prints how many leads it created. They all land in the **queue** (nothing is contacted). Newsletter subscribers are marked broadcast-only and can never be auto-sequenced.

The next morning the daily enrichment job builds dossiers on your top leads, and Monday's digest shows you the top 10 to `promote`.

---

## Step 7 — Your dry-run week (the real test)

For the trial, add 6 real prospects yourself. In #cockpit, just type:

```
add Dana Lee, Head of Brand, Acme
```

…for each one. They go straight into a sequence. From then on, your 7am brief will have real actions. Work it for five weekdays.

---

## The daily loop — commands cheat sheet

Everything happens by typing in **#cockpit**. You never leave Slack.

| You type | It does |
|---|---|
| `done 1 2` | logs those actions as sent |
| `skip 3` | pushes a touch 2 days later |
| `replied 4` | marks a reply, stops that sequence |
| `rewrite 1 shorter` | redrafts a message |
| `add Name, Role, Company` | new prospect into a sequence |
| `call booked 5` · `won 5` · `lost 5` | move a prospect's stage |
| `promote 1 3` · `bin 2` · `hold 5` | act on Monday's lead digest |
| `note …` · `idea …` · `notes` | bank / list newsletter ideas for the month |
| `pause dana` · `resume dana` | pause/resume a prospect |
| `pipeline` · `settings` | show status |
| `set volume 8` · `set brief hour 6` · `set timezone Asia/Bangkok` | adjust settings |
| anything else, in plain English | the assistant answers |

---

## If something's not working

- **Health page shows a red line** → that env var isn't set (or the site wasn't redeployed after adding it). Fix in Vercel, redeploy.
- **Slack "Request URL" won't verify** → the site must be deployed with `SLACK_SIGNING_SECRET` set first, then verify.
- **Bot doesn't answer in the channel** → make sure you invited it (`/invite @Cockpit`) and added the `message.channels` event.
- **No morning brief** → briefs post at your `brief hour` in your timezone; check `settings`. Nothing due? It posts a light "nothing today" line, never nothing.
- Anything else: tell me what the health page says and what you typed, and I'll sort it.
