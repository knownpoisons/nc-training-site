"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase";
import { isAdminAuthed } from "./auth";
import { BIG5 } from "../_data/big5";

export interface Big5Tick { done: boolean; done_by: string | null; done_at: string | null }
export interface Big5RolloutTodo { id: string; list: string; ord: number; task: string; owner: string; due: string; done: boolean; done_by: string | null }
export interface Big5Ticks { ticks: Record<string, Big5Tick>; rollout: Big5RolloutTodo[]; persisted: boolean }

/** Tick state for every Big 5 to-do, plus the old Micky and Jem rollout lists. The jobs themselves live
 *  in _data/big5.ts; only ticks are stored, so anyone in leadership can tick without a redeploy. */
export async function readBig5Ticks(): Promise<Big5Ticks> {
  if (!(await isAdminAuthed())) return { ticks: {}, rollout: [], persisted: false };
  const sb = getSupabaseServer();
  if (!sb) return { ticks: {}, rollout: [], persisted: false };
  const { data, error } = await sb.from("tp_big5_todos").select("id,list,ord,task,owner,due,done,done_by,done_at").order("ord");
  if (error) {
    console.error("[two-palms] big5 read failed", error.message);
    return { ticks: {}, rollout: [], persisted: false };
  }
  const ticks: Record<string, Big5Tick> = {};
  const rollout: Big5RolloutTodo[] = [];
  for (const r of data ?? []) {
    ticks[r.id] = { done: !!r.done, done_by: r.done_by, done_at: r.done_at };
    if (r.list === "micky" || r.list === "jem") rollout.push(r as Big5RolloutTodo);
  }
  return { ticks, rollout, persisted: true };
}

export async function setBig5Todo(id: string, done: boolean, by: string): Promise<{ ok: boolean }> {
  if (!(await isAdminAuthed())) return { ok: false };
  const sb = getSupabaseServer();
  if (!sb) return { ok: false };
  const stamp = { done, done_by: done ? by.trim().slice(0, 40) || null : null, done_at: done ? new Date().toISOString() : null };
  let job: string | null = null;
  let t: { task: string; who: string; when: string } | undefined;
  let ord = 0;
  for (const j of BIG5) {
    const i = j.todos.findIndex((x) => x.id === id);
    if (i >= 0) { job = j.id; t = j.todos[i]; ord = i + 1; break; }
  }
  const { error } = job && t
    ? await sb.from("tp_big5_todos").upsert({ id, list: job, ord, task: t.task, owner: t.who, due: t.when, ...stamp }, { onConflict: "id" })
    : await sb.from("tp_big5_todos").update(stamp).eq("id", id);
  if (!error) revalidatePath("/two-palms/backstage/big-5", "layout");
  else console.error("[two-palms] big5 tick failed", error.message);
  return { ok: !error };
}
