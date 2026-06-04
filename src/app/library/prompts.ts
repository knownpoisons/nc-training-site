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
  heroImage?: string;              // optional, /images/library/<file>
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
      "You have a LinkedIn export sitting in a folder doing nothing.",
      "You want to send 20–50 personalised outreach messages, not a blast.",
      "You're tired of generic AI cold emails that sound like everyone else's.",
      "You want a sales tool that survives past one session — a dashboard, not a chat.",
    ],
    whatYoullGet: [
      "A scored prospect shortlist ranked against your ICP.",
      "Personalised messages written in your voice.",
      "A cleaned CSV of just the top prospects.",
      "A custom HTML dashboard with a 1-click Copy button on every message.",
    ],
    quickFire: [
      "Kick off the LinkedIn data export FIRST — it usually lands in your inbox within a few minutes, but LinkedIn warns it can take up to 24 hours. Go to [LinkedIn → Settings → Get a copy of your data](https://www.linkedin.com/mypreferences/d/download-my-data), tick the box for **Connections**, and request the archive. Open the email and download the ZIP when it arrives.",
      "While you wait, paste this prompt into Claude (or your AI of choice). It starts in Phase 1.",
      "Answer the clarifying questions — ICP, voice, target audience.",
      "When the AI asks the gatekeeper question, upload the **Connections.csv** from the LinkedIn ZIP you downloaded.",
      "Let the AI work through the phases. Don't skip ahead — the prompt is built to slow you down deliberately.",
      "Save the HTML dashboard locally and use it as your outreach launchpad for the next two weeks.",
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
    ],
    heroImage: "/images/library/linkedin-prospect-intelligence-sample.png",
    tags: ["sales", "outreach", "linkedin", "dashboard", "multi-phase"],
  },
];

export function getPrompt(slug: string): Prompt | undefined {
  return PROMPTS.find((p) => p.slug === slug);
}

export function getAllPromptSlugs(): string[] {
  return PROMPTS.map((p) => p.slug);
}
