// ═══════════════════════════════════════════════════════════════════════════════
// CONSENT — founding rule #6. Someone who only agreed to a newsletter must never
// end up in a 1:1 outreach sequence. Two locks: they never reach the digest, and
// promotion refuses them even if an id is passed directly.
//
// This became load-bearing the day 2,360 real Beehiiv subscribers landed in the
// queue, so it is tested rather than trusted.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { MemoryStore } from "../../store/memory";
import { promoteLeads } from "../digest";
import { runSentinelChecks } from "../sentinel";

const TODAY = "2026-07-20";

function seedBoth(store: MemoryStore) {
  const sub = store.seedProspect({
    id: "SUB",
    name: "Newsletter Sub",
    addedAt: TODAY,
    stage: "NEW",
    consentLane: "broadcast_only",
    score: 99, // deliberately top-scoring: rank must not beat consent
  });
  const lead = store.seedProspect({
    id: "LEAD",
    name: "Real Lead",
    addedAt: TODAY,
    stage: "NEW",
    consentLane: "pipeline",
    score: 10,
  });
  return { sub, lead };
}

describe("broadcast-only contacts", () => {
  it("never appear in the promotion digest, however high they score", async () => {
    const store = new MemoryStore();
    seedBoth(store);
    const queued = await store.getQueuedLeads(10);
    expect(queued.map((p) => p.id)).toEqual(["LEAD"]);
  });

  it("are refused by promotion even when the id is passed directly", async () => {
    const store = new MemoryStore();
    seedBoth(store);
    const summary = await promoteLeads(store, ["SUB", "LEAD"], TODAY, 6, "test");

    expect(summary.blocked).toEqual(["Newsletter Sub"]);
    expect(summary.promotedThisWeek).toEqual(["Real Lead"]);

    // The subscriber is untouched: still queued, never sequenced.
    const sub = await store.getProspect("SUB");
    expect(sub!.stage).toBe("NEW");
  });
});

describe("sentinel noise control", () => {
  it("does not flag '(unknown)' — that's the expected placeholder for email-only imports", async () => {
    const store = new MemoryStore();
    store.seedProspect({ id: "U", name: "(unknown)", addedAt: TODAY, stage: "NEW" });
    const issues = await runSentinelChecks(store, `${TODAY}T15:00:00Z`); // before brief hour
    expect(issues.filter((i) => /malformed/i.test(i.title))).toHaveLength(0);
  });

  it("still flags genuine garbage", async () => {
    const store = new MemoryStore();
    store.seedProspect({ id: "G", name: "[ jane, ecd]", addedAt: TODAY, stage: "NEW" });
    const issues = await runSentinelChecks(store, `${TODAY}T15:00:00Z`);
    expect(issues.some((i) => /malformed/i.test(i.title))).toBe(true);
  });
});
