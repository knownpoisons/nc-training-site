import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const HUB_AUTH_COOKIE = "nc_hub_auth";
export const HUB_AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function getHubSecret(): string | null {
  const secret = process.env.HUB_PASSWORD;
  if (!secret || secret.length === 0) return null;
  return secret;
}

export function signHubToken(secret: string): string {
  return createHmac("sha256", secret).update("authed").digest("hex");
}

export function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const secret = getHubSecret();
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[hub-auth] HUB_PASSWORD env var is not set — hub access is denied to everyone."
      );
    }
    return false;
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(HUB_AUTH_COOKIE)?.value;
  if (!token) return false;
  return safeEqualHex(token, signHubToken(secret));
}
