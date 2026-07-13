"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// THE DECK — client components. Motion doctrine (handoff): transform/opacity
// only, one orchestrated load moment, count-ups once per view, barcode strokes
// fill 20ms apart, spring physics on the glass stack, reduced-motion = final
// values. If an animation doesn't clarify state or hierarchy, it isn't here.
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

// ── Reveal: IO-triggered entrance; --i staggers children 40ms apart ───────────
export function Reveal({ i = 0, children, className = "" }: { i?: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (el.classList.add("dk-in"), io.disconnect())),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`dk-reveal ${className}`} style={{ ["--i" as string]: i }}>
      {children}
    </div>
  );
}

// ── CountUp: 600ms ease-out, once per view, never on re-render ────────────────
export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = prefix + Math.round(value).toLocaleString("en-US") + suffix;
      return;
    }
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting) || done.current) return;
      done.current = true;
      io.disconnect();
      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min((ts - t0) / 600, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(value * eased).toLocaleString("en-US") + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, prefix, suffix, reduced]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ── Barcode: the signature element. 1.5px strokes, 3px gap, ink position marker.
export function Barcode({ fill, ticks = 44, marker = true }: { fill: number; ticks?: number; marker?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const strokes = Array.from(el.children) as HTMLElement[];
    const n = Math.max(0, Math.min(ticks, Math.round(fill * ticks)));
    const paint = (instant: boolean) =>
      strokes.forEach((s, idx) => {
        const cls = idx < n ? (marker && idx === n - 1 && n < ticks ? "on cur" : "on") : "";
        if (instant) s.className = cls;
        else if (idx < n) setTimeout(() => (s.className = cls), idx * 20);
      });
    if (reduced) return paint(true);
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        paint(false);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [fill, ticks, marker, reduced]);
  return (
    <div ref={ref} className="dk-barcode" role="img" aria-label={`${Math.round(fill * 100)}%`}>
      {Array.from({ length: ticks }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

// ── GlassDeck: stacked cards, drag/swipe carousel, spring 260/24, rear parallax.
export interface GlassSlide {
  label: string;
  title: string;
  body: string;
  fill: number; // barcode fraction
  footer?: string;
}

export function GlassDeck({ slides }: { slides: GlassSlide[] }) {
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  const s = slides[idx];
  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="dk-glasswrap">
      {/* rear cards — offset 12/24, scaled .98/.96, ±1.5°, parallax on drag */}
      <motion.div
        className="dk-glass-rear"
        style={{ opacity: 0.32, filter: "blur(1px)" }}
        animate={{ y: 24, scale: 0.96, rotate: -1.5 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        aria-hidden
      />
      <motion.div
        className="dk-glass-rear"
        style={{ opacity: 0.55 }}
        animate={{ y: 12, scale: 0.98, rotate: 0.8 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        aria-hidden
      />
      <motion.div
        key={idx}
        className="dk-glass"
        drag={reduced ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70) next();
          else if (info.offset.x > 70) prev();
        }}
        initial={reduced ? false : { x: 40, opacity: 0.6, rotate: 1 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel card"
        aria-label={`${s.label} — card ${idx + 1} of ${slides.length}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
      >
        <div className="dk-dots" aria-hidden>
          {slides.map((_, i) => (
            <i key={i} className={i === idx ? "on" : ""} />
          ))}
        </div>
        <div className="dk-label">{s.label}</div>
        <h2>{s.title}</h2>
        <p>{s.body}</p>
        <Barcode fill={s.fill} />
        {s.footer && <p style={{ marginTop: 10, fontSize: 12.5 }}>{s.footer}</p>}
      </motion.div>
    </div>
  );
}

// ── Nav (top links + mobile pill) ─────────────────────────────────────────────
const TABS = [
  { href: "/deck/pipeline", label: "Pipeline" },
  { href: "/deck/queue", label: "Queue" },
  { href: "/deck/scoreboard", label: "Scoreboard" },
  { href: "/deck/settings", label: "Settings" },
];

export function DeckNav() {
  const path = usePathname();
  return (
    <>
      <nav className="dk-nav" aria-label="Deck">
        <span className="dk-nav-brand">
          COCKPIT <span>/ the deck</span>
        </span>
        {TABS.map((t) => (
          <a key={t.href} href={t.href} className={path?.startsWith(t.href) ? "on" : ""}>
            {t.label}
          </a>
        ))}
      </nav>
      <nav className="dk-pill" aria-label="Deck mobile">
        {TABS.map((t) => (
          <a key={t.href} href={t.href} className={path?.startsWith(t.href) ? "on" : ""}>
            {t.label}
          </a>
        ))}
      </nav>
    </>
  );
}

// ── Assistant: the same brain as Slack's F5, in a right rail / mobile sheet ───
interface Msg { who: "me" | "bot"; text: string }

function AssistantCore() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: "bot", text: "Same brain as #cockpit. Ask about any lead, the pipeline, or what to do next — I'll answer from live data. Acting on it still happens in Slack." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [msgs, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMsgs((m) => [...m, { who: "me", text }]);
    setBusy(true);
    try {
      const r = await fetch("/api/deck/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const j = (await r.json()) as { reply?: string; error?: string };
      setMsgs((m) => [...m, { who: "bot", text: j.reply ?? j.error ?? "No answer came back." }]);
    } catch {
      setMsgs((m) => [...m, { who: "bot", text: "Couldn't reach the assistant — try again." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="dk-msgs">
        {msgs.map((m, i) => (
          <div key={i} className={`dk-msg ${m.who}`}>{m.text}</div>
        ))}
        {busy && (
          <div className="dk-msg bot thinking" aria-label="thinking">
            <i /><i /><i />
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="dk-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="who's my warmest lead?"
          aria-label="Ask the assistant"
        />
        <button onClick={send}>Ask</button>
      </div>
    </>
  );
}

export function AssistantRail() {
  return (
    <aside className="dk-rail" aria-label="Assistant">
      <div className="dk-rail-head">
        <b>The assistant</b>
        <div>reviews with you · never sends</div>
      </div>
      <AssistantCore />
    </aside>
  );
}

export function AssistantSheet() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="dk-fab" onClick={() => setOpen((o) => !o)} aria-label="Open assistant">
        {open ? "×" : "✳"}
      </button>
      {open && (
        <motion.div
          className="dk-sheet"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <div className="dk-rail-head">
            <b>The assistant</b>
            <div>reviews with you · never sends</div>
          </div>
          <AssistantCore />
        </motion.div>
      )}
    </>
  );
}
