"use client";

// Session times in the viewer's own timezone. The server renders Sydney so the
// page never flashes empty; the browser swaps in local time after mount.
import { useEffect, useState } from "react";

function fmt(iso: string, tz?: string) {
  const d = new Date(iso);
  // Built from parts so server and browser ICU builds can't disagree on commas.
  const dp = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).formatToParts(d);
  const q = (t: string) => dp.find((x) => x.type === t)?.value ?? "";
  const day = `${q("weekday")} ${q("day")} ${q("month")}`;
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return { day, time: `${g("hour")}:${g("minute")}${g("dayPeriod").toLowerCase()}` };
}

export function LocalWhen({ iso, mins, toConfirm }: { iso: string | null; mins?: number; toConfirm?: string }) {
  const [tz, setTz] = useState<string | undefined>("Australia/Sydney");
  useEffect(() => { const t = setTimeout(() => setTz(undefined), 0); return () => clearTimeout(t); }, []);
  if (!iso) return <span className="lw"><span className="lw-d">{toConfirm ?? "To confirm"}</span><span className="lw-t">Date to confirm</span></span>;
  const f = fmt(iso, tz);
  return (
    <span className="lw">
      <span className="lw-d">{f.day}</span>
      <span className="lw-t">{f.time}{mins ? ` · ${mins} min` : ""}</span>
    </span>
  );
}
