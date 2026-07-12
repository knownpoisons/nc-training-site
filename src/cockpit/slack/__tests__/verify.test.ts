import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifySlackSignature } from "../verify";

const SECRET = "test_signing_secret";
const NOW = 1_700_000_000;

function sign(body: string, ts: number, secret = SECRET): string {
  return "v0=" + crypto.createHmac("sha256", secret).update(`v0:${ts}:${body}`).digest("hex");
}

describe("verifySlackSignature", () => {
  const body = JSON.stringify({ type: "event_callback" });

  it("accepts a correctly signed, fresh request", () => {
    const ts = NOW;
    expect(
      verifySlackSignature({
        signingSecret: SECRET,
        timestamp: String(ts),
        signature: sign(body, ts),
        rawBody: body,
        nowSeconds: NOW,
      })
    ).toBe(true);
  });

  it("rejects a wrong signature", () => {
    expect(
      verifySlackSignature({
        signingSecret: SECRET,
        timestamp: String(NOW),
        signature: sign(body, NOW, "wrong_secret"),
        rawBody: body,
        nowSeconds: NOW,
      })
    ).toBe(false);
  });

  it("rejects a stale (replayed) request older than 5 minutes", () => {
    const ts = NOW - 6 * 60;
    expect(
      verifySlackSignature({
        signingSecret: SECRET,
        timestamp: String(ts),
        signature: sign(body, ts),
        rawBody: body,
        nowSeconds: NOW,
      })
    ).toBe(false);
  });

  it("fails closed when the signing secret is missing", () => {
    expect(
      verifySlackSignature({
        signingSecret: undefined,
        timestamp: String(NOW),
        signature: sign(body, NOW),
        rawBody: body,
        nowSeconds: NOW,
      })
    ).toBe(false);
  });

  it("rejects a tampered body", () => {
    const sig = sign(body, NOW);
    expect(
      verifySlackSignature({
        signingSecret: SECRET,
        timestamp: String(NOW),
        signature: sig,
        rawBody: body + "tampered",
        nowSeconds: NOW,
      })
    ).toBe(false);
  });
});
