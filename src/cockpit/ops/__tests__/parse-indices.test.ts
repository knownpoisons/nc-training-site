// ═══════════════════════════════════════════════════════════════════════════════
// COMMAND PARSING — action numbers, the way people actually type them.
// These cases are taken from Jem's real #cockpit messages during the dry-run
// week, where "Done 123" and "Done 1-5" silently did the wrong thing.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { parseCommand } from "../parse";

function idx(text: string): number[] {
  const intent = parseCommand(text);
  if (intent.kind !== "done" && intent.kind !== "skip" && intent.kind !== "promote") {
    throw new Error(`unexpected intent: ${intent.kind}`);
  }
  return intent.indices;
}

describe("action numbers", () => {
  it("handles spaced numbers", () => {
    expect(idx("done 1 2 3")).toEqual([1, 2, 3]);
  });

  it("handles comma-separated numbers", () => {
    expect(idx("done 1,2")).toEqual([1, 2]);
  });

  it("expands a range — 'Done 1-5' meant five actions, not two", () => {
    expect(idx("Done 1-5")).toEqual([1, 2, 3, 4, 5]);
  });

  it("splits a run-together digit string — 'Done 123' meant 1, 2 and 3", () => {
    expect(idx("Done 123")).toEqual([1, 2, 3]);
  });

  it("leaves a genuine two-digit number alone (digest can reach 10)", () => {
    expect(idx("promote 10")).toEqual([10]);
  });

  it("dedupes overlapping input", () => {
    expect(idx("done 1-3 2")).toEqual([1, 2, 3]);
  });

  it("still reads a single action", () => {
    expect(idx("skip 3")).toEqual([3]);
  });
});
