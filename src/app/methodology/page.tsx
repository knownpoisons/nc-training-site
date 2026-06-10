import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ServiceIcon } from "@/components/service-icon";
import { MethodologyTopbar } from "@/components/methodology-topbar";

export const metadata: Metadata = {
  title: "The NotContent Method | Think. Make. Build. | NotContent Training",
  description:
    "Four phases. One principle: AI is a creative force multiplier, not a replacement engine. A methodology that widens the gap between what the work costs to make and what it's worth.",
};

// ─── ARC + PHASES ───────────────────────────────────────────────────────────
// Think (Foundations) → Make (Diverge | Converge) → Build (Build)
// The arc labels above each phase reinforce the H1's capability arc so the
// "four phases" never replace "three movements" in the reader's head.

const phases = [
  {
    n: "00",
    name: "Foundations",
    track: "Think",
    arcPosition: "1 of 1 in Think",
    icon: "compass" as const,
    variant: "foundations" as const,
    hook: "Before the team moves fast, it needs the frame.",
    description:
      "Most teams skip the frame and wonder why nothing sticks. Foundations is the part no tool gives you — the mental models and the setup that make everything after it work. Where a team stops poking at a chatbot and starts running AI as infrastructure.",
    outcome:
      "The whole team speaks the same language about AI — and knows where it belongs in the work before anyone touches a tool.",
    whatLabel: "What Your Team Learns",
    what: [
      "LLM onboarding, done properly — Claude, GPT and Gemini set up as infrastructure, not browser tabs. Projects, memory, custom instructions. A trained colleague on every desktop, not a chatbot.",
      "The mental models that run everything — the Three Questions (can AI do this, can AI assist this, should a human own it entirely) and the Stop Rule.",
      "The audit — map the team's real workflow end to end. Find where AI saves time, where it protects quality, and where it quietly breaks things.",
    ],
  },
  {
    n: "01",
    name: "Diverge",
    track: "Make",
    arcPosition: "1 of 2 in Make",
    icon: "diverge" as const,
    image: "/images/training/speaking-wide-1.png",
    imageAlt: "Live training session — exploration phase, options at scale",
    variant: "default" as const,
    hook: "Volume gets cheap. The work starts where it used to finish.",
    description:
      "Most teams start AI adoption by trying to replace what they already do. Wrong move. Diverge is exploration — options at a speed and scale the team has never had. Range first. Taste comes next.",
    outcome:
      "Volume gets cheap. The work starts where it used to finish — and the hours that used to go into the first ten versions go into the margin instead.",
    whatLabel: "What Your Team Learns",
    what: [
      "Prompting as creative direction — the CLEAR framework and the Prompt Skeleton. Works for a headline, a strategy route or a visual.",
      "Volume across disciplines — 50 concepts, 50 headlines, 50 directions, in the time it took to make three.",
      "Tool selection by discipline — the right surface for thinking, for writing, for imagery.",
      "The Stop Rule — knowing when you've explored enough.",
    ],
  },
  {
    n: "02",
    name: "Converge",
    track: "Make",
    arcPosition: "2 of 2 in Make",
    icon: "converge" as const,
    image: "/images/training/speaking-wide-2.png",
    imageAlt: "Live training session — convergence phase, taste applied to AI output",
    variant: "cobalt" as const,
    hook: "AI work clears the bar. Cost drops; quality doesn't.",
    description:
      "Most AI training falls apart here. Teams learn to generate but never to choose. Converge is the discipline of human taste, brand standards and craft applied to AI output. The difference between 'we used AI' and 'we made something great, faster.'",
    outcome:
      "AI work clears the bar. Fast iteration, human judgement — and the cost of the work drops without the quality dropping with it.",
    whatLabel: "What Your Team Learns",
    what: [
      "Quality frameworks for judging any AI output — copy, concepts, decks, imagery.",
      "Brand and governance checks that hold up to legal.",
      "Precision refinement — switching from exploration tools to production tools.",
      "The 80/20 split — what AI finishes, what a human finishes, and why that line is the whole game.",
    ],
  },
  {
    n: "03",
    name: "Build",
    track: "Build",
    arcPosition: "1 of 1 in Build",
    icon: "systemize" as const,
    image: "/images/training/speaking-wide-3.png",
    imageAlt: "Build phase — workflows the team owns",
    variant: "culmination" as const,
    hook: "The team doesn't need us anymore. That's the point.",
    description:
      "The team that depends on a trainer isn't trained. Build is where individual skill becomes a way the whole team works — workflows that turn a one-off saving into a permanent one.",
    outcome:
      "The team doesn't need us anymore. They're building their own margin — workflows that run without a trainer in the room. That's the point. And it's where Ongoing begins.",
    whatLabel: "What Your Team Builds — not learns, builds",
    // Build uses callouts (4 pull-quote tiles) instead of bullets to break
    // the four-phase rhythm and land the culmination harder.
    callouts: [
      {
        kicker: "Claude Code, stripped of the engineer framing",
        body: "Reads any file, writes any file, runs any task. Bulk operations, document transformation, repetitive prep — gone.",
      },
      {
        kicker: "Cowork for the operational grind",
        body: "File ops at scale, exports, handoffs — the sludge that eats a creative day.",
      },
      {
        kicker: "Agentic workflows the team builds itself",
        body: "A brief agent, an asset agent, a review agent. Narrow, sharp, theirs to keep.",
      },
      {
        kicker: "The systems instinct",
        body: "The reflex to spot a repeating task and build the way out — instead of doing it by hand again.",
      },
    ],
  },
];

