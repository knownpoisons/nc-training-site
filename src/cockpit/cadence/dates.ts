// ═══════════════════════════════════════════════════════════════════════════════
// DATE HELPERS — calendar-day arithmetic on "YYYY-MM-DD" strings.
//
// The cadence engine cares about which calendar DAY a touch belongs to, never
// the clock. We represent a day as a plain "YYYY-MM-DD" string and do all maths
// in UTC so daylight-saving shifts can never move a touch onto the wrong day.
// (The settings timezone decides what wall-clock time the 7am cron fires — that
// is a separate concern handled at the cron layer, not here.)
// ═══════════════════════════════════════════════════════════════════════════════

export type Day = string; // "YYYY-MM-DD"

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function assertDay(day: Day): void {
  if (!DAY_RE.test(day)) {
    throw new Error(`Not a YYYY-MM-DD day string: "${day}"`);
  }
}

/** Parse a day string to a UTC Date at midnight. */
function toUTC(day: Day): Date {
  assertDay(day);
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Format a UTC Date back to "YYYY-MM-DD". */
function fromUTC(date: Date): Day {
  return date.toISOString().slice(0, 10);
}

/** Add (or subtract) whole days. */
export function addDays(day: Day, n: number): Day {
  const dt = toUTC(day);
  dt.setUTCDate(dt.getUTCDate() + n);
  return fromUTC(dt);
}

/** 0 = Sunday … 6 = Saturday. */
export function dayOfWeek(day: Day): number {
  return toUTC(day).getUTCDay();
}

export function isWeekend(day: Day): boolean {
  const w = dayOfWeek(day);
  return w === 0 || w === 6;
}

/** Saturday → the following Monday (+2). Sunday → Monday (+1). Weekdays unchanged. */
export function shiftWeekendToMonday(day: Day): Day {
  const w = dayOfWeek(day);
  if (w === 6) return addDays(day, 2); // Sat → Mon
  if (w === 0) return addDays(day, 1); // Sun → Mon
  return day;
}

/** Sort comparator for day strings (ascending). Lexicographic works for ISO dates. */
export function compareDays(a: Day, b: Day): number {
  assertDay(a);
  assertDay(b);
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Whole days from `a` to `b` (b - a). Negative if b is before a. */
export function diffDays(a: Day, b: Day): number {
  const ms = toUTC(b).getTime() - toUTC(a).getTime();
  return Math.round(ms / 86_400_000);
}

/** The Monday of the week containing `day` (weeks run Mon–Sun). */
export function mondayOf(day: Day): Day {
  const dow = dayOfWeek(day); // 0=Sun..6=Sat
  const offset = dow === 0 ? -6 : 1 - dow;
  return addDays(day, offset);
}

/** The Sunday that ends the week containing `day`. */
export function sundayOf(day: Day): Day {
  return addDays(mondayOf(day), 6);
}
