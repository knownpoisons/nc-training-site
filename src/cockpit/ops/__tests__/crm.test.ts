// ═══════════════════════════════════════════════════════════════════════════════
// CRM LEVEL-UP — reply capture + response drafting, call dates + follow-ups,
// dormant resurfacing, stakes line, skip flags, prospect notes/edits, dedupe,
// stage moves, natural dates.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { MemoryStore } from "../../store/memory";
import { FakeSlack } from "../../slack/fake";
import { handleMessage } from "../handle";
import { runMorningBrief } from "../brief";
import { computeScoreboard } from "../scoreboard";
import { parseNaturalDay } from "../../cadence/dates";
import { loadKnowledge } from "../../draft/knowledge";
import { FakeModel } from "../../draft/model";

const CHANNEL = "#c";
const TODAY = "2026-07-13"; // a Monday
const ctx = { channel: CHANNEL, today: TODAY, nowIso: `${TODAY}T18:00:00Z`, messageTs: "u1" };

function seedInSequence(store: MemoryStore, id = "P1", name = "Dana Lee") {
  store.seedProspect({ id, name, role: "Head of Brand", company: "Acme", addedAt: "2026-07-01" });
  const ts = store.seedSchedule(id, "2026-07-01");
  store.setTouch(ts[0].id, { dueDate: TODAY });
  return ts;
}

async function briefed(store: MemoryStore, slack: FakeSlack) {
  await runMorningBrief(store, slack, CHANNEL, TODAY, `${TODAY}T17:00:00Z`);
  slack.reset();
}

describe("reply capture → stored + response drafted", () => {
  it("`replied 1` then a pasted reply stores it and posts a drafted response", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedInSequence(store);
    await briefed(store, slack);

    const knowledge = loadKnowledge();
    const model = new FakeModel(() => "Thanks Dana — fair question on price. We keep budget flat and multiply output. Tuesday 10am or Thursday 2pm?");
    const ctxAI = { ...ctx, draftCtx: { model, knowledge } };

    await handleMessage(store, slack, ctxAI, "replied 1");
    expect(slack.transcript).toMatch(/paste their reply/i);
    slack.reset();

    await handleMessage(store, slack, ctxAI, "Interesting — but shouldn't AI make this cheaper, not $50k?");

    // stored on the card
    const detail = await store.getProspectDetail("P1");
    expect(detail!.prospect.notes).toMatch(/they replied/i);
    expect(detail!.events.some((e) => e.type === "reply" && String((e.payload as { text?: string }).text).includes("cheaper"))).toBe(true);
    // response draft posted
    expect(slack.transcript).toMatch(/response draft/i);
    expect(slack.transcript).toMatch(/Tuesday 10am/);
    // pending cleared — next message is NOT eaten
    expect(await store.getPending()).toBeNull();
  });

  it("a structured command escapes a stale pending state", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedInSequence(store);
    await briefed(store, slack);
    await handleMessage(store, slack, ctx, "replied 1");
    await handleMessage(store, slack, ctx, "pipeline"); // command, not a paste
    expect(await store.getPending()).toBeNull();
    expect(slack.transcript).toMatch(/\*Pipeline\*/);
  });
});

describe("call dates → logged + follow-ups scheduled + prep card", () => {
  it("`call booked 1` then `friday` logs the date and lays down touches 5–7", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedInSequence(store);
    await briefed(store, slack);

    await handleMessage(store, slack, ctx, "call booked 1");
    expect(slack.transcript).toMatch(/what date/i);
    slack.reset();

    await handleMessage(store, slack, ctx, "friday");
    const p = await store.getProspect("P1");
    expect(p!.stage).toBe("CALL");
    expect(p!.callAt).toBe("2026-07-17"); // Friday after Monday the 13th
    const nums = store.allTouchesFor("P1").map((t) => t.touchNumber).sort();
    expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7]);
    // day-2 follow-up lands Sunday → shifted Monday
    const t5 = store.allTouchesFor("P1").find((t) => t.touchNumber === 5)!;
    expect(t5.dueDate).toBe("2026-07-20");
    expect(slack.transcript).toMatch(/call logged/i);
  });

  it("the brief carries a prep card on call day", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    store.seedProspect({ id: "PC", name: "Marco B", company: "Northwind", addedAt: "2026-07-01", stage: "CALL", callAt: TODAY, dossier: "Runs a 12-person team (northwind.co)." });
    await runMorningBrief(store, slack, CHANNEL, TODAY, `${TODAY}T17:00:00Z`);
    expect(slack.transcript).toMatch(/Call today — Marco B/);
    expect(slack.transcript).toMatch(/northwind\.co/);
  });

  it("an unparseable date re-arms and asks again", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedInSequence(store);
    await briefed(store, slack);
    await handleMessage(store, slack, ctx, "call booked 1");
    await handleMessage(store, slack, ctx, "whenever suits them honestly");
    expect((await store.getPending())?.kind).toBe("call_date");
    expect(slack.transcript).toMatch(/couldn't read that as a date/i);
  });
});

