// ═══════════════════════════════════════════════════════════════════════════════
// TWO PALMS HUB — all content lives here. Edit this file, push, it's live.
// Times are stored as ISO with the Sydney offset; the page localises them to
// whoever is looking (browser timezone). Nothing in this file is money, hours,
// or a staff member's name on the team side. Entities only.
// ═══════════════════════════════════════════════════════════════════════════════

export type SessionStatus = "upcoming" | "delivered" | "coming_soon";

export interface Session {
  number: number;
  title: string | null; // null = not announced yet
  phase: string;
  /** ISO 8601 with offset. Sydney is +11:00 in Nov/Dec (AEDT). */
  startsAt: string | null;
  durationMinutes: number;
  status: SessionStatus;
  provisional?: boolean; // date not yet confirmed by Two Palms
  meetUrl?: string | null;
  recordingUrl?: string | null;
  cheatSheetSlug?: string | null;
  wrapNotes?: string | null;
  homework?: string | null;
  resources?: { name: string; url: string; note?: string }[];
  prompts?: string[]; // ids from PROMPTS
}

export interface Programme {
  slug: "foundations" | "creative";
  name: string;
  tagline: string;
  status: "live" | "coming_soon";
  startsLabel: string;
  who: string;
  shape: string;
  phases: { label: string; weeks: string; blurb: string }[];
  sessions: Session[];
  officeHours: { label: string; startsAt: string | null; provisional: boolean }[];
}

export const HUB = {
  name: "Two Palms AI Hub",
  url: "https://training.notcontent.ai/two-palms",
  slackChannel: "#ai-training",
  stance: "AI amplifies production. It doesn't replace the shoot.",
  tenEightyTen:
    "10% human brief, 80% AI execution, 10% human QA. The value lives in the two tens.",
  entities: ["Two Palms Sydney", "Two Palms Munich", "Only Sports", "Forward"],
  spotlight: {
    eyebrow: "This week",
    headline: "Coming soon",
    body: "Each week one thing someone on the team built, said or shipped lands here.",
  },
};

// ─── Foundations ────────────────────────────────────────────────────────────────
// Session 1 is set (invite note, 27 Oct). Sessions 2 to 8 follow the plan of
// Tuesdays from 10 Nov at the same time; marked provisional until Two Palms
// confirms the calendar. Nothing ships to the team as a date until it's firm.
const SYD = "+11:00";

export const FOUNDATIONS: Programme = {
  slug: "foundations",
  name: "Foundations",
  tagline: "How Two Palms works with Claude.",
  status: "live",
  startsLabel: "Starts Mon 2 Nov",
  who: "Everyone. Sydney, Munich, Only Sports, Forward.",
  shape: "Eight sessions, one hour each, about a week apart. Homework in between. Two office hours.",
  phases: [
    { label: "Meet the junior", weeks: "Session 1", blurb: "What Claude is for at Two Palms, the house rules, and the one habit that changes everything: talk, don't type." },
    { label: "Onboard the junior", weeks: "Sessions 2 to 4", blurb: "Projects, Drive, Slack and Granola connected. Claude knows your clients the way you do." },
    { label: "Build your own tools", weeks: "Sessions 5 to 8", blurb: "The three questions: most time-consuming, most costly, most annoying. Then you build the fix." },
    { label: "The production line", weeks: "After", blurb: "Monthly check-ins, office hours, and the hub keeps growing." },
  ],
  sessions: [
    {
      number: 1,
      title: "Meet the junior",
      phase: "Phase 01",
      startsAt: `2026-11-02T17:30:00${SYD}`,
      durationMinutes: 60,
      status: "upcoming",
      meetUrl: null,
      homework: "Have a play before Monday. No homework. Just get curious: ask Claude what it can do for your job.",
      prompts: ["onboarding"],
    },
    { number: 2, title: null, phase: "Phase 02", startsAt: `2026-11-10T17:30:00${SYD}`, durationMinutes: 60, status: "upcoming", provisional: true },
    { number: 3, title: null, phase: "Phase 02", startsAt: `2026-11-17T17:30:00${SYD}`, durationMinutes: 60, status: "upcoming", provisional: true },
    { number: 4, title: null, phase: "Phase 02", startsAt: `2026-11-24T17:30:00${SYD}`, durationMinutes: 60, status: "upcoming", provisional: true },
    { number: 5, title: null, phase: "Phase 03", startsAt: `2026-12-01T17:30:00${SYD}`, durationMinutes: 60, status: "upcoming", provisional: true },
    { number: 6, title: null, phase: "Phase 03", startsAt: `2026-12-08T17:30:00${SYD}`, durationMinutes: 60, status: "upcoming", provisional: true },
    { number: 7, title: null, phase: "Phase 03", startsAt: `2026-12-15T17:30:00${SYD}`, durationMinutes: 60, status: "upcoming", provisional: true },
    { number: 8, title: null, phase: "Phase 03", startsAt: `2026-12-22T17:30:00${SYD}`, durationMinutes: 60, status: "upcoming", provisional: true },
  ],
  officeHours: [
    { label: "Office hours 01", startsAt: `2026-11-26T17:00:00${SYD}`, provisional: true },
    { label: "Office hours 02", startsAt: `2026-12-17T17:00:00${SYD}`, provisional: true },
  ],
};

