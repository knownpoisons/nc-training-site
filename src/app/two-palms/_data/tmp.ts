// ═══════════════════════════════════════════════════════════════════════════════
// TIME · MONEY · PAIN: the form's questions (from the JSON, plus a required name
// first), validation into a tp_tmp row, and the Backstage summary. Pure: no
// database, no cookies, so it's unit-testable. Answers are admin-only.
// ═══════════════════════════════════════════════════════════════════════════════

import { FC, type FQuestion } from "./foundations";

export interface TmpQuestion extends FQuestion {
  /** for choice questions with an "Other"/"Elsewhere" option: where its text goes */
  other?: { option: string; col: string; placeholder: string };
  sub?: string;
}

const NAME_Q: TmpQuestion = { id: "name", q: "First, your name.", type: "text", sub: "Only Jem and Backstage see answers with names on. Nothing here appears on the hub." };

export const TMP_QUESTIONS: TmpQuestion[] = [
  NAME_Q,
  ...FC.forms.time_money_pain.questions.map((q): TmpQuestion => {
    if (q.id === "role") return { ...q, other: { option: "Other", col: "role_other", placeholder: "Your role" } };
    if (q.id === "office") return { ...q, other: { option: "Elsewhere", col: "office_other", placeholder: "Where?" } };
    return q;
  }),
];

export const TMP_COLUMNS = ["name", "role", "role_other", "office", "office_other", "time", "time_hours", "money", "money_hours", "pain", "pain_hours", "tools", "dream"] as const;
export type TmpColumn = (typeof TMP_COLUMNS)[number];
export type TmpAnswers = Partial<Record<TmpColumn, string>>;
export type TmpRow = Record<TmpColumn, string | null>;

export function tmpAnswered(q: TmpQuestion, a: TmpAnswers): boolean {
  const v = (a[q.id as TmpColumn] ?? "").trim();
  if (q.optional) return true;
  if (!v) return false;
  if (q.type === "choice" && q.options && !q.options.includes(v)) return false;
  if (q.other && v === q.other.option && !(a[q.other.col as TmpColumn] ?? "").trim()) return false;
  return true;
}

/** Validates answers into a row. Choice answers must be one of the JSON options. */
export function validateTmp(a: TmpAnswers): { ok: true; row: TmpRow } | { ok: false; missing: string[] } {
  const missing = TMP_QUESTIONS.filter((q) => !tmpAnswered(q, a)).map((q) => q.id);
  if (missing.length) return { ok: false, missing };
  const row = Object.fromEntries(TMP_COLUMNS.map((c) => [c, null])) as TmpRow;
  for (const c of TMP_COLUMNS) {
    const v = (a[c] ?? "").trim();
    row[c] = v ? v.slice(0, 4000) : null;
  }
  if (row.role !== "Other") row.role_other = null;
  if (row.office !== "Elsewhere") row.office_other = null;
  return { ok: true, row };
}

// ─── Backstage summary ─────────────────────────────────────────────────────────
export const HOUR_BUCKETS = FC.forms.time_money_pain.questions.find((q) => q.id === "time_hours")?.options ?? [];

function countBy(rows: Partial<TmpRow>[], col: TmpColumn, order: string[]): { label: string; n: number }[] {
  const m = new Map<string, number>(order.map((o) => [o, 0]));
  for (const r of rows) {
    const v = r[col];
    if (!v) continue;
    m.set(v, (m.get(v) ?? 0) + 1);
  }
  return Array.from(m, ([label, n]) => ({ label, n }));
}

export function tmpSummary(rows: Partial<TmpRow>[]) {
  const opt = (id: string) => FC.forms.time_money_pain.questions.find((q) => q.id === id)?.options ?? [];
  return {
    total: rows.length,
    role: countBy(rows, "role", opt("role")),
    office: countBy(rows, "office", opt("office")),
    hours: {
      time: countBy(rows, "time_hours", HOUR_BUCKETS),
      money: countBy(rows, "money_hours", HOUR_BUCKETS),
      pain: countBy(rows, "pain_hours", HOUR_BUCKETS),
    },
    dream: countBy(rows, "dream", opt("dream")),
  };
}

export function tmpCsv(rows: (Partial<TmpRow> & { created_at?: string })[]): string {
  const cols = ["created_at", ...TMP_COLUMNS];
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s; // no formula injection in spreadsheets
    return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc((r as Record<string, unknown>)[c])).join(","))].join("\n") + "\n";
}
