// ═══════════════════════════════════════════════════════════════════════════════
// DECK AUTH — single user, password → httpOnly cookie. The password is
// DECK_PASSWORD, falling back to CRON_SECRET so the Deck works the moment it
// deploys (Jem already holds that secret). Fails closed when neither is set.
// ═══════════════════════════════════════════════════════════════════════════════

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const COOKIE = "deck_session";

function secret(): string | null {
  return process.env.DECK_PASSWORD ?? process.env.CRON_SECRET ?? null;
}

/** Cookie value = HMAC of the secret, so the raw password never lives client-side. */
function sessionToken(s: string): string {
  return crypto.createHmac("sha256", s).update("deck-session-v1").digest("hex");
}

export async function isDeckAuthed(): Promise<boolean> {
  const s = secret();
  if (!s) return false; // fail closed
  const jar = await cookies();
  const c = jar.get(COOKIE)?.value;
  if (!c) return false;
  const expected = sessionToken(s);
  return c.length === expected.length && crypto.timingSafeEqual(Buffer.from(c), Buffer.from(expected));
}

/** Server-page guard: bounce to the lock screen when unauthenticated. */
export async function requireDeck(): Promise<void> {
  if (!(await isDeckAuthed())) redirect("/deck");
}

/** Server action target: check the password, set the cookie. */
export async function loginDeck(password: string): Promise<boolean> {
  const s = secret();
  if (!s || password !== s) return false;
  const jar = await cookies();
  jar.set(COOKIE, sessionToken(s), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // a month
  });
  return true;
}
