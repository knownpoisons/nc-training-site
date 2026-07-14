"use client";

// ─────────────────────────────────────────────────────────────────────────────
// THE OPERATING MODEL — story interactions.
// Faithful port of the bam83 interaction set: loader countdown, film-grain
// canvas, custom cursor, mouse-following scroll badge, glitch hero, the
// scroll-scrubbed drop, horizontal phase scrub with popping diagrams, the
// sticky quote stack, presser sound toggle, and the record-book reveal.
// All vanilla rAF/scroll listeners — no animation libraries.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BADGE,
  DIAGRAM_LEGEND,
  GRAPH_CENTER,
  LOADER_STEPS,
  PHASES,
  PRESSER,
  QUOTE_CARDS,
  QUOTES_PUNCHLINE,
  type Phase,
  type TeamDot,
} from "./copy";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const ReducedMotionContext = createContext(false);

/* ── Shell: owns the root classes (touch / loaded) + global overlays ────── */

export function StoryShell({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [touch, setTouch] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTouch("ontouchstart" in window);
  }, []);

  const onLoaderDone = useCallback(() => setLoaded(true), []);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      <div
        className={`om${touch ? " om-touch" : ""}${
          loaded || reduced ? " om-loaded" : ""
        }`}
      >
        <noscript>
          <style>{`.om-root{visibility:visible}.om-loader{display:none}`}</style>
        </noscript>
        {!reduced && <Loader onDone={onLoaderDone} />}
        {!reduced && <GrainCanvas />}
        {!reduced && !touch && <CustomCursor />}
        {!reduced && <ScrollBadge touch={touch} />}
        <div className="om-root">{children}</div>
      </div>
    </ReducedMotionContext.Provider>
  );
}

/* ── 1. Loader — week-countdown, final number in cobalt ─────────────────── */

function Loader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [labelVisible, setLabelVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLabelVisible(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= LOADER_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          onDone();
        }, 900);
        return;
      }
      setLabelVisible(false);
      setTimeout(() => {
        setStep(i);
        setLabelVisible(true);
      }, 300);
    }, 1100);
    return () => clearInterval(interval);
  }, [onDone]);

  const s = LOADER_STEPS[step]!;
  return (
    <div className={`om-loader${done ? " om-done" : ""}`} aria-hidden="true">
      <div className={`om-loader-label${labelVisible ? " om-visible" : ""}`}>
        {s.label}
      </div>
      <div
        className={`om-loader-number${
          "accent" in s && s.accent ? " om-accent" : ""
        }`}
        style={{ opacity: labelVisible ? 1 : 0 }}
      >
        {s.num}
      </div>
    </div>
  );
}

/* ── 2. Film-grain canvas (half-res for perf, visually identical) ───────── */

function GrainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / 2);
      canvas.height = Math.ceil(window.innerHeight / 2);
    };

    const draw = () => {
      const { width: w, height: h } = canvas;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="om-grain" aria-hidden="true" />;
}

/* ── 3. Custom cursor (desktop only) ────────────────────────────────────── */

function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.classList.remove("om-hidden");
    };
    const leave = () => cursor.classList.add("om-hidden");
    const enter = () => cursor.classList.remove("om-hidden");
    const over = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [role='button']")) {
        cursor.classList.add("om-hovered");
      }
    };
    const out = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [role='button']")) {
        cursor.classList.remove("om-hovered");
      }
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return <div ref={ref} className="om-cursor om-hidden" aria-hidden="true" />;
}

/* ── 4. Scroll badge — corner on mobile, follows the mouse on desktop ───── */

