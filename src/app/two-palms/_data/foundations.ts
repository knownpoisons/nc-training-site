// ═══════════════════════════════════════════════════════════════════════════════
// AI FOUNDATIONS: typed access to foundations-hub-content.json.
//
// The JSON is the source of truth for every word of session copy. To update the
// hub, paste a new foundations-hub-content.json over the old one and push: the
// overview, the session pages, the schedule, the form and the countdowns all
// follow. Nothing in here hard-codes session copy.
//
// Team side vs presenter side: `ros`, `slides` and `notes` are presenter-only.
// The team view (`teamSession`) strips them; `presenterFor` only returns them
// when the caller has already checked the Backstage password server-side.
// `programme.big5_note` and `open_items` are never rendered on the team side.
// ═══════════════════════════════════════════════════════════════════════════════

import raw from "./foundations-hub-content.json";

export type HomeworkType = "submit" | "do" | "share";
export interface Homework { type: HomeworkType | string; text: string; short?: string; cta?: { label: string; href: string } }
/** After a session has run: the past-tense wrap shown on its page. */
export interface RecapItem { t: string; d: string }
export interface Recap {
  goal: string;
  agenda: string[];
  big_idea?: { head: string; body: string[] };
  framework?: { head: string; intro: string; split: { n: string; who: string; d: string }[]; twist: string };
  remember?: RecapItem[];
  hints?: RecapItem[];
}

export interface FSession {
  n: number;
  key: string;
  name: string;
  phase: string;
  when: { date: string; start_iso: string; duration_min: number; local: { sydney: string; munich: string; phuket?: string } };
  line: string;
  goal: string;
  cover: string[];
  homework: Homework[];
  slack: string;
  slides: string[];
  ros: [string, string][];
  notes: string;
  number: string;
  label: string;
  status: string;
  recording_url: string | null;
  cheat_sheet: string | null;
  wrap_notes: string | null;
  recap?: Recap;
  meet_url?: string | null;
  /** Something to play or open with this session (Session 2: Green Light). */
  play?: Play;
}

export interface Play { href: string; title: string; line: string; img: string }

export interface FQuestion {
  id: string;
  q: string;
  type: "choice" | "text";
  options?: string[];
  optional?: boolean;
}

export interface FoundationsContent {
  programme: {
    name: string;
    hub_name: string;
    through_line: string;
    summary: string;
    outcomes: string[];
    phases: { name: string; sessions: number[] }[];
    slot: string;
    timezones: string[];
    rules_of_engagement: string[];
    every_session: string[];
    big5_note?: string;
    meet_url?: string | null;
    every_session_short?: string[];
  };
  pre_brief: {
    label: string;
    date: string;
    start_iso: string;
    duration_min: number;
    where: string;
    local: Record<string, string>;
    line: string;
    cover: string[];
    munich_note: string;
  };
  office_hours: { n: number; label: string; date: string; duration_min: number; format: string }[];
  sessions: FSession[];
  forms: {
    time_money_pain: {
      label: string;
      opens: string;
      due: string;
      reask: string;
      storage: string;
      intro: string;
      questions: FQuestion[];
    };
  };
  pages_to_add: { approved_tools: { label: string; empty_state: string; fields: string[] } };
  open_items: string[];
}

export const FC = raw as unknown as FoundationsContent;

// ─── Fixed gates (dates the team side unlocks on) ───────────────────────────────
/** Time · Money · Pain opens at the end of Session 1. */
export const TMP_OPENS_ISO = "2026-11-02T18:30:00+11:00";
/** Approved team-built tools opens at the end of Session 6. */
export const TOOLS_OPENS_ISO = "2026-12-08T18:30:00+11:00";

export function tmpIsOpen(now: Date, isAdmin = false): boolean {
  return isAdmin || now.getTime() >= new Date(TMP_OPENS_ISO).getTime();
}
export function toolsAreOpen(now: Date): boolean {
  return now.getTime() >= new Date(TOOLS_OPENS_ISO).getTime();
}

// ─── Time ───────────────────────────────────────────────────────────────────────
export const TZ = { sydney: "Australia/Sydney", munich: "Europe/Berlin" } as const;

/** "5:30pm" for an ISO instant in the given zone. */
export function clock(iso: string, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(new Date(iso));
  const h = parts.find((p) => p.type === "hour")?.value ?? "";
  const m = parts.find((p) => p.type === "minute")?.value ?? "";
  const ap = (parts.find((p) => p.type === "dayPeriod")?.value ?? "").toLowerCase();
  return `${h}:${m}${ap}`;
}

