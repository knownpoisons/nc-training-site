// ═══════════════════════════════════════════════════════════════════════════════
// GMAIL INBOX-MINE — correspondents → RawLead → ingest. Verifies company
// inference, warmth scoring, and dedupe of a repeat emailer.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { MemoryStore } from "../../store/memory";
import { parseGmailCorrespondents, ingestGmailCorrespondents } from "../gmailIntake";

const TODAY = "2026-07-13";
const RECENT = "2026-07-01"; // <30 days before TODAY

describe("parseGmailCorrespondents", () => {
  it("infers company from a business domain, skips freemail", () => {
    const leads = parseGmailCorrespondents([
      { email: "dana@studio-fold.com", name: "Dana Lee", lastSent: RECENT },
      { email: "someone@gmail.com", name: "Pat", lastSent: RECENT },
    ]);
    expect(leads).toHaveLength(2);
    expect(leads[0].company).toBe("Studio Fold");
    expect(leads[0].source).toBe("gmail_sent");
    expect(leads[0].consentLane).toBe("pipeline");
    expect(leads[1].company).toBeNull(); // freemail → no company signal
  });

  it("lowercases the email and drops rows without a valid address", () => {
    const leads = parseGmailCorrespondents([
      { email: "  Rob@Northbound.co ", lastSent: RECENT },
      { email: "not-an-email", lastSent: RECENT },
      { email: "", lastSent: RECENT },
    ]);
    expect(leads).toHaveLength(1);
    expect(leads[0].email).toBe("rob@northbound.co");
  });
});

describe("ingestGmailCorrespondents", () => {
  it("creates a pipeline lead that scores warm (above the cold floor)", async () => {
    const store = new MemoryStore();
    const res = await ingestGmailCorrespondents(
      store,
      [{ email: "dana@studio-fold.com", name: "Dana Lee", lastSent: RECENT, count: 4 }],
      TODAY
    );
    expect(res.created).toBe(1);
    expect(res.byConsent.pipeline).toBe(1);

    const roster = await store.listRoster(10);
    expect(roster).toHaveLength(1);
    // warmth 0.75 lifts a recent business contact out of Tier C.
    expect(roster[0].tier === "A" || roster[0].tier === "B").toBe(true);
    expect(roster[0].score).toBeGreaterThanOrEqual(20);
  });

  it("dedupes a repeat emailer to one lead", async () => {
    const store = new MemoryStore();
    const res = await ingestGmailCorrespondents(
      store,
      [
        { email: "dana@studio-fold.com", name: "Dana Lee", lastSent: "2026-06-01" },
        { email: "DANA@studio-fold.com", name: "Dana L", lastSent: RECENT },
      ],
      TODAY
    );
    expect(res.received).toBe(2);
    expect(res.merged).toBe(1);
    expect(res.created).toBe(1);
  });

  it("lands everything at stage NEW (never sequenced)", async () => {
    const store = new MemoryStore();
    await ingestGmailCorrespondents(store, [{ email: "x@acme.co", lastSent: RECENT }], TODAY);
    const roster = await store.listRoster(10);
    expect(roster[0].stage).toBe("NEW");
  });
});
