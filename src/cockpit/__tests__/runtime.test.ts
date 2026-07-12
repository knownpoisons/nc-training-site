import { describe, it, expect } from "vitest";
import { localParts } from "../runtime";

// The timezone gating is what makes the crons survive the HST → Thailand move.
// These pin the two timezones Jem will actually use.
describe("localParts — local day/hour per timezone", () => {
  // 2026-01-19 17:00 UTC.
  const instant = new Date("2026-01-19T17:00:00Z");

  it("Honolulu (UTC-10): 17:00 UTC is 07:00 local, same day", () => {
    const { day, hour } = localParts("Pacific/Honolulu", instant);
    expect(day).toBe("2026-01-19");
    expect(hour).toBe(7); // this is Jem's 7am brief hour
  });

  it("Bangkok (UTC+7): 17:00 UTC is 00:00 the NEXT day", () => {
    const { day, hour } = localParts("Asia/Bangkok", instant);
    expect(day).toBe("2026-01-20");
    expect(hour).toBe(0);
  });

  it("the same brief hour (7) lands correctly after the move", () => {
    // 7am in Bangkok = 00:00 UTC. Confirm the gate would fire then.
    const bkk7am = new Date("2026-01-20T00:00:00Z");
    const { hour } = localParts("Asia/Bangkok", bkk7am);
    expect(hour).toBe(7);
  });
});
