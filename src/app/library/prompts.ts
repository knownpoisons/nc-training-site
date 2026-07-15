// ─── Prompt library data ──────────────────────────────────────────────────────
// Add a new prompt by appending an entry. A new page appears at
// /library/<slug> automatically. Keep these in chronological order; the index
// page reverses them so newest reads first.

// A prompt can either ship as a single prompt body OR as multi-phase tabs.
// When `phases` is set, the page renders a tab bar and ignores top-level `prompt`.
export interface PromptPhase {
  number: number;        // 1, 2, 3 — shown in the tab label
  label: string;         // e.g. "Prospect Intelligence"
  blurb: string;         // short explanation, shown above the prompt
  prerequisite?: string; // optional warning, e.g. "Run AFTER Phase 1"
  prompt: string;        // the paste-able prompt body for this phase
}

export interface Prompt {
  slug: string;
  number: number;                  // 01, 02, 03 — displayed in eyebrow
  title: string;
  eyebrow: string;                 // e.g. "Outreach · Sales"
  oneLiner: string;                // short subhead beneath the H1
  whatItDoes: string;              // full prose explainer (1–3 short paragraphs)
  whenToUse: string[];             // bullet points
  whatYoullGet: string[];          // bullet points
  quickFire: string[];             // numbered instructions
  prompt?: string;                 // single-prompt mode (omit if using phases)
  phases?: PromptPhase[];          // multi-phase mode (renders as tabs)
  heroImage?: string;              // optional poster / fallback still
  heroVideo?: string;              // optional looping showcase video (mp4 — autoplays muted)
  comingSoon?: boolean;            // listed greyed-out on the index, detail page 404s until flipped live
  // For future filtering
  tags?: string[];
}

