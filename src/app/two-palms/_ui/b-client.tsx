"use client";

// Client pieces of the Bento hub: the header (clocks, countdown pill, menu),
// countdowns, the set-up meter and the Backstage unlock. Times always show in
// Sydney and Munich; nothing here is content, it all arrives as props.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { adminLogin } from "../_lib/actions";

export interface CountEventP { title: string; short: string; start_iso: string; duration_min: number; href: string | null }

// ─── time helpers (client) ──────────────────────────────────────────────────────
function clock(d: Date, tz: string) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${g("hour")}:${g("minute")}${g("dayPeriod").toLowerCase()}`;
}
function hourIn(d: Date, tz: string) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "numeric", minute: "numeric", hour12: false }).formatToParts(d);
  return (Number(p.find((x) => x.type === "hour")?.value ?? 12) % 24) + Number(p.find((x) => x.type === "minute")?.value ?? 0) / 60;
}

export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const t0 = setTimeout(() => setNow(new Date()), 0);
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => { clearTimeout(t0); clearInterval(t); };
  }, [intervalMs]);
  return now;
}

export function pickNext(events: CountEventP[], now: Date): CountEventP | null {
  const t = now.getTime();
  return events.find((e) => new Date(e.start_iso).getTime() + e.duration_min * 60000 > t) ?? null;
}

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

// ─── skylines ───────────────────────────────────────────────────────────────────
function Orb({ d, tz }: { d: Date | null; tz: string }) {
  let x = 46, y = 5;
  if (d) {
    const t = hourIn(d, tz);
    const night = t < 6 || t >= 19;
    if (night) { x = 52; y = 3.4; } else { const f = (t - 6) / 13; x = 5 + f * 50; y = 7.2 - Math.sin(f * Math.PI) * 4.6; }
  }
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <circle className="sun" r="1.9" />
      <path className="moon" d="M.9-2.1a2.3 2.3 0 1 0 0 4.2 1.8 1.8 0 1 1 0-4.2z" />
    </g>
  );
}
const SYD = (
  <>
    <path d="M2 17H58" /><path d="M5 17V15.6H24V17" />
    <path d="M6.5 15.6Q8.5 9.6 13.5 7.6Q11.8 11.6 12.3 15.6M11 15.6Q13.6 10.4 18.6 9.2Q16.8 12.6 17.2 15.6M15.8 15.6Q18.2 12.4 22.4 12Q21 13.8 21.4 15.6" />
    <path d="M30 17Q41-1 52 17" /><path d="M28 13.5H54" /><path d="M30.6 17V11.4H32.8V17M49.2 17V11.4H51.4V17" /><path d="M36 9.9V13.5M41 8V13.5M46 9.9V13.5" />
    <path className="ripple" d="M3 20.6H57" />
  </>
);
const MUC = (
  <>
    <path d="M2 17H58" /><path d="M3 17V13L6 10.5L9 13V17" /><path d="M10.5 17V11.2L13.6 9.6H14M24 9.6H24.4L27.5 11.2V17" />
    <path d="M14 17V7.2H18V17M20 17V7.2H24V17M18 11H20" /><path d="M14 7.2Q14 3.6 16 2.8Q18 3.6 18 7.2M20 7.2Q20 3.6 22 2.8Q24 3.6 24 7.2M16 2.8V1.3M22 2.8V1.3" />
    <path d="M34.5 17V9.4H39.5V17M34.5 9.4L37 3.2L39.5 9.4M37 3.2V1.6M36.2 12.4H37.8" /><path d="M42 17V12.2L45 9.8L48 12.2V17M48 17V13.4L51 11.2L54 13.4V17" />
    <path className="win" d="M44.6 14.4H45.4M50.6 15H51.4M6 14.6H6.8" />
  </>
);

function Zones() {
  const now = useNow(20000);
  const [own, setOwn] = useState("");
  useEffect(() => { const t = setTimeout(() => setOwn(Intl.DateTimeFormat().resolvedOptions().timeZone || ""), 0); return () => clearTimeout(t); }, []);
  const z = [
    { tz: "Australia/Sydney", city: "Sydney", art: SYD, own: own.startsWith("Australia/") },
    { tz: "Europe/Berlin", city: "Munich", art: MUC, own: own.startsWith("Europe/") },
  ];
  return (
    <ul className="tpb-zones" aria-label="Office times">
      {z.map((c) => {
        const h = now ? hourIn(now, c.tz) : 12;
        const night = h < 6 || h >= 19;
        return (
          <li key={c.tz} className={`tpb-zone${c.own ? " is-own" : ""}${night ? " is-night" : ""}`}>
            <svg className="tpb-sky" viewBox="0 0 60 24" aria-hidden="true" focusable="false"><Orb d={now} tz={c.tz} />{c.art}</svg>
            <span className="tpb-zone-t"><span className="city">{c.city}</span><time className="mono">{now ? clock(now, c.tz) : "--:--"}</time></span>
          </li>
        );
      })}
    </ul>
  );
}

function JoinPill({ events }: { events: CountEventP[] }) {
  const now = useNow(30000);
  const e = now ? pickNext(events, now) : events[0] ?? null;
  if (!e) return null;
  let txt = "";
  if (now) {
    const start = new Date(e.start_iso).getTime();
    if (now.getTime() >= start) txt = "on now";
    else { const p = split(start - now.getTime()); txt = p.d ? `in ${p.d}d ${p.h}h` : `in ${p.h}h ${String(p.m).padStart(2, "0")}m`; }
  }
  return (
    <Link className="tpb-join" href={e.href ?? "/two-palms/foundations"} aria-label={`Next: ${e.title}`}>
      <i className="dot dot--live" aria-hidden="true" />
      <span>{e.short} <em>{txt || " "}</em></span>
    </Link>
  );
}

// ─── header + menu ──────────────────────────────────────────────────────────────
export interface MenuArea { href: string; label: string; img: string; status: string; wait?: boolean }
export interface MenuSession { href: string; label: string; when: string }

export function Header({ events, areas, sessions }: { events: CountEventP[]; areas: MenuArea[]; sessions: MenuSession[] }) {
  const [open, setOpen] = useState(false);
  const p = usePathname() ?? "";
  const btn = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => setOpen(false), 0); return () => clearTimeout(t); }, [p]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    sheet.current?.querySelector<HTMLElement>("a")?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);
  const isHere = (h: string) => (h === "/two-palms" ? p === "/two-palms" : p === h || p.startsWith(h + "/"));
  return (
    <header className="tpb-top">
      <a className="skip" href="#main">Skip to content</a>
      <div className="tpb-bar">
        <Link className="tpb-lockup" href="/two-palms" aria-label="Two Palms AI Hub, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="tpb-mark" src="/two-palms/mark-black.png" alt="" width={28} height={28} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="tpb-wmark" src="/two-palms/wordmark-black.png" alt="" />
          <span className="tpb-hubname" aria-hidden="true">AI Hub</span>
        </Link>
        <button ref={btn} className="tpb-menu-btn" type="button" aria-label="Menu" aria-expanded={open} aria-controls="tpb-menu" onClick={() => setOpen((o) => !o)}>
          <span className="tpb-mb-ic" aria-hidden="true"><i /><i /><i /></span><span className="mb-l">Menu</span>
        </button>
        <Zones />
        <JoinPill events={events} />
      </div>
      {open ? (
        <div className="tpb-menu" id="tpb-menu" role="dialog" aria-modal="true" aria-label="Menu" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="tpb-menu-in" ref={sheet}>
            <div className="tpb-menu-body">
              <section aria-labelledby="tpb-m-areas">
                <h2 className="tpb-mh" id="tpb-m-areas"><span>Areas</span><span className="tpb-mh-r">{String(areas.length).padStart(2, "0")}</span></h2>
                <ul className="tpb-mrows">
                  {areas.map((a) => (
                    <li key={a.href}>
                      <Link className="tpb-mrow" href={a.href} aria-current={isHere(a.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <span className={`win${a.wait ? " is-wait" : ""}`}><img src={a.img} alt="" width={36} height={36} loading="lazy" /></span>
                        <span className="tpb-mrow-n">{a.label}</span>
                        <span className="tpb-mrow-s">{a.status}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="tpb-m-sessions">
                <h2 className="tpb-mh" id="tpb-m-sessions"><span>AI Foundations</span><span className="tpb-mh-r">{String(sessions.length).padStart(2, "0")}</span></h2>
                <ul className="tpb-mrows">
                  {sessions.map((s, i) => (
                    <li key={s.href}>
                      <Link className="tpb-mrow" href={s.href} aria-current={p === s.href ? "page" : undefined} onClick={() => setOpen(false)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <span className="win is-wait"><img src={`/two-palms/img/session-0${i + 1}.jpg`} alt="" width={36} height={36} loading="lazy" /></span>
                        <span className="tpb-mrow-n">{s.label}</span>
                        <span className="tpb-mrow-s">{s.when}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

// ─── countdown tile body ────────────────────────────────────────────────────────
export function NextUpBody({ events, fallback }: { events: CountEventP[]; fallback: CountEventP | null }) {
  const now = useNow(1000);
  const e = now ? pickNext(events, now) : fallback;
  if (!e) return <p className="tp">That&rsquo;s the programme. Recordings stay on each session page.</p>;
  const start = new Date(e.start_iso).getTime();
  const live = now ? now.getTime() >= start : false;
  const p = now ? split(start - now.getTime()) : null;
  const pad = (n: number | undefined) => (n === undefined ? "--" : String(n).padStart(2, "0"));
  return (
    <>
      <h3 className="tt">{e.title}</h3>
      <div className="lockup-t" style={{ marginTop: 12 }}>
        <span className="big mono">{clockStatic(e.start_iso, "Australia/Sydney")}</span><span className="lab-x">Sydney</span>
      </div>
      <p className="zone2"><b>{clockStatic(e.start_iso, "Europe/Berlin")}</b> Munich · {dayStatic(e.start_iso, "Australia/Sydney")} · {e.duration_min} min</p>
      <div className="cd-in" aria-live="off">
        <span className="lab-x">{live ? "On now" : "Starts in"}</span>
        <span className="count mono" aria-label={p ? `${p.d} days ${p.h} hours ${p.m} minutes` : undefined}>
          <span className="cu"><b>{pad(p?.d)}</b><i>d</i></span>
          <span className="cu"><b>{pad(p?.h)}</b><i>h</i></span>
          <span className="cu"><b>{pad(p?.m)}</b><i>m</i></span>
        </span>
      </div>
    </>
  );
}
function clockStatic(iso: string, tz: string) { return clock(new Date(iso), tz); }
function dayStatic(iso: string, tz: string) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).formatToParts(new Date(iso));
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${g("weekday")} ${g("day")} ${g("month")}`;
}