export const CREATIVE: Programme = {
  slug: "creative",
  name: "Creative Programme",
  tagline: "AI production, the Two Palms way.",
  status: "coming_soon",
  startsLabel: "From late November",
  who: "Creatives first, then account and project managers, then management.",
  shape: "Session 1 for everyone. Creatives three to four sessions. Account and project managers one and a half. Management as needed.",
  phases: [
    { label: "Divergence", weeks: "First", blurb: "More ideas, faster. References, mood boards and storyboards from a brief." },
    { label: "Convergence", weeks: "Then", blurb: "Picking, refining and extending. Campaign extension over replacement." },
    { label: "Production", weeks: "Then", blurb: "Image and video models in the real pipeline, with a creative QA gate before anything leaves." },
    { label: "Running it", weeks: "After", blurb: "The team runs AI production with a creative director reviewing." },
  ],
  sessions: [],
  officeHours: [],
};

// ─── Prompt library ─────────────────────────────────────────────────────────────
export interface Prompt {
  id: string;
  tab: "Start here" | "Everyday" | "Moving work" | "Admin";
  title: string;
  when: string;
  body: string;
}

export const PROMPTS: Prompt[] = [
  {
    id: "onboarding",
    tab: "Start here",
    title: "Set up your new Claude account",
    when: "Your first chat in your Two Palms Claude account. About 10 minutes.",
    body: `I've just been given a Claude account at Two Palms Media, a social-led creative agency with offices in Sydney and Munich, plus Only Sports. Help me set it up properly for my job. I'm busy, so keep everything short and plain English, no jargon.

First, interview me. Ask one question at a time and wait for my answer:
1. My name, role and office
2. Which clients I work on
3. The 3 things I do every week that take the most time or annoy me most
4. Which tools I use day to day (Slack, Drive, Productive, Monday, Canva, Adobe, Notion, anything else)
5. How I like information given to me (short bullets, tables, a quick summary first, something else)
6. One thing I've already tried with AI that worked, and one that didn't

Then give me four things:
A. My personal preferences, written as a block I can paste into Settings > General > personal preferences. Include my role, my clients, how I like answers, and "keep it short unless I ask for more".
B. Which shared client projects I should ask my account lead to add me to, based on my clients.
C. One starter task I can do in the next 10 minutes, using one of my 3 time-wasters, so I see something useful today.
D. The Two Palms house rules, in 5 lines:
- Work stuff only in this Two Palms account, never a personal one
- Client work lives in that client's shared project; start a new chat whenever you like, Claude can find past chats and Drive
- Check the client's AI level before you start, and check every fact, name and number before anything leaves the building
- Passwords, bank details and anything a client has said not to share never go in
- Not sure? Ask Claude to check it against the Two Palms AI policy, then ask Micky

Don't put any client confidential details into my personal preferences.`,
  },
  {
    id: "three-questions",
    tab: "Start here",
    title: "Find the first thing to fix",
    when: "Once you're set up. Speak it, don't type it.",
    body: `I want to find the first part of my job to hand to you. Interview me, one question at a time:
1. What's the most time-consuming repetitive thing I do, daily, weekly or monthly?
2. What's the most costly, where money or outside people change hands?
3. What's the most annoying, even if it's quick?
Then pick the one you'd start with, explain why in two lines, and tell me what you need from me to do it. Don't build anything yet.`,
  },
  {
    id: "describe-the-problem",
    tab: "Everyday",
    title: "Describe the problem, not the solution",
    when: "Any task. Replace the brackets and talk it through.",
    body: `Here's a problem I have: [describe what happens today, in your own words, including why it's annoying]. The outcome I want: [what done looks like]. Figure out the best way to get there. Don't ask me how to do it. Ask me only if you hit something you can't get past. Then do it.`,
  },
  {
    id: "two-levels-up",
    tab: "Everyday",
    title: "Ask two levels above",
    when: "When the first answer is fine but small.",
    body: `Good. Now answer the same question as if you were two levels more senior than the person who asked it. What would they want to know, decide or avoid that I haven't asked about?`,
  },
  {
    id: "plan-first",
    tab: "Everyday",
    title: "Plan before you build",
    when: "Anything with more than three steps.",
    body: `Before you do anything, give me a plan: the steps, what you'll need from me, and where it could go wrong. Keep it under ten lines. Wait for my OK.`,
  },
  {
    id: "move-chat-1",
    tab: "Moving work",
    title: "1 · Hand over a chat worth keeping",
    when: "Paste into the ChatGPT or old Claude chat you want to bring across.",
    body: `I'm moving this work to another AI assistant. Write a handover brief of this whole conversation, in markdown, that someone with no context could pick up from. Include:
- The goal
- Decisions made, and anything we ruled out and why
- Where it's at now
- Any files, links or templates we used
- Open questions
- The very next step
Leave out small talk and anything that doesn't affect the work. Leave out passwords, bank details and personal information.`,
  },
  {
    id: "move-chat-2",
    tab: "Moving work",
    title: "2 · Pick it up in your Two Palms Claude",
    when: "New chat, inside the right client project.",
    body: `Here's a handover brief from work I started in another AI assistant. Read it, then tell me in 5 bullets what you understand. Check it against what's in this project and Drive, ask me anything that's missing, then let's carry on from the next step.

[paste the brief here]`,
  },
  {
    id: "move-chat-3",
    tab: "Moving work",
    title: "3 · What a personal account knows about your work",
    when: "Personal accounts only. Never the shared logins.",
    body: `I'm moving my work to a new company AI account. From your memory and our past chats, write me a short markdown summary of what you know about my work, so I can give it to my new assistant. Include:
- My role and what I actually do day to day
- The clients and projects I've worked on with you, one line each
- How I like answers given to me
- Any templates, processes or prompts we built that I reuse
- Anything unfinished worth picking up
Work stuff only. Leave out anything personal, health or money related, passwords, bank details, and anything a client asked to keep confidential. Keep it under one page.`,
  },
  {
    id: "policy-check",
    tab: "Everyday",
    title: "Check it against the policy",
    when: "Not sure if something's allowed.",
    body: `Before we go on: check what I'm about to do against the Two Palms AI policy. Tell me in two lines if it's green, amber or red, and what to change if it isn't green.`,
  },
];

