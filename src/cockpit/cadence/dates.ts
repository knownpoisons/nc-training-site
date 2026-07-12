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

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * Parse a human date reply ("2026-07-18", "18/7", "jul 18", "friday",
 * "tomorrow", "next tuesday") relative to `today`. Returns null if unparseable.
 * Resolved weekdays land on the NEXT occurrence (never today/past).
 */
export function parseNaturalDay(text: string, today: Day): Day | null {
  const t = text.trim().toLowerCase();

  // ISO
  let m = t.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  if (/\btoday\b/.test(t)) return today;
  if (/\btomorrow\b/.test(t)) return addDays(today, 1);

  // weekday name → next occurrence
  for (let w = 0; w < 7; w++) {
    if (new RegExp(`\\b${WEEKDAYS[w]}\\b`).test(t) || new RegExp(`\\b${WEEKDAYS[w].slice(0, 3)}\\b`).test(t)) {
      let diff = (w - dayOfWeek(today) + 7) % 7;
      if (diff === 0) diff = 7;
      if (/\bnext\b/.test(t) && diff <= 3) diff += 7; // "next tue" on a Monday → the week after
      return addDays(today, diff);
    }
  }

  // "jul 18" / "18 jul"
  m = t.match(/\b([a-z]{3,9})\s+(\d{1,2})\b/) ?? t.match(/\b(\d{1,2})\s+([a-z]{3,9})\b/);
  if (m) {
    const [a, b] = [m[1], m[2]];
    const mon = MONTHS[(isNaN(Number(a)) ? a : b).slice(0, 3)];
    const dom = Number(isNaN(Number(a)) ? b : a);
    if (mon && dom >= 1 && dom <= 31) {
      const year = Number(today.slice(0, 4));
      let candidate = `${year}-${String(mon).padStart(2, "0")}-${String(dom).padStart(2, "0")}`;
      if (compareDays(candidate, today) < 0) candidate = `${year + 1}${candidate.slice(4)}`;
      return candidate;
    }
  }

  // "18/7" or "18/7/2026" (day/month — British)
  m = t.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (m) {
    const dom = Number(m[1]);
    const mon = Number(m[2]);
    if (mon >= 1 && mon <= 12 && dom >= 1 && dom <= 31) {
      const year = m[3] ? (m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3])) : Number(today.slice(0, 4));
      let candidate = `${year}-${String(mon).padStart(2, "0")}-${String(dom).padStart(2, "0")}`;
      if (!m[3] && compareDays(candidate, today) < 0) candidate = `${year + 1}${candidate.slice(4)}`;
      return candidate;
    }
  }
  return null;
}
