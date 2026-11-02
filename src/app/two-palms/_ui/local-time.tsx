"use client";
import { useEffect, useState } from "react";

/** Just the clock time of an ISO instant, in the viewer's timezone (Sydney on the server). */
export function LocalTime({ iso }: { iso: string }) {
  const [tz, setTz] = useState<string | undefined>("Australia/Sydney");
  useEffect(() => { const t = setTimeout(() => setTz(undefined), 0); return () => clearTimeout(t); }, []);
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short" }).formatToParts(new Date(iso));
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return <>{`${g("hour")}:${g("minute")}${g("dayPeriod").toLowerCase()} ${g("timeZoneName")}`}</>;
}
