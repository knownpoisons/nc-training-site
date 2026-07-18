// ═══════════════════════════════════════════════════════════════════════════════
// CALL DEBRIEF — the shared fileDebrief write path (used by the Granola sync) and
// the prospectsAwaitingDebrief selector.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { MemoryStore } from "../../store/memory";
import { FakeModel } from "../../draft/model";
import { fileDebrief } from "../debrief";

const TODAY = "2026-07-13";
const NOW = `${TODAY}T02:00:00Z`;

describe("fileDebrief", () => {
  it("distills the transcript, files the brief, logs the event, notes the card", async () => {
    const store = new MemoryStore();
    const p = store.seedProspect({ id: "P1", name: "Dana Lee", company: "Acme", addedAt: "2026-07-01" });

    const model = new FakeModel(
      () =>
        "CARED: speed of production\nOBJECTIONS: price\nPERSONAL: two kids\nNEXT: proposal Friday\nREAD: warm, ready to move"
    );

    const filed = await fileDebrief(store, model, p.id, "…full transcript…", {
      today: TODAY,
      nowIso: NOW,
      noteSource: "auto-filed from Granola",
    });

    expect(filed).not.toBeNull();
    expect(filed!.callBrief).toMatch(/CARED: speed of production/);

    const detail = await store.getProspectDetail("P1");
    expect(detail!.prospect.callBrief).toMatch(/OBJECTIONS: price/);
    expect(detail!.prospect.notes).toMatch(/auto-filed from Granola/);
    expect(detail!.events.some((e) => e.type === "call_debrief")).toBe(true);
  });

  it("falls back to raw notes when no model is wired", async () => {
    const store = new MemoryStore();
    const p = store.seedProspect({ id: "P2", name: "Rob", addedAt: "2026-07-01" });
    const filed = await fileDebrief(store, null, p.id, "they liked it, follow up next week", {
      today: TODAY,
      nowIso: NOW,
    });
    expect(filed!.callBrief).toMatch(/raw notes/);
  });

  it("returns null if the prospect has vanished", async () => {
    const store = new MemoryStore();
    const filed = await fileDebrief(store, null, "ghost", "x", { today: TODAY, nowIso: NOW });
    expect(filed).toBeNull();
  });
});

describe("prospectsAwaitingDebrief (store selector)", () => {
  it("selects only recent-call prospects that still lack a brief", async () => {
    const store = new MemoryStore();
    // had a call yesterday, no brief → awaiting
    store.seedProspect({ id: "A", name: "Awaiting", addedAt: "2026-07-01", callAt: "2026-07-12" });
    // had a call, already briefed → not awaiting
    store.seedProspect({ id: "B", name: "Done", addedAt: "2026-07-01", callAt: "2026-07-12", callBrief: "CARED: x" });
    // call is older than the window → not awaiting
    store.seedProspect({ id: "C", name: "Old", addedAt: "2026-06-01", callAt: "2026-06-01" });
    // no call at all → not awaiting
    store.seedProspect({ id: "D", name: "NoCall", addedAt: "2026-07-01" });

    const awaiting = await store.prospectsAwaitingDebrief("2026-07-06");
    expect(awaiting.map((p) => p.id)).toEqual(["A"]);
  });
});