function ScrollBadge({ touch }: { touch: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const badge = ref.current;
    if (!badge) return;
    const BADGE_W = 60;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let gone = false;
    let following = false;
    let initialized = false;
    let mouseX = 0;
    let mouseY = 0;

    badge.classList.add("om-hidden");

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (following && !gone) {
        badge.style.left = `${mouseX - BADGE_W}px`;
        badge.style.top = `${mouseY - BADGE_W}px`;
      }
    };
    if (!touch) document.addEventListener("mousemove", move);

    const showBadge = () => {
      if (gone) return;
      initialized = true;
      badge.classList.remove("om-hidden");
    };
    const hideBadge = () => badge.classList.add("om-hidden");

    const onScroll = () => {
      const final = document.getElementById("om-final");
      if (final) {
        const rect = final.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75) {
          gone = true;
          hideBadge();
          return;
        }
      }
      if (!initialized) return;
      if (!touch && !following) {
        following = true;
        badge.style.left = `${mouseX - BADGE_W}px`;
        badge.style.top = `${mouseY - BADGE_W}px`;
      }
      hideBadge();
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(showBadge, 2500);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    showTimer = setTimeout(showBadge, 6000);
    return () => {
      document.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
      if (hideTimer) clearTimeout(hideTimer);
      if (showTimer) clearTimeout(showTimer);
    };
  }, [touch]);

  return (
    <div ref={ref} className="om-badge om-hidden" aria-hidden="true">
      <svg className="om-badge-ring" viewBox="0 0 120 120">
        <defs>
          <path
            id="om-badge-circle"
            d="M 60,60 m -47,0 a 47,47 0 1,1 94,0 a 47,47 0 1,1 -94,0"
          />
        </defs>
        <text className="om-badge-text">
          <textPath href="#om-badge-circle">
            {BADGE.pre}
            <tspan className="om-badge-accent">{BADGE.accent}</tspan>
            {BADGE.post}
          </textPath>
        </text>
      </svg>
      <div className="om-badge-arrow">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1v10M2 7l4 4 4-4"
            stroke="rgba(232,230,224,0.6)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── 5. Glitch figure — cobalt/platinum split layers ────────────────────── */

export function GlitchFigure({ src, alt }: { src: string; alt: string }) {
  const reduced = useContext(ReducedMotionContext);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let t2: ReturnType<typeof setTimeout>;
    const fire = () => {
      setGlitching(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setGlitching(true)));
    };
    const t1 = setTimeout(fire, 4500);
    t2 = setTimeout(fire, 6400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduced]);

  const layerStyle = { backgroundImage: `url('${src}')` };
  return (
    <div className="om-glitch-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`om-glitch-img${glitching ? " om-glitching" : ""}`}
      />
      <div
        className={`om-glitch-layer om-glitch-layer-a${glitching ? " om-active" : ""}`}
        style={layerStyle}
      />
      <div
        className={`om-glitch-layer om-glitch-layer-b${glitching ? " om-active" : ""}`}
        style={layerStyle}
      />
    </div>
  );
}

/* ── shared: framed video / placeholder ─────────────────────────────────── */

export function FramedVideo({
  src,
  poster,
  caption,
  placeholderLabel,
}: {
  src?: string | null;
  poster?: string;
  caption?: string;
  placeholderLabel?: string;
}) {
  return (
    <div className="om-frame">
      {src ? (
        <video src={src} poster={poster} muted loop autoPlay playsInline />
      ) : (
        <div className="om-frame-placeholder">
          <div className="om-frame-placeholder-icon">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M1 1l12 7-12 7V1z" fill="rgba(232,230,224,0.3)" />
            </svg>
          </div>
          {placeholderLabel && (
            <div className="om-frame-placeholder-label">{placeholderLabel}</div>
          )}
        </div>
      )}
      <span className="om-frame-corner om-tl" />
      <span className="om-frame-corner om-tr" />
      <span className="om-frame-corner om-bl" />
      <span className="om-frame-corner om-br" />
      {caption && <div className="om-frame-caption">{caption}</div>}
    </div>
  );
}

/* ── 6. The drop — the NC globe scroll-falls into a retro Apple II ──────── */