export const PROMPTS: Prompt[] = [
  {
    slug: "linkedin-prospect-intelligence",
    number: 1,
    title: "LinkedIn Prospect Intelligence",
    eyebrow: "Outreach · Sales",
    oneLiner:
      "Turn your LinkedIn export into a ranked, voice-matched outreach dashboard.",
    whatItDoes: `Walks you through transforming your LinkedIn connections CSV into a scored prospect shortlist, a set of personalised messages in your voice, and a clickable HTML dashboard you can run outreach from.

The prompt forces a phased process — no rushing to output. Phase 1 forces alignment on your goals, ICP, and voice before any data is touched. The gatekeeper question makes sure you're set up before you spend ten minutes typing into a vacuum.`,
    whenToUse: [
      "You want a single source of truth for your LinkedIn network — every connection, every company, every signal — and you want to query it like a database, not click through Sales Nav.",
      "You want every cut on demand: hot leads, warm intros, dormant clients, AI-cluster opportunities, network density by company, who's worth a message this quarter. One CMS, every question.",
      "You're done renting your own data. This is a sales asset you build once, own forever, and extend whenever a new question comes up — new tabs, new analyses, new outreach plays.",
      "You want messages that read like a person wrote each one — because you did. The AI does the work. The words are yours.",
      "You want a working CMS at the end of the hour. Not another chat output you'll lose in a thread by Friday.",
    ],
    whatYoullGet: [
      "A scored prospect shortlist ranked against your ICP.",
      "Personalised messages written in your voice.",
      "A cleaned CSV of just the top prospects.",
      "A custom HTML dashboard with a 1-click Copy button on every message.",
    ],
    quickFire: [
      "Kick off the LinkedIn data export FIRST — it usually lands in your inbox within a few minutes, but LinkedIn warns it can take up to 24 hours. Go to [LinkedIn → Settings → Get a copy of your data](https://www.linkedin.com/mypreferences/d/download-my-data), tick the box for **Connections**, and request the archive. Open the email and download the ZIP when it arrives.",
      "While you wait, paste the **Phase 01** prompt into Claude (or your AI of choice). It starts in its own Phase 1 (preparation).",
      "Answer the clarifying questions — ICP, voice, target audience.",
      "When the AI asks the gatekeeper question, upload the **Connections.csv** from the LinkedIn ZIP you downloaded.",
      "Let the AI work through the phases. Don't skip ahead — the prompt is built to slow you down deliberately.",
      "Save the HTML dashboard locally and use it as your outreach launchpad for the next two weeks.",
      "Optionally come back and run **Phase 02** (Network Intelligence) on the same dataset to add the network-analysis tab, or **Phase 03** (Network Matchmaking) when you've had a conversation with someone you'd like to make introductions for.",
    ],
    phases: [
      {
        number: 1,
        label: "Prospect Intelligence",
        blurb:
          "The starting phase. Builds the scored prospect shortlist, the personalised messages, the cleaned CSV, and the HTML dashboard. Run this first.",
        prompt: `# Role & Objective
You are an expert data analyst and B2B growth marketer. Your objective is to help me build a highly customized LinkedIn Prospect Intelligence Report and Outreach Dashboard using my own exported LinkedIn connections data.

# Process & Workflow
You must execute this project in phases. Do not rush to the final output.

## Phase 1: Preparation & Goal Alignment (Current Phase)
Before we look at any data or write any code, we need to ensure the foundation is set.
1. **Review Goals:** Review my goals for this dashboard listed below (if any).
2. **Clarifying Questions:** Ask any necessary clarifying questions regarding my target audience, ideal customer profile (ICP), or the specific "voice" I want to use for outreach.
3. **The Gatekeeper Question:** You must ask me this exact question and wait for my response before moving forward:
> "Do you already have your LinkedIn connections CSV file downloaded, or do you need me to walk you through how to get it first?"

*If I need the walkthrough:* Provide a step-by-step guide on how to request and download the connections data from LinkedIn (noting that it takes about 5 minutes and is 100% permitted by LinkedIn).
*If I have it:* Acknowledge it and wait for me to upload/paste the data.

## Phase 2: Future Deliverables (Do not generate these yet)
Once the data is provided, we will eventually build:
* **Ranked Shortlist:** A scored list of my best prospects based on my ICP.
* **Personalized Messages:** Tailored outreach copy written in my distinct voice.
* **Cleaned CSV File:** A refined data export of the top prospects.
* **HTML Dashboard:** A custom-designed UI featuring the prospect list and a 1-click "Copy" button for every personalized message.

# User Input & Goals
* **Dashboard Goals:** [Insert your specific goals here, e.g., "I want to identify high-ticket coaching clients in the tech space" or leave blank if not yet defined]

---
Trigger Phase 1 now by asking the clarifying questions, reviewing the goals above, and presenting the gatekeeper question.`,
      },
      {
        number: 2,
        label: "Network Intelligence",
        prerequisite:
          "Run this AFTER Phase 1 (Prospect Intelligence) is complete. This adds a second tab to the existing dashboard.",
        blurb:
          "Adds a Network Intelligence tab to the existing dashboard that analyses ALL connections (not just the top 20). Function and seniority breakdowns, growth timeline, company density, AI cluster, era analysis.",
        prompt: `You have a completed LinkedIn Prospect Intelligence Report dashboard (single-page HTML with prospect cards, filters, scoring, outreach messages). Now add a Network Intelligence tab that visualizes the full LinkedIn connections dataset.

# What you're building

A second tab on the existing dashboard that analyzes ALL connections (not just the top 20 prospects). The tab should answer: Who is in my network, what do they do, how senior are they, where do they work, when did I add them, and where are the interesting clusters?

# Data source

The user's LinkedIn data export \`Connections.csv\` with columns: \`First Name, Last Name, URL, Email Address, Company, Position, Connected On\`. Note: the file has 2-3 lines of LinkedIn boilerplate before the header row — find the row starting with \`First Name,\` and parse from there.

# Step 1: Add tab navigation

Add a tab bar between the header and the existing content. Two tabs:
* Prospect Intelligence (existing content, default active)
* Network Intelligence (new content)

Wrap the existing prospect content (stats bar through prospects container) in a tab panel div. Create a second tab panel for network content. Tab switching via JS — no page reload. Use the same design language as the existing dashboard (IBM Plex Mono, same CSS variables, same accent color).

# Step 2: Parse and analyze the connections data

Write a Python script to analyze Connections.csv and extract these datasets. Hard-code the results into the dashboard JS (same pattern as the prospect cards).

Analyses to run:

1. **Totals:** connection count, unique companies, connections with email, email percentage
2. **Connections by year:** count per year for the full timeline
3. **Function tagging** (multi-tag each connection by scanning Position + Company, case-insensitive):
   * Creative/Design: creative, design, art director, graphic, illustrat, visual, ux, ui, motion
   * Marketing: marketing, growth, demand gen, digital market, seo, sem, paid media
   * Brand/Strategy: brand, strateg, planning, insight
   * Content/Copy: content, copy, writer, editor, editorial
   * Leadership/C-Suite: ceo, coo, cfo, cto, cmo, cco, chief, president, managing director, vp, vice president
   * Founder/Owner: founder, co-founder, owner, entrepreneur, principal
   * Production/Ops: producer, production, project manager, operations, studio manager
   * Sales/BD: sales, business develop, account manager, account director, partnerships
   * Tech/Engineering: engineer, developer, software, data scien, machine learning
   * AI/ML: artificial intelligence, ' ai ', ai-, ai/, .ai, generative, machine learning, llm
   * Photography/Video: photo, video, film, cinemat
   * PR/Comms: public relation, communications, pr , media relation
   * Fashion/Lifestyle: fashion, apparel, luxury, retail, stylist
   * Consulting/Advisory: consult, advisor, freelanc, fractional
   * Education/Training: teacher, professor, lecturer, educat, training, coach, mentor
   * Agency: agency, studio
4. **Seniority tagging** (scan Position only):
   * C-Suite/VP: ceo, coo, cfo, cto, cmo, cco, chief, president, vice president, vp
   * Director: director, head of
   * Founder/Owner: founder, co-founder, owner, principal
   * Manager/Lead: manager, lead, supervisor, team lead
   * Senior: senior, sr., sr (space after)
   * Freelance/Independent: freelanc, independent, self-employed, consultant
   * Junior/Associate: junior, jr., associate, assistant, intern
5. **Monthly connections** for the most recent 3-4 years (YYYY-MM counts)
6. **Top companies** with 3+ connections (exclude freelance/self-employed variants). Include the people at each company (name + position).
7. **Key title frequencies:** count exact matches for: founder, creative director, chief, ceo, head of, director of, managing director, art director, vp of
8. **AI connections cluster:** filter all connections where Position + Company contains AI-related keywords. Group into sub-clusters:
   * AI creative directors & artists
   * AI platform & tool companies
   * AI trainers & educators
   * Enterprise AI roles
9. **Network eras:** group years into career phases based on the user's history. Calculate total connections per era and percentage of total network.
10. **Decision maker count:** sum of C-Suite/VP + Director + Founder/Owner seniority categories as a percentage of total.

# Step 3: Build the Network Intelligence tab

Use Chart.js (CDN: \`https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js\`). Load it via script tag. Initialize charts lazily — only when the user first clicks the Network tab (so Page 1 still loads fast).

Layout (top to bottom):

1. **Metric cards row** (4-up grid, same style as Phase 1 stats bar):
   * Total Connections
   * Unique Companies
   * AI Connections
   * Decision Makers (as percentage)
2. **Section: Growth Timeline** \`[NC.NET.01]\`
   * Bar chart: connections by year, bars color-coded by career era
   * Legend above chart showing era colors and labels
3. **Section: Network Composition** \`[NC.NET.02]\` (two-column grid)
   * Left: Horizontal bar chart — function breakdown (sorted descending)
   * Right: Donut chart — seniority breakdown with right-side legend
4. **Section: Company Density** \`[NC.NET.03]\`
   * Horizontal bar chart — top companies with 3+ connections
5. **Section: Growth Velocity** \`[NC.NET.04]\`
   * Line chart with area fill — monthly connections for recent years
   * Call out the biggest spike month in the subtitle
6. **Section: Title Density & Network Eras** \`[NC.NET.05]\` (two-column grid)
   * Left: Vertical bar chart — key title counts, each bar a different color
   * Right: Era cards — styled list showing each career phase with colored dot, year range, phase name, connection count, and one-line description
7. **Section: AI Network Cluster** \`[NC.NET.06]\` (two-column grid of cards)
   * 4 cluster cards, each with a colored icon dot, cluster name, and list of notable names with their title and company
   * Below: final metric cards row — Creative Directors count, Founders count, C-Suite/VP count, Emails on File count

# Chart styling rules

* Use the dashboard's existing accent color as the primary chart color
* Use 3-4 supporting colors (a purple, teal, pink, gray) consistently across all charts
* Font size 10-11px for axis labels, IBM Plex Mono
* Minimal grid lines (y-axis only, very light)
* No x-axis grid lines
* Border radius 3px on all bars
* Bar percentage 0.7
* Line charts: tension 0.3, point radius 2, border width 2, area fill at 10% opacity

# Section label pattern (match Phase 1)

\`\`\`html
<div class="section-label">SECTION NAME</div>
<div class="section-code">[NC.NET.0X]</div>
\`\`\`

# Step 4: Update footer

Change footer subtitle from \`/ linkedin prospects\` to \`/ linkedin intelligence\` and update the description to reference both tabs.

# Design constraints

* Match Phase 1's design language exactly — same fonts, colors, spacing, card styles
* Charts render inside white cards with 1px border (same as prospect cards)
* All new CSS goes in the existing \`<style>\` block
* All new JS goes after the existing \`renderCards('all')\` call
* Chart.js script tag goes after the main script block
* Tab switching must not break existing filter buttons or copy-to-clipboard functionality
* Mobile responsive: chart grids collapse to single column below 768px, metric grids to 2-up

# Output

The same single HTML file, now with two functional tabs. No additional files needed.`,
      },
      {
        number: 3,
        label: "Network Matchmaking",
        prerequisite:
          "Run this AFTER Phase 1 + Phase 2 are complete on someone else's LinkedIn dashboard. You'll need: their completed Phase 1+2 dashboard HTML, a transcript of the conversation with the person you're matchmaking for (e.g. Jeremy), and the dashboard owner's Connections.csv.",
        blurb:
          "Adds a third tab — Network Matchmaking. Reads your conversation with someone (Jeremy in the worked example), extracts their actual ICP and language from the transcript, then scores every connection in the dashboard owner's network against it. Returns ranked match cards with intro angles you can copy and send.",
        prompt: `# Context

Jeremy Somers (founder of NotContent.AI — AI creative training for enterprise teams at training.notcontent.ai) had a conversation with you. In that conversation, he explained what he does, who he's looking for, and what makes a great prospect for his training programs. You offered to make introductions from your LinkedIn network.

This prompt takes your completed LinkedIn Intelligence dashboard (Phase 1 + 2) and the transcript of your conversation with Jeremy, and builds a **Phase 3 tab: Network Matchmaking** — a ranked list of people in YOUR network who are the best introductions for Jeremy, based on what he actually said he needs.

# Inputs you'll need ready

1. **Your completed dashboard HTML** (with Phase 1 prospect cards and Phase 2 network intelligence already built from your own Connections.csv)
2. **Conversation transcript** — the full conversation between you and Jeremy. This could be a Zoom/meeting transcript, a WhatsApp export, a text file, or pasted text. Paste it or attach it.
3. **Your Connections.csv** — the same LinkedIn data export used for Phase 1 + 2

# Your task

You have a completed LinkedIn Intelligence dashboard (Phase 1 + Phase 2). Now add a **third tab: Network Matchmaking** that identifies the best introductions from this person's network for Jeremy Somers / NotContent Training.

## Step 1: Extract matching criteria from the transcript

Read the conversation transcript carefully. Extract:

1. **What Jeremy is selling:** AI creative training programs ($5K–$75K) at training.notcontent.ai. NOT agency services — he trains teams to use AI together.
2. **Who he wants to meet** (pull EXACT quotes from the transcript where he describes his ideal customer):
   * Creative directors, heads of creative, CCOs at agencies or brand in-house teams
   * Agency founders/CEOs running creative shops (NOT AI agencies — those are competitors)
   * Brand-side creative/content leads (Director of Creative, Head of Brand, VP Creative)
   * Heads of production, studio directors
   * Anyone running an in-house creative team ("The Greenhouse" type setups)
   * People at companies with high-volume creative output (e-commerce, FMCG, fashion, DTC, pharma)
3. **Who he does NOT want:**
   * AI tool companies / AI agencies (competitors, not customers)
   * Pure tech/engineering roles with no creative mandate
   * Junior roles without budget authority
   * Sales/recruiting outreach
4. **What makes someone high-value** (from the conversation):
   * Large team they could train (team size = deal size)
   * High-volume creative production (lots of "a little bit creative" work)
   * Already experimenting with AI individually but no team alignment
   * Global or multi-market operations (more complexity = more need)
   * Decision-making authority (can sign a $50K engagement)
5. **Any specific names, companies, industries, or signals** Jeremy mentioned in the conversation as interesting.

## Step 2: Score every connection

For each connection in Connections.csv, calculate a **Match Score (0–100)** across these dimensions:

| Dimension | Max Points | What to assess |
|---|---|---|
| **Role fit** | 30 | Does their title match who Jeremy wants to meet? Creative leadership, agency founder, brand creative lead, head of production = high. Sales, engineering, recruiting = zero. |
| **Company fit** | 25 | Is the company an agency, brand with in-house creative, or organization with high-volume creative needs? Size matters — big company = bigger training deal. Exclude AI tool companies. |
| **Authority** | 20 | Can this person approve a $5K–$75K engagement? C-suite, VP, Director, Founder = high. Manager, Senior, Junior = lower. |
| **Relevance signals** | 15 | Does anything in their title or company suggest they're dealing with the exact problem Jeremy solves (AI adoption, creative production, team alignment)? |
| **Intro quality** | 10 | How strong is YOUR relationship with this person? If you have context from the conversation about who you know well vs. barely, factor that in. Default to 5 if unknown. |

## Step 3: Build the matchmaking tab

Add a third tab to the dashboard: **Network Matchmaking**

**Layout:**

1. **Context card** at the top — a styled box summarizing:
   * Who this matchmaking is for (Jeremy Somers / NotContent Training)
   * What he's looking for (1-2 sentence summary extracted from the transcript)
   * 2-3 direct quotes from the transcript that capture what he needs
   * Link: training.notcontent.ai
2. **Match stats bar** (4 metrics):
   * Total connections scanned
   * Strong matches (score 70+)
   * Good matches (score 50–69)
   * Conversation quotes used
3. **Ranked match cards** — show the top 20-30 matches, each card containing:
   * Rank and match score (/100)
   * Name, title, company
   * Score breakdown bars (same visual style as Phase 1 prospect cards)
   * **Why this is a match** — 2-3 sentences explaining why this person fits what Jeremy described. Reference specific things from the transcript where possible ("Jeremy mentioned he's looking for teams with high-volume e-commerce content — [Name] leads exactly that at [Company]").
   * **Suggested intro angle** — a one-liner the dashboard owner could use when making the intro. Something like: "Jeremy trains creative teams to use AI together — your [team/operation] at [company] is exactly the kind of setup he works with."
   * LinkedIn profile link
   * Badge: "STRONG MATCH" (70+), "GOOD MATCH" (50-69), or no badge below 50
4. **Filter bar** — same style as Phase 1:
   * All Matches
   * Strong Matches (70+)
   * Agency People
   * Brand People

**Card styling:** Match the existing prospect card design exactly — same card structure, same score breakdown bars, same badge styling. Use the same color palette (orange accent, teal, sage, cream, gray). The "Why this is a match" section replaces the "Intel" section from Phase 1. The "Suggested intro angle" replaces the "Outreach Message" section but is shorter (1-2 sentences, no copy button needed).

## Step 4: Update tab navigation

The tab bar now shows three tabs:
* Prospect Intelligence
* Network Intelligence
* Network Matchmaking ← new

## Step 5: Generate a shareable summary

Below the match cards, add a **summary block** styled like the footer — a pre-written message the dashboard owner can copy and send to Jeremy:

\`\`\`
Hey Jeremy — ran your criteria against my LinkedIn network. Found [X] strong matches and [Y] good matches. Here are the top [N] I think are worth an intro:

1. [Name] — [Title] at [Company]. [One-line why].
2. [Name] — [Title] at [Company]. [One-line why].
3. [Name] — [Title] at [Company]. [One-line why].
...

Want me to make intros to any of these?
\`\`\`

Include a copy button on this summary block.

# Important rules

* **The transcript is the source of truth.** Don't assume what Jeremy wants — extract it from what he actually said. If he mentioned specific industries, company sizes, or types of people, those should weight the scoring.
* **Quote the transcript.** The "Why this is a match" sections are more powerful when they reference specific things Jeremy said.
* **Don't include AI agencies/tool companies.** These are Jeremy's competitors, not his customers.
* **Rank by match score.** The person making intros should see the best matches first.
* **The intro angle should be usable.** Write it as something the dashboard owner would actually send — casual, personal, one sentence.

# Output

The same single HTML file, now with three functional tabs. No additional files needed.`,
      },
    ],
    heroImage: "/images/library/linkedin-prospect-intelligence-sample.webp",
    heroVideo: "/images/library/linkedin-prospect-intelligence-sample-dash.mp4",
    tags: ["sales", "outreach", "linkedin", "dashboard", "multi-phase"],
  },
  {
    slug: "copy-autopsy",
    number: 2,
    title: "The Copy Autopsy",
    eyebrow: "Conversion · Copy",
    oneLiner:
      "Eight rewrites. Five judges. Kill the weak ones. Ship what survives.",
    whatItDoes: `Takes any landing/sales page — URL, draft, or pasted copy — and runs it through a structured teardown. Not a vague "here's some feedback." A diagnosis, eight full rewrites from different strategic angles, a judging panel that scores every version, and a final merged page built from whatever actually earned its place.

The prompt forces the AI to compete against itself. Eight versions means eight different bets on what will convert. The five judges (a skeptical CFO, a founder scrolling at midnight, your biggest competitor, your ideal customer, and a conversion copywriter) score each one. Then it kills the losers and merges the winners into one page you can actually ship.

You end up with a complete landing/sales page — hero through final CTA — built from the strongest headline, the best proof angle, the sharpest differentiation, and the most compelling offer framing across all eight versions. Not the AI's first guess. Its best surviving work.`,
    whenToUse: [
      "You have a landing/sales page that's live but underperforming — traffic's coming in, conversions aren't.",
      "You're about to launch and want to pressure-test the copy before it goes live. Better to kill weak ideas now than after you've spent the ad budget.",
      "You've been staring at your own page too long and can't tell if it's good or just familiar.",
      "You want a structured second opinion that's harsher than your team will be. This prompt is built to be blunt.",
      "You need to differentiate against a specific competitor and want the page reframed around what makes you different, not just what makes you good.",
    ],
    whatYoullGet: [
      "A blunt diagnosis of what's working and what's leaking conversions on your current page.",
      "Eight complete landing/sales page rewrites — each built around a different strategic angle (pain, outcome, skeptic-proof, founder story, category play, ROI, competitor contrast, direct conversion).",
      "A scored judging panel — five personas rate every version on clarity, credibility, relevance, differentiation, emotional pull, and conversion potential.",
      "A kill/keep/merge decision for every version with a full scoreboard.",
      "One final optimized landing/sales page — hero through CTA — assembled from the winning pieces across all eight versions.",
    ],
    quickFire: [
      "Grab your landing/sales page URL, or copy-paste the full page copy into a doc. Either works.",
      "Write 2–4 sentences of context: what you sell, who it's for, what the page needs to do. Be specific — \"SaaS for accountants\" beats \"a software product.\"",
      "Optionally add a competitor URL or name. The prompt uses it to sharpen the differentiation angle. Skip it if you don't have one.",
      "Paste the prompt into Claude (or your AI of choice). Fill in the three bracketed inputs at the top: your page, your context, and the competitor.",
      "Let it run through all five steps. Don't interrupt the judging phase — the scores need to land before the merge makes sense.",
      "Review the final merged page. It's a full structure (hero → problem → solution → proof → CTA) — use it as your next draft or ship it directly.",
    ],
    prompt: `You are a senior conversion strategist, landing/sales page teardown expert, and direct-response copywriter.

Analyze and rewrite my landing/sales page eight different ways, then judge every version, kill the weak ones, and merge the strongest ideas into one final page.

## My Input

Landing/sales page:
[INSERT URL OR COPY]

Context:
[INSERT 2–4 SENTENCES ABOUT WHAT YOU SELL, WHO IT'S FOR, AND THE MAIN GOAL]

Competitor:
[INSERT COMPETITOR URL OR NAME — OPTIONAL]

## Step 1: Diagnose the Current Page

Review the page and identify:

* Main promise
* Target audience
* Strongest sections
* Weakest sections
* Trust gaps
* Conversion leaks
* Generic or unclear copy

Be blunt and specific.

## Step 2: Rewrite It Eight Ways

Create eight distinct landing/sales page versions using different strategic angles:

1. Pain-focused
2. Outcome-focused
3. Skeptic-proof
4. Founder-led story
5. Category differentiation
6. ROI/business case
7. Competitor contrast
8. Simple/direct conversion

For each version, include:

* Headline
* Subheadline
* CTA
* Section flow
* Key copy
* Proof or objection-handling angle

## Step 3: Create Five Judges

Create these judges:

1. Skeptical CFO
2. Founder scrolling at midnight
3. Biggest competitor: [INSERT COMPETITOR NAME]
4. Ideal customer
5. Conversion copywriter

Each judge scores every version from 1–10 based on clarity, credibility, relevance, differentiation, emotional pull, and conversion potential.

## Step 4: Score, Kill, and Merge

Show a scoreboard with:

* Version
* Judge scores
* Average score
* Rank
* Keep / Kill / Merge decision

Then identify:

* Best headline
* Best CTA
* Best offer framing
* Best proof angle
* Best emotional hook
* Best differentiation angle
* Best section sequence

## Step 5: Final Output

Using the winning pieces, create one final optimized landing/sales page with:

* Hero
* Problem
* Solution
* Differentiation
* Proof
* Objection handling
* FAQ
* Final CTA

Be candid. Do not protect weak ideas. Prioritize clarity, conversion, and differentiation over cleverness.`,
    heroImage: "/images/library/copy-autopsy-sample.jpg",
    tags: ["conversion", "landing-page", "sales-page", "copywriting", "marketing"],
  },
  {
    slug: "content-taste-audit",
    number: 3,
    title: "The Content Taste Audit",
    eyebrow: "Content · Quality",
    oneLiner:
      "Point it at any site. It tells you which copy deserves to exist — and how to sharpen the rest.",
    whatItDoes: `Turns any website into a ruthless content-taste audit. It judges every page against two gates — would anyone share this, and could only this brand have written it — then hunts the AI slop most copy is drowning in and hands back concrete rewrites in the brand's own voice.

It won't polish a hollow page. If the words are competent but forgettable, it says so and tells you what to go find — the real story, the number, the belief you'll defend — instead of dressing up nothing. Built from the same taste standard we run on this site.`,
    whenToUse: [
      "Your copy reads clean but forgettable — technically fine, no teeth. This finds exactly where and why.",
      "You just AI-drafted a batch of pages or posts and want to catch the slop before it ships.",
      "You have real proof — numbers, clients, stories — and a nagging feeling the copy isn't using it.",
      "You're sizing up a competitor's site, or one you're about to rebuild, and want the honest read on what's weak.",
    ],
    whatYoullGet: [
      "A per-page verdict — SHIP / SPAR / REWORK / KILL — with both gate scores.",
      "Every slop line quoted verbatim and tagged with its pattern.",
      "Ranked fixes written as actual replacement copy — in the brand's voice, no invented facts.",
      "The site-wide patterns, and the single highest-impact move to make first.",
    ],
    quickFire: [
      "Paste the prompt into Claude (or your AI of choice).",
      "Give it the target — a URL if it can browse, or paste the copy page by page.",
      "Hand it your audience and any proof (real numbers, client names, stories). The more it has, the sharper the onlyness call.",
      "Read the verdicts. Execute the fixes it can prove; for anything marked SPAR, go get the real story before you touch the words.",
    ],
    prompt: `You are a content taste auditor with a design director's eye for words. I'll give you a website (or copy from one). Judge whether the copy deserves to exist, then tell me exactly how to sharpen it. Do not be polite — competent but forgettable is a failing grade.

STEP 0 — SET UP (before auditing). Ask me for, then wait for:
1. The target — a URL to read (fetch it if you can browse), or copy I'll paste, page by page.
2. Who it's for — the audience and the brand, plus any voice note or real proof (numbers, client names, stories).
No voice note? Say voice judgment will be limited, then proceed. Don't audit until you have the target. If I've already given you everything, skip the questions and go.

THE BAR — every page clears TWO gates, not one:

GATE 1 · SHARE TEST — would a smart, busy person forward this with "you need to read this"? People share for exactly five reasons: it made them look smart; it named a feeling they couldn't articulate; it handed them an unfair advantage (a framework, number, or model they can use now); it surprised them; or it told a story they can't stop thinking about. Name which of the five each page goes for — and whether it lands. Hits none of the five and it dies on arrival.

GATE 2 · ONLYNESS TEST — could only this brand have written this? Delete the logo — can you still tell who it is? Could a competitor republish it next week? Is it built on their own proof — a real story, their numbers, a belief they'll defend — or on public knowledge every AI already has? Generic-but-good still FAILS this gate.

FIND THE SLOP — catch and quote every one, verbatim:
- Generic openings that work on any topic ("In today's fast-paced world…", "It's no secret that…").
- Hedge-word soup that signals no opinion ("it's important to consider", "there are many factors at play").
- Summary voice — reads like a summary of other content; evenly-weighted paragraphs that commit to nothing.
- False contrarianism ("the shift nobody's talking about" — then cites a report talking about it).
- Listicle blobs — five to seven common-sense "insights", no names, no numbers.
- Interchangeable lines — swap the logo and they still work.
- Vague claims sitting next to unused specific proof — the worst tell: real numbers exist and the copy reaches for mush instead.
- Fabricated or unverifiable stats. Flag any number that can't be sourced.

DON'T POLISH SLOP. If a page passes Gate 1 but fails Gate 2 — or is clean but hollow — the fix is a stronger idea, not better words. Say so, and tell me what to interrogate: What do they believe that smart peers would argue with? What did they watch happen that contradicts the consensus? What number or story is only theirs? Never invent their opinion — propose angles as provocations they have to claim as true.

OUTPUT — for EACH page, in this exact format, compact:

PAGE: <url or name>
GATE 1 — Share: PASS / BORDERLINE / FAIL — which trigger, plus one sentence
GATE 2 — Onlyness: PASS / BORDERLINE / FAIL — one sentence on why
BEST LINES: up to 2 verbatim quotes that actually work
SLOP: up to 3 verbatim offending lines, each tagged with its pattern
RANKED FIXES (max 3, highest-impact first): concrete — show the actual rewritten line, in the brand's voice, using only real or provided proof
VERDICT: SHIP / SPAR (core is weak — go get a real idea) / REWORK / KILL

Then close with:
SITE-WIDE PATTERNS — the 3 to 5 issues that repeat across pages (duplicate lines, hoarded proof, house tics), ranked by impact.
THE ONE MOVE — if I only do one thing this week, what is it?

Rules: quote real lines, never paraphrase — "the submit button", not "some elements". Say what's wrong AND why it costs them. Prioritise ruthlessly — if everything's important, nothing is. Don't soften. And never hand me a fabricated fact, number, or client name — if the proof isn't there, tell me to go get it.`,
    heroImage: "/images/library/content-taste-audit-sample.jpg",
    tags: ["content", "copywriting", "audit", "quality", "brand-voice", "marketing"],
  },
  {
    slug: "voice-card",
    number: 4,
    title: "The Voice Card",
    eyebrow: "Brand · Voice",
    oneLiner:
      "Sit for a 20-minute interrogation. Walk away with a card that makes any AI write like you — and tripwires that catch it drifting.",
    whatItDoes: `Builds a portable voice card — the one asset every other AI writing task depends on. Not a "brand guidelines" doc nobody opens: a paste-able card that captures your rhythm, vocabulary, stance and banned words, plus a 10-line test suite that catches any future AI draft the moment it stops sounding like you.

The mechanic is calibration duels. You can't describe your own voice accurately — nobody can. So the prompt doesn't ask you to. It studies real pieces you love and hate, then writes the same paragraph two ways and makes you pick. Every pick teaches it something it couldn't get from your description. Five rounds later, the card converges on how you actually write, not how you think you write.`,
    whenToUse: [
      "Fifteen people on your team are writing in fifteen accents and every AI draft comes back sounding like a press release.",
      "You're about to run any serious AI writing workflow — this card is the input that makes the rest work.",
      "Your AI drafts are technically fine but you rewrite every one anyway, and you can't articulate why.",
      "You want new hires and freelancers producing on-voice work in week one, not month three.",
    ],
    whatYoullGet: [
      "A paste-able Voice Card: rhythm, sentence habits, vocabulary, stance, punctuation tics, openings and closings.",
      "A banned-words list — the phrases that instantly make copy not-you.",
      "A 10-line drift test suite: run any future draft through it and catch the fakes.",
      "A one-line instruction block for pasting the card at the top of any AI chat.",
    ],
    quickFire: [
      "Gather your raw material FIRST: 5 pieces of writing that sound exactly like you (emails, posts, decks — anything real) and 5 that make you wince. Real pieces, not examples you'd like to be true.",
      "Paste the prompt into Claude (or your AI of choice) and hand over the writing when it asks.",
      "Play the duels honestly — pick the version you'd actually send, not the one that sounds impressive.",
      "Save the final card somewhere the whole team can reach. Paste it at the top of every AI writing chat from now on.",
    ],
    prompt: `You are a voice analyst. Your job is to build me a portable VOICE CARD — a compact document that makes any AI write like me — through evidence and forced choices, never through my self-description. People are wrong about their own voice; you will not ask me to describe mine.

STEP 0 — RAW MATERIAL. Ask me for, then wait for:
1. FIVE real pieces of my writing that sound exactly like me (emails, posts, scripts, decks — real, not aspirational).
2. FIVE pieces that make me wince — my own drafts gone wrong, AI outputs I rejected, or writing in my niche I'd never publish.
Do not proceed with fewer than 3 + 3. If I try to describe my voice instead of providing samples, refuse politely and ask for the writing.

STEP 1 — AUTOPSY (silent). Study both piles. For the loved pile, extract: sentence-length pattern and rhythm; how I open and close; vocabulary I reach for; stance (how directly I state opinions, how I handle hedging); punctuation habits; what I never do. For the hated pile, extract the specific tells that make it wrong. Keep this analysis internal — do not show me yet.

STEP 2 — CALIBRATION DUELS. Run exactly 5 rounds. Each round: write ONE short paragraph (60–90 words) on a neutral topic relevant to my field, in two candidate versions, A and B, that differ on ONE dimension you're unsure about (rhythm, directness, warmth, formality, metaphor use…). Ask me to pick A or B — and optionally say why in a few words. Update your model of my voice after every pick. Never reveal what dimension you're testing until after I choose. If my picks contradict the writing samples, the PICKS win — say so and adjust.

STEP 3 — THE VOICE CARD. Output the card in this exact structure, tight enough to paste anywhere:

VOICE CARD — [my name/brand]
RHYTHM: sentence-length pattern, pacing, paragraph habits
OPENINGS & CLOSINGS: how I enter and leave a piece
VOCABULARY: 10–15 words/constructions I actually use
STANCE: how I state opinions, what I hedge, what I never hedge
PUNCTUATION & TICS: the mechanical fingerprints
NEVER: 10 banned words/phrases that instantly make copy not-me (draw these from the hated pile + AI-slop classics)
IN ONE LINE: my voice summarized in a single sentence

STEP 4 — DRIFT TEST SUITE. Output 10 numbered pass/fail checks — specific to ME, not generic ("Does any sentence exceed X words?", "Does it open with a scene or a thesis, never a definition?", "Ctrl-F these banned words: …"). A future draft that fails 3+ is off-voice and gets rewritten.

STEP 5 — USAGE BLOCK. End with a 2-line instruction I can paste above the card in any AI chat: "Write in this voice. Before returning anything, run it against the drift tests and fix failures silently."

Rules: never flatter my writing; the card must be honest, including weaknesses that ARE the voice. No generic advice. If the samples are too thin to be confident on a dimension, say so and mark that line PROVISIONAL rather than inventing.`,
    comingSoon: true,
    tags: ["brand-voice", "writing", "ai-workflow", "content", "team-standards"],
  },
  {
    slug: "case-study-extractor",
    number: 5,
    title: "The Case Study Extractor",
    eyebrow: "Proof · Sales",
    oneLiner:
      "Interrogates a finished project until the real numbers and scars fall out — then builds the case study that sells the next one.",
    whatItDoes: `Every team has finished projects and no case studies. The work shipped, the client was happy, and the proof is rotting in a project folder because writing it up feels like homework. This prompt does the extraction: it interrogates you about one finished project until the numbers, the baseline, the quotes and the almost-failure fall out — then builds the case study.

The mechanic is a hard no-adjectives rule plus a skeptic pass. It refuses "significantly faster" and demands "how many days, down from how many." Then, before anything is final, it re-reads the draft as a procurement director who believes none of it — and every claim either gets a source or gets cut. What survives is proof, not brochure.`,
    whenToUse: [
      "You're pitching AI-era work and your proof is 'trust us' — you need the case study before the next RFP, not after.",
      "A project just wrapped, the details are still fresh, and you have 30 minutes before they evaporate.",
      "Your existing case studies are adjectives in a trench coat — 'seamless collaboration drove impactful results' — and you know it.",
      "You need proof lines for a deck or a bio by Thursday, not a 2,000-word write-up someday.",
    ],
    whatYoullGet: [
      "A publishable case study — challenge, work, result — where every claim survived a skeptic pass.",
      "The real numbers, extracted: baseline, delta, time, cost — or an honest list of which numbers you still need to hunt down.",
      "A pull-quote kit: 3 proof lines sized for decks, bios, and social.",
      "A follow-up list: the 2–3 facts or client permissions to chase that would make the study twice as strong.",
    ],
    quickFire: [
      "Pick ONE finished project. Grab whatever artifacts you have — the brief, timelines, invoices, Slack threads, client emails. More raw material = more surviving claims.",
      "Paste the prompt and answer its questions. When it refuses an adjective, give it the number — or admit you don't have one and let it mark the claim.",
      "Take the skeptic pass seriously: what gets cut was never going to convince a buyer anyway.",
      "Before publishing, clear client naming/quotes with the client. The prompt will flag exactly what needs permission.",
    ],
    prompt: `You are a case-study extractor. I'm going to tell you about one finished project, and your job is to pull the real proof out of me — numbers, baselines, quotes, scars — then build a case study a skeptical buyer would believe. You are allergic to adjectives.

THE ONE RULE: no unquantified claim survives. When I say "much faster," you ask "how long did it take, and how long did it used to take?" When I say "the client loved it," you ask "what did they actually say or do — verbatim, or what happened next?" If I don't have the number, you mark the claim [UNVERIFIED] and move on. You never decorate a vague claim into a pretty sentence.

STEP 0 — SETUP. Ask me for, then wait for: the project (client, what shipped, when), and any raw material I can paste (brief, timeline, emails, invoices, metrics). If I can't name the client publicly, ask what I CAN say (category, size, market) and use that consistently.

STEP 1 — INTERROGATION. Ask one question at a time, adapt to my answers, and hunt these in order:
1. THE BASELINE — what did this kind of project cost/take BEFORE (time, money, people)? A result means nothing without the before.
2. THE DELTA — what actually changed, in numbers: time, cost, output volume, revisions, headcount avoided.
3. THE MOMENT IT ALMOST FAILED — every real project has one. What went wrong, what did you do? (This is what makes it believable — a story with no scar reads as fiction.)
4. THE HUMAN PROOF — what did the client say, verbatim? Who said it, what's their title? What did they DO after (rehire, refer, expand scope)?
5. THE MECHANISM — what specifically did you do differently that caused the result? Not the philosophy: the moves.
Keep going until you have at least: one baseline, two deltas, one scar, one quote or behavior. If I genuinely lack one, note the gap and continue.

STEP 2 — DRAFT. Write the case study, 400–600 words: CHALLENGE (with baseline) → THE WORK (the mechanism + the scar, told straight) → THE RESULT (deltas, plainly stated, one hedge max per number). My voice: direct, no marketing language, no exclamation marks. Every number appears once — no restating the same result in vaguer words.

STEP 3 — SKEPTIC PASS. Now re-read the draft as a procurement director who believes none of it. For each claim: BELIEVE (has a source/number), CHALLENGE (plausible but unsourced — rewrite it honestly or tag [UNVERIFIED]), or CUT (decorative). Show me the table, then the revised study with challenges resolved.

STEP 4 — THE KIT. Finish with:
PULL-QUOTE KIT: 3 proof lines built from the strongest surviving claims — one for a deck slide (under 12 words), one for a bio/about page, one for a social post.
PERMISSIONS: exactly what needs client sign-off before publishing (name, quote, numbers).
STRENGTHEN: the 2–3 missing facts that would most upgrade this study, and who to ask.

Rules: never invent a number, a quote, or a client reaction — ever. If the extraction reveals the project has no real proof, say so plainly: that's a finding, not a failure. The case study you don't publish is better than the one a buyer catches lying.`,
    comingSoon: true,
    tags: ["case-study", "proof", "sales", "agency", "copywriting"],
  },
  {
    slug: "governance-one-pager",
    number: 6,
    title: "The Governance One-Pager",
    eyebrow: "Ops · Risk",
    oneLiner:
      "The AI policy your clients keep asking about — drafted, argued, and on one page before Monday.",
    whatItDoes: `Your clients are starting to ask the question: "What's your AI policy?" Right now the honest answer at most studios is a shrug and a promise. This prompt gets you to a real answer — a one-page working policy in plain language: what you use AI for, what you never use it for, how you disclose, how client work stays protected, and who signs off.

The mechanic is the stress test. A drafted policy is easy; a defensible one isn't. So after drafting, the prompt attacks its own draft from three directions — a nervous client who just read a scary headline, a procurement reviewer with a checklist, and your most senior creative who thinks this is all beneath them — and patches every hole it finds. What survives fits on one page and survives a client meeting.`,
    whenToUse: [
      "A client or their procurement team just asked for your AI policy and you have nothing to send.",
      "Your team is already using AI on client work — unevenly, quietly, with no shared rules — and you'd rather write the policy than have an incident write it for you.",
      "You're pitching AI-assisted work and need to answer the risk question before it's asked.",
      "Different people on the team are giving clients different answers about how AI is used. That's how trust dies.",
    ],
    whatYoullGet: [
      "A one-page working AI policy in plain language — not legalese, not a 40-page PDF nobody reads.",
      "Clear lines: what AI is used for, what it's never used for, disclosure rules, data handling, and the human sign-off gate.",
      "The stress-test log: the holes the three attackers found and how each was patched.",
      "A short 'how to talk about it' note — the two-sentence answer for when a client asks in a meeting.",
    ],
    quickFire: [
      "Block 30 minutes. Have in mind: your client roster (who's nervous, who's regulated), the tools your team actually uses, and any existing client contract language about AI.",
      "Paste the prompt and answer honestly — including the uncomfortable question of what your team is already doing without rules.",
      "Read the three attacks. The holes they find are the questions clients will ask.",
      "Have a lawyer glance at the final page before it goes in a contract — this is a working policy, not legal advice. Then put it where the whole team can see it.",
    ],
    prompt: `You are helping me draft a working AI governance policy for a creative business — one page, plain language, defensible in a client meeting. Not legalese, not a corporate PDF: the real rules my team will actually follow and my clients will actually believe.

STEP 0 — INTERROGATION. Ask me these, one small batch at a time, and wait for answers:
1. The business: what we make, team size, and whether clients are brands, agencies, or both.
2. The client reality: who's nervous about AI, who's asked already, anyone regulated (finance, health, kids) or with contract language about AI?
3. The tooling truth: which AI tools the team ACTUALLY uses today — including the unofficial ones. (Honesty here is the whole point; the policy has to cover reality, not the org chart's fantasy.)
4. The lines I already feel: anything I already know we'd never do (e.g. training models on client assets, AI-generating final brand artwork, feeding confidential briefs to consumer tools)?
5. Disclosure instinct: do I want to proactively tell clients where AI is used, answer honestly when asked, or decide per client?

STEP 1 — DRAFT THE ONE-PAGER. Using my answers, draft the policy with exactly these sections, total under 450 words, plain confident language:
WHAT WE USE AI FOR — the real use cases, stated without apology.
WHAT WE NEVER USE AI FOR — the hard lines, specific enough to be checkable.
YOUR WORK, PROTECTED — where client materials can and cannot go: which tools, what data rules, what never leaves our accounts.
DISCLOSURE — when and how we tell clients AI touched the work.
THE HUMAN GATE — who reviews AI-assisted work before it ships, and what they check.
OWNERSHIP & UPDATES — who owns this policy and how often it's revisited (AI moves quarterly; the policy should too).

STEP 2 — STRESS TEST. Attack your own draft three times, in character, 3–4 hard questions each:
ATTACK 1 — THE NERVOUS CLIENT: just read a headline about AI leaking data / stealing artists' work. What in this policy fails to reassure them? What question would they ask that it can't answer?
ATTACK 2 — PROCUREMENT: reviewing this against a vendor checklist. Where is it too vague to verify? What would they demand in writing that's missing?
ATTACK 3 — THE SENIOR CREATIVE: 25 years of craft, thinks this policy is either bureaucracy or a threat. What would make them ignore it? Where does it accidentally insult the craft?
For each attack, list the holes found, then PATCH the policy. Show the patch log briefly (hole → fix).

STEP 3 — FINAL OUTPUT. Deliver:
1. The final one-page policy (post-patches, still under one page).
2. THE MEETING ANSWER: a two-sentence spoken version for when a client asks "so what's your AI policy?" in a room.
3. FLAG FOR COUNSEL: 2–3 items a lawyer should look at before this goes into any contract.

Rules: plain language over legal cosplay — "we never upload your unreleased product photos to consumer AI tools" beats "confidential materials are handled in accordance with best practices." Every rule must be checkable by a team member in the moment. If my answers reveal the team is doing something indefensible today, say so directly and make stopping it rule one. This is a working policy, not legal advice — and it should say that on the page.`,
    comingSoon: true,
    tags: ["governance", "risk", "policy", "agency", "operations", "client-trust"],
  },
];

// Master switch for the /library email gate. false = library fully open;
// flip to true to require the Beehiiv opt-in before any prompt renders.
export const LIBRARY_GATE_ENABLED = true;

export function getPrompt(slug: string): Prompt | undefined {
  return PROMPTS.find((p) => p.slug === slug);
}

export function getAllPromptSlugs(): string[] {
  return PROMPTS.filter((p) => !p.comingSoon).map((p) => p.slug);
}
