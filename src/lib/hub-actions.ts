"use server";

import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import {
  HUB_AUTH_COOKIE,
  HUB_AUTH_MAX_AGE_SECONDS,
  getHubSecret,
  signHubToken,
} from "@/lib/hub-auth";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function loginToHub(password: string): Promise<LoginResult> {
  const secret = getHubSecret();
  if (!secret) {
    return {
      ok: false,
      error: "Hub is not configured. Get in touch with Jeremy.",
    };
  }

  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(secret, "utf8");
  const matches = a.length === b.length && timingSafeEqual(a, b);
  if (!matches) {
    return {
      ok: false,
      error: "Wrong password. Try again or get in touch with Jeremy.",
    };
  }

  const token = signHubToken(secret);
  const cookieStore = await cookies();
  cookieStore.set(HUB_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: HUB_AUTH_MAX_AGE_SECONDS,
    path: "/",
  });

  return { ok: true };
}