// ─── Kit: the model board ───────────────────────────────────────────────────────
export interface ModelRow {
  job: string;
  pick: string;
  effort: string;
  note: string;
}

export const CLAUDE_BOARD: ModelRow[] = [
  { job: "Quick questions, rewrites, summaries", pick: "Claude Haiku 5.5", effort: "Low", note: "Fast. Fine for anything you'd check anyway." },
  { job: "Everyday work: drafts, reports, research, planning", pick: "Claude Sonnet 5.5", effort: "Medium", note: "The default. Most of the week lives here." },
  { job: "Hard problems, long documents, building tools", pick: "Claude Opus 5.5", effort: "High", note: "Slower, uses more of your allowance. Worth it when it matters." },
  { job: "Anything with more than three steps", pick: "Any, in planning mode first", effort: "Plan, then build", note: "Ask for the plan. Approve it. Then let it build." },
];

export const CREATIVE_BOARD: { lane: string; test: string; production: string; upscale: string; status: string }[] = [
  { lane: "Storyboards", test: "Claude + image model", production: "Locked house style (illustrated)", upscale: "n/a", status: "Being set up" },
  { lane: "Concepting and mood", test: "Claude + image model", production: "Flora canvas", upscale: "n/a", status: "From the Creative Programme" },
  { lane: "Images", test: "GPT Image via Claude", production: "Flora (model per job)", upscale: "Flora upscalers", status: "From the Creative Programme" },
  { lane: "Video", test: "MiniMax (keyframes first)", production: "MiniMax H3 Max in Flora, keyframe-anchored", upscale: "Topaz / Flora", status: "Creative director only for now" },
];

