"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { FRAGMENTS, GRID_CELLS, GRID_DIMS, type Fragment } from "./particle-paths";

type Size = { w: number; h: number };

// ─── One fragment ───────────────────────────────────────────────────────────
// Positioned by pixel translate (compositor-only). Percent positions from the
// trajectory table are multiplied by measured stage size. Stops:
// [birth, diverge, converge, build] → [0, 0.32, 0.64, 1].
function FragmentNode({
  f,
  progress,
  size,
}: {
  f: Fragment;
  progress: MotionValue<number>;
  size: Size;
}) {
  const { w, h } = size;
  const pxX = useTransform(
    progress,
    [0, 0.32, 0.64, 1],
    [w / 2, (f.ex / 100) * w, (f.cx / 100) * w, (f.gx / 100) * w],
  );
  const pxY = useTransform(
    progress,
    [0, 0.32, 0.64, 1],
    [h / 2, (f.ey / 100) * h, (f.cy / 100) * h, (f.gy / 100) * h],
  );
  const rotate = useTransform(progress, [0, 0.32, 0.64, 1], [0, f.rot, f.rot * 0.25, 0]);
  const d = f.stagger * 0.06;
  const opacity = useTransform(
    progress,
    [0, 0.05 + d, 0.32, 0.5, 0.64, 0.82, 1],
    [0, 1, 1, 0.5, 0.85, 1, 1],
  );

  return (
    <motion.div style={{ x: pxX, y: pxY }} className="absolute left-0 top-0 will-change-transform">
      <motion.span
        style={{ rotate, opacity, fontSize: f.serif ? `${f.scale}rem` : undefined }}
        className={
          "block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap select-none " +
          (f.serif
            ? "font-editorial italic text-[#1338BE]"
            : "font-mono text-[#1338BE]/55 text-[11px] tracking-[0.15em]")
        }
      >
        {f.label}
      </motion.span>
    </motion.div>
  );
}

// ─── Phase caption ──────────────────────────────────────────────────────────
function PhaseCaption({
  progress,
  range,
  eyebrow,
  title,
  line,
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  eyebrow: string;
  title: string;
  line: string;
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[1]], [16, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-[11%] mx-auto max-w-[1100px] px-6 lg:px-8 text-center pointer-events-none"
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#1338BE] mb-3">{eyebrow}</p>
      <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-[1.05]">
        {title}
      </h3>
      <p className="mt-3 text-sm text-ink-muted max-w-md mx-auto">{line}</p>
    </motion.div>
  );
}

// ─── Static fallback (reduced-motion / pre-mount / no-JS) ───────────────────
function StaticSpread() {
  const cols = [
    { eyebrow: "01 · Today", title: "Everyone solo", line: "A few people flying with AI, the rest guessing. Different tools, no shared method." },
    { eyebrow: "02 · The method", title: "One way of working", line: "The whole team converges on the same operating system for the work." },
    { eyebrow: "03 · What you keep", title: "It holds", line: "Documented role by role — the operating model runs without a trainer in the room." },
  ];
  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-24 lg:py-32">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#1338BE] mb-3">The Method, in motion</p>
      <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-[1.05] max-w-2xl">
        A scattered team in. <em className="italic text-[#1338BE]">One operating model out.</em> Documented.
      </h2>
      <div className="mt-14 grid gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-3">
        {cols.map((c) => (
          <div key={c.eyebrow} className="bg-background p-8 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1338BE]">{c.eyebrow}</p>
            <h3 className="mt-4 font-editorial text-2xl text-ink font-normal">{c.title}</h3>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">{c.line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Animated stage ─────────────────────────────────────────────────────────
// Split out so it mounts only when animating — its scroll binding and DOM
// measurement initialise against a live, present DOM node.

const STAGE_ID = "flagship-scrub";

function AnimatedStage() {
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  // Section scroll range in document pixels: [start, end]. Measured from the
  // DOM by stable id (avoids ref staleness under React StrictMode double-mount).
  const [range, setRange] = useState<[number, number]>([0, 1]);

  // Motion's global scroll — a live pixel MotionValue, no target ref required.
  const { scrollY } = useScroll();

  useEffect(() => {
    const measure = () => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
      const el = document.getElementById(STAGE_ID);
      if (!el) return;
      const start = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = el.offsetHeight - window.innerHeight;
      setRange([start, start + Math.max(1, scrollable)]);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Map document scroll → 0..1 progress across the section, clamped.
  const scrollYProgress = useTransform(scrollY, range, [0, 1], { clamp: true });

  const gridOpacity = useTransform(scrollYProgress, [0.64, 0.82], [0, 1]);

  return (
    <section
      id={STAGE_ID}
      aria-label="The NotContent Method in motion"
      className="relative h-[200vh] sm:h-[250vh] border-y border-foreground/10"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        {/* Scroll-progress rule — telegraphs "this is a timeline, keep going" */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-[#1338BE]/40 z-10"
          aria-hidden="true"
        />
        {/* Build-phase documented-grid backdrop */}
        <motion.div
          style={{ opacity: gridOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="grid w-[62%] h-[46%] border border-[#1338BE]/15"
            style={{
              gridTemplateColumns: `repeat(${GRID_DIMS.COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_DIMS.ROWS}, 1fr)`,
            }}
          >
            {GRID_CELLS.map((c, i) => (
              <div key={i} className="border border-[#1338BE]/10 relative">
                <span className="absolute top-1 left-1 text-[7px] font-mono text-[#1338BE]/30 tracking-wider">
                  {c}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fragment field */}
        <div className="absolute inset-0" aria-hidden="true">
          {size.w > 0 &&
            FRAGMENTS.map((f, i) => (
              <FragmentNode key={i} f={f} progress={scrollYProgress} size={size} />
            ))}
        </div>

        {/* Phase captions — the team's transformation */}
        <PhaseCaption
          progress={scrollYProgress}
          range={[0.02, 0.14, 0.28, 0.36]}
          eyebrow="Most teams today"
          title="Everyone using AI differently."
          line="A few people flying, the rest guessing. Different tools, no shared method."
        />
        <PhaseCaption
          progress={scrollYProgress}
          range={[0.4, 0.5, 0.58, 0.66]}
          eyebrow="The method"
          title="One shared way of working."
          line="The whole team converges on the same operating system for the work."
        />
        <PhaseCaption
          progress={scrollYProgress}
          range={[0.72, 0.84, 0.96, 1]}
          eyebrow="What you keep"
          title="An operating model that holds."
          line="Documented role by role — it runs without a trainer in the room."
        />
      </div>
    </section>
  );
}

// ─── The flagship section ───────────────────────────────────────────────────
// Picks the animated scrub or the static editorial spread. The animated stage
// is a separate component so its scroll ref is live from first render.
export function DivergeConverge() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || reduced) {
    return (
      <section
        aria-label="The NotContent Method in motion"
        className="relative oci-grid-lines border-y border-foreground/10"
      >
        <StaticSpread />
      </section>
    );
  }
  return <AnimatedStage />;
}