/** "Next" marker on schedule rows, decided in the browser so it stays right as time passes. */
export function IsNextMark({ events, startIso, label = "Next" }: { events: CountEventP[]; startIso: string; label?: string }) {
  const now = useNow(30000);
  if (!now) return null;
  const n = pickNext(events, now);
  if (!n || n.start_iso !== startIso) return null;
  return <span className="st is-hot">{now.getTime() >= new Date(startIso).getTime() ? "On now" : label}</span>;
}

// ─── set-up meter (reads the ticks from the Setup page, this browser only) ─────
export function SetupMeter({ total }: { total: number }) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { const t = setTimeout(() => { try { setDone(JSON.parse(localStorage.getItem("tp-setup-done") || "[]")); } catch {} }, 0); return () => clearTimeout(t); }, []);
  return (
    <div className="meter">
      <ol className="cells" aria-label={`${done.length} of ${total} set-up steps done`}>
        {Array.from({ length: total }, (_, i) => String(i + 1).padStart(2, "0")).map((n) => <li key={n} className={done.includes(n) ? "is-on" : undefined}>{n}</li>)}
      </ol>
      <div className="meter-m"><span className="mono">{done.length}/{total} done</span><span className="lab-x">This browser</span></div>
    </div>
  );
}

// ─── Backstage unlock (reuses the admin login) ──────────────────────────────────
export function AdminUnlock({ label = "Presenter notes: Backstage password" }: { label?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (!open) return <button type="button" className="lnk" onClick={() => setOpen(true)}>{label}</button>;
  return (
    <form
      className="unlock-f"
      onSubmit={(e) => {
        e.preventDefault(); setErr(null);
        const v = pw;
        start(async () => {
          const r = await adminLogin(v);
          if (r.ok) router.refresh(); else { setErr("Wrong password."); setPw(""); }
        });
      }}
    >
      <label className="sr" htmlFor="tpb-admin-pw">Backstage password</label>
      <input id="tpb-admin-pw" className="fld fld--sm" type="password" autoComplete="current-password" placeholder="Backstage password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
      <button className="btn btn--pri" disabled={pending || !pw}>{pending ? "Checking" : "Unlock"}</button>
      {err ? <span className="err" role="alert" style={{ marginTop: 0 }}>{err}</span> : null}
    </form>
  );
}
