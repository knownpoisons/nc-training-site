"use server";

import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import {
  PARTNER_AUTH_COOKIE,
  PARTNER_AUTH_MAX_AGE_SECONDS,
  getPartnerSecret,
  signPartnerToken,
} from "@/lib/partners-auth";

export interface PartnerLoginResult {
  ok: boolean;
  error?: string;
}

export async function loginToPartners(password: string): Promise<PartnerLoginResult> {
  const secret = getPartnerSecret();
  if (!secret) return { ok: false, error: "Partner gate not configured." };

  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "Wrong password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(PARTNER_AUTH_COOKIE, signPartnerToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PARTNER_AUTH_MAX_AGE_SECONDS,
  });
  return { ok: true };
}
