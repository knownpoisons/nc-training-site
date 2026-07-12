// ═══════════════════════════════════════════════════════════════════════════════
// CRON AUTH — every cron endpoint must present the shared secret.
//
// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. We accept that, and
// also an `x-cron-secret` header for manual/local testing. If CRON_SECRET is not
// set in the environment we FAIL CLOSED (deny) — a missing secret must never
// mean "open to the world".
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

export function isAuthorizedCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const header = req.headers.get("x-cron-secret");
  if (header === secret) return true;

  return false;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}
