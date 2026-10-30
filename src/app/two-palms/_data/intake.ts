// ═══════════════════════════════════════════════════════════════════════════════
// TWO PALMS AI FOUNDATIONS: pre-programme intake (v2, 30 Oct 2026)
// One source of truth for the form, the database columns and the CSV export.
// Answers are for Jem only: they are never shown in the hub or in Backstage.
// ═══════════════════════════════════════════════════════════════════════════════

export type GridRow = { col: string; label: string };

export type IntakeQ =
  | { id: string; kind: "text"; col: string; q: string; sub?: string; placeholder?: string; optional?: boolean }
  | { id: string; kind: "long"; col: string; q: string; sub?: string; placeholder?: string; optional?: boolean }
  | { id: string; kind: "pills"; col: string; q: string; sub?: string; options: string[]; other?: { option: string; col: string; placeholder: string }; why?: { col: string; placeholder: string }; optional?: boolean }
  | { id: string; kind: "multi"; col: string; q: string; sub?: string; options: string[]; other?: { option: string; col: string; placeholder: string }; optional?: boolean }
  | { id: string; kind: "scale"; col: string; q: string; sub?: string; low: string; high: string; optional?: boolean }
  | { id: string; kind: "grid"; q: string; sub?: string; rows: GridRow[]; options: string[]; numeric?: boolean; optional?: boolean };

export const HOURS = ["0", "Under 1 hr", "1 to 3 hrs", "3 to 5 hrs", "5+ hrs"];

