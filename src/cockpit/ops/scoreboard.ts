// ═══════════════════════════════════════════════════════════════════════════════
// F6 — FRIDAY SCOREBOARD + HONESTY REPORT. COMPUTED, never generated.
//
// Numbers first, one sentence of read, no cheerleading. Per engine
// (partner/outbound/alumni/list/press) and per track (A agencies / B brand
// teams). Day-90 gate countdown with the current track leader. The honesty line
// uses REAL conversion once ≥20 touches have been sent; before that it says so.
// ═══════════════════════════════════════════════════════════════════════════════

import { compareDays, diffDays, type Day } from "../cadence/dates";
import type { SourceEngine, Track } from "../cadence/types";
import type { EventType } from "../store/types";

export interface SbTouch {
  prospectId: string;
  dueDate: Day;
  sentAt: Day | null;
  skippedCount?: number;
}
export interface SbEvent {
  prospectId: string;
  type: EventType;
  at: Day; // date-only
}
export interface SbProspect {
  id: string;
  name?: string;
  sourceEngine: SourceEngine;
  track: Track | null;
}

export interface ScoreboardInput {
  weekStart: Day;
  weekEnd: Day;
  today: Day;
  programStart: Day; // day-90 gate anchor
  touches: SbTouch[]; // ALL touches (filtered by week inside)
  events: SbEvent[]; // ALL events
  prospects: SbProspect[];
  minTouchesForRealData?: number; // default 20
}

export interface EngineRow {
  sent: number;
  replies: number;
  calls: number;
}
export interface TrackRow extends EngineRow {
  closes: number;
}

export interface Scoreboard {
  sent: number;
  due: number;
  completion: number; // sent / due, 0..1
  replies: number;
  replyRate: number; // replies / sent, 0..1
  callsBooked: number;
  closes: number;
  perEngine: Record<SourceEngine, EngineRow>;
  perTrack: Record<"A" | "B", TrackRow>;
  day90DaysRemaining: number;
  trackLeader: "A" | "B" | "tie";
  allTimeSent: number;
  usingRealData: boolean;
  honestyLine: string;
  /** Prospects with a touch skipped twice running — named on Fridays (F3 rule). */
  flagged: string[];
}

const ENGINES: SourceEngine[] = ["partner", "outbound", "alumni", "list", "press"];

function inWeek(day: Day, start: Day, end: Day): boolean {
  return compareDays(day, start) >= 0 && compareDays(day, end) <= 0;
}

