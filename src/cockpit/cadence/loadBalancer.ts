// ═══════════════════════════════════════════════════════════════════════════════
// LOAD BALANCER — never let a day carry more than 8 touches.
//
// Rule (handoff F1/F3): daily load cap is 8. When a day is overloaded, the
// earliest-added prospect keeps its slot and the overflow rolls forward one day
// (re-shifted off weekends), where it is re-checked. Nothing is ever dropped.
//
// Pure function: give it every scheduled touch and a map of prospect → added day;
// it returns the same touches with adjusted due_dates so no day exceeds the cap.
// ═══════════════════════════════════════════════════════════════════════════════

import { addDays, compareDays, shiftWeekendToMonday, type Day } from "./dates";
import type { Touch } from "./types";

export const DAILY_CAP = 8;

/** Priority for keeping a slot on an overloaded day: earliest-added wins. */
function makePriority(addedAt: Map<string, Day>) {
  return (a: Touch, b: Touch): number => {
    const aa = addedAt.get(a.prospectId) ?? "9999-12-31";
    const bb = addedAt.get(b.prospectId) ?? "9999-12-31";
    // 1) earliest-added prospect first
    const byAdded = compareDays(aa, bb);
    if (byAdded !== 0) return byAdded;
    // 2) earlier touch number first (a prospect's own touches stay ordered)
    if (a.touchNumber !== b.touchNumber) return a.touchNumber - b.touchNumber;
    // 3) stable, deterministic tiebreak
    return a.prospectId < b.prospectId ? -1 : a.prospectId > b.prospectId ? 1 : 0;
  };
}

/**
 * Balance a set of touches so no calendar day holds more than DAILY_CAP.
 * Only unsent, un-halted touches are movable; sent/halted touches are left as-is
 * but still counted against the cap for the day they occupy.
 */
export function balance(
  touches: Touch[],
  addedAt: Map<string, Day>,
  cap: number = DAILY_CAP
): Touch[] {
  const priority = makePriority(addedAt);

  // Bucket touches by day. We move the movable ones; fixed ones stay put.
  const byDay = new Map<Day, Touch[]>();
  const push = (day: Day, t: Touch) => {
    const list = byDay.get(day);
    if (list) list.push(t);
    else byDay.set(day, [t]);
  };
  for (const t of touches) push(t.dueDate, { ...t });

  // Process days in ascending order. Overflow only ever moves forward, so a
  // single forward sweep settles every day. New future days are folded in as
  // we go (re-sorting keeps the already-processed prefix intact).
  let days = [...byDay.keys()].sort(compareDays);
  let i = 0;
  while (i < days.length) {
    const day = days[i];
    const list = byDay.get(day)!;
    if (list.length > cap) {
      // Fixed touches (already sent/halted) can't move — they hold their slots.
      const fixed = list.filter((t) => t.sentAt || t.halted);
      const movable = list.filter((t) => !t.sentAt && !t.halted).sort(priority);

      const keepMovable = Math.max(0, cap - fixed.length);
      const stay = movable.slice(0, keepMovable);
      const overflow = movable.slice(keepMovable);

      byDay.set(day, [...fixed, ...stay]);

      const nextDay = shiftWeekendToMonday(addDays(day, 1));
      for (const t of overflow) push(nextDay, { ...t, dueDate: nextDay });

      // Re-sort to include any brand-new future day the overflow just created.
      days = [...byDay.keys()].sort(compareDays);
    }
    i++;
  }

  // Flatten back out, ordered by day then priority for stable output.
  const out: Touch[] = [];
  for (const day of [...byDay.keys()].sort(compareDays)) {
    const list = byDay.get(day)!;
    const fixed = list.filter((t) => t.sentAt || t.halted);
    const movable = list.filter((t) => !t.sentAt && !t.halted).sort(priority);
    out.push(...fixed, ...movable);
  }
  return out;
}

/** Count touches per day — handy for assertions and the simulation printout. */
export function loadByDay(touches: Touch[]): Map<Day, number> {
  const counts = new Map<Day, number>();
  for (const t of touches) counts.set(t.dueDate, (counts.get(t.dueDate) ?? 0) + 1);
  return counts;
}
