"use server";

import { getSupabaseServer } from "@/lib/supabase";
import { isTeamAuthed, markIntakeDone } from "./auth";
import { INTAKE_ARRAY_COLUMNS, INTAKE_COLUMNS, INTAKE_INT_COLUMNS } from "../_data/intake";

export type IntakeV2 = Record<string, string | string[] | number | null>;

/** Saves one intake response. Only known columns are written; text is trimmed and capped.
 *  If the insert fails the answers are logged server-side so nothing is lost. */
export async function submitIntakeV2(a: IntakeV2): Promise<{ ok: boolean; stored: boolean }> {
  if (!(await isTeamAuthed())) return { ok: false, stored: false };
  const row: Record<string, unknown> = {};
  for (const c of INTAKE_COLUMNS) {
    const v = a[c];
    if (v === undefined || v === null || v === "") continue;
    if (INTAKE_INT_COLUMNS.has(c)) {
      const n = Number(v);
      if (Number.isInteger(n) && n >= 1 && n <= 5) row[c] = n;
    } else if (INTAKE_ARRAY_COLUMNS.has(c)) {
      if (Array.isArray(v)) row[c] = v.map((x) => String(x).slice(0, 120)).slice(0, 30);
    } else {
      row[c] = String(v).trim().slice(0, 4000);
    }
  }
  let stored = false;
  const sb = getSupabaseServer();
  if (sb) {
    const { error } = await sb.from("tp_intake_v2").insert(row);
    if (error) console.error("[two-palms] intake v2 insert failed", error.message, JSON.stringify(row));
    else stored = true;
  } else {
    console.warn("[two-palms] intake v2 not stored (no database)", JSON.stringify(row));
  }
  if (stored) await markIntakeDone();
  return { ok: stored, stored };
}
