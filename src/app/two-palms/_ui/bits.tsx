"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// ─── Reveal on scroll ───────────────────────────────────────────────────────────
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: { children: ReactNode; delay?: number; as?: "div" | "section" | "li" | "span"; className?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { const t0 = setTimeout(() => setInView(true), 0); return () => clearTimeout(t0); }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setInView(true); io.disconnect(); } }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    const t = setTimeout(() => setInView(true), 1000); // fallback
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  const T = Tag as unknown as "div";
  return (
    <T ref={ref as never} className={`tp-reveal ${className}`} data-in={inView ? "true" : "false"} style={{ "--tp-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </T>
  );
}

// ─── Sketch marks: hand-drawn strokes that draw themselves on ────────────────────
type Mark = "underline" | "circle" | "arrow" | "arrow-down" | "star" | "tick" | "zigzag" | "bubble";

const MARKS: Record<Mark, { vb: string; d: string[]; len: number }> = {
  underline: { vb: "0 0 300 24", d: ["M4 14 C 60 6, 120 18, 180 10 S 260 8, 296 13", "M30 19 C 90 14, 160 22, 230 16"], len: 310 },
  circle: { vb: "0 0 300 110", d: ["M150 10 C 60 6, 8 30, 10 58 C 12 92, 90 104, 160 100 C 240 96, 294 78, 290 50 C 286 22, 210 8, 140 12 C 110 14, 80 20, 60 30"], len: 760 },
  arrow: { vb: "0 0 120 60", d: ["M6 44 C 30 20, 60 10, 108 18", "M92 6 L 110 18 L 94 32"], len: 160 },
  "arrow-down": { vb: "0 0 60 120", d: ["M18 6 C 40 30, 48 60, 34 108", "M18 92 L 34 112 L 50 94"], len: 170 },
  star: { vb: "0 0 60 60", d: ["M30 6 L 30 54", "M8 30 L 52 30", "M14 14 L 46 46", "M46 14 L 14 46"], len: 60 },
  tick: { vb: "0 0 60 60", d: ["M8 32 L 24 48 L 54 12"], len: 80 },
  zigzag: { vb: "0 0 200 30", d: ["M4 20 L 30 8 L 56 22 L 82 8 L 108 22 L 134 8 L 160 22 L 196 10"], len: 260 },
  bubble: { vb: "0 0 100 80", d: ["M50 6 C 20 6, 6 20, 6 36 C 6 52, 22 62, 40 64 L 34 76 L 56 64 C 78 62, 94 52, 94 36 C 94 20, 78 6, 50 6 Z", "M30 36 L 32 36", "M50 36 L 52 36", "M70 36 L 72 36"], len: 320 },
};

export function Sketch({ mark, className = "", delay = 0, width, color }: { mark: Mark; className?: string; delay?: number; width?: number | string; color?: string }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [inView, setInView] = useState(false);
  const m = MARKS[mark];
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { const t0 = setTimeout(() => setInView(true), 0); return () => clearTimeout(t0); }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setInView(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    const t = setTimeout(() => setInView(true), 1200);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  return (
    <svg ref={ref} className={`tp-sketch ${className}`} viewBox={m.vb} aria-hidden="true" data-in={inView ? "true" : "false"} style={{ "--len": m.len, "--tp-delay": `${delay}ms`, width, color } as CSSProperties}>
      {m.d.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/** Word with a hand-drawn underline that draws on. */
export function Underline({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="tp-underline-wrap">
      {children}
      <Sketch mark="underline" delay={delay} />
    </span>
  );
}
/** Word with a hand-drawn circle around it. */
export function Circled({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="tp-circle-wrap">
      {children}
      <Sketch mark="circle" delay={delay} />
    </span>
  );
}

// ─── Copy button ────────────────────────────────────────────────────────────────
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="tp-copy"
      data-done={done ? "true" : "false"}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); } catch { /* no clipboard */ }
      }}
    >
      {done ? "Copied" : label}
    </button>
  );
}

// ─── Time: localise to the viewer ───────────────────────────────────────────────
function fmt(d: Date, tz: string | undefined, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-AU", { ...opts, timeZone: tz }).format(d);
}

export function Clocks() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 15000); return () => clearInterval(t); }, []);
  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined;
  const isSyd = tz === "Australia/Sydney" || tz === "Australia/Melbourne";
  const isMuc = tz === "Europe/Berlin";
  const t = (z?: string) => (now ? fmt(now, z, { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--");
  return (
    <div className="tp-clocks" aria-label="Office clocks">
      <div className={`tp-clock ${isSyd ? "tp-clock-you" : ""}`}><span className="tp-clock-city">Sydney</span><span className="tp-clock-time">{t("Australia/Sydney")}</span></div>
      <div className={`tp-clock ${isMuc ? "tp-clock-you" : ""}`}><span className="tp-clock-city">Munich</span><span className="tp-clock-time">{t("Europe/Berlin")}</span></div>
      {!isSyd && !isMuc && tz ? (
        <div className="tp-clock tp-clock-you"><span className="tp-clock-city">You</span><span className="tp-clock-time">{t(tz)}</span></div>
      ) : null}
    </div>
  );
}

/** A session time shown in the viewer's own zone, with the two office times. */
export function LocalTime({ iso, provisional = false }: { iso: string; provisional?: boolean }) {
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => { const t = setTimeout(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone), 0); return () => clearTimeout(t); }, []);
  const d = new Date(iso);
  const main = tz
    ? fmt(d, tz, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
    : fmt(d, "Australia/Sydney", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  const syd = fmt(d, "Australia/Sydney", { hour: "numeric", minute: "2-digit" });
  const muc = fmt(d, "Europe/Berlin", { hour: "numeric", minute: "2-digit" });
  const zoneLabel = tz ? tz.split("/").pop()?.replace("_", " ") : "Sydney";
  return (
    <span className="tp-local" title={`${syd} Sydney · ${muc} Munich`}>
      <strong>{main}</strong> <span className="tp-mute">your time ({zoneLabel})</span>
      <span className="tp-mute"> · {syd} Sydney · {muc} Munich</span>
      {provisional ? <span className="tp-chip tp-chip-orange" style={{ marginLeft: 8 }}>to confirm</span> : null}
    </span>
  );
}

function U({ n, l }: { n: number; l: string }) {
  return <div className="tp-count-u"><div className="tp-count-n">{String(n).padStart(2, "0")}</div><div className="tp-count-l">{l}</div></div>;
}

export function Countdown({ iso, label }: { iso: string; label: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(iso).getTime() - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [iso]);
  if (left === null) return <div className="tp-count" aria-hidden="true" />;
  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return (
    <div>
      <div className="tp-eyebrow" style={{ marginBottom: 10 }}><span className="tp-dot" />{left === 0 ? "Happening now" : label}</div>
      <div className="tp-count"><U n={d} l="days" /><U n={h} l="hrs" /><U n={m} l="min" /><U n={sec} l="sec" /></div>
    </div>
  );
}

// ─── Tabs ───────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, children }: { tabs: string[]; children: (active: string) => ReactNode }) {
  const [active, setActive] = useState(tabs[0]);
  return (
    <div>
      <div className="tp-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t} role="tab" className="tp-tab" aria-selected={active === t} onClick={() => setActive(t)}>{t}</button>
        ))}
      </div>
      <div key={active} className="tp-slide-enter">{children(active)}</div>
    </div>
  );
}