// ─── HANDSHAKE — 10/80/10 worked example ───────────────────────────────────
// Surfacing ONE framework as a concrete artifact. Sits inside Foundations
// (the phase where the Handshake belongs in the methodology). Three columns,
// one sentence each.

const handshake = [
  { pct: "10%", role: "Human", body: "Sets the brief. Names the constraints. Owns the standard." },
  { pct: "80%", role: "AI", body: "Does the volume. Range, options, drafts, variants at scale." },
  { pct: "10%", role: "Human", body: "Owns the final call. Taste, judgement, ship-or-don't." },
];

// ─── COMPARISON TABLE ───────────────────────────────────────────────────────
// Margin row + Width row added — the through-line of the rewrite.

const differences = [
  {
    theirs: "Generic AI overview for any industry",
    ours: "Built for creative and media teams — design, copy, motion, strategy, production",
  },
  {
    theirs: "One-day workshop, then you're on your own",
    ours: "Half-day entry point or 8-week transformation with ongoing monthly support",
  },
  {
    theirs: "Tool demos and prompt templates",
    ours: "Methodology that works regardless of which tools survive next year",
  },
  {
    theirs: "Individual upskilling",
    ours: "Team-wide adoption — everyone moves together or nobody moves",
  },
  {
    theirs: "Theory and slides",
    ours: "Your brand assets, your briefs, your output — from session one",
  },
  {
    theirs: "Learn the tools",
    ours: "Onboard properly, then build your own workflows",
  },
  {
    theirs: "Productivity — do more, faster",
    ours: "Margin — more value out of the work you already win",
  },
];

// Tighter container width per the design system spec (was max-w-7xl across
// the page; design system documents 1100px for editorial pages).
const CONTAINER = "mx-auto max-w-[1100px] px-6 lg:px-8";
// Eyebrow tracking per design system (was 0.15em; spec is 0.22em).
const EYEBROW = "text-[11px] uppercase tracking-[0.22em]";