export const TOOL_REGISTER: { tool: string; status: "Approved" | "Testing" | "Not approved"; note: string }[] = [
  { tool: "Claude (Two Palms Team account)", status: "Approved", note: "Where all AI work happens." },
  { tool: "Granola (Two Palms account)", status: "Approved", note: "Meeting notes. Tell everyone in the meeting." },
  { tool: "AI inside Google Workspace, Canva, Adobe, Sprout", status: "Approved", note: "On Two Palms accounts." },
  { tool: "GPT Image (via a Two Palms connector)", status: "Testing", note: "Coming once the connector is built. Not for client material yet." },
  { tool: "Flora, MiniMax, Kling, Seedance", status: "Testing", note: "Creative Programme tools. Creative director use only until registered." },
  { tool: "Personal ChatGPT, Gemini or Claude accounts", status: "Not approved", note: "Shared ChatGPT logins switch off Fri 6 Nov." },
  { tool: "Higgsfield and other personal image tools", status: "Not approved", note: "Ask before client use." },
];

export const POLICY_ONE_PAGER = `TWO PALMS AI POLICY, THE SHORT VERSION

AI is part of how we work. Used well, it frees up time for the work only people do: ideas, craft, judgement and relationships. These rules keep us, and our clients, safe.

THE 10 RULES
1. Two Palms accounts only. All work happens in approved tools on your Two Palms account: Claude, Granola, the AI inside tools we already use, or a tool our Head of AI has approved for a job. Never a personal account.
2. You own what goes out. If your name or ours is on it, you've read it, checked it and you stand behind it.
3. Check every fact. Names, numbers, dates, quotes, stats and links. AI makes things up and sounds sure about it.
4. Protect what isn't ours. Only put in what the task needs (see the traffic lights).
5. Know the client's AI level before you start (below).
6. No fake people, no fake voices. Never create or change a real person's face, body or voice without their written consent.
7. No fake proof. Never invent reviews, comments, results or user content and present them as real.
8. Be open. Tell clients when AI plays a real part in their work, and label it for the public when people wouldn't otherwise know.
9. Freelancers play by the same rules, and declare their AI use with every deliverable.
10. Speak up fast. Something gone wrong? Tell Micky the same day. Honest mistakes reported quickly are fixable.

TRAFFIC LIGHTS
Green, go ahead: public info, your own drafts, general research, non-sensitive internal stuff.
Amber, Claude or Granola only, only what's needed, and only if the client's AI level allows it: client briefs, strategy, unreleased work, performance data, budgets, pitches, meeting notes, people's contact details.
Red, never: passwords and logins, bank and card details, tax file or ID numbers, health information, anything that identifies a child, anything a client has told us not to put into AI, one client's material in another client's work.
Not sure? Treat it as the next colour up, and ask.

CLIENT AI LEVELS (set by the account lead, recorded in the brief)
0 · No AI: no AI at any stage, including note-takers and drafting.
1 · Assist: AI helps us work. Anything AI drafted is rewritten and checked by a person before it reaches the client. No AI images, video, voice or music in final work.
2 · Create: AI-made images, video, voice or copy can appear in final work, with client approval and agreed labelling.
Don't know the level? Treat it as 1, and keep client information out of AI until the account lead confirms.

AGENTS AND AUTOMATIONS
Anything that runs on its own (scheduled tasks, Slack bots, reply assistants) can draft, sort and remind. A person sends, posts or approves.

NOT SURE?
Ask Claude to check it against the Two Palms AI policy. Then ask Micky. Full policy: in Drive, and inside Claude as a skill.`;

export const RULES = [
  { n: "01", t: "Two Palms accounts only", d: "Never a personal account for work." },
  { n: "02", t: "You own what goes out", d: "Read it, checked it, stand behind it." },
  { n: "03", t: "Check every fact", d: "Names, numbers, dates, quotes, links." },
  { n: "04", t: "Protect what isn't ours", d: "Only what the task needs. Traffic lights." },
  { n: "05", t: "Know the client's AI level", d: "0 none, 1 assist, 2 create. Unknown means 1." },
  { n: "06", t: "No fake people, no fake voices", d: "Written consent or it doesn't happen." },
  { n: "07", t: "No fake proof", d: "No invented reviews, comments or results." },
  { n: "08", t: "Be open", d: "Tell clients. Label it for the public." },
  { n: "09", t: "Freelancers, same rules", d: "And they declare AI use per deliverable." },
  { n: "10", t: "Speak up fast", d: "Tell Micky the same day." },
];

