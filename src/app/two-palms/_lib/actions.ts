"use server";

import { getSupabaseServer } from "@/lib/supabase";
import { isAdminAuthed, isTeamAuthed, loginAdmin, loginTeam, markIntakeDone } from "./auth";

export async function teamLogin(password: string): Promise<{ ok: boolean }> {
  return { ok: await loginTeam(password) };
}

export async function adminLogin(password: string): Promise<{ ok: boolean }> {
  if (!(await isTeamAuthed())) return { ok: false };
  return { ok: await loginAdmin(password) };
}

export interface IntakeAnswers {
  entity: string;
  role: string;
  clients: string;
  ai_today: string; // how often
  tools: string[];
  confidence: number; // 1-5
  time_wasters: string;
  one_win: string;
  one_fail: string;
  want: string;
  name: string; // Backstage only, never shown on the team side
}

/** Saves the intake. Fails soft: if the database isn't configured the person
 *  still gets in, and the answers are logged server-side so nothing is lost. */
export async function submitIntake(a: IntakeAnswers): Promise<{ ok: boolean; stored: boolean }> {
  if (!(await isTeamAuthed())) return { ok: false, stored: false };
  let stored = false;
  const sb = getSupabaseServer();
  if (sb) {
    const { error } = await sb.from("tp_intake").insert({
      entity: a.entity,
      role: a.role,
      clients: a.clients,
      ai_today: a.ai_today,
      tools: a.tools,
      confidence: a.confidence,
      time_wasters: a.time_wasters,
      one_win: a.one_win,
      one_fail: a.one_fail,
      want: a.want,
      name: a.name,
    });
    if (error) console.error("[two-palms] intake insert failed", error.message, JSON.stringify(a));
    else stored = true;
  } else {
    console.warn("[two-palms] intake not stored (no database)", JSON.stringify(a));
  }
  await markIntakeDone();
  return { ok: true, stored };
}

export interface CheckState {
  id: string;
  done: boolean;
  done_by: string | null;
  done_at: string | null;
}

export async function readChecklist(): Promise<CheckState[]> {
  if (!(await isAdminAuthed())) return [];
  const sb = getSupabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("tp_checklist").select("id,done,done_by,done_at");
  return (data ?? []) as CheckState[];
}

export async function setCheck(id: string, done: boolean, by: string): Promise<{ ok: boolean }> {
  if (!(await isAdminAuthed())) return { ok: false };
  const sb = getSupabaseServer();
  if (!sb) return { ok: false };
  const { error } = await sb.from("tp_checklist").upsert({
    id,
    done,
    done_by: done ? by || null : null,
    done_at: done ? new Date().toISOString() : null,
  });
  return { ok: !error };
}

export interface IntakeRow extends IntakeAnswers {
  id: number;
  created_at: string;
}

export async function readIntake(): Promise<IntakeRow[]> {
  if (!(await isAdminAuthed())) return [];
  const sb = getSupabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("tp_intake").select("*").order("created_at", { ascending: false });
  return (data ?? []) as IntakeRow[];
}
