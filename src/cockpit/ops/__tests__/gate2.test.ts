// ═══════════════════════════════════════════════════════════════════════════════
// GATE 2 — the Slack loop, end to end, against an in-memory store + fake Slack.
//
// This is the automated stand-in for the handoff's "round-trip test in a test
// channel": message → DB state change → confirmation in channel. Every command
// asserts the DB state AFTER it runs. The live-channel confirmation is a thin
// final check once Jem's Slack workspace exists.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStore } from "../../store/memory";
import { FakeSlack } from "../../slack/fake";
import { runMorningBrief } from "../brief";
import { runNudge } from "../nudge";
import { handleMessage } from "../handle";

const CHANNEL = "#cockpit-test";
const TODAY = "2026-01-19"; // a Monday
const NOW = "2026-01-19T17:00:00Z";

const FUTURE = "2026-02-18"; // comfortably after TODAY — a "not yet due" date

/**
 * Seed one realistic in-sequence prospect: every touch before `dueTouch` is
 * already sent, `dueTouch` is due today, and every later touch sits in the
 * future (not yet due). This mirrors real state — exactly one touch pending.
 */
function seedProspectWithDueTouch(
  store: MemoryStore,
  args: { id: string; name: string; addedAt: string; dueTouch: number; role?: string; company?: string }
) {
  const p = store.seedProspect({
    id: args.id,
    name: args.name,
    role: args.role,
    company: args.company,
    addedAt: args.addedAt,
  });
  const touches = store.seedSchedule(args.id, args.addedAt);
  for (const t of touches) {
    if (t.touchNumber < args.dueTouch) store.setTouch(t.id, { sentAt: args.addedAt });
    else if (t.touchNumber === args.dueTouch) store.setTouch(t.id, { dueDate: TODAY });
    else store.setTouch(t.id, { dueDate: FUTURE });
  }
  return { prospect: p, touches };
}

function seedTwelveDue(store: MemoryStore) {
  // Three prospects at different points in their sequence, so the ordering
  // (warmest / highest touch number first) is observable.
  const p1 = seedProspectWithDueTouch(store, { id: "P1", name: "Dana Lee", role: "Head of Brand", company: "Acme", addedAt: "2026-01-05", dueTouch: 3 });
  const p2 = seedProspectWithDueTouch(store, { id: "P2", name: "Sam Ruiz", role: "CD", company: "Fable", addedAt: "2026-01-06", dueTouch: 2 });
  const p3 = seedProspectWithDueTouch(store, { id: "P3", name: "Kim Vale", role: "Founder", company: "Vale Co", addedAt: "2026-01-07", dueTouch: 1 });
  return { p1, p2, p3 };
}

describe("Gate 2 · Morning Brief posts correctly", () => {
  let store: MemoryStore;
  let slack: FakeSlack;

  beforeEach(() => {
    store = new MemoryStore();
    slack = new FakeSlack();
  });

  it("posts exactly one message with the due actions, replies-first / warmest-first", async () => {
    seedTwelveDue(store);
    // Add a replied prospect — must sort to the very top.
    store.seedProspect({ id: "PR", name: "Rae Kwon", company: "Loop", addedAt: "2026-01-04", stage: "REPLIED" });

    const res = await runMorningBrief(store, slack, CHANNEL, TODAY, NOW);

    expect(res.posted).toBe(true);
    expect(slack.messages).toHaveLength(1);
    expect(res.actionCount).toBe(4); // PR reply + P1 t3 + P2 t2 + P3 t1

    const brief = await store.getBrief(TODAY);
    expect(brief).not.toBeNull();
    // action 1 = the reply, then warmest touch first
    expect(brief!.actions[0].kind).toBe("reply");
    expect(brief!.actions[0].prospectId).toBe("PR");
    expect(brief!.actions[1].label).toContain("touch 3"); // P1
    expect(brief!.actions[2].label).toContain("touch 2"); // P2
    expect(brief!.actions[3].label).toContain("touch 1"); // P3
  });

  it("caps the brief at 8 and rolls the rest to tomorrow", async () => {
    for (let i = 1; i <= 11; i++) {
      seedProspectWithDueTouch(store, { id: `X${i}`, name: `Prospect ${i}`, addedAt: "2026-01-05", dueTouch: 1 });
    }
    const res = await runMorningBrief(store, slack, CHANNEL, TODAY, NOW);
    expect(res.actionCount).toBe(8);
    expect(res.overflow).toBe(3);
    expect(slack.messages[0].text).toContain("3 more due");
  });

  it("never posts an empty brief — posts the light line instead", async () => {
    const res = await runMorningBrief(store, slack, CHANNEL, TODAY, NOW);
    expect(res.empty).toBe(true);
    expect(slack.messages).toHaveLength(1);
    expect(slack.messages[0].text.toLowerCase()).toContain("nothing due");
  });
});