export function computeScoreboard(input: ScoreboardInput): Scoreboard {
  const { weekStart, weekEnd, today, programStart, touches, events, prospects } = input;
  const minReal = input.minTouchesForRealData ?? 20;
  const byId = new Map(prospects.map((p) => [p.id, p]));

  const sentThisWeek = touches.filter((t) => t.sentAt && inWeek(t.sentAt, weekStart, weekEnd));
  const dueThisWeek = touches.filter((t) => inWeek(t.dueDate, weekStart, weekEnd));
  const weekEvents = events.filter((e) => inWeek(e.at, weekStart, weekEnd));

  const sent = sentThisWeek.length;
  const due = dueThisWeek.length;
  const replies = weekEvents.filter((e) => e.type === "reply").length;
  const callsBooked = weekEvents.filter((e) => e.type === "call_booked").length;
  const closes = weekEvents.filter((e) => e.type === "closed_won").length;

  // per engine
  const perEngine = Object.fromEntries(
    ENGINES.map((e) => [e, { sent: 0, replies: 0, calls: 0 }])
  ) as Record<SourceEngine, EngineRow>;
  for (const t of sentThisWeek) {
    const p = byId.get(t.prospectId);
    if (p) perEngine[p.sourceEngine].sent += 1;
  }
  for (const e of weekEvents) {
    const p = byId.get(e.prospectId);
    if (!p) continue;
    if (e.type === "reply") perEngine[p.sourceEngine].replies += 1;
    if (e.type === "call_booked") perEngine[p.sourceEngine].calls += 1;
  }

  // per track
  const perTrack: Record<"A" | "B", TrackRow> = {
    A: { sent: 0, replies: 0, calls: 0, closes: 0 },
    B: { sent: 0, replies: 0, calls: 0, closes: 0 },
  };
  const bump = (track: Track | null, field: keyof TrackRow) => {
    if (track === "A" || track === "B") perTrack[track][field] += 1;
  };
  for (const t of sentThisWeek) bump(byId.get(t.prospectId)?.track ?? null, "sent");
  for (const e of weekEvents) {
    const track = byId.get(e.prospectId)?.track ?? null;
    if (e.type === "reply") bump(track, "replies");
    if (e.type === "call_booked") bump(track, "calls");
    if (e.type === "closed_won") bump(track, "closes");
  }

  // day-90 gate
  const day90DaysRemaining = 90 - diffDays(programStart, today);

  // track leader: closes, then calls, then replies
  const trackLeader = leaderOf(perTrack.A, perTrack.B);

  // honesty
  const allTimeSent = touches.filter((t) => t.sentAt).length;
  const usingRealData = allTimeSent >= minReal;

  // Two consecutive skips on the same prospect → named plainly, no daily nagging.
  const flaggedIds = new Set(
    touches.filter((t) => !t.sentAt && (t.skippedCount ?? 0) >= 2).map((t) => t.prospectId)
  );
  const flagged = [...flaggedIds].map((id) => byId.get(id)?.name ?? id);
  const replyRate = sent > 0 ? replies / sent : 0;
  const completion = due > 0 ? sent / due : 0;

  const honestyLine = usingRealData
    ? `Reply rate ${pct(replyRate)} on ${sent} sent this week; ${callsBooked} call${
        callsBooked === 1 ? "" : "s"
      } booked. Real conversion data (${allTimeSent} touches logged).`
    : `Too early for real conversion — ${allTimeSent}/${minReal} touches sent. Running on plan assumptions until then.`;

  return {
    sent,
    due,
    completion,
    replies,
    replyRate,
    callsBooked,
    closes,
    perEngine,
    perTrack,
    day90DaysRemaining,
    trackLeader,
    allTimeSent,
    usingRealData,
    honestyLine,
    flagged,
  };
}

function leaderOf(a: TrackRow, b: TrackRow): "A" | "B" | "tie" {
  for (const k of ["closes", "calls", "replies", "sent"] as const) {
    if (a[k] !== b[k]) return a[k] > b[k] ? "A" : "B";
  }
  return "tie";
}

function pct(x: number): string {
  return `${Math.round(x * 100)}%`;
}

export function renderScoreboard(s: Scoreboard, weekLabel: string): string {
  const lines: string[] = [];
  lines.push(`*Friday scoreboard · ${weekLabel}*`);
  lines.push(
    `Sent ${s.sent}/${s.due} (${pct(s.completion)})  ·  Replies ${s.replies}  ·  ` +
      `Calls ${s.callsBooked}  ·  Closes ${s.closes}`
  );
  lines.push("");
  lines.push("*By track*");
  lines.push(
    `A (agencies): sent ${s.perTrack.A.sent}, replies ${s.perTrack.A.replies}, calls ${s.perTrack.A.calls}, closes ${s.perTrack.A.closes}`
  );
  lines.push(
    `B (brand): sent ${s.perTrack.B.sent}, replies ${s.perTrack.B.replies}, calls ${s.perTrack.B.calls}, closes ${s.perTrack.B.closes}`
  );
  lines.push("");
  const leaderText = s.trackLeader === "tie" ? "level" : `Track ${s.trackLeader} leads`;
  lines.push(`*Day-90 gate:* ${s.day90DaysRemaining} days left — ${leaderText}.`);
  if (s.flagged.length) {
    lines.push(`*Avoided twice:* ${s.flagged.join(", ")} — skip or send, but decide.`);
  }
  lines.push(s.honestyLine);
  return lines.join("\n");
}
