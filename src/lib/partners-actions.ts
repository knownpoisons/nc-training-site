"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";
import {
  PARTNER_AUTH_COOKIE,
  PARTNER_AUTH_MAX_AGE_SECONDS,
  getPartnerSecret,
  signPartnerToken,
} from "@/lib/partners-auth";

function passwordMatches(password: string, secret: string): boolean {
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function setPartnerCookie(secret: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PARTNER_AUTH_COOKIE, signPartnerToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PARTNER_AUTH_MAX_AGE_SECONDS,
  });
}

// Form-action login: the cookie commits during the redirect navigation, so it
// persists reliably on Vercel (a programmatic action + router.refresh() does
// not). Mirrors The Deck's proven gate. `next` returns the visitor to the page
// they were gated on. On failure, re-render the login with ?e=1.
export async function submitPartnerLogin(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/partners");
  const dest = next.startsWith("/partners") ? next : "/partners";

  const secret = getPartnerSecret();
  const ok = !!secret && passwordMatches(password, secret);
  if (ok && secret) await setPartnerCookie(secret);

  redirect(ok ? dest : `${dest.split("?")[0]}?e=1`);
}

export interface PartnerLoginResult {
  ok: boolean;
  error?: string;
}

// Legacy programmatic action (kept for compatibility; the login form now uses
// submitPartnerLogin above).
export async function loginToPartners(password: string): Promise<PartnerLoginResult> {
  const secret = getPartnerSecret();
  if (!secret) return { ok: false, error: "Partner gate not configured." };
  if (!passwordMatches(password, secret)) {
    return { ok: false, error: "Wrong password." };
  }
  await setPartnerCookie(secret);
  return { ok: true };
}