/** "Mon 2 Nov" for an ISO instant in the given zone. */
export function dayLabel(iso: string, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).formatToParts(new Date(iso));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("weekday")} ${g("day")} ${g("month")}`;
}

export interface TwoZones { sydney: string; munich: string; sydneyDay: string; munichDay: string }
export function twoZones(iso: string): TwoZones {
  return { sydney: clock(iso, TZ.sydney), munich: clock(iso, TZ.munich), sydneyDay: dayLabel(iso, TZ.sydney), munichDay: dayLabel(iso, TZ.munich) };
}

// ─── Sessions ───────────────────────────────────────────────────────────────────
export const SESSIONS: FSession[] = FC.sessions;

export function sessionByParam(p: string): FSession | null {
  if (/^\d+$/.test(p)) return SESSIONS.find((s) => s.n === Number(p)) ?? null;
  return SESSIONS.find((s) => s.key === p.toLowerCase()) ?? null;
}
export const sessionHref = (s: { n: number }) => `/two-palms/foundations/${s.n}`;
/** "Shift" from "SHIFT". */
export const sessionTitle = (s: { name: string }) => s.name.charAt(0) + s.name.slice(1).toLowerCase();

/** The fields the team sees. Presenter fields are not in this object at all. */
export interface TeamSession {
  n: number; key: string; number: string; label: string; title: string; phase: string;
  date: string; start_iso: string; duration_min: number;
  line: string; goal: string; cover: string[]; homework: Homework[]; slack: string; status: string;
  recording_url: string | null; cheat_sheet: string | null; wrap_notes: string | null;
  recap: Recap | null; end_ms: number; play: Play | null;
}
export function teamSession(s: FSession): TeamSession {
  return {
    n: s.n, key: s.key, number: s.number, label: s.label, title: sessionTitle(s), phase: s.phase,
    date: s.when.date, start_iso: s.when.start_iso, duration_min: s.when.duration_min,
    line: s.line, goal: s.goal, cover: s.cover, homework: s.homework, slack: s.slack, status: s.status,
    recording_url: s.recording_url, cheat_sheet: s.cheat_sheet, wrap_notes: s.wrap_notes,
    recap: s.recap ?? null, play: s.play ?? null, end_ms: new Date(s.when.start_iso).getTime() + s.when.duration_min * 60000,
  };
}

export interface PresenterContent { ros: [string, string][]; slides: string[]; notes: string }
/** Presenter content, or null unless the Backstage password has been checked. */
export function presenterFor(s: FSession, isAdmin: boolean): PresenterContent | null {
  if (!isAdmin) return null;
  return { ros: s.ros, slides: s.slides, notes: s.notes };
}

export function phaseNumber(name: string): number {
  return FC.programme.phases.findIndex((p) => p.name === name) + 1;
}

// ─── The schedule: pre-brief, eight sessions, two office hours ──────────────────
export interface ScheduleEvent {
  id: string;
  kind: "prebrief" | "session" | "office";
  tag: string; // "Pre", "S01", "OH1"
  title: string;
  line: string;
  start_iso: string | null; // null = to confirm
  duration_min: number;
  dateLabel: string;
  href: string | null;
  note?: string;
  toConfirm: boolean;
}

export function scheduleEvents(): ScheduleEvent[] {
  const pb = FC.pre_brief;
  const pre: ScheduleEvent = {
    id: "prebrief", kind: "prebrief", tag: "Pre", title: "Pre-brief", line: pb.line,
    start_iso: pb.start_iso, duration_min: pb.duration_min, dateLabel: pb.date.replace(/ \d{4}$/, ""),
    href: "/two-palms/foundations#pre-brief", note: pb.munich_note, toConfirm: false,
  };
  const sess: ScheduleEvent[] = SESSIONS.map((s) => ({
    id: `s${s.n}`, kind: "session", tag: `S${s.number}`, title: `Session ${s.n}: ${sessionTitle(s)}`, line: s.line,
    start_iso: s.when.start_iso, duration_min: s.when.duration_min, dateLabel: s.when.date.replace(/ \d{4}$/, ""),
    href: sessionHref(s), toConfirm: false,
  }));
  const oh: ScheduleEvent[] = FC.office_hours.map((o) => ({
    id: `oh${o.n}`, kind: "office", tag: `OH${o.n}`, title: o.label, line: o.format,
    start_iso: null, duration_min: o.duration_min, dateLabel: o.date.replace(/\s*\(to confirm\)/i, ""),
    href: null, toConfirm: true,
  }));
  // Office hours have no firm time yet; place them by their rough date ("around Thu 26 Nov").
  const approx = (e: ScheduleEvent): number => {
    if (e.start_iso) return new Date(e.start_iso).getTime();
    const m = e.dateLabel.match(/(\d{1,2}) (Nov|Dec)/);
    return m ? new Date(`2026-${m[2] === "Nov" ? "11" : "12"}-${m[1].padStart(2, "0")}T12:00:00+11:00`).getTime() : Infinity;
  };
  return [pre, ...sess, ...oh].map((e, i) => ({ e, i, t: approx(e) })).sort((a, b) => a.t - b.t || a.i - b.i).map((x) => x.e);
}

/** The next dated event that hasn't finished yet (live counts as next). */
export function nextEvent(now: Date, events = scheduleEvents()): ScheduleEvent | null {
  const t = now.getTime();
  return events.find((e) => e.start_iso && new Date(e.start_iso).getTime() + e.duration_min * 60000 > t) ?? null;
}

/** A plain, serialisable version for client countdowns. */
export interface CountEvent { title: string; short: string; start_iso: string; duration_min: number; href: string | null }
export function countEvents(): CountEvent[] {
  return scheduleEvents().filter((e) => e.start_iso).map((e) => ({
    title: e.title, short: e.kind === "prebrief" ? "Pre-brief" : `Session ${e.title.match(/^Session (\d+)/)?.[1] ?? ""}`,
    start_iso: e.start_iso!, duration_min: e.duration_min, href: e.href,
  }));
}