export default function MethodologyPage() {
  return (
    <>
      <MethodologyTopbar />

      {/* ═══ HERO — Cobalt 60vh ═══ */}
      <section className="relative min-h-[60vh] bg-[#1338BE] text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img src="/images/training/speaking-wide-3.png" alt="" className="h-full w-full object-cover opacity-[0.1] mix-blend-lighten" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1338BE] via-[#1338BE]/50 to-transparent" />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className={"h-full " + CONTAINER + " relative"}>
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        <div className={"relative z-10 " + CONTAINER + " pb-16 lg:pb-24 w-full"}>
          <Reveal>
            <p className={EYEBROW + " text-white/50 mb-6"}>
              The NotContent Method
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="oci-display text-white leading-[0.93]">
              Think.
              <br />
              Make.
              <br />
              Build.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
              <p className="max-w-md text-lg text-white/70 leading-relaxed">
                Three moves. One principle — AI is a creative force multiplier,
                not a replacement engine. The teams that win don&rsquo;t just
                work faster. They widen the gap between what the work costs to
                make and what it&rsquo;s worth.
              </p>
              <Link
                href="/book"
                className={"inline-flex items-center justify-center h-14 px-10 bg-white text-[#1338BE] font-medium hover:bg-white/90 transition-colors " + EYEBROW}
              >
                Book a Discovery Call
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ INTRO — A methodology, not a tool list ═══ */}
      <section className="pb-8 pt-20 lg:pt-28 relative oci-grid-lines">
        <div className={CONTAINER}>
          <Reveal>
            <div className="oci-section-label" style={{ letterSpacing: "0.22em" }}>
              <span>The Method</span>
              <span>[NC.2]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mt-8">
              <h2 className="oci-display-sm max-w-2xl">
                A methodology,
                <br />
                not a tool list.
              </h2>
              <p className="max-w-md text-sm text-muted-foreground leading-relaxed lg:text-right">
                Separate exploration from execution so speed never costs you
                taste. Then build the workflows that make the gain compound.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-10 max-w-3xl space-y-5 text-base lg:text-lg text-foreground/80 leading-relaxed">
              <p>
                Most teams chase productivity — more output, same people.
                That&rsquo;s half the prize. The bigger half is margin: the
                same work, delivered at a fraction of the cost, so the spread
                between what you spend making it and what you charge for it
                gets wider.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ARC DIAGRAM — Think → [Diverge | Converge] → Build ═══ */}
      <section className="pb-16 lg:pb-24 relative oci-grid-lines">
        <div className={CONTAINER}>
          {/* Mobile arc — typographic stack (replaces the desktop SVG below) */}
          <Reveal delay={150}>
            <div className="sm:hidden" role="img" aria-label="The capability arc: Think leads to Make leads to Build">
              <ol className="border-t border-[#1338BE]/15">
                {/* THINK */}
                <li className="grid grid-cols-[64px_1fr] gap-5 py-5 border-b border-[#1338BE]/15 items-start">
                  <span className={EYEBROW + " text-[#1338BE] font-semibold pt-0.5"}>Think</span>
                  <div className="space-y-1.5">
                    <p className="font-editorial text-lg text-ink leading-snug">
                      <span className="text-[#1338BE]/40 text-sm tabular-nums mr-2">00</span>
                      Foundations
                    </p>
                  </div>
                </li>
                {/* MAKE — brackets two phases */}
                <li className="grid grid-cols-[64px_1fr] gap-5 py-5 border-b border-[#1338BE]/15 items-start">
                  <span className={EYEBROW + " text-[#1338BE] font-semibold pt-0.5"}>Make</span>
                  <div className="space-y-2">
                    <p className="font-editorial text-lg text-ink leading-snug">
                      <span className="text-[#1338BE]/40 text-sm tabular-nums mr-2">01</span>
                      Diverge
                    </p>
                    <p className="font-editorial text-lg text-ink leading-snug">
                      <span className="text-[#1338BE]/40 text-sm tabular-nums mr-2">02</span>
                      Converge
                    </p>
                  </div>
                </li>
                {/* BUILD */}
                <li className="grid grid-cols-[64px_1fr] gap-5 py-5 border-b border-[#1338BE]/15 items-start">
                  <span className={EYEBROW + " text-[#1338BE] font-semibold pt-0.5"}>Build</span>
                  <div className="space-y-1.5">
                    <p className="font-editorial text-lg text-ink leading-snug">
                      <span className="text-[#1338BE]/40 text-sm tabular-nums mr-2">03</span>
                      Build
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </Reveal>

          {/* Desktop arc — SVG */}
          <Reveal delay={150}>
            <svg viewBox="0 0 1000 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full hidden sm:block" aria-hidden="true" role="img" aria-label="The capability arc: Think (Foundations) leads to Make (Diverge and Converge) leads to Build">

              {/* ── Arc labels (top tier) ─────────────────────────────── */}
              <text x="120" y="34" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#1338BE" letterSpacing="3.5" fontWeight="600">THINK</text>
              <text x="500" y="34" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#1338BE" letterSpacing="3.5" fontWeight="600">MAKE</text>
              <text x="880" y="34" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#1338BE" letterSpacing="3.5" fontWeight="600">BUILD</text>

              {/* ── Arc-label brackets (tier-binders) ─────────────────── */}
              {/* THINK bracket — over Foundations */}
              <line x1="80" y1="46" x2="160" y2="46" stroke="#1338BE" strokeWidth="1" opacity="0.4" />
              <line x1="80" y1="46" x2="80" y2="54" stroke="#1338BE" strokeWidth="1" opacity="0.4" />
              <line x1="160" y1="46" x2="160" y2="54" stroke="#1338BE" strokeWidth="1" opacity="0.4" />
              {/* MAKE bracket — over Diverge + Converge */}
              <line x1="320" y1="46" x2="680" y2="46" stroke="#1338BE" strokeWidth="1" opacity="0.4" />
              <line x1="320" y1="46" x2="320" y2="54" stroke="#1338BE" strokeWidth="1" opacity="0.4" />
              <line x1="680" y1="46" x2="680" y2="54" stroke="#1338BE" strokeWidth="1" opacity="0.4" />
              {/* BUILD bracket — over Build */}
              <line x1="840" y1="46" x2="920" y2="46" stroke="#1338BE" strokeWidth="1" opacity="0.4" />
              <line x1="840" y1="46" x2="840" y2="54" stroke="#1338BE" strokeWidth="1" opacity="0.4" />
              <line x1="920" y1="46" x2="920" y2="54" stroke="#1338BE" strokeWidth="1" opacity="0.4" />

              {/* ── Node 00: Foundations — concentric squares (frame) ── */}
              <g>
                <rect x="80" y="140" width="80" height="60" fill="none" stroke="#1338BE" strokeWidth="1" opacity="0.25" />
                <rect x="92" y="148" width="56" height="44" fill="none" stroke="#1338BE" strokeWidth="1" opacity="0.35" />
                <rect x="104" y="156" width="32" height="28" fill="#1338BE" opacity="0.12" />
                <circle cx="120" cy="170" r="3" fill="#1338BE" opacity="0.5" />
                <text x="120" y="230" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1338BE" opacity="0.55" letterSpacing="0.15em">FOUNDATIONS</text>
                <text x="120" y="246" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#1338BE" opacity="0.35" letterSpacing="0.15em">00</text>
              </g>

              {/* Arrow 00 → 01 */}
              <line x1="180" y1="170" x2="280" y2="170" stroke="#1338BE" strokeWidth="1" opacity="0.18" strokeDasharray="4 4" />
              <polygon points="280,166 290,170 280,174" fill="#1338BE" opacity="0.25" />

              {/* ── Node 01: Diverge — explosion ───────────────────────── */}
              <g>
                <circle cx="380" cy="170" r="44" fill="#1338BE" opacity="0.04" />
                <circle cx="380" cy="170" r="28" fill="#1338BE" opacity="0.06" />
                <circle cx="380" cy="170" r="6" fill="#1338BE" opacity="0.35" />
                <line x1="386" y1="164" x2="425" y2="135" stroke="#1338BE" strokeWidth="1" opacity="0.22" />
                <line x1="388" y1="168" x2="430" y2="155" stroke="#1338BE" strokeWidth="1" opacity="0.27" />
                <line x1="388" y1="172" x2="430" y2="185" stroke="#1338BE" strokeWidth="1" opacity="0.27" />
                <line x1="386" y1="176" x2="425" y2="205" stroke="#1338BE" strokeWidth="1" opacity="0.22" />
                <circle cx="425" cy="135" r="2.5" fill="#1338BE" opacity="0.2" />
                <circle cx="430" cy="155" r="2.5" fill="#1338BE" opacity="0.25" />
                <circle cx="430" cy="185" r="2.5" fill="#1338BE" opacity="0.25" />
                <circle cx="425" cy="205" r="2.5" fill="#1338BE" opacity="0.2" />
                <text x="380" y="230" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1338BE" opacity="0.55" letterSpacing="0.15em">DIVERGE</text>
                <text x="380" y="246" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#1338BE" opacity="0.35" letterSpacing="0.15em">01</text>
              </g>

              {/* Arrow 01 → 02 */}
              <line x1="450" y1="170" x2="550" y2="170" stroke="#1338BE" strokeWidth="1" opacity="0.18" strokeDasharray="4 4" />
              <polygon points="550,166 560,170 550,174" fill="#1338BE" opacity="0.25" />

              {/* ── Node 02: Converge — funnel ─────────────────────────── */}
              <g>
                <rect x="600" y="138" width="80" height="64" rx="2" fill="#1338BE" opacity="0.03" />
                <line x1="600" y1="144" x2="650" y2="160" stroke="#1338BE" strokeWidth="1" opacity="0.18" />
                <line x1="600" y1="160" x2="650" y2="166" stroke="#1338BE" strokeWidth="1" opacity="0.22" />
                <line x1="600" y1="170" x2="650" y2="170" stroke="#1338BE" strokeWidth="1.5" opacity="0.32" />
                <line x1="600" y1="180" x2="650" y2="174" stroke="#1338BE" strokeWidth="1" opacity="0.22" />
                <line x1="600" y1="196" x2="650" y2="180" stroke="#1338BE" strokeWidth="1" opacity="0.18" />
                <line x1="650" y1="170" x2="690" y2="170" stroke="#1338BE" strokeWidth="2" opacity="0.4" />
                <circle cx="650" cy="170" r="5" fill="#1338BE" opacity="0.3" />
                <circle cx="690" cy="170" r="3.5" fill="#1338BE" opacity="0.4" />
                <text x="640" y="230" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1338BE" opacity="0.55" letterSpacing="0.15em">CONVERGE</text>
                <text x="640" y="246" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#1338BE" opacity="0.35" letterSpacing="0.15em">02</text>
              </g>

              {/* Arrow 02 → 03 */}
              <line x1="710" y1="170" x2="810" y2="170" stroke="#1338BE" strokeWidth="1" opacity="0.18" strokeDasharray="4 4" />
              <polygon points="810,166 820,170 810,174" fill="#1338BE" opacity="0.25" />

              {/* ── Node 03: Build — structured grid + feedback loop ──── */}
              <g>
                <rect x="840" y="138" width="80" height="64" rx="2" fill="none" stroke="#1338BE" strokeWidth="1.5" opacity="0.22" />
                <line x1="840" y1="160" x2="920" y2="160" stroke="#1338BE" strokeWidth="0.5" opacity="0.16" />
                <line x1="840" y1="180" x2="920" y2="180" stroke="#1338BE" strokeWidth="0.5" opacity="0.16" />
                <line x1="867" y1="138" x2="867" y2="202" stroke="#1338BE" strokeWidth="0.5" opacity="0.16" />
                <line x1="893" y1="138" x2="893" y2="202" stroke="#1338BE" strokeWidth="0.5" opacity="0.16" />
                <rect x="841" y="139" width="25" height="20" fill="#1338BE" opacity="0.09" />
                <rect x="868" y="161" width="24" height="18" fill="#1338BE" opacity="0.14" />
                <rect x="894" y="181" width="25" height="20" fill="#1338BE" opacity="0.18" />
                <rect x="841" y="161" width="25" height="18" fill="#1338BE" opacity="0.07" />
                <rect x="894" y="139" width="25" height="20" fill="#1338BE" opacity="0.11" />
                <path d="M930 170 Q 950 170 950 150 Q 950 120 920 120" stroke="#1338BE" strokeWidth="1" opacity="0.22" fill="none" />
                <polygon points="922,117 918,123 914,117" fill="#1338BE" opacity="0.22" />
                <text x="880" y="230" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1338BE" opacity="0.55" letterSpacing="0.15em">BUILD</text>
                <text x="880" y="246" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#1338BE" opacity="0.35" letterSpacing="0.15em">03</text>
              </g>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* ═══ PHASE 00 — FOUNDATIONS (quieter, narrower, no full-bleed image) ═══ */}
      <section id="phase-00" data-phase="00" className="py-20 lg:py-28 relative oci-grid-lines scroll-mt-24">
        <div className={CONTAINER}>
          <Reveal>
            <div className="oci-section-label" style={{ letterSpacing: "0.22em" }}>
              <span>Phase {phases[0]!.n} · {phases[0]!.track}</span>
              <span>{phases[0]!.arcPosition}</span>
            </div>
          </Reveal>

          <div className="mt-10 max-w-3xl">
            <Reveal delay={100}>
              <div className="flex items-center gap-4 mb-5">
                <ServiceIcon icon={phases[0]!.icon} size={32} className="opacity-50" />
                <p className={EYEBROW + " text-muted-foreground"}>
                  {phases[0]!.hook}
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight font-light text-foreground">
                {phases[0]!.name}.
              </h3>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 text-base text-foreground/70 leading-relaxed">
                {phases[0]!.description}
              </p>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-8 border-l-[3px] border-[#1338BE] pl-6">
                <p className={EYEBROW + " text-[#1338BE] mb-2"}>
                  The Outcome
                </p>
                <p className="text-base leading-relaxed text-foreground">
                  {phases[0]!.outcome}
                </p>
              </div>
            </Reveal>
          </div>

          {/* What Your Team Learns — kept as a list, narrower on Foundations */}
          <Reveal delay={300}>
            <div className="mt-12 max-w-3xl border border-[#1338BE]/15 bg-[#1338BE]/[0.015] p-8">
              <p className={EYEBROW + " text-muted-foreground mb-6"}>
                {phases[0]!.whatLabel}
              </p>
              <ul className="space-y-4">
                {phases[0]!.what?.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#1338BE]/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ HANDSHAKE — 10/80/10 worked example ═══ */}
      <section className="pb-20 lg:pb-28 relative oci-grid-lines">
        <div className={CONTAINER}>
          <Reveal>
            <div className="border-t border-foreground/10 pt-12">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <p className={EYEBROW + " text-[#1338BE]"}>
                  Worked example
                </p>
                <p className={EYEBROW + " text-muted-foreground"}>
                  The Handshake
                </p>
              </div>
              <h4 className="font-editorial text-2xl sm:text-3xl lg:text-4xl tracking-tight font-normal text-foreground leading-[1.1]">
                The 10/80/10 split.
              </h4>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                Where the hands go matters more than the tool. The split looks
                the same on a brief, a strategy route or a key visual.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
              {handshake.map((step, i) => (
                <div
                  key={i}
                  className="bg-background p-7 lg:p-8"
                >
                  <p className="font-editorial text-3xl lg:text-4xl text-[#1338BE] font-normal leading-none">
                    {step.pct}
                  </p>
                  <p className={EYEBROW + " text-foreground mt-4"}>
                    {step.role}
                  </p>
                  <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PHASE 01 — DIVERGE (cream bg, full-bleed image) ═══ */}
      <section id="phase-01" data-phase="01" className="py-24 lg:py-36 relative oci-grid-lines scroll-mt-24">
        <div className={CONTAINER}>
          <Reveal>
            <div className="oci-section-label" style={{ letterSpacing: "0.22em" }}>
              <span>Phase {phases[1]!.n} · {phases[1]!.track}</span>
              <span>{phases[1]!.arcPosition}</span>
            </div>
          </Reveal>

          <Reveal delay={50}>
            <div className="mt-12 relative aspect-[21/9] overflow-hidden bg-[#1338BE]">
              <img
                src={phases[1]!.image}
                alt={phases[1]!.imageAlt}
                className="h-full w-full object-cover grayscale mix-blend-multiply opacity-60"
              />
            </div>
          </Reveal>

          <div className="mt-12 grid gap-16 lg:grid-cols-2">
            <div>
              <Reveal delay={100}>
                <div className="flex items-center gap-4 mb-6">
                  <ServiceIcon icon={phases[1]!.icon} size={36} className="opacity-50" />
                  <p className={EYEBROW + " text-muted-foreground"}>
                    {phases[1]!.hook}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <h3 className="oci-display-sm">{phases[1]!.name}.</h3>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  {phases[1]!.description}
                </p>
              </Reveal>
              <Reveal delay={250}>
                <div className="mt-8 border border-[#1338BE]/20 p-6">
                  <p className={EYEBROW + " text-[#1338BE] mb-2"}>
                    The Outcome
                  </p>
                  <p className="text-sm leading-relaxed">
                    {phases[1]!.outcome}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} direction="right">
              <div className="border border-[#1338BE]/20 bg-[#1338BE]/[0.02] p-8">
                <p className={EYEBROW + " text-muted-foreground mb-6"}>
                  {phases[1]!.whatLabel}
                </p>
                <ul className="space-y-5">
                  {phases[1]!.what?.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#1338BE]/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ PHASE 02 — CONVERGE (cobalt bg, no full-bleed image) ═══ */}
      <section id="phase-02" data-phase="02" className="py-24 lg:py-36 bg-[#1338BE] text-white relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className={"h-full " + CONTAINER + " relative"}>
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        <div className={"relative z-10 " + CONTAINER}>
          <Reveal>
            <div className={"flex items-center justify-between border-b border-white/20 pb-3 mb-0 " + EYEBROW + " text-white/50"}>
              <span>Phase {phases[2]!.n} · {phases[2]!.track}</span>
              <span>{phases[2]!.arcPosition}</span>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-16 lg:grid-cols-2">
            <div>
              <Reveal delay={100}>
                <div className="flex items-center gap-4 mb-6">
                  <ServiceIcon icon={phases[2]!.icon} size={36} className="opacity-50 [&>svg]:stroke-white" />
                  <p className={EYEBROW + " text-white/50"}>
                    {phases[2]!.hook}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <h3 className="oci-display-sm text-white">{phases[2]!.name}.</h3>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-sm text-white/60 leading-relaxed">
                  {phases[2]!.description}
                </p>
              </Reveal>
              <Reveal delay={250}>
                <div className="mt-8 border border-white/20 p-6">
                  <p className={EYEBROW + " text-white/50 mb-2"}>
                    The Outcome
                  </p>
                  <p className="text-sm text-white leading-relaxed">
                    {phases[2]!.outcome}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} direction="right">
              <div className="border border-white/20 bg-white/[0.05] p-8">
                <p className={EYEBROW + " text-white/50 mb-6"}>
                  {phases[2]!.whatLabel}
                </p>
                <ul className="space-y-5">
                  {phases[2]!.what?.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 text-sm text-white/60 leading-relaxed"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-white/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ PHASE 03 — BUILD (culmination: larger outcome + pull-quote callouts) ═══ */}
      <section id="phase-03" data-phase="03" className="py-28 lg:py-40 relative oci-grid-lines scroll-mt-24">
        <div className={CONTAINER}>
          <Reveal>
            <div className="oci-section-label" style={{ letterSpacing: "0.22em" }}>
              <span>Phase {phases[3]!.n} · {phases[3]!.track}</span>
              <span>{phases[3]!.arcPosition}</span>
            </div>
          </Reveal>

          <Reveal delay={50}>
            <div className="mt-12 relative aspect-[21/8] overflow-hidden bg-[#1338BE]">
              <img
                src={phases[3]!.image}
                alt={phases[3]!.imageAlt}
                className="h-full w-full object-cover grayscale mix-blend-multiply opacity-60"
              />
            </div>
          </Reveal>

          <div className="mt-14 max-w-4xl">
            <Reveal delay={100}>
              <div className="flex items-center gap-4 mb-6">
                <ServiceIcon icon={phases[3]!.icon} size={40} className="opacity-50" />
                <p className={EYEBROW + " text-muted-foreground"}>
                  {phases[3]!.hook}
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <h3 className="oci-display-sm">{phases[3]!.name}.</h3>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 text-base lg:text-lg text-foreground/75 leading-relaxed max-w-3xl">
                {phases[3]!.description}
              </p>
            </Reveal>
          </div>

          {/* Culmination outcome — larger pull-quote treatment */}
          <Reveal delay={250}>
            <div className="mt-12 border-l-[4px] border-[#1338BE] pl-8 lg:pl-12 py-2 max-w-4xl">
              <p className={EYEBROW + " text-[#1338BE] mb-3"}>
                The Outcome
              </p>
              <p className="font-editorial text-xl sm:text-2xl lg:text-3xl text-foreground leading-snug tracking-tight font-normal">
                {phases[3]!.outcome}
              </p>
            </div>
          </Reveal>

          {/* What Your Team BUILDS — 4 pull-quote callout tiles (not bullets) */}
          <Reveal delay={300}>
            <div className="mt-16">
              <p className={EYEBROW + " text-muted-foreground mb-8"}>
                {phases[3]!.whatLabel}
              </p>
              <div className="grid gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-2">
                {phases[3]!.callouts?.map((c, i) => (
                  <div key={i} className="bg-background p-8 lg:p-10">
                    <p className="font-editorial text-base lg:text-lg text-foreground leading-snug tracking-tight font-normal">
                      {c.kicker}
                    </p>
                    <p className="mt-3 text-sm text-foreground/65 leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ IMPACT BAND — HELD until verified ═══
        TODO: Re-enable when Jeremy confirms each figure + client clearance.
        Reframe labels toward margin once real numbers land. Suggested:
          [CONFIRM] — production cost cut on a single campaign
          [CONFIRM] — output from the same budget, no added headcount
          [CONFIRM] — saved on a single product launch
        Source markup preserved below as a comment for fast restoration.
      ═══ */}

      {/* ═══ COMPARISON TABLE — "Techniques over tools." framing ═══ */}
      <section className="py-24 lg:py-36 relative oci-grid-lines">
        <div className={CONTAINER}>
          <Reveal>
            <div className="oci-section-label" style={{ letterSpacing: "0.22em" }}>
              <span>Why This Works</span>
              <span>[NC.3]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mt-8 mb-16">
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] text-foreground leading-[1.1] tracking-tight font-normal max-w-2xl">
                Techniques over <em className="font-editorial italic text-[#1338BE]">tools.</em>
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground leading-relaxed lg:text-right">
                The tools change every week. The techniques don&rsquo;t. The
                Method teaches the way of working that survives every new
                release — so the work compounds instead of restarting.
              </p>
            </div>
          </Reveal>

          {/* Table header */}
          <Reveal delay={150}>
            <div className="grid grid-cols-2 border-b border-[#1338BE]/20 pb-3">
              <p className={EYEBROW + " text-muted-foreground"}>
                Typical AI Training
              </p>
              <p className={EYEBROW + " text-muted-foreground"}>
                The NotContent Method
              </p>
            </div>
          </Reveal>

          {/* Table rows */}
          {differences.map((diff, i) => (
            <Reveal key={diff.ours} delay={180 + i * 60}>
              <div className="grid grid-cols-2 border-b border-[#1338BE]/10 py-5">
                <p className="pr-3 sm:pr-8 text-sm text-muted-foreground line-through decoration-foreground/20">
                  {diff.theirs}
                </p>
                <p className="text-sm font-medium">{diff.ours}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ SECONDARY-PATH CTA — for the methodology-curious not-yet-ready buyer ═══ */}
      <section className="py-20 lg:py-28 border-t border-foreground/10 relative oci-grid-lines">
        <div className={CONTAINER}>
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div className="max-w-xl">
                <p className={EYEBROW + " text-[#1338BE] mb-4"}>
                  Two ways in
                </p>
                <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.1] tracking-tight font-normal">
                  Not ready for the call?
                  <br />
                  <em className="font-editorial italic text-[#1338BE]">See how this runs.</em>
                </h2>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-md">
                  Start with a half-day audit of where your team actually
                  stands — or see the full 8-week build. Either route, the
                  next step is the same: clear-eyed about the gap, honest
                  about the work.
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <Link
                  href="/programs/foundations"
                  className={"inline-flex items-center justify-center h-14 px-10 bg-[#1338BE] text-white font-medium hover:bg-[#0e2c95] transition-colors " + EYEBROW}
                >
                  See the Audit Workshop →
                </Link>
                <Link
                  href="/programs/transformation"
                  className={"inline-flex items-center justify-center h-14 px-10 border border-foreground/20 text-foreground hover:bg-foreground hover:text-white transition-colors " + EYEBROW}
                >
                  See the 8-week build →
                </Link>
                <Link
                  href="/book"
                  className={EYEBROW + " text-muted-foreground hover:text-foreground transition-colors text-center mt-2 border-b border-foreground/15 hover:border-foreground/40 pb-1 self-center"}
                >
                  Or book a Discovery Call →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