describe("Gate 2 · commands round-trip (message → DB change → confirmation)", () => {
  let store: MemoryStore;
  let slack: FakeSlack;

  async function setup() {
    store = new MemoryStore();
    slack = new FakeSlack();
    seedTwelveDue(store);
    await runMorningBrief(store, slack, CHANNEL, TODAY, NOW);
    slack.reset(); // drop the brief message so we assert only on command output
  }

  const ctx = { channel: CHANNEL, today: TODAY, nowIso: "2026-01-19T18:00:00Z", messageTs: "u_1" };

  it("done → touch marked sent + ✅ reaction + confirmation", async () => {
    await setup();
    const brief = (await store.getBrief(TODAY))!;
    const touchAction = brief.actions.find((a) => a.kind === "touch")!;

    const res = await handleMessage(store, slack, ctx, `done ${touchAction.n}`);

    expect(res.confirmed).toBe(true);
    // DB: the referenced touch is now sent
    const t = store.allTouchesFor(touchAction.prospectId).find((x) => x.id === touchAction.touchId)!;
    expect(t.sentAt).toBe(TODAY);
    // Slack: a ✅ reaction and a text confirmation
    expect(slack.reactions.some((r) => r.emoji === "white_check_mark")).toBe(true);
    expect(slack.messages.some((m) => /logged sent/i.test(m.text))).toBe(true);
  });

  it("done on touch 4 → prospect goes DORMANT with a resurface date", async () => {
    store = new MemoryStore();
    slack = new FakeSlack();
    store.seedProspect({ id: "PZ", name: "Zed Ali", addedAt: "2025-12-01" });
    const ts = store.seedSchedule("PZ", "2025-12-01");
    // touches 1–3 sent, touch 4 due today
    store.setTouch(ts[0].id, { sentAt: "2025-12-01" });
    store.setTouch(ts[1].id, { sentAt: "2025-12-04" });
    store.setTouch(ts[2].id, { sentAt: "2025-12-12" });
    store.setTouch(ts[3].id, { dueDate: TODAY });
    await runMorningBrief(store, slack, CHANNEL, TODAY, NOW);

    const brief = (await store.getBrief(TODAY))!;
    const t4 = brief.actions.find((a) => a.touchNumber === 4)!;
    await handleMessage(store, slack, ctx, `done ${t4.n}`);

    const p = await store.getProspect("PZ");
    expect(p!.stage).toBe("DORMANT");
    expect(p!.resurfaceAt).toBe("2026-04-19"); // 2026-01-19 + 90 days
  });

  it("skip → touch pushed +2 days, skip event logged, confirmation", async () => {
    await setup();
    const brief = (await store.getBrief(TODAY))!;
    const a = brief.actions.find((x) => x.kind === "touch")!;
    const before = store.allTouchesFor(a.prospectId).find((x) => x.id === a.touchId)!.dueDate;

    await handleMessage(store, slack, ctx, `skip ${a.n}`);

    const after = store.allTouchesFor(a.prospectId).find((x) => x.id === a.touchId)!;
    expect(after.dueDate).not.toBe(before);
    expect(after.skippedCount).toBe(1);
    expect(store.events.some((e) => e.type === "skip")).toBe(true);
    expect(slack.messages.some((m) => /pushed \+2/i.test(m.text))).toBe(true);
  });

  it("add → new prospect created with a full 4-touch schedule + confirmation", async () => {
    await setup();
    const before = (await store.pipelineCounts()).IN_SEQUENCE;

    const res = await handleMessage(store, slack, ctx, "add Nia Park, VP Marketing, Orbit");

    const after = (await store.pipelineCounts()).IN_SEQUENCE;
    expect(after).toBe(before + 1);
    const created = await store.getProspect(res.note!);
    expect(created!.name).toBe("Nia Park");
    expect(created!.company).toBe("Orbit");
    expect(store.allTouchesFor(created!.id)).toHaveLength(4);
    expect(slack.messages.some((m) => /added/i.test(m.text))).toBe(true);
  });

  it("replied → prospect REPLIED, remaining touches halted, confirmation", async () => {
    await setup();
    const brief = (await store.getBrief(TODAY))!;
    const a = brief.actions.find((x) => x.kind === "touch")!;

    await handleMessage(store, slack, ctx, `replied ${a.n}`);

    const p = await store.getProspect(a.prospectId);
    expect(p!.stage).toBe("REPLIED");
    const live = store.allTouchesFor(a.prospectId).filter((t) => !t.sentAt && !t.halted);
    expect(live).toHaveLength(0); // every unsent touch halted
    expect(slack.messages.some((m) => /REPLIED/.test(m.text))).toBe(true);
  });

  it("rewrite → draft text updated + confirmation", async () => {
    await setup();
    const brief = (await store.getBrief(TODAY))!;
    const a = brief.actions.find((x) => x.kind === "touch")!;

    await handleMessage(store, slack, ctx, `rewrite ${a.n} shorter`);

    const t = store.allTouchesFor(a.prospectId).find((x) => x.id === a.touchId)!;
    expect(t.draftText).toContain("rewritten: shorter");
    expect(slack.messages.some((m) => /rewrote/i.test(m.text))).toBe(true);
  });

  it("pause → prospect paused + confirmation", async () => {
    await setup();
    await handleMessage(store, slack, ctx, "pause Dana Lee");
    const p = await store.getProspect("P1");
    expect(p!.paused).toBe(true);
    expect(slack.messages.some((m) => /paused/i.test(m.text))).toBe(true);
  });

  it("a paused prospect drops out of the next brief", async () => {
    await setup();
    await store.setPaused("P1", true);
    slack.reset();
    await runMorningBrief(store, slack, "2026-01-20", "2026-01-20", "2026-01-20T17:00:00Z");
    const brief = (await store.getBrief("2026-01-20"))!;
    expect(brief.actions.some((a) => a.prospectId === "P1")).toBe(false);
  });

  it("an unknown message is never silent — routes to the F5 stub", async () => {
    await setup();
    const res = await handleMessage(store, slack, ctx, "what should I do about the cold ones?");
    expect(res.intent).toBe("conversational");
    expect(slack.messages).toHaveLength(1); // confirmation, never silent
  });
});