function AppleII({ hit }: { hit: boolean }) {
  return (
    <svg
      viewBox="0 0 320 260"
      className={`om-a2${hit ? " om-hit" : ""}`}
      style={{ display: "block", width: "100%" }}
    >
      {/* monitor case — opaque so the globe disappears behind it */}
      <rect x="78" y="34" width="164" height="118" rx="8" fill="#0b0d13" stroke="rgba(232,230,224,0.4)" strokeWidth="1.5" />
      {/* the slot mouth on top */}
      <rect x="124" y="28" width="72" height="8" rx="2" fill="#0b0d13" stroke="rgba(232,230,224,0.4)" strokeWidth="1.2" />
      <line x1="132" y1="32" x2="188" y2="32" stroke="rgba(61,99,240,0.5)" strokeWidth="1" />
      {/* vents */}
      <path d="M88 42 h18 M88 46 h18 M214 42 h18 M214 46 h18" stroke="rgba(232,230,224,0.12)" strokeWidth="1" />
      {/* screen */}
      <rect className="om-a2-screen" x="94" y="56" width="132" height="80" rx="4" fill="#0e1220" stroke="rgba(232,230,224,0.25)" strokeWidth="1" />
      <text className="om-a2-prompt" x="104" y="122" fontFamily="'DM Mono', monospace" fontSize="14" fill="rgba(61,99,240,0.9)">
        ]
      </text>
      <rect className="om-a2-cursor" x="114" y="111" width="8" height="12" fill="rgba(61,99,240,0.9)" />
      {/* model badge */}
      <text x="160" y="147" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="8" letterSpacing="0.25em" fill="rgba(232,230,224,0.35)">
        NC ][
      </text>
      {/* body wedge + keyboard */}
      <path d="M60 152 L260 152 L284 216 L36 216 Z" fill="#0b0d13" stroke="rgba(232,230,224,0.3)" strokeWidth="1.5" />
      <path d="M74 166 L246 166 M70 178 L250 178 M66 190 L254 190 M62 202 L258 202" stroke="rgba(232,230,224,0.12)" strokeWidth="1" />
      <path d="M84 166 v36 M110 166 v36 M136 166 v36 M162 166 v36 M188 166 v36 M214 166 v36 M238 166 v36" stroke="rgba(232,230,224,0.07)" strokeWidth="1" />
      {/* feet */}
      <rect x="56" y="216" width="20" height="5" fill="rgba(232,230,224,0.15)" />
      <rect x="244" y="216" width="20" height="5" fill="rgba(232,230,224,0.15)" />
    </svg>
  );
}

export function DropSection({
  label,
  globeSrc,
  children,
}: {
  label: string;
  globeSrc: string;
  children: ReactNode; // the swish panel contents
}) {
  const reduced = useContext(ReducedMotionContext);
  const sectionRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [swishVisible, setSwishVisible] = useState(false);
  const [hit, setHit] = useState(false);
  const [landed, setLanded] = useState(false);
  const swishRef = useRef(false);
  const landedRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const ball = ballRef.current;
    const target = targetRef.current;
    const flash = flashRef.current;
    if (!section || !ball || !target || !flash) return;

    // Screen geometry as fractions of the Apple II graphic (viewBox 320×260):
    // screen rect x 94..226 (centre 160 = graphic centre), y 56..136 (centre 96).
    const SCREEN_CY = 96 / 260; // 0.369 down the graphic
    const SCREEN_W = 132 / 320; // 0.4125 of graphic width

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = clamp01(-rect.top / scrollable);

      const targetRect = target.getBoundingClientRect();
      const globeW = ball.offsetWidth;
      const globeH = ball.offsetHeight || globeW * 0.42;

      // land the globe centred on the little screen, shrunk to sit inside it
      const screenCenterY = targetRect.top + targetRect.height * SCREEN_CY;
      const landedScale = (targetRect.width * SCREEN_W * 0.72) / globeW;
      const startY = -globeH - 60;
      const restY = screenCenterY - globeH / 2;

      const LAND = 0.55; // globe is fully seated on the screen by here
      let ballY: number;
      let scale: number;
      let rotation: number;
      if (progress <= LAND) {
        const p = progress / LAND;
        const eased = p * p;
        ballY = startY + (restY - startY) * eased;
        scale = 1 + (landedScale - 1) * eased;
        rotation = p * 360;
      } else {
        ballY = restY;
        scale = landedScale;
        rotation = 360;
      }
      ball.style.transform = `translateX(-50%) translateY(${ballY}px) scale(${scale}) rotate(${rotation}deg)`;

      // seated + screen glow on landing
      if (progress >= LAND && !landedRef.current) {
        landedRef.current = true;
        setLanded(true);
        setHit(true);
        flash.style.opacity = "0.32";
        setTimeout(() => {
          flash.style.opacity = "0";
        }, 150);
      }
      if (progress < LAND - 0.05 && landedRef.current) {
        landedRef.current = false;
        setLanded(false);
        setHit(false);
      }

      // the "Look." panel takes over later, so the pulse on the screen is seen
      if (progress > 0.85 && !swishRef.current) {
        swishRef.current = true;
        setSwishVisible(true);
      }
      if (progress < 0.8 && swishRef.current) {
        swishRef.current = false;
        setSwishVisible(false);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [reduced]);

  return (
    <section ref={sectionRef} className="om-drop-section">
      <div className="om-drop-sticky">
        <div className="om-drop-label">{label}</div>
        <div ref={targetRef} className="om-drop-target" aria-hidden="true">
          <AppleII hit={hit} />
        </div>
        <div
          ref={ballRef}
          className={`om-drop-globe${landed ? " om-landed" : ""}`}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={globeSrc} alt="" />
        </div>
        <div className={`om-swish${swishVisible ? " om-visible" : ""}`}>
          {children}
        </div>
      </div>
      <div ref={flashRef} className="om-drop-flash" />
    </section>
  );
}

