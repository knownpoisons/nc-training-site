// ═══════════════════════════════════════════════════════════════════════════════
// 14-DAY SIMULATION — Gate 1's dry run.
//
// Seed 12 fake prospects across two weeks at 6/week, build every prospect's
// touch schedule, run the load balancer, and return the settled schedule plus a
// day-by-day printout. The Gate 1 test asserts: every touch present, no day over
// the cap of 8, nothing landing on a weekend.
// ═══════════════════════════════════════════════════════════════════════════════

import { addDays, compareDays, isWeekend, shiftWeekendToMonday, type Day } from "./dates";
import { scheduleForProspect, TOTAL_TOUCHES } from "./cadence";
import { balance, DAILY_CAP, loadByDay } from "./loadBalancer";
import type { Prospect, Touch } from "./types";

export interface SimResult {
  prospects: Prospect[];
  scheduled: Touch[]; // after load balancing
  totalTouches: number;
  printout: string;
  maxPerDay: number;
  weekendTouches: number;
}

/**
 * Deterministic seeding: 6 prospects a week, added on weekdays, for two weeks.
 * Within a week the adds fall Mon, Tue, Wed, Wed, Thu, Fri (a believable "Jem
 * adds one or two a day" pattern) — 6 per week, 12 total.
 */
const WEEK_OFFSETS = [0, 1, 2, 2, 3, 4]; // Mon,Tue,Wed,Wed,Thu,Fri

export function seedProspects(startMonday: Day): Prospect[] {
  const prospects: Prospect[] = [];
  let n = 0;
  for (const week of [0, 1]) {
    const weekStart = addDays(startMonday, week * 7);
    for (const off of WEEK_OFFSETS) {
      n += 1;
      const addedAt = shiftWeekendToMonday(addDays(weekStart, off));
      prospects.push({ id: `P${String(n).padStart(2, "0")}`, addedAt, stage: "IN_SEQUENCE" });
    }
  }
  return prospects;
}

export function runSimulation(startMonday: Day = "2026-01-05"): SimResult {
  const prospects = seedProspects(startMonday);

  // Build every prospect's raw schedule, then balance the whole set together.
  const raw: Touch[] = prospects.flatMap((p) => scheduleForProspect(p.id, p.addedAt));
  const addedAt = new Map(prospects.map((p) => [p.id, p.addedAt]));
  const scheduled = balance(raw, addedAt);

  const counts = loadByDay(scheduled);
  const maxPerDay = Math.max(...counts.values());
  const weekendTouches = scheduled.filter((t) => isWeekend(t.dueDate)).length;

  return {
    prospects,
    scheduled,
    totalTouches: scheduled.length,
    printout: renderSchedule(prospects, scheduled),
    maxPerDay,
    weekendTouches,
  };
}

/** Human-readable day-by-day schedule for eyeball review. */
export function renderSchedule(prospects: Prospect[], touches: Touch[]): string {
  const dows = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const byDay = new Map<Day, Touch[]>();
  for (const t of touches) {
    const list = byDay.get(t.dueDate);
    if (list) list.push(t);
    else byDay.set(t.dueDate, [t]);
  }
  const days = [...byDay.keys()].sort(compareDays);

  const lines: string[] = [];
  lines.push("── 14-DAY SIMULATION · day-by-day schedule ──────────────────────");
  lines.push(`Prospects: ${prospects.length}  ·  Touches: ${touches.length}  ·  Daily cap: ${DAILY_CAP}`);
  lines.push("");
  for (const day of days) {
    const list = byDay.get(day)!.sort((a, b) =>
      a.prospectId < b.prospectId ? -1 : a.prospectId > b.prospectId ? 1 : a.touchNumber - b.touchNumber
    );
    const w = new Date(`${day}T00:00:00Z`).getUTCDay();
    const tag = list.length >= DAILY_CAP ? `  [${list.length}/${DAILY_CAP}]` : "";
    const cells = list.map((t) => `${t.prospectId}·t${t.touchNumber}`).join("  ");
    lines.push(`${day} ${dows[w]}  (${String(list.length).padStart(2)})${tag}  ${cells}`);
  }
  lines.push("");
  lines.push(
    `Totals: ${touches.length} touches expected ${prospects.length * TOTAL_TOUCHES} ` +
      `(${prospects.length} × ${TOTAL_TOUCHES})`
  );
  return lines.join("\n");
}
