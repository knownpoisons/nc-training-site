// The Big 5: the five operations jobs, as leadership reads them in Backstage.
// This file is the source of truth for everything except ticks. After each Big 5 call, Claude
// updates this file (stage, now, next, to-dos, a new note, any new doc) and pushes; the page
// shows it on the next deploy. Ticks live in the database (tp_big5_todos), keyed by to-do id,
// so keep ids stable once published. Dates are only written when they are confirmed.
import { REPORTING_INTAKE, REPORTING_TRANSCRIPT, SCOPING_OPTIONS, SCOPING_TRANSCRIPT, TIMESHEETS_BRIEF } from "./big5-docs";

export const B5_STAGES = ["Intake", "Plan", "Build", "Test", "Live"] as const;
/** -1 = not started; 0..4 = the stage it is working through now. */
export type B5Stage = -1 | 0 | 1 | 2 | 3 | 4;

export interface B5Todo { id: string; stage: number; task: string; who: string; when: string; done?: boolean }
export interface B5Note {
  date: string; title: string; who: string;
  heard?: string[]; decided?: string[]; open?: string[];
  actions?: { task: string; who: string; when: string }[];
}
export interface B5Doc { id: string; title: string; date: string; line: string; body: string }
export interface B5Job {
  id: string; n: number; name: string; short: string;
  owner: string; with: string; tools: string; done_looks_like: string;
  stage: B5Stage; now: string;
  next: { what: string; who: string; when: string };
  todos: B5Todo[]; notes: B5Note[]; docs: B5Doc[];
}

const KICKOFF: B5Note = {
  date: "Wed 21 Oct", title: "Kickoff", who: "Ed, Micky, Allyssa, Fergus, Sam, Jem",
  heard: ["Big 5 confirmed, no sixth job.", "Owners named for each job (below each card)."],
  decided: ["Jem runs a 30 to 45 minute intake per job with its owners."],
};