/* ── 7. Phases — sticky horizontal scrub with popping diagrams ──────────── */

const COBALT = "#3D63F0";

// One team dot on the convergence graph. Greys are the team at baseline, blues
// are capabilities landed; a `core` dot is the whole team as one machine on the
// centre ✕; `ghost` dots mark where the team started (phase four).
function TeamDotGlyph({ dot, index }: { dot: TeamDot; index: number }) {
  const delay = `${index * 24}ms`;

  if (dot.kind === "core") {
    return (
      <g className="om-dot om-popped" style={{ animationDelay: delay }}>
        <circle className="om-core-ring" cx={dot.x} cy={dot.y} r={18} fill="none" stroke={COBALT} strokeWidth={1.2} />
        <circle cx={dot.x} cy={dot.y} r={14} fill={COBALT} />
      </g>
    );
  }

  if (dot.ghost) {
    return (
      <circle
        className="om-dot om-popped"
        style={{ animationDelay: delay }}
        cx={dot.x}
        cy={dot.y}
        r={4}
        fill="none"
        stroke="rgba(232,230,224,0.14)"
        strokeWidth={1}
      />
    );
  }

  const isBlue = dot.kind === "blue";
  return (
    <>
      {dot.trail && (
        <line
          className="om-trail"
          x1={dot.x}
          y1={dot.y}
          x2={GRAPH_CENTER.x}
          y2={GRAPH_CENTER.y}
          stroke={isBlue ? "rgba(61,99,240,0.32)" : "rgba(232,230,224,0.12)"}
          strokeWidth={0.8}
          strokeDasharray="2 3"
        />
      )}
      <circle
        className="om-dot om-popped"
        style={{ animationDelay: delay }}
        cx={dot.x}
        cy={dot.y}
        r={4.6}
        fill={isBlue ? COBALT : "rgba(232,230,224,0.42)"}
      />
    </>
  );
}

function LegendGlyph({ kind }: { kind: "grey" | "blue" | "cross" }) {
  if (kind === "cross") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24">
        <path d="M5 5 L19 19 M19 5 L5 19" stroke="rgba(232,230,224,0.6)" strokeWidth="2.2" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill={kind === "blue" ? COBALT : "rgba(232,230,224,0.42)"} />
    </svg>
  );
}