describe("Gate 2 · the Nudge (F8) — once, only when silent", () => {
  let store: MemoryStore;
  let slack: FakeSlack;

  beforeEach(async () => {
    store = new MemoryStore();
    slack = new FakeSlack();
    seedTwelveDue(store);
    await runMorningBrief(store, slack, CHANNEL, TODAY, NOW);
    slack.reset();
  });

  it("fires once when there has been no interaction", async () => {
    const res = await runNudge(store, slack, CHANNEL, TODAY, "2026-01-19T23:00:00Z");
    expect(res.fired).toBe(true);
    expect(slack.messages).toHaveLength(1);
    expect(slack.messages[0].text).toContain("still open");
  });

  it("never fires twice", async () => {
    await runNudge(store, slack, CHANNEL, TODAY, "2026-01-20T00:00:00Z");
    slack.reset();
    const second = await runNudge(store, slack, CHANNEL, TODAY, "2026-01-20T00:05:00Z");
    expect(second.fired).toBe(false);
    expect(second.reason).toBe("already-nudged");
    expect(slack.messages).toHaveLength(0);
  });

  it("does not fire if Jem interacted after the brief", async () => {
    // any command records interaction
    await handleMessage(
      store,
      slack,
      { channel: CHANNEL, today: TODAY, nowIso: "2026-01-19T19:00:00Z", messageTs: "u_1" },
      "pipeline"
    );
    slack.reset();
    const res = await runNudge(store, slack, CHANNEL, TODAY, "2026-01-20T00:00:00Z");
    expect(res.fired).toBe(false);
    expect(res.reason).toBe("already-interacted");
    expect(slack.messages).toHaveLength(0);
  });
});
