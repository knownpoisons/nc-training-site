// ═══════════════════════════════════════════════════════════════════════════════
// SLACK REQUEST VERIFICATION — prove an inbound webhook really came from Slack.
//
// Slack signs each request: v0 = HMAC-SHA256(signing_secret, "v0:{ts}:{body}").
// We recompute and constant-time compare, and reject anything older than 5
// minutes (replay protection). Fails closed if the signing secret is missing.
// ═══════════════════════════════════════════════════════════════════════════════

import crypto from "node:crypto";

const FIVE_MINUTES = 60 * 5;

export function verifySlackSignature(args: {
  signingSecret: string | undefined;
  timestamp: string | null;
  signature: string | null;
  rawBody: string;
  nowSeconds: number;
}): boolean {
  const { signingSecret, timestamp, signature, rawBody, nowSeconds } = args;
  if (!signingSecret) return false; // fail closed
  if (!timestamp || !signature) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(nowSeconds - ts) > FIVE_MINUTES) return false; // stale → replay

  const base = `v0:${timestamp}:${rawBody}`;
  const digest = "v0=" + crypto.createHmac("sha256", signingSecret).update(base).digest("hex");

  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
