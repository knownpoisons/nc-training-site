import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

// ─── Partner gate ──────────────────────────────────────────────────────────────
// Same shape as hub-auth but scoped to /partners — own env var, own cookie, so
// client hub auth and partner auth don't share trust.
export const PARTNER_AUTH_COOKIE = "nc_partner_auth";
export const PARTNER_AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function getPartnerSecret(): string | null {
  const secret = process.env.PARTNER_PASSWORD;
  if (!secret || secret.length === 0) return null;
  return secret;
}

export function signPartnerToken(secret: string): string {
  return createHmac("sha256", secret).update("authed").digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export async function isPartnerAuthenticated(): Promise<boolean> {
  const secret = getPartnerSecret();
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[partners-auth] PARTNER_PASSWORD env var is not set — partner access is denied to everyone."
      );
    }
    return false;
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(PARTNER_AUTH_COOKIE)?.value;
  if (!token) return false;
  return safeEqualHex(token, signPartnerToken(secret));
}
