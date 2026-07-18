// ═══════════════════════════════════════════════════════════════════════════════
// MORNING SENTINEL — the outside-Vercel watcher. Flags a missing brief, garbage
// prospects; stays silent when healthy.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { MemoryStore } from "../../store/memory";
import { runSentinelChecks, renderSentinelAlert } from "../sentinel";

// TODAY is a Monday. Settings default to HST, brief hour 7.
const TODAY = "2026-07-13";
// 09:00 HST = 19:00 UTC — past the 7am brief hour.
const AFTER_BRIEF = `${TODAY}T19:00:00Z`;
// 15:00 UTC = 05:00 HST — before the brief hour.
const BEFORE_BRIEF = `${TODAY}T15:00:00Z`;

async function postBrief(store: MemoryStore) {
  await store.saveBrief({
    briefDate: TODAY,
    slackChannel: "#c",
    slackTs: "1",
    actions: [],
    postedAt: `${TODAY}T17:00:00Z`,
    lastInteractionAt: null,
    nudgedAt: null,
  });
}

describe("runSentinelChecks", () => {
  it("flags a brief that never ran once the brief hour has passed", async () => {
    const store = new MemoryStore();
    const issues = await runSentinelChecks(store, AFTER_BRIEF);
    expect(issues.some((i) => /never ran/i.test(i.title))).toBe(true);
  });

  it("stays quiet about the brief before the brief hour", async () => {
    const store = new MemoryStore();
    const issues = await runSentinelChecks(store, BEFORE_BRIEF);
    expect(issues.some((i) => /brief/i.test(i.title))).toBe(false);
  });

  it("is clean when the brief and Monday digest have both posted", async () => {
    const store = new MemoryStore();
    await postBrief(store);
    await store.saveDigest({ digestDate: TODAY, slackTs: "2", actions: [], postedAt: `${TODAY}T16:00:00Z` });
    const issues = await runSentinelChecks(store, AFTER_BRIEF);
    expect(issues).toHaveLength(0);
    expect(renderSentinelAlert(issues)).toBeNull();
  });

  it("flags a garbage prospect name", async () => {
    const store = new MemoryStore();
    await postBrief(store);
    await store.saveDigest({ digestDate: TODAY, slackTs: "2", actions: [], postedAt: `${TODAY}T16:00:00Z` });
    store.seedProspect({ id: "G", name: "[ jane, ecd]", addedAt: TODAY, stage: "IN_SEQUENCE" });
    const issues = await runSentinelChecks(store, AFTER_BRIEF);
    const malformed = issues.find((i) => /malformed/i.test(i.title));
    expect(malformed).toBeTruthy();
    expect(malformed!.detail).toMatch(/jane/);
    expect(renderSentinelAlert(issues)).toMatch(/needs a look/i);
  });
});