describe("dormant resurfacing", () => {
  it("resurfaceDue revives due prospects into the NEW queue", async () => {
    const store = new MemoryStore();
    store.seedProspect({ id: "PD", name: "Old Lead", addedAt: "2026-01-01", stage: "DORMANT", resurfaceAt: "2026-07-10" });
    store.seedProspect({ id: "PN", name: "Not Yet", addedAt: "2026-01-01", stage: "DORMANT", resurfaceAt: "2026-09-01" });
    const n = await store.resurfaceDue(TODAY);
    expect(n).toBe(1);
    expect((await store.getProspect("PD"))!.stage).toBe("NEW");
    expect((await store.getProspect("PD"))!.notes).toMatch(/resurfaced/);
    expect((await store.getProspect("PN"))!.stage).toBe("DORMANT");
  });
});

describe("stakes line", () => {
  it("the brief opens with pipeline vs target", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    store.seedProspect({ id: "W1", name: "Won Co", addedAt: "2026-06-01", stage: "WON", dealValue: 50000 });
    store.seedProspect({ id: "C1", name: "Call Co", addedAt: "2026-06-01", stage: "CALL", dealValue: 80000 });
    seedInSequence(store);
    await runMorningBrief(store, slack, CHANNEL, TODAY, `${TODAY}T17:00:00Z`);
    expect(slack.transcript).toMatch(/\$50k closed of \$700k/);
    expect(slack.transcript).toMatch(/\$80k in play/);
  });
});

describe("scoreboard flags avoided prospects", () => {
  it("two skips on a touch names the prospect on Friday", () => {
    const sb = computeScoreboard({
      weekStart: "2026-07-13", weekEnd: "2026-07-19", today: "2026-07-17", programStart: "2026-07-01",
      prospects: [{ id: "P1", name: "Dana Lee", sourceEngine: "outbound", track: "A" }],
      touches: [{ prospectId: "P1", dueDate: "2026-07-15", sentAt: null, skippedCount: 2 }],
      events: [],
    });
    expect(sb.flagged).toEqual(["Dana Lee"]);
  });
});

describe("prospect notes, edits, stage moves, dedupe", () => {
  it("`note dana: …` appends to the card; newsletter notes still work", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedInSequence(store);
    await handleMessage(store, slack, ctx, "note Dana Lee: budget approved for Q4");
    expect((await store.getProspect("P1"))!.notes).toMatch(/budget approved/);
    await handleMessage(store, slack, ctx, "note remember to write about taste");
    expect((await store.getNewsletterNotes("2026-07")).length).toBe(1);
  });

  it("`set dana value 80k` and `set dana email …` patch the record", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedInSequence(store);
    await handleMessage(store, slack, ctx, "set Dana Lee value 80k");
    await handleMessage(store, slack, ctx, "set Dana Lee email dana@acme.co");
    const p = await store.getProspect("P1");
    expect(p!.dealValue).toBe(80000);
    expect(p!.email).toBe("dana@acme.co");
  });

  it("`move dana to proposal` moves the stage", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedInSequence(store);
    await handleMessage(store, slack, ctx, "move Dana Lee to proposal");
    expect((await store.getProspect("P1"))!.stage).toBe("PROPOSAL");
  });

  it("`add` captures email + dedupes on exact re-add", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    await handleMessage(store, slack, ctx, "add Nia Park, VP Marketing, Orbit, nia@orbit.co");
    const nia = await store.findProspectByEmail("nia@orbit.co");
    expect(nia).not.toBeNull();
    slack.reset();
    await handleMessage(store, slack, ctx, "add Nia Park, VP Marketing, Orbit");
    expect(slack.transcript).toMatch(/already tracking/i);
    expect((await store.pipelineCounts()).IN_SEQUENCE).toBe(1);
  });
});

describe("parseNaturalDay", () => {
  const today = "2026-07-13"; // Monday
  it("handles the shapes Jem will actually type", () => {
    expect(parseNaturalDay("2026-07-18", today)).toBe("2026-07-18");
    expect(parseNaturalDay("tomorrow", today)).toBe("2026-07-14");
    expect(parseNaturalDay("friday", today)).toBe("2026-07-17");
    expect(parseNaturalDay("jul 20", today)).toBe("2026-07-20");
    expect(parseNaturalDay("18/7", today)).toBe("2026-07-18");
    expect(parseNaturalDay("no idea yet", today)).toBeNull();
  });
});
