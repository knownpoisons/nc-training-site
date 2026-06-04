// ─── Prompt library data ──────────────────────────────────────────────────────
// Add a new prompt by appending an entry. A new page appears at
// /library/<slug> automatically. Keep these in chronological order; the index
// page reverses them so newest reads first.

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
  prompt: string;                  // the paste-able prompt body
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
      "Paste this prompt into Claude (or your AI of choice). It starts in Phase 1.",
      "Answer the clarifying questions — ICP, voice, target audience.",
      "When asked the gatekeeper question, either upload your LinkedIn connections CSV or follow the walkthrough to export it (about 5 minutes).",
      "Let the AI work through the phases. Don't skip ahead — the prompt is built to slow you down deliberately.",
      "Save the HTML dashboard locally and use it as your outreach launchpad for the next two weeks.",
    ],
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
    tags: ["sales", "outreach", "linkedin", "dashboard"],
  },
];

export function getPrompt(slug: string): Prompt | undefined {
  return PROMPTS.find((p) => p.slug === slug);
}

export function getAllPromptSlugs(): string[] {
  return PROMPTS.map((p) => p.slug);
}
