// The Big 5: the five operations jobs, as leadership reads them in Backstage.
// This file is the source of truth for everything except ticks. After each Big 5 call, Claude
// updates this file (stage, now, next, to-dos, a new note, any new doc) and pushes; the page
// shows it on the next deploy. Ticks live in the database (tp_big5_todos), keyed by to-do id,
// so keep ids stable once published. Dates are only written when they are confirmed.
import { REPORTING_INTAKE, TIMESHEETS_BRIEF } from "./big5-docs";

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
    owner: "Allyssa (AU) and Sam (EU)", with: "Ed",
    tools: "Barry the Budget Builder in Claude, the master scoping spreadsheet, Productive",
    done_looks_like: "One quote template, plus a Claude Skill that drafts scopes and asks juniors the questions they miss, with approval thresholds built in.",
    stage: 0,
    now: "Intake call Thursday 16:30 Phuket with Sam and Ed.",
    next: { what: "Intake call: walk through how a scope gets built today", who: "Sam, Ed, Jem", when: "Thu 5 Nov" },
    todos: [
      { id: "scoping-3", stage: 0, task: "Book the intake call", who: "Jem", when: "Thu 5 Nov", done: true },
      { id: "scoping-4", stage: 0, task: "Hold the intake call", who: "Sam, Ed, Jem", when: "Thu 5 Nov" },
      { id: "scoping-2", stage: 0, task: "Fix the influencer markup formula in the master sheet (20% to 5%)", who: "Allyssa", when: "to confirm" },
      { id: "scoping-1", stage: 1, task: "Pick one quote template", who: "Ed, Sam", when: "to confirm" },
      { id: "scoping-5", stage: 1, task: "Decide time-based or output-based pricing (its own session)", who: "Ed, Fergus, Jem", when: "to confirm" },
      { id: "scoping-6", stage: 2, task: "Build the scoping Skill on the chosen template", who: "Jem", when: "to confirm" },
      { id: "scoping-7", stage: 3, task: "Run three real scopes through it with the owners", who: "Allyssa, Sam", when: "to confirm" },
    ],
    notes: [{
      ...KICKOFF,
      heard: ["Around 10 different quote styles went out in 4 weeks. Ed wants one standard.", "The influencer markup in the master scoping sheet is 20% because of a formula error. It was meant to be 5%.", "Around 70% of the business is retainer."],
      decided: ["Ed and Sam standardise the quote and define what should trigger automation.", "Time-based versus output-based pricing gets its own session."],
    }],
    docs: [],
  },
  {
    id: "timesheets", n: 2, name: "Timesheets", short: "Timesheets",
    owner: "Micky (AU) and Sam (EU)", with: "Ed, Allyssa",
    tools: "Productive",
    done_looks_like: "Near-automatic entry with no chasing. People confirm a draft in about two minutes a day.",
    stage: 1,
    now: "Plan drafted after the intake with Micky. Six checks with Micky and one workshop lock it.",
    next: { what: "Workshop: agree the short service list, who owns close-out, and the pilot thresholds", who: "Ed, Micky, Allyssa, Sam, Jem", when: "to confirm" },
    todos: [
      { id: "timesheets-3", stage: 0, task: "Intake call with Micky", who: "Micky, Jem", when: "Thu 29 Oct", done: true },
      { id: "timesheets-4", stage: 0, task: "Write the plan as a brief for Micky", who: "Jem", when: "Thu 29 Oct", done: true },
      { id: "timesheets-5", stage: 1, task: "Answer the six checks in the brief (Productive plan, booking settings, works council, volunteers, long bookings, baseline)", who: "Micky", when: "to confirm" },
      { id: "timesheets-1", stage: 1, task: "Book and run the workshop", who: "Jem", when: "to confirm" },
      { id: "timesheets-6", stage: 1, task: "Get employment-law advice before the pilot (NSW notice, Munich works council)", who: "Micky", when: "to confirm" },
      { id: "timesheets-7", stage: 1, task: "Review Productive's own AI time-tracking agents", who: "Micky, Jem", when: "to confirm" },
      { id: "timesheets-2", stage: 2, task: "Proof of concept: automate Jem's own Productive timesheet", who: "Jem", when: "to confirm" },
      { id: "timesheets-8", stage: 3, task: "4-week pilot with about 6 volunteers across both offices", who: "Micky, Sam", when: "to confirm" },
      { id: "timesheets-9", stage: 4, task: "Go or no-go at a capacity meeting before the January rollout", who: "Ed, Micky", when: "before January" },
    ],
    notes: [{
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
    tools: "Nothing standard today",
    done_looks_like: "Designed once, then a consistent report at the press of a button.",
    stage: 0,
    now: "Intake call Thursday 11:30 Phuket with Stef and Fergus. The 20 questions are in the invite.",
    next: { what: "Intake call: pick the one report to automate first", who: "Stef, Fergus, Jem", when: "Thu 5 Nov" },
    todos: [
      { id: "reporting-2", stage: 0, task: "Book the intake call", who: "Jem", when: "Thu 5 Nov", done: true },
      { id: "reporting-3", stage: 0, task: "Put the 20 intake questions in the invite", who: "Jem", when: "Wed 4 Nov", done: true },
      { id: "reporting-4", stage: 0, task: "Hold the intake call", who: "Stef, Fergus, Jem", when: "Thu 5 Nov" },
      { id: "reporting-1", stage: 0, task: "Confirm Stef as owner", who: "Ed", when: "to confirm" },
      { id: "reporting-5", stage: 1, task: "Pick one client and one report as the pilot", who: "Stef", when: "to confirm" },
      { id: "reporting-6", stage: 1, task: "Send the last 2 or 3 versions of it plus the raw data behind one", who: "Stef", when: "to confirm" },
      { id: "reporting-7", stage: 2, task: "Build the first automated version", who: "Jem", when: "to confirm" },
      { id: "reporting-8", stage: 3, task: "Sign off the automated version against the real one", who: "Stef, Fergus", when: "to confirm" },
    ],
    notes: [{ ...KICKOFF, heard: ["Nobody owns reporting today. Ed proposed Stef, with Fergus as the client's voice."] }],
    docs: [{ id: "intake", title: "Intake questions", date: "Wed 4 Nov", line: "The 20 questions for the intake call.", body: REPORTING_INTAKE }],
  },
  {
    id: "finance", n: 4, name: "Budgets, invoicing, recon", short: "Budgets and recon",
    owner: "Ed and Sam", with: "to confirm",
    tools: "Productive plus a finance tool (Xero, to confirm)",
    done_looks_like: "To shape at intake.",
    stage: -1,
    now: "Not started. Waiting on which finance tool Two Palms uses.",
    next: { what: "Confirm the finance tool", who: "Ed", when: "to confirm" },
    todos: [
      { id: "finance-1", stage: 0, task: "Confirm the finance tool", who: "Ed", when: "to confirm" },
      { id: "finance-2", stage: 0, task: "Book the intake call", who: "Jem", when: "to confirm" },
    ],
    notes: [KICKOFF],
    docs: [],
  },
  {
    id: "tasks", n: 5, name: "Task management and client hygiene", short: "Tasks and hygiene",
    owner: "Nicky now, then the new Group Account Director", with: "Sam and Will (EU)",
    tools: "Slack client channels, monday.com for Zambrero, Sam's R&R docs",
    done_looks_like: "Claude reads email, Slack, Drive and Granola and puts each person's tasks into their daily briefing. No manual board updates.",
    stage: -1,
    now: "Not started.",
    next: { what: "Book the intake call", who: "Jem", when: "to confirm" },
    todos: [
      { id: "tasks-1", stage: 0, task: "Book the intake call", who: "Jem", when: "to confirm" },
      { id: "tasks-2", stage: 0, task: "Decide where a task lives: personal to-do or client board", who: "Nicky, Sam", when: "to confirm" },
    ],
    notes: [KICKOFF],
    docs: [],
  },
];

export const big5Job = (id: string) => BIG5.find((j) => j.id === id);