export const MENTAL_MODELS = [
  { t: "10 / 80 / 10", d: "Human brief, AI execution, human QA. The value lives in the two tens. Clients only ever see the middle." },
  { t: "Describe the problem, not the solution", d: "Tell it what's wrong and what done looks like. Let it find the route. If you describe your own fix, you get your own fix." },
  { t: "Speak, don't type", d: "Voice carries five times the context. Ums and tangents are fine. It works them out." },
  { t: "The three questions", d: "Most time-consuming. Most costly. Most annoying. Work through them in that order until the boring part of the job is gone." },
  { t: "Two levels up", d: "Take the answer and ask for it again as if someone two levels more senior had asked. Different question, better answer." },
  { t: "Plan, then build", d: "Anything with more than three steps: ask for the plan first. Approve it. Then let it run." },
  { t: "Figure it out", d: "\"Don't come back until it's done or you hit something you can't get past.\" Then go and do something else." },
  { t: "Same budget, ten times the content", d: "AI doesn't make the shoot cheaper. It makes the shoot go further. Faster and more means charge more, not less." },
  { t: "Don't tell them how the watch is made", d: "Show the work. Sell the way of working second." },
];

export const GLOSSARY: { term: string; d: string }[] = [
  { term: "Chat", d: "A single conversation. Start a new one whenever you like. Claude can look back at old ones." },
  { term: "Project", d: "A folder of chats with shared files and instructions. One per client. The thing that matters more than any chat." },
  { term: "Personal preferences", d: "A note Claude reads before every chat: who you are, how you like answers. Set once in Settings." },
  { term: "Skill", d: "A set of instructions Claude loads when a task calls for it. The AI policy is one. Shared across the whole team." },
  { term: "Connector", d: "A link from Claude to a tool you already use: Drive, Gmail, Calendar, Slack, Granola. Claude only sees what you can see." },
  { term: "Model", d: "The brain behind the chat. Haiku is fast, Sonnet is the default, Opus is the heavy one. See the model board." },
  { term: "Planning mode", d: "Ask Claude to think and plan before it builds. Use it for anything with more than three steps." },
  { term: "Context", d: "Everything Claude can see right now: your message, the project files, the chat so far. More context, better answer. Too much, slower." },
  { term: "Token", d: "A piece of a word. How usage is measured. You don't need to count them; just know long chats and big files use more." },
  { term: "Prompt", d: "What you say to it. The prompt library is a set of good ones to steal." },
  { term: "Hallucination", d: "When AI makes something up and sounds sure. Why rule three exists." },
  { term: "Agent", d: "Claude running on its own for a while: reading, deciding, doing steps. It can draft and remind. A person sends." },
  { term: "Claude Code", d: "Claude that works inside files and software rather than a chat window. For building tools. Not needed for Foundations." },
  { term: "MCP", d: "The plumbing standard connectors are built on. You'll hear it. You don't need to touch it." },
  { term: "API", d: "A way for one piece of software to talk to another. An API key is the password for that. Keys live with Micky, never in a chat." },
];

export const SETUP_STEPS = [
  { n: "01", t: "Accept the invite", d: "It's in your Two Palms inbox from Fri 30 Oct. Accept it on your Two Palms email.", who: "You", mins: "2" },
  { n: "02", t: "Run the onboarding prompt", d: "Open a new chat, paste the first prompt from the library, answer its questions one at a time.", who: "You", mins: "10" },
  { n: "03", t: "Paste your preferences", d: "Take the preferences block it gives you and paste it into Settings > General > Personal preferences.", who: "You", mins: "2" },
  { n: "04", t: "Join your client projects", d: "Ask your account lead to add you to the shared project for each client you work on.", who: "You + account lead", mins: "5" },
  { n: "05", t: "Sign in to your connectors", d: "Settings > Connectors: sign in to Drive, Gmail, Calendar, Slack and Granola. Claude only sees what you can see.", who: "You", mins: "5" },
  { n: "06", t: "Talk, don't type", d: "Turn on dictation (Mac: press the microphone key, or install a free dictation app). Say your next prompt out loud.", who: "You", mins: "3" },
  { n: "07", t: "Do one real thing", d: "Pick the starter task the onboarding prompt gave you. Ten minutes. See something useful today.", who: "You", mins: "10" },
  { n: "08", t: "Finish anything on the shared ChatGPT", d: "Shared logins switch off Fri 6 Nov. Anything worth keeping: use the Moving work prompts.", who: "You", mins: "varies" },
];

