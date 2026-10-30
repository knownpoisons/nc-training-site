import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { getSupabaseServer } from "@/lib/supabase";
import { INTAKE_COLUMNS } from "@/app/two-palms/_data/intake";

// Jem-only CSV of the Two Palms intake. Key = TP_INTAKE_EXPORT_KEY (or CRON_SECRET as a fallback).
// Works as a direct download and inside Google Sheets: =IMPORTDATA("<this url with ?key=...>")
export const dynamic = "force-dynamic";

function keyOk(given: string | null): boolean {
  const expected = process.env.TP_INTAKE_EXPORT_KEY || process.env.CRON_SECRET;
  if (!expected || !given || given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = Array.isArray(v) ? v.join("; ") : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  if (!keyOk(req.nextUrl.searchParams.get("key"))) return new Response("Not found", { status: 404 });
  const sb = getSupabaseServer();
  if (!sb) return new Response("Database not configured", { status: 500 });
  const { data, error } = await sb.from("tp_intake_v2").select("*").order("created_at", { ascending: true });
  if (error) return new Response("Read failed: " + error.message, { status: 500 });
  const cols = ["id", "created_at", ...INTAKE_COLUMNS];
  const lines = [cols.join(","), ...(data ?? []).map((r: Record<string, unknown>) => cols.map((c) => cell(r[c])).join(","))];
  const download = req.nextUrl.searchParams.get("download") === "1";
  return new Response(lines.join("\r\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "cache-control": "no-store",
      ...(download ? { "content-disposition": `attachment; filename="two-palms-intake-${new Date().toISOString().slice(0, 10)}.csv"` } : {}),
    },
  });
}