// The scatter-graph frame: x/y axes, week ticks, crosshair + target reticle,
// and the ✕ at the centre — the operating model everything converges on.
function GraphFrame() {
  const cx = GRAPH_CENTER.x;
  const cy = GRAPH_CENTER.y;
  const xticks = [
    { x: 95, label: "02" },
    { x: 150, label: "04" },
    { x: 205, label: "06" },
    { x: 260, label: "08" },
  ];
  return (
    <>
      <rect x="1" y="1" width="298" height="278" rx="2" fill="none" stroke="rgba(232,230,224,0.06)" strokeWidth="1" />
      {/* corner registration ticks */}
      <path
        d="M8 1 V8 M1 8 H8 M292 1 V8 M299 8 H292 M8 279 V272 M1 272 H8 M292 279 V272 M299 272 H292"
        stroke="rgba(232,230,224,0.18)"
        strokeWidth="1"
        fill="none"
      />
      {/* axes + arrowheads */}
      <line x1="40" y1="16" x2="40" y2="250" stroke="rgba(232,230,224,0.3)" strokeWidth="1" />
      <line x1="40" y1="250" x2="294" y2="250" stroke="rgba(232,230,224,0.3)" strokeWidth="1" />
      <path d="M40 16 l-3 6 M40 16 l3 6" stroke="rgba(232,230,224,0.3)" strokeWidth="1" fill="none" />
      <path d="M294 250 l-6 -3 M294 250 l-6 3" stroke="rgba(232,230,224,0.3)" strokeWidth="1" fill="none" />
      {/* x ticks + week labels */}
      {xticks.map((t) => (
        <g key={t.x}>
          <line x1={t.x} y1="250" x2={t.x} y2="255" stroke="rgba(232,230,224,0.25)" strokeWidth="1" />
          <text x={t.x} y="266" textAnchor="middle" className="om-graph-micro">
            {t.label}
          </text>
        </g>
      ))}
      {/* axis titles */}
      <text x="150" y="277" textAnchor="middle" className="om-graph-axis">
        CAPABILITY →
      </text>
      <text x="13" y={cy} textAnchor="middle" className="om-graph-axis" transform={`rotate(-90 13 ${cy})`}>
        ALIGNMENT ↑
      </text>
      {/* crosshair through the operating model */}
      <line x1="40" y1={cy} x2="294" y2={cy} stroke="rgba(232,230,224,0.08)" strokeWidth="1" strokeDasharray="3 4" />
      <line x1={cx} y1="16" x2={cx} y2="250" stroke="rgba(232,230,224,0.08)" strokeWidth="1" strokeDasharray="3 4" />
      {/* target reticle + the ✕ */}
      <circle cx={cx} cy={cy} r="26" fill="none" stroke="rgba(232,230,224,0.12)" strokeWidth="1" strokeDasharray="3 4" />
      <path
        d={`M${cx - 8} ${cy - 8} L${cx + 8} ${cy + 8} M${cx + 8} ${cy - 8} L${cx - 8} ${cy + 8}`}
        stroke="rgba(232,230,224,0.55)"
        strokeWidth="1.6"
      />
    </>
  );
}