// ─── Backstage ──────────────────────────────────────────────────────────────────
export interface CheckItem {
  id: string;
  group: string;
  t: string;
  d?: string;
  owner: string;
  due?: string;
}

export const MICKY_CHECKLIST: CheckItem[] = [
  { id: "owner", group: "Claude Team", t: "Make Jem an Owner (Micky stays Primary Owner)", owner: "Micky", due: "Before invites" },
  { id: "policy-switches", group: "Claude Team", t: "Organization settings > Policy: turn on cloud code execution and file creation, Skills, and chat search", owner: "Micky", due: "Before invites" },
  { id: "connectors", group: "Claude Team", t: "Connectors for everyone: Google Drive, Gmail, Calendar, Slack, Granola", d: "Check the Google Workspace admin console allows Claude, or the Google ones won't sign in. Productive: park if not in the directory.", owner: "Jem + Micky", due: "Before invites" },
  { id: "policy-skill", group: "Claude Team", t: "Upload the AI policy skill (Plugins and skills > Upload)", owner: "Jem", due: "Before invites" },
  { id: "privacy", group: "Claude Team", t: "Walk through data and privacy settings together (export, retention, memory)", d: "Micky needs this for the policy's monitoring line.", owner: "Jem + Micky", due: "Before invites" },
  { id: "projects", group: "Claude Team", t: "One shared project per client, set up by the account lead, key Drive docs added", owner: "Account leads", due: "Week 1" },
  { id: "migrations", group: "Claude Team", t: "Power-user migrations: Sam and Ed bring their accounts in on their Two Palms email", d: "Skills don't move: download them first. Ed has two accounts on one email: check which holds the work.", owner: "Sam, Ed", due: "Week 1" },
  { id: "invites", group: "Claude Team", t: "Send the invites with the channel post", owner: "Micky", due: "Fri 30 Oct" },
  { id: "channel", group: "Slack", t: "Create the AI training channel; Jem's first post pinned", owner: "Micky", due: "Fri 30 Oct" },
  { id: "hub-password", group: "Slack", t: "Post the hub link and team password in the pinned post", owner: "Micky", due: "Fri 30 Oct" },
  { id: "openai", group: "Image generation", t: "OpenAI account, billing, monthly cap, one key in the password manager", d: "Don't paste the key anywhere yet. Jem builds the connector.", owner: "Micky", due: "Week 1" },
  { id: "chatgpt-off", group: "Switch-off", t: "Shared ChatGPT logins (Two Palms, Only Sports): switch-off date announced, passwords changed on the day", owner: "Micky", due: "Fri 6 Nov" },
  { id: "policy-drive", group: "Policy", t: "File the full AI policy and tool register in one small AI folder in Drive", owner: "Micky", due: "Week 1" },
  { id: "client-levels", group: "Policy", t: "Account leads set each client's AI level from the contract (Bank First and Prime Video first)", owner: "Account leads", due: "Before 2 Nov" },
  { id: "munich", group: "Policy", t: "GDPR line for Munich, checked with Sam", owner: "Micky + Sam", due: "Nov" },
  { id: "monitoring", group: "Policy", t: "Check workplace monitoring notice timing with the lawyer", owner: "Micky", due: "Nov" },
];

export const LEADERSHIP_CHECKLIST: CheckItem[] = [
  { id: "calendar", group: "Programme", t: "Confirm sessions 2 to 8 in the calendar (Tuesdays from 10 Nov, 5:30pm Sydney)", owner: "Ed + Allyssa", due: "This week" },
  { id: "meet-link", group: "Programme", t: "One recurring Meet link for every session, created from a Two Palms calendar so recordings land in Two Palms Drive", owner: "Allyssa", due: "Before 2 Nov" },
  { id: "roster", group: "Programme", t: "Roster: who's in, by entity", owner: "Micky", due: "Before 2 Nov" },
  { id: "big5", group: "Big 5", t: "Decide: Big 5 run as separate owner projects outside Foundations", owner: "Ed", due: "This week" },
  { id: "flora", group: "Creative", t: "Flora seats for the Creative Programme", owner: "Jem + Ed", due: "Nov" },
  { id: "storyboard", group: "Creative", t: "Approve Storyboard Studio for account managers and strategists", owner: "Ed + Ekala", due: "Before Bank First week of 2 Nov" },
];
