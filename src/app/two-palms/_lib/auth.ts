// ═══════════════════════════════════════════════════════════════════════════════
// TWO PALMS HUB AUTH — three cookies, all httpOnly, all HMAC of the secret so
// no password ever lives client-side.
//   tp_team    : the whole-hub team password (TP_HUB_PASSWORD)
//   tp_intake  : set once the intake form has been completed on this browser
//   tp_admin   : the Backstage password (TP_HUB_ADMIN_PASSWORD)
// Fails closed when a secret is missing. Same pattern as /deck.
// ═══════════════════════════════════════════════════════════════════════════════

import { cookies } from "next/headers";
import crypto from "node:crypto";

const TEAM = "tp_team";
const INTAKE = "tp_intake";
const ADMIN = "tp_admin";
const MONTH = 60 * 60 * 24 * 30;

function teamSecret(): string | null {
  return process.env.TP_HUB_PASSWORD ?? null;
}
function adminSecret(): string | null {
  return process.env.TP_HUB_ADMIN_PASSWORD ?? null;
}

function token(secret: string, salt: string): string {
  return crypto.createHmac("sha256", secret).update(salt).digest("hex");
}

async function matches(cookieName: string, expected: string | null): Promise<boolean> {
  if (!expected) return false;
  const jar = await cookies();
  const c = jar.get(cookieName)?.value;
  if (!c || c.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(c), Buffer.from(expected));
}

export async function isTeamAuthed(): Promise<boolean> {
  const s = teamSecret();
  return matches(TEAM, s ? token(s, "tp-team-v1") : null);
}

export async function isIntakeDone(): Promise<boolean> {
  const s = teamSecret();
  return matches(INTAKE, s ? token(s, "tp-intake-v1") : null);
}

export async function isAdminAuthed(): Promise<boolean> {
  const s = adminSecret();
  return matches(ADMIN, s ? token(s, "tp-admin-v1") : null);
}

async function setCookie(name: string, value: string) {
  const jar = await cookies();
  jar.set(name, value, { httpOnly: true, secure: true, sameSite: "lax", path: "/two-palms", maxAge: MONTH });
}

export async function loginTeam(password: string): Promise<boolean> {
  const s = teamSecret();
  if (!s || password.trim() !== s) return false;
  await setCookie(TEAM, token(s, "tp-team-v1"));
  return true;
}

export async function markIntakeDone(): Promise<void> {
  const s = teamSecret();
  if (!s) return;
  await setCookie(INTAKE, token(s, "tp-intake-v1"));
}

export async function loginAdmin(password: string): Promise<boolean> {
  const s = adminSecret();
  if (!s || password.trim() !== s) return false;
  await setCookie(ADMIN, token(s, "tp-admin-v1"));
  return true;
}

export function hubConfigured(): { team: boolean; admin: boolean } {
  return { team: !!teamSecret(), admin: !!adminSecret() };
}
