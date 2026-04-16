# Scorecard Setup Guide

The scorecard (`/assess`) writes leads to **Supabase**, subscribes them to **Beehiiv**, and sends a transactional result email via **Resend**. Each integration is wrapped so one failure doesn't break the others — the user always sees their result.

**Until you wire these up, the code falls back to logging the lead to Vercel logs and moving on. No error is shown to the user.**

## 1. Supabase

Lead data lives here. Rich schema — tier, score, dimensions, stack audit, full answer payload.

### Create the project

1. https://supabase.com/dashboard → **New project**
2. Name: `notcontent-training` (or whatever you prefer)
3. Region: closest to your users (US East if unsure)
4. Save the **database password** in your password manager (you won't need it for this integration, but you'll want it)

### Run the migration

1. Dashboard → **SQL Editor** → **New query**
2. Paste the contents of `supabase/migrations/001_scorecard_leads.sql`
3. **Run**
4. Verify: **Table Editor** should show `scorecard_leads` with all columns

### Grab the env vars

Dashboard → **Project Settings** → **API**:

- `NEXT_PUBLIC_SUPABASE_URL` = **Project URL** (e.g. `https://abcdefg.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` = the `service_role` key (long string, starts `eyJ…`)

**⚠️ NEVER expose the service_role key client-side.** It bypasses RLS. The code only reads it server-side in `src/lib/supabase.ts`.

---

## 2. Resend (transactional email)

Free tier: 3,000 emails/month, 100/day. No credit card required.

### Create the account

1. https://resend.com/signup → sign up with GitHub or email
2. **Domains** → **Add domain** → `notcontent.ai`
3. Resend shows you 3–4 DNS records to add (MX, TXT, and 2 DKIM `resend._domainkey` records)
4. Add those records in your DNS provider for `notcontent.ai`
5. Back in Resend, click **Verify** — takes ~5 minutes for DNS to propagate
6. Once verified, **API Keys** → **Create API Key** → full-access → copy it

### Env vars

- `RESEND_API_KEY` = `re_...`
- `RESEND_FROM_EMAIL` = `Jeremy Somers <jeremy@notcontent.ai>` (or `scorecard@notcontent.ai` if you want to keep replies separate — any address at the verified domain works)
- `RESEND_REPLY_TO` (optional) = `jeremy@notcontent.ai` — if you send _from_ `scorecard@` but want replies to land at `jeremy@`

### Test it

After deploy, fill out the scorecard with your own email. You should receive the branded result email within seconds.

---

## 3. Beehiiv (already configured)

No changes needed if you already have `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` set on Vercel.

The API route now passes **richer custom fields** than before:

- `first_name`
- `ai_score` (0–100)
- `ai_tier` (e.g. `capable_but_exposed`)
- `stack_bucket` (A or B)
- `stack_count`
- `work_type` (brand / performance / retail / agency)
- `recommended_program`

And tags:

- `ai-scorecard`
- `tier-{tier}`
- `bucket-{A|B}`
- `program-{program}`

**If your Beehiiv publication doesn't have these custom fields defined yet**, the subscription call will still succeed — Beehiiv silently ignores unknown custom fields. But if you want them to show up in your dashboard, add them under **Settings → Custom Fields** in Beehiiv.

---

## 4. Vercel environment variables

Add all of the below to the `nc-training-site` project (the production one tied to `training.notcontent.ai`):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL         = https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY        = eyJ... (server-only, DO NOT expose)

# Resend
RESEND_API_KEY                   = re_...
RESEND_FROM_EMAIL                = Jeremy Somers <jeremy@notcontent.ai>
RESEND_REPLY_TO                  = jeremy@notcontent.ai   (optional)

# Beehiiv (already set)
BEEHIIV_API_KEY                  = (existing)
BEEHIIV_PUBLICATION_ID           = (existing)

# Site URL (for emailed CTA links)
NEXT_PUBLIC_SITE_URL             = https://training.notcontent.ai
```

Scope: **Production + Preview + Development** for all of them, except the service role key — that one should only be set for **Production + Preview**, never touched by the dev environment.

After adding, **redeploy** so the build picks them up.

---

## 5. Quick sanity check

After deploy, run the scorecard end-to-end with a real email:

1. **Browser:** answer all 10 questions → land on results page → see score + tier + stack bucket + program
2. **Inbox:** scorecard email arrives within ~10 seconds
3. **Supabase dashboard:** `scorecard_leads` table has a new row with all fields populated
4. **Beehiiv dashboard:** new subscriber with the custom fields + tags

If any step fails, check Vercel **Functions** → `/api/assess` logs. The route logs which integration skipped (`env_missing`) vs. which failed hard (stack trace).

---

## Scoring reference

The scoring is in `src/app/assess/logic.ts` and `src/app/assess/questions.ts`.

| Dimension | Questions | Max |
|-----------|-----------|-----|
| Adoption | Q1 + Q2 | 30 |
| Readiness | Q3 + Q4 + Q5 + Q10 | 40 |
| Blockers | Q8 + Q9 | 26 |
| **Total** | | **96** |

Score displayed = `round(raw / 96 × 100)`.

| Score | Tier |
|-------|------|
| 0–30 | STARTING LINE |
| 31–55 | TWO-SPEED |
| 56–79 | CAPABLE BUT EXPOSED |
| 80–100 | AT THE FRONTIER |

Q6 = segmentation only (work_type tag). Q7 = stack audit routing (Bucket A/B). Neither contributes to score.

Tier → program mapping:
- STARTING LINE → Foundations
- TWO-SPEED → Accelerator
- CAPABLE BUT EXPOSED → Transformation
- AT THE FRONTIER → Transformation