export const INTAKE_QS: IntakeQ[] = [
  // Part 1: you and your work
  { id: "name", kind: "text", col: "name", q: "First, your name.", sub: "Only Jem sees your answers. Nobody at Two Palms sees them with your name on.", placeholder: "First and last" },
  {
    id: "role", kind: "pills", col: "role", q: "Which best describes your role?",
    options: ["Account / client services", "Strategy", "Creative (design, copy, art direction)", "Content, social and community", "Production, video and editing", "Project management / operations", "Finance / admin", "Leadership", "Other"],
    other: { option: "Other", col: "role_other", placeholder: "Your role" },
  },
  { id: "week", kind: "long", col: "week", q: "What do you actually spend your week doing?", sub: "In two sentences. Not your job title: the work.", placeholder: "Most of my week goes on…" },
  { id: "based", kind: "pills", col: "based", q: "Where are you based?", options: ["Sydney", "Munich", "Elsewhere"], other: { option: "Elsewhere", col: "based_other", placeholder: "City" } },

  // Part 2: where your time goes (the baseline)
  {
    id: "hours", kind: "grid", q: "Roughly how many hours a week go on each of these?", sub: "Best guess is fine. We'll ask again after Session 8.",
    options: HOURS,
    rows: [
      { col: "h_email_slack", label: "Email and Slack messages" },
      { col: "h_meetings", label: "Meetings and writing up notes" },
      { col: "h_scoping", label: "Scoping, briefs and quotes" },
      { col: "h_pm", label: "Project and task management" },
      { col: "h_timesheets", label: "Timesheets" },
      { col: "h_reporting", label: "Client reporting" },
      { col: "h_budgets", label: "Budgets, invoicing and reconciliation" },
      { col: "h_research", label: "Research and finding information" },
      { col: "h_decks", label: "Decks and presentations" },
      { col: "h_writing", label: "Writing (posts, captions, copy, documents)" },
    ],
  },
  { id: "never_again", kind: "long", col: "never_again", q: "The one task you'd happily never do again.", sub: "The repetitive job that eats the most time and adds the least value. What is it, and roughly how long does it take you each week?", placeholder: "Every Friday I…" },
  { id: "interruptions", kind: "pills", col: "interruptions", q: "How often do you get pulled off your work to answer questions or find things for other people?", options: ["Rarely", "A few times a week", "A few times a day", "Constantly"] },
  { id: "success", kind: "long", col: "success", q: "By Session 8, what would have to be different about your week for this to have been worth it?", placeholder: "If I could…" },

  // Part 3: you and AI today
  {
    id: "ai_stage", kind: "pills", col: "ai_stage", q: "Where are you with AI right now?",
    options: ["I've barely used it. I know it exists.", "I've tried ChatGPT, Claude or Gemini a bit, mostly for personal things.", "I use it for work most weeks.", "I use it every day and have my own ways of working with it.", "I'm the person others come to with AI questions."],
  },
  { id: "ai_freq", kind: "pills", col: "ai_freq", q: "How often do you use AI for work?", options: ["Never", "Less than once a week", "A few times a week", "Every day", "Most of my day"] },
  {
    id: "tools", kind: "multi", col: "tools", q: "Which have you actually used for work?", sub: "On something real, not just a try. Pick all that apply.",
    options: ["Claude", "ChatGPT", "Gemini (in Google Workspace)", "Microsoft Copilot", "Granola", "Voice dictation (Wispr Flow, Superwhisper…)", "Figma AI", "Adobe Firefly / Photoshop AI", "CapCut AI", "Canva AI", "Notion AI", "Other", "None yet"],
    other: { option: "Other", col: "tools_other", placeholder: "Which others?" },
  },
  {
    id: "confidence", kind: "grid", numeric: true, q: "How confident are you at each of these?", sub: "1 is not at all. 5 is very.",
    options: ["1", "2", "3", "4", "5"],
    rows: [
      { col: "c_prompt", label: "Writing a good request (a prompt)" },
      { col: "c_check", label: "Checking whether an answer is right" },
      { col: "c_docs", label: "Using AI on a document, spreadsheet or PDF" },
      { col: "c_workspace", label: "Using AI with your email, calendar or Drive" },
      { col: "c_client_data", label: "Knowing what's OK to put into AI from a client" },
    ],
  },
  { id: "ai_fail", kind: "long", col: "ai_fail", optional: true, q: "The last time AI didn't work for you.", sub: "What were you trying to do, and what went wrong? Skip if nothing comes to mind.", placeholder: "I asked it to…" },
  { id: "ai_win", kind: "long", col: "ai_win", optional: true, q: "The last time AI really helped.", sub: "What did you do, and what came out of it? Even something small.", placeholder: "I used it to…" },
  { id: "feeling", kind: "pills", col: "feeling", q: "How do you feel about AI and your work, honestly?", options: ["Worried", "Sceptical", "Curious", "Excited", "Already all in"], why: { col: "feeling_why", placeholder: "Anything behind that? (optional)" } },
  { id: "rules_clarity", kind: "scale", col: "rules_clarity", q: "How clear are you on what you can and can't use AI for at Two Palms?", low: "No idea", high: "Completely clear" },

  // Part 4: set-up and logistics
  { id: "claude_account", kind: "pills", col: "claude_account", q: "Your Claude account.", options: ["It's set up and I've used it", "I've got the invite but haven't set it up", "I haven't seen an invite yet", "Not sure"] },
  { id: "device", kind: "pills", col: "device", q: "What do you mostly work on?", options: ["Mac", "Windows PC", "Both", "Mostly phone or tablet"] },
  { id: "install", kind: "pills", col: "can_install", q: "Can you install apps on your work computer?", options: ["Yes", "Some restrictions", "No", "Not sure"] },
  { id: "anything_else", kind: "long", col: "anything_else", optional: true, q: "Anything else Jem should know?", sub: "Concerns, hopes, a project you'd love to bring, how you learn best, or anything that would make the sessions easier (captions, timing, anything).", placeholder: "Optional" },
];

/** Every database column the form writes, in question order: the CSV header. */
export const INTAKE_COLUMNS: string[] = INTAKE_QS.flatMap((q) => {
  if (q.kind === "grid") return q.rows.map((r) => r.col);
  const cols = [q.col];
  if ((q.kind === "pills" || q.kind === "multi") && q.other) cols.push(q.other.col);
  if (q.kind === "pills" && q.why) cols.push(q.why.col);
  return cols;
});

export const INTAKE_INT_COLUMNS = new Set<string>(["rules_clarity", ...((INTAKE_QS.find((q) => q.id === "confidence") as Extract<IntakeQ, { kind: "grid" }>).rows.map((r) => r.col))]);
export const INTAKE_ARRAY_COLUMNS = new Set<string>(["tools"]);
