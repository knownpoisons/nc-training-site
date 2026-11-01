"use server";

import { getSupabaseServer } from "@/lib/supabase";
import { isAdminAuthed, isTeamAuthed } from "./auth";
import { tmpIsOpen } from "../_data/foundations";
import { validateTmp, type TmpAnswers, type TmpRow } from "../_data/tmp";

export type TmpResult = { ok: true } | { ok: false; reason: "auth" | "closed" | "invalid" | "nodb" | "error" };

/** Saves one Time · Money · Pain response to tp_tmp (service role; RLS on, no policies).
 *  If it can't be stored, the answers are logged server-side so nothing is lost. */
export async function submitTmp(a: TmpAnswers): Promise<TmpResult> {
  if (!(await isTeamAuthed())) return { ok: false, reason: "auth" };
  if (!tmpIsOpen(new Date(), await isAdminAuthed())) return { ok: false, reason: "closed" };
  const v = validateTmp(a);
  if (!v.ok) return { ok: false, reason: "invalid" };
  const sb = getSupabaseServer();
  if (!sb) {
    console.warn("[two-palms] tmp not stored (no database)", JSON.stringify(v.row));
    return { ok: false, reason: "nodb" };
  }
  const { error } = await sb.from("tp_tmp").insert(v.row);
  if (error) {
    console.error("[two-palms] tmp insert failed", error.message, JSON.stringify(v.row));
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}

export type TmpDbRow = TmpRow & { id: number; created_at: string };

/** Admin only. Empty when not admin or no database. */
export async function readTmp(): Promise<TmpDbRow[]> {
  if (!(await isAdminAuthed())) return [];
  const sb = getSupabaseServer();
  if (!sb) return [];
  const { data, error } = await sb.from("tp_tmp").select("*").order("created_at", { ascending: false });
  if (error) { console.error("[two-palms] tmp read failed", error.message); return []; }
  return (data ?? []) as TmpDbRow[];
}
