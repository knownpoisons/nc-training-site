"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/two-palms", label: "Home" },
  { href: "/two-palms/setup", label: "Setup" },
  { href: "/two-palms/foundations", label: "Foundations" },
  { href: "/two-palms/creative", label: "Creative" },
  { href: "/two-palms/prompts", label: "Prompts" },
  { href: "/two-palms/kit", label: "Rules + Kit" },
  { href: "/two-palms/backstage", label: "Backstage" },
];

// ─── Skylines: one hairline drawing per office, a sun or moon riding over it ───
// 160 × 44 box. Ground at y 40. Sky arc from (10, 40) over (80, 6) to (150, 40).
const SYDNEY = (
  <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
    {/* Harbour Bridge */}
    <path d="M6 40 L6 31 M14 40 L14 29 M6 31 Q 30 10 54 29 M14 29 Q 30 15 48 29 M22 40 L22 24.5 M30 40 L30 21 M38 40 L38 21.5 M46 40 L46 25 M6 33 L54 33" />
    <path d="M50 40 L50 31 M54 40 L54 29" />
    {/* Opera House sails */}
    <path d="M62 40 Q 66 22 84 26 L80 40 Z M72 40 Q 78 18 98 24 L94 40 Z M88 40 Q 96 20 112 28 L108 40 Z M60 40 L116 40" />
    {/* Towers */}
    <path d="M122 40 L122 22 L130 22 L130 40 M134 40 L134 14 L141 14 L141 40 M137.5 14 L137.5 8 M145 40 L145 26 L152 26 L152 40" />
    <path d="M2 40 L158 40" />
  </g>
);
const MUNICH = (
  <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
    {/* Olympic tower */}
    <path d="M14 40 L16 10 M20 40 L18 10 M12 20 Q 17 17 22 20 M12 20 L22 20 M17 10 L17 3" />
    {/* Frauenkirche: two towers with onion domes */}
    <path d="M52 40 L52 18 Q 57 10 62 18 L62 40 M57 10 L57 6 M72 40 L72 18 Q 77 10 82 18 L82 40 M77 10 L77 6 M62 24 L72 24 M62 40 L72 40 L72 30 L62 30" />
    {/* Neues Rathaus spire and roofline */}
    <path d="M94 40 L94 24 L104 24 L104 40 M99 24 L99 12 L101 8 L103 12 M108 40 L108 28 L126 28 L126 40 M112 28 L112 22 L116 18 L120 22 L120 28" />
    {/* Alps, far */}
    <path d="M128 40 L138 30 L146 36 L154 26 L158 32" strokeDasharray="1.5 2.5" />
    <path d="M2 40 L158 40" />
  </g>
);

function skyAt(hour: number): { x: number; y: number; sun: boolean } {
  // Sun from 06:00 to 18:00, moon from 18:00 to 06:00, each over the same arc.
  const sun = hour >= 6 && hour < 18;
  const t = sun ? (hour - 6) / 12 : ((hour + 24 - 18) % 24) / 12;
  const x = 12 + t * 136, y = 40 - Math.sin(t * Math.PI) * 32;
  return { x, y, sun };
}

function Sky({ hour }: { hour: number }) {
  const { x, y, sun } = skyAt(hour);
  return sun ? (
    <g className="tp-sky-sun" transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <circle r="3.2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1={Math.cos((a * Math.PI) / 180) * 4.8} y1={Math.sin((a * Math.PI) / 180) * 4.8} x2={Math.cos((a * Math.PI) / 180) * 6.4} y2={Math.sin((a * Math.PI) / 180) * 6.4} />)}
    </g>
  ) : (
    <g className="tp-sky-moon" transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M1.5 -3.6 A 3.9 3.9 0 1 0 1.5 3.6 A 3 3 0 1 1 1.5 -3.6 Z" />
    </g>
  );
}

function hourIn(tz: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0), m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { h: (h % 24) + m / 60, label: `${String(h % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}` };
}

export function Clocks() {
  const [now, setNow] = useState<Date | null>(null);
  const [tz, setTz] = useState<string>("");
  useEffect(() => {
    const t0 = setTimeout(() => { setNow(new Date()); setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); }, 0);
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => { clearTimeout(t0); clearInterval(t); };
  }, []);
  const here = tz.startsWith("Australia/") ? "syd" : tz.startsWith("Europe/") ? "muc" : null;
  const syd = now ? hourIn("Australia/Sydney", now) : null, muc = now ? hourIn("Europe/Berlin", now) : null;
  return (
    <div className="tp-clocks" aria-label="Office clocks">
      {[{ id: "syd", city: "Sydney", d: syd, art: SYDNEY }, { id: "muc", city: "Munich", d: muc, art: MUNICH }].map((c) => (
        <div key={c.id} className={`tp-clock ${here === c.id ? "tp-clock-here" : ""}`}>
          <svg className="tp-skyline" viewBox="0 0 160 44" aria-hidden="true">
            {c.art}
            {c.d ? <Sky hour={c.d.h} /> : null}
          </svg>
          <div className="tp-clock-row">
            <span className="tp-clock-city">{c.city}{here === c.id ? <i className="tp-clock-dot" /> : null}</span>
            <span className="tp-clock-time">{c.d ? c.d.label : "--:--"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Next session strip ─────────────────────────────────────────────────────────
export function NextStrip({ iso, title, href }: { iso: string; title: string; href: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(iso).getTime() - Date.now()));
    const t0 = setTimeout(tick, 0);
    const t = setInterval(tick, 30000);
    return () => { clearTimeout(t0); clearInterval(t); };
  }, [iso]);
  const s = left === null ? null : Math.floor(left / 1000);
  const d = s === null ? "--" : String(Math.floor(s / 86400)).padStart(2, "0");
  const h = s === null ? "--" : String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  const m = s === null ? "--" : String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  return (
    <Link href={href} className="tp-next" aria-label={`Next session: ${title}`}>
      <span className="tp-next-l"><i className="tp-next-dot" />Next</span>
      <span className="tp-next-t">{title}</span>
      <span className="tp-next-c"><b>{d}</b>d <b>{h}</b>h <b>{m}</b>m</span>
    </Link>
  );
}

export function Header({ next }: { next: { iso: string; title: string; href: string } | null }) {
  const p = usePathname() ?? "";
  return (
    <header className="tp-header">
      <div className="tp-wrap tp-header-top">
        <Link href="/two-palms" className="tp-logo" aria-label="Two Palms AI Hub">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/two-palms/wordmark-black.png" alt="Two Palms" />
          <span className="tp-logo-x">x</span>
          <span className="tp-logo-t">AI Hub</span>
        </Link>
        <Clocks />
      </div>
      <div className="tp-wrap tp-header-bottom">
        <nav className="tp-nav" aria-label="Hub">
          {NAV.map((n) => {
            const active = n.href === "/two-palms" ? p === "/two-palms" : p.startsWith(n.href);
            return <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}><span>{n.label}</span></Link>;
          })}
        </nav>
        {next ? <NextStrip {...next} /> : null}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="tp-footer">
      <div className="tp-wrap tp-footer-in">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/two-palms/wordmark-black.png" alt="Two Palms" />
          <span className="tp-hand tp-orange">x NotContent</span>
        </div>
        <div>Sydney · Munich · Private. Don&rsquo;t share the link outside the team.</div>
        <div>© {new Date().getFullYear()} Two Palms Media &amp; NotContent.ai</div>
      </div>
    </footer>
  );
}