export function PhasesSection() {
  const reduced = useContext(ReducedMotionContext);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [renderedPanels, setRenderedPanels] = useState<number[]>([0]);

  useEffect(() => {
    if (reduced) {
      setRenderedPanels([0, 1, 2, 3]);
      return;
    }
    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track || !progress) return;
    let lastPanel = -1;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = clamp01(-rect.top / scrollable);
      track.style.transform = `translateX(-${p * (PHASES.length - 1) * 100}vw)`;
      progress.style.width = `${p * 100}%`;
      const current = Math.min(PHASES.length - 1, Math.floor(p * PHASES.length));
      if (current !== lastPanel) {
        lastPanel = current;
        setActive(current);
        setRenderedPanels((prev) =>
          prev.includes(current) ? prev : [...prev, current],
        );
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [reduced]);

  return (
    <section ref={sectionRef} className="om-phases">
      <div className="om-phases-sticky">
        <div ref={progressRef} className="om-phases-progress" />
        <div ref={trackRef} className="om-phases-track">
          {PHASES.map((phase, i) => (
            <PhasePanel
              key={phase.nav}
              phase={phase}
              dotsVisible={renderedPanels.includes(i)}
            />
          ))}
        </div>
        <div className="om-phases-nav">
          {PHASES.map((phase, i) => (
            <span
              key={phase.nav}
              className={`om-nav-dot${i === active ? " om-active" : ""}`}
            >
              {phase.nav}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhasePanel({ phase, dotsVisible }: { phase: Phase; dotsVisible: boolean }) {
  return (
    <div className="om-panel">
      <div className="om-panel-ghost" aria-hidden="true">
        {phase.ghost}
      </div>
      <div className="om-diagram-side">
        <svg className="om-diagram-svg" viewBox="0 0 300 280">
          <GraphFrame />
          {dotsVisible &&
            phase.dots.map((dot, i) => <TeamDotGlyph key={i} dot={dot} index={i} />)}
        </svg>
        <div className="om-diagram-legend">
          {DIAGRAM_LEGEND.map((l) => (
            <span key={l.kind} className="om-legend-item">
              <LegendGlyph kind={l.kind} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <div className="om-editorial">
        <div className="om-eyebrow">{phase.eyebrow}</div>
        <span className={`om-panel-num${phase.accent ? " om-accent" : ""}`}>
          {phase.num}
        </span>
        <span className="om-panel-numlabel">{phase.numLabel}</span>
        <p className="om-story">
          {phase.story.map((part, i) =>
            typeof part === "string" ? part : <em key={i}>{part.em}</em>,
          )}
        </p>
        <div className="om-trio">
          {phase.trio.map((item) => (
            <div key={item.cat} className="om-trio-item">
              <span className={`om-trio-val${item.accent ? " om-accent" : ""}`}>
                {item.val}
              </span>
              <span className="om-trio-cat">{item.cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 8. Quote stack — cards deal out on scroll, then the punchline ──────── */

export function QuoteStack({
  eyebrow,
  titleA,
  titleEm,
}: {
  eyebrow: string;
  titleA: string;
  titleEm: string;
}) {
  const reduced = useContext(ReducedMotionContext);
  const sectionRef = useRef<HTMLElement>(null);
  const [headlineFaded, setHeadlineFaded] = useState(false);
  const [popped, setPopped] = useState(0);
  const [fading, setFading] = useState(false);
  const [punch, setPunch] = useState(false);

  useEffect(() => {
    if (reduced) {
      setPopped(QUOTE_CARDS.length);
      setPunch(true);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = clamp01(-rect.top / scrollable);

      setHeadlineFaded(p >= 0.18);
      if (p >= 0.18 && p < 0.88) {
        const cardProgress = (p - 0.18) / 0.62;
        setPopped(Math.floor(cardProgress * QUOTE_CARDS.length));
        setFading(false);
        setPunch(false);
      } else if (p < 0.18) {
        setPopped(0);
        setFading(false);
        setPunch(false);
      } else {
        setFading(true);
        setPunch(true);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [reduced]);

  return (
    <section ref={sectionRef} className="om-quotes">
      <div className="om-quotes-sticky">
        <div
          className="om-quotes-headline"
          style={{ opacity: headlineFaded || punch ? 0 : 1 }}
        >
          <div className="om-eyebrow">{eyebrow}</div>
          <h2 className="om-quotes-heading">
            {titleA}
            <em>{titleEm}</em>
          </h2>
        </div>
        <div className="om-quotes-field">
          {QUOTE_CARDS.map((card, i) => (
            <div
              key={i}
              className={`om-quote-card${i < popped && !fading ? " om-popped" : ""}${
                fading ? " om-fading" : ""
              }${card.featured ? " om-featured" : ""}`}
              style={
                {
                  "--qx": `${card.x}%`,
                  "--qy": `${card.y}%`,
                  "--rot": `${card.rot}deg`,
                } as React.CSSProperties
              }
            >
              <div className="om-quote-header">
                <div className="om-quote-avatar">{card.initials}</div>
                <div className="om-quote-meta">
                  <span className="om-quote-name">
                    {card.name}
                    <span className="om-quote-check">✓</span>
                  </span>
                  <span className="om-quote-handle">{card.handle}</span>
                </div>
              </div>
              <div className="om-quote-text">{card.text}</div>
            </div>
          ))}
        </div>
        <div className={`om-quotes-punchline${punch ? " om-visible" : ""}`}>
          <div className="om-punchline-pre">{QUOTES_PUNCHLINE.pre}</div>
          <div className="om-punchline-main">{QUOTES_PUNCHLINE.main}</div>
        </div>
      </div>
    </section>
  );
}

/* ── 9. Presser — full-bleed media, quote, tap-for-sound ────────────────── */

export function PresserSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const hasVideo = Boolean(PRESSER.videoSrc);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section className="om-presser">
      <div className="om-presser-media" aria-hidden="true">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={PRESSER.videoSrc!}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={PRESSER.placeholderImage} alt="" />
        )}
      </div>
      <div className="om-presser-overlay" />
      {!hasVideo && (
        <div className="om-presser-placeholder-tag">
          {PRESSER.placeholderLabel}
        </div>
      )}
      <div className="om-presser-quote">
        <div className="om-presser-text">{PRESSER.quote}</div>
        <span className="om-presser-attr">{PRESSER.attribution}</span>
      </div>
      {hasVideo && (
        <button className="om-presser-sound" onClick={toggleSound}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 6v4h3l4 3V3L5 6H2z"
              fill="rgba(232,230,224,0.4)"
            />
            <path
              d="M11 5c1.5 1.5 1.5 4.5 0 6"
              stroke="rgba(232,230,224,0.4)"
              strokeWidth="1"
            />
          </svg>
          <span>{muted ? PRESSER.soundHint : PRESSER.muteHint}</span>
        </button>
      )}
    </section>
  );
}

/* ── 11. Reveal — IntersectionObserver fade-up ──────────────────────────── */

export function Reveal({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: "div" | "section";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLElement>}
      className={`om-reveal${inView ? " om-in" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
