// The Big 5: the five operations jobs, as leadership reads them in Backstage.
// This file is the source of truth for everything except ticks. After each Big 5 call, Claude
// updates this file (stage, now, next, to-dos, a new note, any new doc) and pushes; the page
// shows it on the next deploy. Ticks live in the database (tp_big5_todos), keyed by to-do id,
// so keep ids stable once published. Dates are only written when they are confirmed.
import { REPORTING_INTAKE, REPORTING_PLAN, REPORTING_TRANSCRIPT, SCOPING_OPTIONS, SCOPING_TRANSCRIPT, TIMESHEETS_BRIEF } from "./big5-docs";

/** When the quickfire summary was last checked. */
export const B5_UPDATED = "Fri 20 Nov";

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
  /** One short paragraph: what this job actually is, for someone landing on the page cold. */
  tldr: string;
  /** One or two sentences for the orange 'where we are' box. */
  quick: string;
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
    tldr: "Two Palms sends out quotes in about ten different shapes, and the numbers behind them live in a master spreadsheet with at least one formula error. This job picks one quote template and builds a Claude Skill that drafts a scope from a brief, asks a junior the questions they would otherwise miss, and knows which numbers need a senior sign-off. Done means a scope that looks the same whoever wrote it.",
    quick: "Intake done. One quote format agreed (the branded Xero quote) and Barry is the base. Where Barry lives and what replaces Productive gets decided by end of January, once timesheets land.",
    stage: 1,
    now: "Intake done. Barry is the base and Xero is the quote. The options are up: where Barry lives and what replaces Productive. Munich runs on Qonto and DATEV, not Xero, so the quote and finance side needs a Munich version too.",
    next: { what: "Scoping regroup: settle the rate card and the quote, and park Barry's home and Productive until timesheets land", who: "Ed, Sam, Jem", when: "to confirm" },
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
    tldr: "Timesheets are late, thin and nobody visibly uses them, so nobody fills them in well. This job has Claude draft each person's day from their calendar, Granola, Slack and Productive, then ask them to confirm in two minutes. Nothing submits on its own. A weekly capacity brief and a monthly close-out give the data a reader, which is the real fix.",
    quick: "Plan written with Micky; paused while she is away until Mon 23 Nov. Next: her six checks and one workshop to lock it, with legal advice before any pilot. Pilot early in the new year, go or no-go by end of January.",
    stage: 1,
    now: "Plan drafted after the intake with Micky. Micky now has Claude chasing timesheets for her; making them easier to fill in is her next step. Six checks with Micky and one workshop lock it. Sam's Munich session is booked. Micky is away until Mon 23 Nov, so the job is paused; she and Jem will go through timesheets at a catch-up next week. Fergus and Lucy have each built their own version of the plan (Claude drafts the timesheet, the person approves it), so Jem will talk to Lucy first to see if it changes the workshop.",
    next: { what: "Answer the six checks in the brief, then book the workshop", who: "Micky, Jem", when: "to confirm" },
    todos: [
      { id: "timesheets-3", stage: 0, task: "Intake call with Micky", who: "Micky, Jem", when: "Thu 29 Oct", done: true },
      { id: "timesheets-4", stage: 0, task: "Write the plan as a brief for Micky", who: "Jem", when: "Thu 29 Oct", done: true },
      { id: "timesheets-5", stage: 1, task: "Answer the six checks in the brief (Productive plan, booking settings, works council, volunteers, long bookings, baseline)", who: "Micky", when: "to confirm" },
      { id: "timesheets-1", stage: 1, task: "Book and run the workshop", who: "Jem", when: "to confirm" },
      { id: "timesheets-6", stage: 1, task: "Get employment-law advice before the pilot (NSW notice, Munich works council)", who: "Micky", when: "to confirm" },
      { id: "timesheets-7", stage: 1, task: "Review Productive's own AI time-tracking agents", who: "Micky, Jem", when: "to confirm" },
      { id: "timesheets-10", stage: 1, task: "Timesheets session with Sam (Munich side). Rebook: the 17 Nov slot didn't happen", who: "Sam, Jem", when: "to confirm" },
      { id: "timesheets-11", stage: 1, task: "Check the Claude settings let staff create their own skills (Lucy is blocked)", who: "to confirm", when: "to confirm" },
      { id: "timesheets-12", stage: 1, task: "Send Micky a time for next week's catch-up, with timesheets on the agenda", who: "Jem", when: "next week (Micky back Mon 23 Nov)" },
      { id: "timesheets-13", stage: 1, task: "Talk to Lucy about her timesheet setup and whether it changes the workshop and rollout", who: "Jem", when: "to confirm" },
      { id: "timesheets-14", stage: 1, task: "Bring Nicky in on timesheets (she used to sell an AI time-tracking product)", who: "to confirm", when: "to confirm" },
      { id: "timesheets-15", stage: 1, task: "Agree how to benchmark the AI change: admin time taken out, time moved to high-value work", who: "Fergus, Jem", when: "to confirm" },
      { id: "timesheets-2", stage: 2, task: "Proof of concept: automate Jem's own Productive timesheet", who: "Jem", when: "to confirm" },
      { id: "timesheets-8", stage: 3, task: "4-week pilot with about 6 volunteers across both offices", who: "Micky, Sam", when: "to confirm" },
      { id: "timesheets-9", stage: 4, task: "Go or no-go at a capacity meeting before the January rollout", who: "Ed, Micky", when: "before January" },
    ],
    notes: [{
      date: "Wed 18 Nov", title: "AI training (timesheets segment)", who: "Lucy, Jem",
      heard: [
        "At this week's AI training Lucy walked the team through her timesheet setup, as agreed on Slack.",
        "How she did it: she asked Claude to write the prompt for her, fixed what it got wrong (it missed some of what she wanted), did a trial run, then had it show a table to approve before anything goes into Productive. It took her a couple of hours, on and off.",
        "Jem told the team Micky, Lucy and Fergus have each tried automating their own timesheets, and that he and Micky are working on one Two Palms-wide version.",
      ],
      open: ["Whether Lucy's approve-a-table step becomes the standard for the team-wide version."],
    }, {
      date: "Wed 18 Nov", title: "Initiatives Connect", who: "Fergus, Ed, Stef, Jem",
      heard: [
        "Timesheet compliance is about 50%, and the data that does come in is probably not accurate.",
        "Fergus has his own setup: Claude reads his email, diary, Slack, Granola and Drive activity and gives him a draft timesheet. It doesn't push to Productive yet; that would be the next step.",
        "Lucy has automated her own timesheets (Stef raised it).",
        "Fergus and Ed discussed an effective rate card with the CFO as a KPI: profit per client and per project, and better capacity planning.",
        "Ed pointed out Nicky used to sell an AI time-tracking product, so she knows the pitfalls and the team's worries.",
      ],
      decided: [
        "Timesheets are paused while Micky is away; Jem picks it up with her on her return.",
        "Automation is there to help people, not to track or cut them.",
        "Whatever method is chosen has to be the same for everyone.",
      ],
      open: [
        "A leadership question: stop manual timesheets and have people approve a draft built from their activity, or go fully automatic and accept it won't be 100% right. Even 75% right would beat today.",
        "Whether Lucy's setup changes the workshop and the team-wide rollout.",
        "How to benchmark the AI change, e.g. more time on creative and strategy, less on admin, for next year's Best Place to Work entry.",
      ],
      actions: [
        { task: "Talk to Lucy about her timesheet setup", who: "Jem", when: "to confirm" },
        { task: "Pick timesheets back up with Micky", who: "Micky, Jem", when: "next week (Micky back Mon 23 Nov)" },
        { task: "Bring Nicky in on timesheets", who: "to confirm", when: "to confirm" },
        { task: "Agree how to benchmark the AI change", who: "Fergus, Jem", when: "to confirm" },
      ],
    }, {
      date: "Wed 18 Nov", title: "Slack update", who: "Lucy, Jem",
      heard: ["Lucy sent Jem her timesheet instructions: Claude builds a draft from her Calendar, Granola, Gmail, Slack and Productive bookings, matches each block to a client project, and shows her a table to OK before it logs anything in Productive. It lives in a Claude project for now, not a skill yet."],
      decided: ["Lucy agreed to walk the team through how she set it up at training."],
    }, {
      date: "Wed 18 Nov", title: "Update", who: "Jem",
      heard: ["The Munich session with Sam listed for Tue 17 Nov didn't happen: Sam was away. To rebook."],
    }, {
      date: "Tue 17 Nov", title: "Slack update", who: "Micky, Jem",
      heard: ["Micky said she still needs to dig into timesheets. She is out of the office from 3pm today and back Mon 23 Nov.", "Jem has heard Stef, and maybe one other person, are already trying to automate parts of it."],
      decided: ["Micky and Jem will go through timesheets together at a catch-up next week. Jem will send the time."],
      actions: [{ task: "Send Micky a time for next week's catch-up, with timesheets on the agenda", who: "Jem", when: "next week (Micky back Mon 23 Nov)" }],
    }, {
      date: "Mon 16 Nov", title: "Slack update", who: "Lucy",
      heard: ["In the #tpm_ai_training thread on Micky's timesheet setup, Lucy said she has been trying to set up her own timesheet and email-triage skills, but Claude tells her she is blocked, possibly by company settings. She asked Jem whether the team has permission to create skills yet."],
      open: ["Whether the Two Palms Claude settings let staff create their own skills. Until that is sorted, Micky's skill file can't be pasted in by others."],
      actions: [{ task: "Check the Two Palms Claude settings allow staff to create skills, and reply to Lucy", who: "to confirm", when: "to confirm" }],
    }, {
      date: "Thu 12 Nov", title: "Slack update", who: "Micky, Stef, Jem",
      heard: ["Micky has set Claude up to do the timesheet chasing for her, so she no longer chases people by hand. She shared it in #tpm_ai_training as a tick for her time problem."],
      decided: ["Her next step: make filling in timesheets easier, ideally fully automated.", "Later in the thread Stef asked for the same setup. Jem said Micky will package it as a skill file anyone can paste in."],
      open: ["How her chasing setup works, and whether it slots into the Phase 1 plan (private daily drafts) or the pilot."],
      actions: [{ task: "Package the timesheet-chasing setup as a skill file others can paste in", who: "Micky", when: "to confirm" }],
    }, {
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
    tools: "Sprout Social (Turo, Owala; Zambrero moving to it by end Nov), Sprinklr for Netflix (client's tool), Brandwatch for Zambrero until the move, Klear plus creator screenshots for talent. Fergus's spreadsheet-to-portal as the front end. Logins live in NordPass",
    done_looks_like: "Exports land in a Drive drop-zone, Claude turns them into one standard table, code does the maths, Claude writes the so-what, a check flags gaps, the owner approves in Slack, the portal renders it. One locked template. Nobody copies numbers.",
    tldr: "Every client report is built by hand: someone pulls numbers out of Sprout, Sprinklr or Brandwatch, pastes them into a spreadsheet, and the spreadsheet feeds Fergus's client portal. The portal is good. This job automates the pipe behind it: exports land in a drop-zone, Claude turns them into one standard table, code does the maths, Claude writes the so-what, a check flags gaps, the owner approves in Slack. One locked template, no knobs. First live report is Turo in December.",
    quick: "Stef's pack is in, so we're planning. One Sprout client (Turo), one monthly report, run beside the manual one and live 18 December. Netflix and talent follow in January.",
    stage: 1,
    now: "Stef's pack is in (client list, three reports, six level-up ideas). Pilot proposed: Turo, November's monthly report, built from a Sprout export and run beside Taryn's manual one. Live 18 Dec. Three inputs block the build: the raw Sprout export, the Sprout plan tier, Fergus's PR reports.",
    next: { what: "Send the raw Sprout export behind Turo October and confirm which Sprout plan Two Palms is on", who: "Stef", when: "to confirm" },
    todos: [
      { id: "reporting-2", stage: 0, task: "Book the intake call", who: "Jem", when: "Thu 5 Nov", done: true },
      { id: "reporting-3", stage: 0, task: "Put the 20 intake questions in the invite", who: "Jem", when: "Wed 4 Nov", done: true },
      { id: "reporting-4", stage: 0, task: "Hold the intake call", who: "Stef, Fergus, Jem", when: "Thu 5 Nov", done: true },
      { id: "reporting-9", stage: 0, task: "List every client with reports: who handles the data now, which platform it comes from, who has the logins", who: "Stef", when: "Tue 17 Nov", done: true },
      { id: "reporting-6", stage: 0, task: "Share 2 or 3 current reports (Turo October, OM SYSTEM talent wrap, Zambrero October portal)", who: "Stef", when: "Tue 17 Nov", done: true },
      { id: "reporting-10", stage: 0, task: "Level-up ideas from a Claude brainstorm off the transcript (Stef's six are in; Fergus's still to come)", who: "Stef done, Fergus to confirm", when: "to confirm" },
      { id: "reporting-15", stage: 0, task: "Read Stef's pack and reply with next steps", who: "Jem", when: "Wed 18 Nov", done: true },
      { id: "reporting-16", stage: 0, task: "Send Jem your 2 or 3 PR reports (Forward portal and the spreadsheets behind them)", who: "Fergus", when: "to confirm" },
      { id: "reporting-5", stage: 1, task: "Agree the pilot: Turo, November monthly report, Taryn as the AM, run beside the manual version, not sent to the client", who: "Stef, Fergus, Jem", when: "to confirm", done: false },
      { id: "reporting-17", stage: 1, task: "Send the raw Sprout export (CSV or XLSX) behind the Turo October report, plus the Zambrero monthly template", who: "Stef, Taryn", when: "to confirm" },
      { id: "reporting-18", stage: 1, task: "Confirm which Sprout plan Two Palms is on and whether the Xane account is switching (Advanced has an API; anything below means a human clicks Export)", who: "Stef", when: "to confirm" },
      { id: "reporting-19", stage: 1, task: "Write the one-page definition of live for 18 Dec, both of you sign it", who: "Jem writes, Stef and Fergus sign", when: "to confirm" },
      { id: "reporting-20", stage: 1, task: "Write the data model: what one post row looks like, and the sheet layout the portal reads", who: "Jem", when: "to confirm" },
      { id: "reporting-11", stage: 1, task: "Write the project plan and timeline from the pack (pilot now, Netflix and talent in January, product ideas to Ed)", who: "Jem", when: "to confirm" },
      { id: "reporting-21", stage: 1, task: "Tell Ed: level-up ideas 2 to 5 are a client-facing product, outside the signed scope unless he places it in Systems and Tools", who: "Jem", when: "to confirm" },
      { id: "reporting-22", stage: 1, task: "Move the Zambrero portal password out of the shared pack doc into NordPass with the rest", who: "Stef", when: "to confirm" },
      { id: "reporting-23", stage: 1, task: "Tell Taryn she is on the pilot and what a month looks like for her (export, drop, review the exception list)", who: "Stef", when: "to confirm" },
      { id: "reporting-7", stage: 2, task: "Build the pilot: drop-zone, Claude normalises the Sprout export into the standard table, code computes deltas and KPI status, Claude writes the so-what, the running top 3 and bottom 3 tracker accrues", who: "Jem", when: "to confirm" },
      { id: "reporting-12", stage: 2, task: "Build the check before anything goes out (missing posts, numbers against the source file, out-of-range values, branding), then the Slack ping to the owner", who: "Jem", when: "to confirm" },
      { id: "reporting-24", stage: 2, task: "Run Turo October through it as the dry run, compare against Taryn's October report", who: "Jem, Taryn", when: "to confirm" },
      { id: "reporting-25", stage: 3, task: "Turo November: export dropped, automated report built, Taryn's manual one built in parallel", who: "Taryn, Jem", when: "early Dec, to confirm" },
      { id: "reporting-8", stage: 3, task: "Sign off the automated version against the manual one: errors, hours saved, what the exception list caught", who: "Stef, Fergus", when: "by Fri 18 Dec" },
      { id: "reporting-26", stage: 3, task: "Run two more cycles in parallel before anything goes to a client", who: "Taryn, Stef", when: "Jan and Feb, to confirm" },
      { id: "reporting-27", stage: 4, task: "Netflix track: build on Shainah's weekly inputs doc, Sprinklr exports, four cadences", who: "Jem, Shainah", when: "January, to confirm" },
      { id: "reporting-13", stage: 4, task: "Talent track: Klear export plus a typed creator form, screenshots as evidence only; automate the creator data requests and reminders from the contracts", who: "Jem, talent team", when: "January, to confirm" },
      { id: "reporting-28", stage: 4, task: "Move the portal to a Two Palms domain with Workspace sign-in before any regulated client (Bank First) or Netflix goes near it", who: "Jem, Micky", when: "to confirm" },
      { id: "reporting-14", stage: 4, task: "Lock the template and roll it out client by client (Owala, Zambrero once on Sprout, then the rest)", who: "Stef, Fergus", when: "to confirm" },
    ],
    notes: [{
      date: "Mon 23 Nov", title: "Slack update", who: "Nicky, Stef",
      heard: [
        "Zambrero have sent a list of requests for their reporting dashboard. Stef is working through them with Claude.",
        "One of the requests: they want the total campaign budget on campaign reports (fees, production and paid), not just the paid amplification spend.",
      ],
      decided: [
        "Nicky: leave the total-budget request for now. Showing it live would mean connecting the finance tools, which is a much bigger job than Zambrero realise.",
      ],
      open: [
        "Whether total campaign budget belongs in the reporting build later. It touches the Finance job, so it is parked rather than dropped.",
      ],
    }, {
      date: "Wed 18 Nov", title: "Stef's pack, and the plan", who: "Stef, Jem",
      heard: [
        "Who reports on what: Netflix ANZ (Shainah; weekly, monthly, quarterly, yearly plus ad hoc; Sprinklr, the client's tool; the weekly is already part-drafted by Claude from an inputs doc). Zambrero always-on and campaigns (Gee for social, Fergus and Karri for PR; Brandwatch, likely moving to Sprout by end of November; the only portal client; paid is in scope; creator data comes in by email). Turo and Owala (Taryn; Sprout; monthly). Bank First (Gee; retainer from 1 Oct, no report yet, no access yet). Talent campaigns (Klear, the INT KPI tracker, creators emailing screenshots).",
        "Time: about 2 to 3 hours per social report per client per month. Talent about the same. Netflix roughly the same per report but there are many more of them.",
        "All client logins are in NordPass. Still open: what each SOW says versus what gets delivered. Zambrero's monthly reporting meeting is out of scope, for example.",
        "Stef's six level-up ideas: automate our own reporting; a live portal for social and talent with KPI progress; one integrated launch report including the client's own activity; a forward look (listening, trends, what to do next); a Two Palms Social Update newsletter per client; a running what-works tracker. She reckons four of the six are billable.",
      ],
      decided: [
        "Pilot is Turo: Sprout, monthly, Taryn, no regulator, and the report Stef called closest to the baseline. November's report, built from a Sprout export in the drop-zone, run beside Taryn's manual one. That is what live on 18 Dec means. To be confirmed by Stef and Fergus.",
        "The money is not in hours saved. At 2 to 3 hours a report it is a day or two a month across the clients. The money is in ideas 2 to 5, which are a product, not a report. They go to Ed before anyone prices them.",
        "Idea 6, the running what-works tracker, is free inside the pilot: the code keeps each month's top and bottom three.",
        "Netflix is track two, January, built on Shainah's inputs doc rather than from zero. Talent is January too: Klear export plus a typed creator form.",
        "Bank First stays out until the portal is on a Two Palms domain with proper sign-in.",
      ],
      open: [
        "Which Sprout plan Two Palms is on, and whether the Xane account switches. Decides whether the pilot can pull from the API or starts from a human export.",
        "Fergus's PR reports and his own level-up ideas.",
        "The pack has the Zambrero portal password in plain text. It needs to come out of the doc.",
      ],
      actions: [
        { task: "Raw Sprout export behind Turo October, plus the Zambrero monthly template", who: "Stef, Taryn", when: "to confirm" },
        { task: "Confirm the Sprout plan and the Xane account", who: "Stef", when: "to confirm" },
        { task: "PR reports", who: "Fergus", when: "to confirm" },
        { task: "Definition of live, data model, project plan", who: "Jem", when: "to confirm" },
        { task: "One line to Ed on the product ideas and scope", who: "Jem", when: "to confirm" },
      ],
    }, {
      date: "Tue 17 Nov", title: "Slack update", who: "Stef",
      heard: ["Stef sent Jem the reporting pack from the intake as a Claude page: the client list (who builds each report, which platform, who holds the logins), three current reports, and her first pass at the level-up ideas. She asked what the next steps are."],
      decided: ["The client list and current reports are in, so the plan can be written."],
      open: ["Fergus's own level-up ideas have not come in yet."],
    }, {
      date: "Tue 10 Nov", title: "Slack update", who: "Stef",
      heard: ["Jem reminded Stef the call notes and transcript are in Backstage, and that the plan waits on the client list and 2 or 3 current reports."],
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
        "Keep the portal as the front end. The job is moving the data: the spreadsheet fills itself from each platform, nobody copies numbers.",
        "How it connects (settled after the call, 5 Nov): not by Claude logging into Sprout or the other platforms with stored logins. No vendor supports it, 2FA breaks it, and it would put client logins inside a bot. Instead: exports land in a Drive drop-zone per client, Claude turns them into one standard table, code does the maths, Claude writes the so-what. Paid connectors start snapshotting Meta, IG and TikTok now, because TikTok only keeps about 60 days of history.",
        "First live report by 18 Dec: one Sprout-based client, one monthly report, run alongside the manual version for three cycles. Not Zambrero, Netflix or Bank First.",
        "A check runs before anything reaches the team, then the owner gets a Slack ping to approve. Nobody adds their own version of the report: leadership locks one template.",
        "Influencer data requests and reminders get sent automatically, based on the contracts in the client folders.",
        "Map the upgrades and paid add-ons first (more frequent reporting, next month's briefs built from the insights) so the build is planned with them in mind. The core can still be built first.",
      ],
      open: [
        "What the people who enter the data today do with the time they get back.",
        "Fergus wants a separate conversation on standardising operational documents (WIP docs, timelines, follow-up emails).",
      ],
    }, { ...KICKOFF, heard: ["Nobody owns reporting today. Ed proposed Stef, with Fergus as the client's voice."] }],
    docs: [
      { id: "plan", title: "The plan, v1", date: "Wed 18 Nov", line: "Pilot, tracks, what live means, who does what. One page.", body: REPORTING_PLAN },
      { id: "transcript", title: "Intake call transcript", date: "Thu 5 Nov", line: "The full call, for pasting into Claude.", body: REPORTING_TRANSCRIPT },
      { id: "intake", title: "Intake questions", date: "Wed 4 Nov", line: "The 20 questions for the intake call.", body: REPORTING_INTAKE },
    ],
  },
  {
    id: "finance", n: 4, name: "Budgets, invoicing, recon", short: "Budgets and recon",
    owner: "Ed and Sam", with: "to confirm",
    tools: "Productive, Xero in Australia, Qonto and DATEV in Munich",
    done_looks_like: "To shape at intake.",
    tldr: "Budgets, invoicing and reconciliation run across Productive and a finance tool still to be confirmed. This job starts with an intake with Ed and Sam to map how money moves from a signed scope to a paid invoice, where it goes wrong, and which steps a system can own. Nothing is scoped until the finance tool is named.",
    quick: "Not started: Sam co-owns it and was away. The intake gets rebooked with Sam, Ed and Allyssa, built for Xero in Australia and Qonto and DATEV in Munich from day one.",
    stage: -1,
    now: "Not started. Sam co-owns this and was away, so the intake didn't happen. Finance tools are confirmed: Xero in Australia, Qonto and DATEV in Munich.",
    next: { what: "Rebook the intake call. Ed and Allyssa especially welcome, as the rate card sits with them", who: "Sam, Jem", when: "to confirm" },
    todos: [
      { id: "finance-1", stage: 0, task: "Confirm the finance tool", who: "Ed", when: "to confirm", done: true },
      { id: "finance-2", stage: 0, task: "Book the intake call", who: "Jem", when: "Wed 11 Nov", done: true },
      { id: "finance-3", stage: 0, task: "Hold the intake call", who: "Sam, Jem (Ed, Allyssa)", when: "to confirm" },
    ],
    notes: [{
      date: "Wed 18 Nov", title: "Update", who: "Jem",
      heard: ["The intake listed for Thu 19 Nov wasn't booked: Sam was away. To rebook."],
    }, {
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
    tldr: "Tasks live in people's heads, Slack threads and the odd board, and client hygiene slips when nobody is watching. This job has Claude read email, Slack, Drive and Granola and put each person's tasks into their daily briefing, so nobody updates a board by hand. It starts with an intake with Nicky and Sam on where a task should live.",
    quick: "Not started: Sam was away and the owner is changing. Munich intake with Sam and Will first; Australia starts in the new GAD's first week in December, with Fergus's WIP and follow-up standards folded in.",
    stage: -1,
    now: "Not started. Sam was away and the owner is changing: Nicky finishes 24 Nov and the new Group Account Director starts in December. Munich goes first with Sam and Will; Australia starts with the new GAD.",
    next: { what: "Book the Munich intake", who: "Sam, Jem", when: "to confirm" },
    todos: [
      { id: "tasks-1", stage: 0, task: "Book the intake call", who: "Jem", when: "to confirm" },
      { id: "tasks-2", stage: 0, task: "Decide where a task lives: personal to-do or client board", who: "Nicky, Sam", when: "to confirm" },
    ],
    notes: [{
      date: "Thu 19 Nov", title: "Slack update", who: "Stef",
      heard: ["Stef has set Claude up to run her post-WIP steps on its own once a client WIP wraps: a client follow-up email with tasks split into ours and theirs, an internal WIP summary with actions posted to the client's Slack channel, and an update to the WIP tracker (that last one still being tested)."],
      open: ["Whether Stef's setup is the starting point for the WIP and follow-up part of this job."],
    }, {
      date: "Wed 18 Nov", title: "Update", who: "Jem",
      heard: ["No intake was booked while Sam was away. Munich first with Sam and Will; Australia in the new GAD's first week in December."],
    }, {
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