export const BIG5: B5Job[] = [
  {
    id: "scoping", n: 1, name: "Scoping to flighting", short: "Scoping",
    owner: "Ed and Allyssa (AU), Sam (EU)", with: "Will (EU check)",
    tools: "Barry the Budget Builder in Claude, the master scoping sheet, rate cards, Xero. Productive until March.",
    done_looks_like: "Everyone who scopes uses Barry in Claude, from one live rate card. Every quote goes out as the branded Xero quote, with a Munich version to work out. A senior does the final check.",
    stage: 1,
    now: "Intake done. Barry is the base and Xero is the quote. The options are up: where Barry lives and what replaces Productive. Munich runs on Qonto and DATEV, not Xero, so the quote and finance side needs a Munich version too.",
    next: { what: "Read the options (Documents) and pick where Barry lives and what replaces Productive", who: "Ed, Sam", when: "Tue 10 Nov" },
    todos: [
      { id: "scoping-3", stage: 0, task: "Book the intake call", who: "Jem", when: "Thu 5 Nov", done: true },
      { id: "scoping-4", stage: 0, task: "Hold the intake call", who: "Sam, Ed, Jem", when: "Thu 5 Nov", done: true },
      { id: "scoping-11", stage: 0, task: "Send Jem times for your remaining Big 5 sessions", who: "Sam", when: "before Wed 11 Nov", done: true },
      { id: "scoping-2", stage: 0, task: "Fix the influencer markup formula in the master sheet (20% to 5%)", who: "Allyssa", when: "to confirm" },
      { id: "scoping-1", stage: 1, task: "Pick one quote template (branded Xero quote)", who: "Ed, Sam", when: "Thu 5 Nov", done: true },
      { id: "scoping-10", stage: 1, task: "Options: where Barry lives, and what replaces Productive", who: "Jem", when: "Thu 5 Nov", done: true },
      { id: "scoping-12", stage: 1, task: "Pick where Barry lives and what replaces Productive", who: "Ed, Sam", when: "Tue 10 Nov" },
      { id: "scoping-13", stage: 1, task: "Confirm whether Munich invoices from Xero or a German system", who: "Ed", when: "to confirm" },
      { id: "scoping-16", stage: 1, task: "Check which email Sam's Claude Console invite went to, so he can accept it", who: "Micky (Jem to ping)", when: "to confirm" },
      { id: "scoping-15", stage: 1, task: "Work out the Munich version of the quote and finance side (Qonto, DATEV). Not urgent, but don't build everything around Xero", who: "to confirm", when: "to confirm" },
      { id: "scoping-14", stage: 1, task: "Add any new tools (HubSpot, Harvest, a Xero connector) to the AI policy tool list", who: "Micky", when: "to confirm" },
      { id: "scoping-8", stage: 1, task: "Update the rate cards into one live source: per client, per role, AU and Germany", who: "Allyssa, Ed", when: "to confirm" },
      { id: "scoping-9", stage: 1, task: "Record 20 to 30 minutes on how you want to price from now on (Barry's context)", who: "Ed, Sam", when: "to confirm" },
      { id: "scoping-5", stage: 1, task: "Decide time-based or output-based pricing (its own session)", who: "Ed, Fergus, Jem", when: "to confirm" },
      { id: "scoping-6", stage: 2, task: "Build Barry into the Claude Team setup on the approved quote formats", who: "Jem", when: "to confirm" },
      { id: "scoping-7", stage: 3, task: "Run three real scopes through it with the owners", who: "Allyssa, Sam", when: "to confirm" },
    ],
    notes: [{
      date: "Wed 11 Nov", title: "Slack update", who: "Sam, Jem",
      heard: ["Sam sent times for his three remaining Big 5 sessions, all after he's back. His Claude Console invite hasn't reached his inbox yet."],
      decided: ["Booked: timesheets Tue 17 Nov and budgets and invoicing Thu 19 Nov, both 10:30 Munich time.", "Jem asked to move task management to Thu 19 Nov at 13:15 Munich, as Fri 20 is his day off."],
      open: ["Sam to confirm the task management time."],
      actions: [{ task: "Ping Micky about which email Sam's Console invite went to", who: "Jem", when: "to confirm" }],
    }, {
      date: "Thu 5 Nov", title: "Slack update", who: "Sam",
      heard: [
        "Australia runs everything through Xero. Munich banks with Qonto and uses DATEV for reconciliation.",
        "So the quote and finance side will always need a Munich and an Australian version. It doesn't need solving now; Sam wants it on the page so nothing gets built only around Xero.",
        "Sam is reading the options and will pick with Ed.",
      ],
      open: [
        "Sam is still working out times for the three sessions owed (timesheets, budgets and invoicing, task management). The booking link only shows him 1am to 6am Munich time. He's out from Wed 11 Nov and back the week after.",
        "Whether Munich's invoices themselves come from a German system is still to confirm.",
      ],
    }, {
      date: "Thu 5 Nov", title: "Intake", who: "Ed, Sam, Allyssa, Jem",
      heard: [
        "Ed built Barry in Claude after the resource manager left. Only Ed and Allyssa use it. It drafts the scope from the master sheet, rate cards and past scopes; Ed adjusts.",
        "Europe scopes on day rates plus a 10% production fee. Sam builds it, Will checks it.",
        "Quotes go out as Xero, Excel PDFs and emails, sometimes with columns left showing.",
        "Work slips through: Munich missed about $60K of invoicing last year and about $170K the year before.",
        "Rate cards haven't been updated since last year, and several clients have their own version.",
      ],
      decided: [
        "Default quote: a branded Xero quote with a summary and grouped lines (pre-production, production, post-production, hard costs). Full breakdown only when the client asks.",
        "Barry is the base. It only outputs approved formats and flags the right senior in Slack at a judgement call.",
        "The final gut check on price stays with a senior.",
        "Productive is not renewed in March (Ed).",
      ],
      open: ["Where Barry lives in Claude, and what replaces Productive. Options are in Documents."],
      actions: [
        { task: "Update the rate cards into one live source", who: "Allyssa, Ed", when: "to confirm" },
        { task: "Send times for the remaining Big 5 sessions", who: "Sam", when: "before Wed 11 Nov" },
        { task: "Pick from the options", who: "Ed, Sam", when: "Tue 10 Nov" },
      ],
    }, {
      ...KICKOFF,
      heard: ["Around 10 different quote styles went out in 4 weeks. Ed wants one standard.", "The influencer markup in the master scoping sheet is 20% because of a formula error. It was meant to be 5%.", "Around 70% of the business is retainer."],
      decided: ["Ed and Sam standardise the quote and define what should trigger automation.", "Time-based versus output-based pricing gets its own session."],
    }],
    docs: [
      { id: "options", title: "The options", date: "Thu 5 Nov", line: "Where Barry lives, the rate card, the quote, replacing Productive. One page.", body: SCOPING_OPTIONS },
      { id: "transcript", title: "Intake call transcript", date: "Thu 5 Nov", line: "The full call, for pasting into Claude.", body: SCOPING_TRANSCRIPT },
    ],
  },
  {
    id: "timesheets", n: 2, name: "Timesheets", short: "Timesheets",
    owner: "Micky (AU) and Sam (EU)", with: "Ed, Allyssa",
    tools: "Productive",
    done_looks_like: "Near-automatic entry with no chasing. People confirm a draft in about two minutes a day.",
    stage: 1,
    now: "Plan drafted after the intake with Micky. Six checks with Micky and one workshop lock it. Sam's Munich session is booked.",
    next: { what: "Timesheets session with Sam (Munich side)", who: "Sam, Jem (Ed, Allyssa welcome)", when: "Tue 17 Nov, 10:30 Munich" },
    todos: [
      { id: "timesheets-3", stage: 0, task: "Intake call with Micky", who: "Micky, Jem", when: "Thu 29 Oct", done: true },
      { id: "timesheets-4", stage: 0, task: "Write the plan as a brief for Micky", who: "Jem", when: "Thu 29 Oct", done: true },
      { id: "timesheets-5", stage: 1, task: "Answer the six checks in the brief (Productive plan, booking settings, works council, volunteers, long bookings, baseline)", who: "Micky", when: "to confirm" },
      { id: "timesheets-1", stage: 1, task: "Book and run the workshop", who: "Jem", when: "to confirm" },
      { id: "timesheets-6", stage: 1, task: "Get employment-law advice before the pilot (NSW notice, Munich works council)", who: "Micky", when: "to confirm" },
      { id: "timesheets-7", stage: 1, task: "Review Productive's own AI time-tracking agents", who: "Micky, Jem", when: "to confirm" },
      { id: "timesheets-10", stage: 1, task: "Timesheets session with Sam (Munich side)", who: "Sam, Jem", when: "Tue 17 Nov, 10:30 Munich" },
      { id: "timesheets-2", stage: 2, task: "Proof of concept: automate Jem's own Productive timesheet", who: "Jem", when: "to confirm" },
      { id: "timesheets-8", stage: 3, task: "4-week pilot with about 6 volunteers across both offices", who: "Micky, Sam", when: "to confirm" },
      { id: "timesheets-9", stage: 4, task: "Go or no-go at a capacity meeting before the January rollout", who: "Ed, Micky", when: "before January" },
    ],
    notes: [{
      date: "Wed 11 Nov", title: "Slack update", who: "Sam, Jem",
      decided: ["Timesheets session with Sam booked for Tue 17 Nov, 10:30 Munich time (8:30pm Sydney). Ed and Allyssa can join if they want."],
    }, {
      date: "Thu 29 Oct", title: "Intake: Timesheet chat", who: "Micky, Jem",
      heard: ["The problem is purpose and ownership, not the tool. Nobody visibly uses the data and nobody owns close-out.", "Productive's booking-based tracking turns timesheets into a copy of the plan, which hides over-servicing.", "Small rewards like half days off didn't stick."],
      decided: ["Phase 1: Claude drafts each person's timesheet privately every afternoon; they confirm by text or voice. Nothing submits on its own.", "Plus a weekly capacity brief and a monthly close-out.", "Phase 2 if it fails: only contractors and freelancers log time. Munich still has to record working time by law."],
      open: ["Which Productive plan Two Palms is on decides how it gets built."],
      actions: [{ task: "Answer the six checks", who: "Micky", when: "to confirm" }, { task: "Book the workshop", who: "Jem", when: "to confirm" }],
    }, { ...KICKOFF, heard: ["Micky owns timesheets in Australia for now, a future Group Account Director later. Sam owns Munich."] }],
    docs: [{ id: "brief", title: "Timesheets: the plan", date: "Thu 29 Oct", line: "The full brief: root causes, the system, the pilot, watch-outs.", body: TIMESHEETS_BRIEF }],
  },
  {
    id: "reporting", n: 3, name: "Retainer and project reporting", short: "Reporting",
    owner: "Stef (Stefanie Jung)", with: "Fergus (the client's voice)",
    tools: "Fergus's client portal (a password-protected dashboard built on a spreadsheet), Sprout Social for most clients, Zambrero's and Netflix's own platforms",
    done_looks_like: "Claude fills the portal's spreadsheet from every platform on its own, checks it, then pings the owner in Slack to approve. One locked template for every client.",
    stage: 0,
    now: "Intake call done. The portal already makes the reports look good; the job is getting the data into it without anyone touching it. Waiting on two things from Stef and Fergus.",
    next: { what: "Send Jem the list of every client with reports (who does the data, which platform, who has the logins) plus 2 or 3 current reports. Slack, email or drop it in Drive and say where", who: "Stef, Fergus", when: "Wed 11 Nov (Stef hoping)" },
    todos: [
      { id: "reporting-2", stage: 0, task: "Book the intake call", who: "Jem", when: "Thu 5 Nov", done: true },
      { id: "reporting-3", stage: 0, task: "Put the 20 intake questions in the invite", who: "Jem", when: "Wed 4 Nov", done: true },
      { id: "reporting-4", stage: 0, task: "Hold the intake call", who: "Stef, Fergus, Jem", when: "Thu 5 Nov", done: true },
      { id: "reporting-9", stage: 0, task: "List every client with reports: who handles the data now, which platform it comes from, who has the logins", who: "Stef", when: "Wed 11 Nov (Stef hoping)" },
      { id: "reporting-6", stage: 0, task: "Share 2 or 3 current reports (portal links and the spreadsheets behind them)", who: "Stef, Fergus", when: "to confirm" },
      { id: "reporting-10", stage: 0, task: "Each talk it through with your own Claude, using the call transcript: how could reporting go ten levels up, and what new paid services could it open?", who: "Stef, Fergus (separately)", when: "to confirm" },
      { id: "reporting-1", stage: 0, task: "Confirm Stef as owner", who: "Ed", when: "to confirm" },
      { id: "reporting-11", stage: 1, task: "Write the project plan and timeline", who: "Jem", when: "to confirm" },
      { id: "reporting-5", stage: 1, task: "Pick the test client (live, but not sent to the client)", who: "Stef, Fergus, Jem", when: "to confirm" },
      { id: "reporting-7", stage: 2, task: "Build the data feed: Claude fills the portal spreadsheet from Sprout, Zambrero's and Netflix's platforms", who: "Jem", when: "to confirm" },
      { id: "reporting-12", stage: 2, task: "Build the check before anything goes out (data and branding), then a Slack ping to the owner to approve", who: "Jem", when: "to confirm" },
      { id: "reporting-13", stage: 2, task: "Automate influencer data requests and reminders from the contracts in the client folders", who: "Jem", when: "to confirm" },
      { id: "reporting-8", stage: 3, task: "Sign off the automated version against the real one", who: "Stef, Fergus", when: "to confirm" },
      { id: "reporting-14", stage: 4, task: "Lock the template and roll it out to every reporting client", who: "Stef, Fergus", when: "to confirm" },
    ],
    notes: [{
      date: "Tue 10 Nov", title: "Slack update", who: "Stef",
      heard: ["Jem reminded Stef the call notes and transcript are in Backstage, and that the plan waits on the client list and 2 or 3 current reports."],
      actions: [{ task: "Send the client list and current reports", who: "Stef", when: "Wed 11 Nov (Stef hoping)" }],
    }, {
      date: "Thu 5 Nov", title: "Intake", who: "Stef, Fergus, Jem",
      heard: [
        "How often and how deep each report goes depends on the client's contract: weekly, monthly, quarterly or yearly. There's a baseline social and talent template deck.",
        "Most clients report from Sprout Social; Zambrero and Netflix use their own platforms. Some clients include paid as well as organic.",
        "Fergus built a client portal that turns a spreadsheet into a password-protected dashboard. It has run for 5 or 6 Zambrero campaigns, and Stef extended it for an integrated PR and social campaign. Clients love it and no end-of-campaign decks have been needed.",
        "The spreadsheet is filled by hand (now partly by dropping posts into Claude), so the numbers are only as current as the last entry, and gaps or mistakes slip through.",
        "Influencer results have no shared platform: managers email each influencer for their backend stats.",
      ],
      decided: [
        "Keep the portal as the front end. The job is moving the data: Claude fills the spreadsheet from each platform automatically. How it connects to each platform gets settled in the plan.",
        "A check runs before anything reaches the team, then the owner gets a Slack ping to approve. Nobody adds their own version of the report: leadership locks one template.",
        "Influencer data requests and reminders get sent automatically, based on the contracts in the client folders.",
        "Map the upgrades and paid add-ons first (more frequent reporting, next month's briefs built from the insights) so the build is planned with them in mind. The core can still be built first.",
        "Send things to Jem however is easiest: Slack, email, or drop it in Drive and say where.",
      ],
      open: [
        "Which client is the test.",
        "How Claude gets the data from each platform: logging in for us, or working from exports and connectors. Jem decides this in the plan, with security in mind.",
        "What the people who enter the data today do with the time they get back.",
        "Fergus wants a separate conversation on standardising operational documents (WIP docs, timelines, follow-up emails).",
      ],
      actions: [
        { task: "List every reporting client, who handles it, the platform and the logins", who: "Stef", when: "to confirm" },
        { task: "Share 2 or 3 current reports", who: "Stef, Fergus", when: "to confirm" },
        { task: "Talk the upgrades through with your own Claude, using the transcript", who: "Stef, Fergus", when: "to confirm" },
        { task: "Project plan, timeline and test client, once the above arrives", who: "Jem", when: "to confirm" },
      ],
    }, { ...KICKOFF, heard: ["Nobody owns reporting today. Ed proposed Stef, with Fergus as the client's voice."] }],
    docs: [
      { id: "transcript", title: "Intake call transcript", date: "Thu 5 Nov", line: "The full call, for pasting into Claude.", body: REPORTING_TRANSCRIPT },
      { id: "intake", title: "Intake questions", date: "Wed 4 Nov", line: "The 20 questions for the intake call.", body: REPORTING_INTAKE },
    ],
  },
  {
    id: "finance", n: 4, name: "Budgets, invoicing, recon", short: "Budgets and recon",
    owner: "Ed and Sam", with: "to confirm",
    tools: "Productive, Xero in Australia, Qonto and DATEV in Munich",
    done_looks_like: "To shape at intake.",
    stage: -1,
    now: "Not started. Finance tools are confirmed: Xero in Australia, Qonto and DATEV in Munich. The intake call is booked.",
    next: { what: "Intake call: budgets and invoicing. Ed and Allyssa especially welcome, as the rate card sits with them", who: "Sam, Jem (Ed, Allyssa)", when: "Thu 19 Nov, 10:30 Munich" },
    todos: [
      { id: "finance-1", stage: 0, task: "Confirm the finance tool", who: "Ed", when: "to confirm", done: true },
      { id: "finance-2", stage: 0, task: "Book the intake call", who: "Jem", when: "Wed 11 Nov", done: true },
      { id: "finance-3", stage: 0, task: "Hold the intake call", who: "Sam, Jem (Ed, Allyssa)", when: "Thu 19 Nov, 10:30 Munich" },
    ],
    notes: [{
      date: "Wed 11 Nov", title: "Slack update", who: "Sam, Jem",
      decided: ["Budgets and invoicing intake booked for Thu 19 Nov, 10:30 Munich time (8:30pm Sydney). Sam suggested Ed and Allyssa join this one, as the rate card sits with them."],
    }, {
      date: "Thu 5 Nov", title: "Slack update", who: "Sam",
      heard: ["Australia runs everything through Xero. Munich banks with Qonto and uses DATEV for reconciliation, so this job needs a Munich and an Australian version."],
      open: ["Sam needs to find a time for this intake. He's out from Wed 11 Nov and back the week after."],
    }, KICKOFF],
    docs: [],
  },
  {
    id: "tasks", n: 5, name: "Task management and client hygiene", short: "Tasks and hygiene",
    owner: "Nicky now, then the new Group Account Director", with: "Sam and Will (EU)",
    tools: "Slack client channels, monday.com for Zambrero, Sam's R&R docs",
    done_looks_like: "Claude reads email, Slack, Drive and Granola and puts each person's tasks into their daily briefing. No manual board updates.",
    stage: -1,
    now: "Not started. Intake time proposed, waiting on Sam.",
    next: { what: "Confirm the intake time (Jem proposed Thu 19 Nov, 13:15 Munich)", who: "Sam", when: "to confirm" },
    todos: [
      { id: "tasks-1", stage: 0, task: "Book the intake call", who: "Jem", when: "to confirm" },
      { id: "tasks-2", stage: 0, task: "Decide where a task lives: personal to-do or client board", who: "Nicky, Sam", when: "to confirm" },
    ],
    notes: [{
      date: "Wed 11 Nov", title: "Slack update", who: "Sam, Jem",
      heard: ["Sam offered Fri 20 Nov at 10:00 Munich for this intake."],
      decided: ["Fri 20 is Jem's day off, so he asked for Thu 19 Nov at 13:15 Munich instead."],
      open: ["Sam to confirm."],
    }, {
      date: "Thu 5 Nov", title: "From the reporting intake", who: "Fergus, Jem",
      heard: ["Fergus wants the next conversation to cover standardising the operational documents around account management: WIP documents, follow-up emails, project timelines. Granola should already help with follow-up notes."],
      open: ["Whether this sits inside job 5 or gets its own session with Fergus."],
    }, KICKOFF],
    docs: [],
  },
];

export const big5Job = (id: string) => BIG5.find((j) => j.id === id);
