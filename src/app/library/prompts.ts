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
    tags: ["conversion", "landing-page", "sales-page", "copywriting", "marketing"],
  },
];

export function getPrompt(slug: string): Prompt | undefined {
  return PROMPTS.find((p) => p.slug === slug);
}

export function getAllPromptSlugs(): string[] {
  return PROMPTS.map((p) => p.slug);
}
