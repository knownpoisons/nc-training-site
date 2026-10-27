"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase";
import { isAdminAuthed } from "./auth";

export type Big5Status = "Not started" | "Intake" | "Planning" | "Building" | "Live";

export interface Big5Job {
  id: string;
  ord: number;
  name: string;
  owner: string;
  co_owners: string;
  runs_on: string;
  hours: string;
  done_looks_like: string;
  deep_dive: string;
  open_questions: string[];
  status: Big5Status;
  stage: number;
}

export interface Big5Todo {
  id: string;
  list: string;
  ord: number;
  task: string;
  owner: string;
  due: string;
  done: boolean;
  done_by: string | null;
  done_at: string | null;
}

export interface Big5Data {
  jobs: Big5Job[];
  todos: Big5Todo[];
  persisted: boolean;
}

/** Everything the Big 5 page needs, read live (so Claude's edits in the
 *  database show on the next load without a redeploy). Admin only. */
export async function readBig5(): Promise<Big5Data> {
  if (!(await isAdminAuthed())) return { jobs: [], todos: [], persisted: false };
  const sb = getSupabaseServer();
  if (!sb) return { jobs: [], todos: [], persisted: false };
  const [j, t] = await Promise.all([
    sb.from("tp_big5_jobs").select("*").order("ord"),
    sb.from("tp_big5_todos").select("id,list,ord,task,owner,due,done,done_by,done_at").order("ord"),
  ]);
  if (j.error || t.error) {
    console.error("[two-palms] big5 read failed", j.error?.message, t.error?.message);
    return { jobs: [], todos: [], persisted: false };
  }
  return { jobs: (j.data ?? []) as Big5Job[], todos: (t.data ?? []) as Big5Todo[], persisted: true };
}

export async function setBig5Todo(id: string, done: boolean, by: string): Promise<{ ok: boolean }> {
  if (!(await isAdminAuthed())) return { ok: false };
  const sb = getSupabaseServer();
  if (!sb) return { ok: false };
  const { error } = await sb
    .from("tp_big5_todos")
    .update({ done, done_by: done ? by.trim().slice(0, 40) || null : null, done_at: done ? new Date().toISOString() : null })
    .eq("id", id);
  if (!error) revalidatePath("/two-palms/backstage/big-5");
  return { ok: !error };
}
