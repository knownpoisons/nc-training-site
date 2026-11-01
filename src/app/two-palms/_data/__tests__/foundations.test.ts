import { describe, expect, it } from "vitest";
import raw from "../foundations-hub-content.json";
import { FOUNDATIONS, FOUNDATIONS_CONTENT, FOUNDATIONS_SESSIONS, TOOLS } from "../hub";
import {
  TMP_OPENS_ISO, TOOLS_OPENS_ISO, nextEvent, presenterFor, scheduleEvents, sessionByParam, teamSession, tmpIsOpen, toolsAreOpen, twoZones,
} from "../foundations";
import { TMP_QUESTIONS, tmpCsv, tmpSummary, validateTmp } from "../tmp";

describe("hub.ts reads the Foundations JSON", () => {
  it("has 8 sessions whose labels match the JSON", () => {
    expect(FOUNDATIONS_SESSIONS).toHaveLength(8);
    expect(FOUNDATIONS.sessions).toHaveLength(8);
    FOUNDATIONS_SESSIONS.forEach((s, i) => {
      expect(s.label).toBe(raw.sessions[i].label);
      expect(s.label).toBe(`AI Foundations Training · Session ${i + 1}: ${s.name.charAt(0)}${s.name.slice(1).toLowerCase()}`);
    });
    expect(FOUNDATIONS.sessions[0].title).toBe("Shift");
    expect(FOUNDATIONS.sessions[0].startsAt).toBe(raw.sessions[0].when.start_iso);
    expect(FOUNDATIONS_CONTENT.programme.through_line).toBe("You direct. It makes.");
  });
  it("finds sessions by number or key", () => {
    expect(sessionByParam("1")?.key).toBe("shift");
    expect(sessionByParam("shift")?.n).toBe(1);
    expect(sessionByParam("9")).toBeNull();
  });
});

describe("schedule times in Sydney and Munich", () => {
  it("Session 1 is 5:30pm Sydney, 7:30am Munich", () => {
    const z = twoZones(sessionByParam("1")!.when.start_iso);
    expect(z.sydney).toBe("5:30pm");
    expect(z.munich).toBe("7:30am");
    expect(z.sydneyDay).toBe("Mon 2 Nov");
  });
  it("the pre-brief is 1:00pm Sydney, 3:00am Munich", () => {
    const z = twoZones(FOUNDATIONS_CONTENT.pre_brief.start_iso);
    expect(z.sydney).toBe("1:00pm");
    expect(z.munich).toBe("3:00am");
  });
  it("every session's computed times match the JSON local values", () => {
    for (const s of FOUNDATIONS_SESSIONS) {
      const z = twoZones(s.when.start_iso);
      expect(z.sydney).toBe(s.when.local.sydney);
      expect(z.munich).toBe(s.when.local.munich);
    }
  });
  it("lists pre-brief, 8 sessions and 2 office hours in order, office hours to confirm", () => {
    const ev = scheduleEvents();
    expect(ev.map((e) => e.id)).toEqual(["prebrief", "s1", "s2", "s3", "s4", "oh1", "s5", "s6", "s7", "oh2", "s8"]);
    expect(ev.filter((e) => e.toConfirm).map((e) => e.id)).toEqual(["oh1", "oh2"]);
  });
  it("counts down to the pre-brief first, then Session 1", () => {
    expect(nextEvent(new Date("2026-11-01T12:00:00+11:00"))?.id).toBe("prebrief");
    expect(nextEvent(new Date("2026-11-02T13:30:00+11:00"))?.id).toBe("s1");
    expect(nextEvent(new Date("2026-11-02T18:00:00+11:00"))?.id).toBe("s1"); // live
    expect(nextEvent(new Date("2026-11-02T19:00:00+11:00"))?.id).toBe("s2");
  });
});

describe("presenter content is admin-only", () => {
  const s1 = sessionByParam("1")!;
  it("returns nothing for the team", () => {
    expect(presenterFor(s1, false)).toBeNull();
  });
  it("returns run of show, slides and notes for Backstage", () => {
    const p = presenterFor(s1, true)!;
    expect(p.ros.length).toBeGreaterThan(0);
    expect(p.slides).toEqual(s1.slides);
    expect(p.notes).toBe(s1.notes);
  });
  it("the team view carries no presenter fields at all", () => {
    for (const s of FOUNDATIONS_SESSIONS) {
      const t = teamSession(s) as unknown as Record<string, unknown>;
      expect(t.ros).toBeUndefined();
      expect(t.slides).toBeUndefined();
      expect(t.notes).toBeUndefined();
      const json = JSON.stringify(t);
      // beats that also appear in the team's own "what we'll cover" copy are fine
      for (const [, beat] of s.ros) if (!s.cover.some((c) => c.includes(beat))) expect(json).not.toContain(beat);
      if (s.notes) expect(json).not.toContain(s.notes);
      expect(json).not.toContain("big5");
    }
  });
});

describe("Time · Money · Pain", () => {
  it("is locked before the end of Session 1, open after; admins can open it early", () => {
    expect(TMP_OPENS_ISO).toBe("2026-11-02T18:30:00+11:00");
    expect(tmpIsOpen(new Date("2026-11-02T18:29:59+11:00"))).toBe(false);
    expect(tmpIsOpen(new Date("2026-11-02T18:30:00+11:00"))).toBe(true);
    expect(tmpIsOpen(new Date("2026-11-01T09:00:00+11:00"), true)).toBe(true);
  });
  it("asks a required name first, then the JSON questions", () => {
    expect(TMP_QUESTIONS[0].id).toBe("name");
    expect(TMP_QUESTIONS.slice(1).map((q) => q.id)).toEqual(raw.forms.time_money_pain.questions.map((q) => q.id));
  });
  it("validates answers and rejects made-up choices", () => {
    const good = { name: "A B", role: "Strategy", office: "Sydney", time: "x", time_hours: "1 to 3", money: "y", money_hours: "10+", pain: "z", pain_hours: "Under 1", dream: "Pain" };
    const v = validateTmp(good);
    expect(v.ok).toBe(true);
    expect(validateTmp({ ...good, name: "" }).ok).toBe(false);
    expect(validateTmp({ ...good, time_hours: "40" }).ok).toBe(false);
    expect(validateTmp({ ...good, role: "Other" }).ok).toBe(false);
    expect(validateTmp({ ...good, role: "Other", role_other: "Intern" }).ok).toBe(true);
    const s = tmpSummary([good as never, { ...good, dream: "Time" } as never]);
    expect(s.total).toBe(2);
    expect(s.dream.find((d) => d.label === "Pain")?.n).toBe(1);
    expect(s.hours.money.find((d) => d.label === "10+")?.n).toBe(2);
    expect(tmpCsv([{ ...good, time: "=cmd()" } as never]).split("\n")[1]).toContain("'=cmd()");
  });
});

describe("Approved team-built tools", () => {
  it("locks before the end of Session 6, opens after", () => {
    expect(TOOLS_OPENS_ISO).toBe("2026-12-08T18:30:00+11:00");
    expect(toolsAreOpen(new Date("2026-11-02T12:00:00+11:00"))).toBe(false);
    expect(toolsAreOpen(new Date("2026-12-08T18:29:00+11:00"))).toBe(false);
    expect(toolsAreOpen(new Date("2026-12-08T18:30:00+11:00"))).toBe(true);
    expect(Array.isArray(TOOLS)).toBe(true);
  });
});
