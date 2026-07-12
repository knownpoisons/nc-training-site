// ═══════════════════════════════════════════════════════════════════════════════
// CADENCE ENGINE — the scheduling brain. Pure functions, no database, no clock.
//
// Rules (from the handoff, F3):
//   • Touch schedule per new prospect: day 1, 4, 12, 21.
//   • Weekend touches shift to the following Monday.
//   • A skip pushes that touch +2 days (then re-shifts off weekends) and counts.
//   • A reply at any point halts the sequence → prospect moves to REPLIED.
//   • After touch 4 with no reply → prospect goes DORMANT, resurfaces in 90 days.
//   • Two consecutive skips on the same prospect → flagged (surfaced Friday).
//
// The daily load cap of 8 lives in loadBalancer.ts, applied on top of this.
// ═══════════════════════════════════════════════════════════════════════════════

import { addDays, shiftWeekendToMonday, type Day } from "./dates";
import type { Prospect, Stage, Touch } from "./types";

/** Day offsets from the added date for touches 1–4 → calendar days 1, 4, 12, 21. */
export const TOUCH_OFFSETS = [0, 3, 11, 20] as const;
export const TOTAL_TOUCHES = TOUCH_OFFSETS.length;

export const SKIP_PUSH_DAYS = 2;
export const DORMANT_DAYS = 90;
export const CONSECUTIVE_SKIP_FLAG = 2;

/** Post-call follow-up cadence (PLAYBOOK: the follow-up IS the conversion).
 *  Touch 5 = day+2 value (the Loom), 6 = day+7 made-thing, 7 = day+30 news hook. */
export const FOLLOWUP_TOUCHES: ReadonlyArray<{ touchNumber: number; offset: number }> = [
  { touchNumber: 5, offset: 2 },
  { touchNumber: 6, offset: 7 },
  { touchNumber: 7, offset: 30 },
];

/** Build the follow-up schedule from a base day (the call date). */
export function followUpsFrom(prospectId: string, baseDay: Day): Touch[] {
  return FOLLOWUP_TOUCHES.map((f) => ({
    prospectId,
    touchNumber: f.touchNumber,
    dueDate: shiftWeekendToMonday(addDays(baseDay, f.offset)),
    sentAt: null,
    skippedCount: 0,
  }));
}

/**
 * Build the initial 4-touch schedule for a freshly added prospect.
 * Each touch is placed at its offset, then shifted off weekends to Monday.
 */
export function scheduleForProspect(prospectId: string, addedAt: Day): Touch[] {
  return TOUCH_OFFSETS.map((offset, i) => ({
    prospectId,
    touchNumber: i + 1,
    dueDate: shiftWeekendToMonday(addDays(addedAt, offset)),
    sentAt: null,
    skippedCount: 0,
  }));
}

/**
 * Apply a skip to a single touch: push it +2 days, re-shift off weekends,
 * and increment its skip counter. Returns a new touch (does not mutate).
 */
export function applySkip(touch: Touch): Touch {
  return {
    ...touch,
    dueDate: shiftWeekendToMonday(addDays(touch.dueDate, SKIP_PUSH_DAYS)),
    skippedCount: touch.skippedCount + 1,
  };
}

/** A prospect is flagged (Friday scoreboard) when any touch has been skipped twice running. */
export function hasConsecutiveSkipFlag(touches: Touch[]): boolean {
  return touches.some((t) => t.skippedCount >= CONSECUTIVE_SKIP_FLAG);
}

/**
 * A reply halts the sequence: the prospect moves to REPLIED and every unsent
 * touch is marked halted (kept for history, never fired).
 */
export function applyReply(
  prospect: Prospect,
  touches: Touch[]
): { prospect: Prospect; touches: Touch[] } {
  return {
    prospect: { ...prospect, stage: "REPLIED" },
    touches: touches.map((t) =>
      t.sentAt ? t : { ...t, halted: true }
    ),
  };
}

/**
 * Decide whether a prospect should go DORMANT. Trigger: touch 4 has been sent
 * and no reply has halted the sequence. Returns the resurface day when so.
 */
export function evaluateDormancy(
  prospect: Prospect,
  touches: Touch[]
): { dormant: boolean; stage: Stage; resurfaceAt?: Day } {
  if (prospect.stage === "REPLIED") {
    return { dormant: false, stage: prospect.stage };
  }
  const finalTouch = touches.find((t) => t.touchNumber === TOTAL_TOUCHES);
  const finalSent = finalTouch?.sentAt;
  if (finalSent) {
    return {
      dormant: true,
      stage: "DORMANT",
      resurfaceAt: addDays(finalSent, DORMANT_DAYS),
    };
  }
  return { dormant: false, stage: prospect.stage };
}
