// ═══════════════════════════════════════════════════════════════════════════════
// VOLUME GOVERNOR — 6 new prospects/week, raised only with Jem's explicit yes,
// never above 8 (handoff F3, failure mode #4: a tracker calibrated to aspiration
// gets abandoned). Promoting more than the week's remaining slots staggers the
// overflow into future weeks — nothing is dropped, and Jem is told.
// ═══════════════════════════════════════════════════════════════════════════════

import { addDays, mondayOf, type Day } from "../cadence/dates";

export const DEFAULT_WEEKLY_VOLUME = 6;
export const MAX_WEEKLY_VOLUME = 8;
export const STREAK_WEEKS_TO_PROMPT = 3;
export const COMPLETION_THRESHOLD = 0.8;

/**
 * Assign a promotion date to each of `count` leads, respecting the weekly cap.
 * The current week gets `weeklyVolume - alreadyThisWeek` slots; each later week
 * gets a full `weeklyVolume`. Returns one Day per lead (in order).
 */
export function assignPromotionDates(
  count: number,
  alreadyThisWeek: number,
  weeklyVolume: number,
  today: Day
): Day[] {
  const dates: Day[] = [];
  let week = mondayOf(today);
  let slotsLeft = Math.max(0, weeklyVolume - alreadyThisWeek);
  // If this week is already full, start next week.
  if (slotsLeft === 0) {
    week = addDays(week, 7);
    slotsLeft = weeklyVolume;
  }
  for (let i = 0; i < count; i++) {
    if (slotsLeft === 0) {
      week = addDays(week, 7);
      slotsLeft = weeklyVolume;
    }
    // Promote on the current day for this week if it's this week, else the Monday.
    dates.push(week === mondayOf(today) ? today : week);
    slotsLeft -= 1;
  }
  return dates;
}

/**
 * Should we prompt Jem to raise the weekly volume? Yes only when the last
 * STREAK_WEEKS_TO_PROMPT weeks all hit ≥80% brief completion and we're below the
 * ceiling. Never raises on its own — this only decides whether to ASK.
 */
export function shouldPromptRaise(recentCompletions: number[], currentVolume: number): boolean {
  if (currentVolume >= MAX_WEEKLY_VOLUME) return false;
  const last = recentCompletions.slice(-STREAK_WEEKS_TO_PROMPT);
  return last.length === STREAK_WEEKS_TO_PROMPT && last.every((c) => c >= COMPLETION_THRESHOLD);
}

/** Clamp a requested volume to the allowed range. */
export function clampVolume(v: number): number {
  return Math.max(1, Math.min(MAX_WEEKLY_VOLUME, Math.round(v)));
}
