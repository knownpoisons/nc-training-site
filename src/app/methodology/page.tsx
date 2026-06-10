import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ServiceIcon } from "@/components/service-icon";

export const metadata: Metadata = {
  title: "The NotContent Method | Think. Make. Build. | NotContent Training",
  description:
    "Four phases. One principle: AI is a creative force multiplier, not a replacement engine. A methodology that widens the gap between what the work costs to make and what it's worth.",
};

// ─── PHASES ─────────────────────────────────────────────────────────────────
// Phase 00 — Foundations (Think) — new front-of-page block
// Phase 01 — Diverge (Make) — keeps equity, copy widened
// Phase 02 — Converge (Make) — keeps equity, copy widened
// Phase 03 — Build (Build) — renamed from Systemize, copy widened
//
// Eyebrow pattern: "Phase NN · Think / Make / Build"
// Icons reused from ServiceIcon — Foundations uses 'compass' (methodology /
// mental models). Build keeps the systemize gear (the name changed, the
// reflex didn't).

const phases = [
  {
    n: "00",
    name: "Foundations",
    track: "Think",
    icon: "compass" as const,
    image: "/images/training/speaking-wide-4.png",
    imageAlt: "Foundations session — onboarding the team to AI as infrastructure",
    bg: "cream" as const,
    hook: "Before the team moves fast, it needs the frame.",
    description:
      "Before a team moves fast with AI, it needs the frame. Most teams skip this and wonder why nothing sticks.\n\nFoundations is the part no tool gives you — the mental models and the proper setup that make everything after it work. This is where a team stops poking at a chatbot and starts running AI as infrastructure.",
    outcome:
      "The whole team speaks the same language about AI — and knows where it belongs in the work before anyone touches a tool.",
    whatLabel: "What Your Team Learns",
    what: [
      "LLM onboarding, done properly — Claude, GPT and Gemini set up as infrastructure, not browser tabs. Projects, memory, custom instructions. A trained colleague on every desktop, not a chatbot.",
      "The mental models that run everything — the Three Questions (can AI do this, can AI assist this, should a human own it entirely) and the Stop Rule.",
      "The Handshake — the 10/80/10 split. A human sets the brief, AI does the volume, a human owns the final call. Where the hands go matters more than the tool.",
      "The audit — map the team's real workflow end to end. Find where AI saves time, where it protects quality, and where it quietly breaks things.",
    ],
  },
  {
    n: "01",
    name: "Diverge",
    track: "Make",
    icon: "diverge" as const,
    image: "/images/training/speaking-wide-1.png",
    imageAlt: "Live training session — exploration phase, options at scale",
    bg: "cream" as const,
    hook: "Volume gets cheap. The work starts where it used to finish.",
    description:
      "Most teams start AI adoption by trying to replace what they already do. Wrong move.\n\nDiverge is exploration — options at a speed and scale the team has never had. No judgement, no polish, no 'is this on-brand' yet. Range first. Taste comes next.",
    outcome:
      "Volume gets cheap. The work starts where it used to finish — and the hours that used to go into the first ten versions go into the margin instead.",
    whatLabel: "What Your Team Learns",
    what: [
      "Prompting as creative direction — the CLEAR framework and the Prompt Skeleton. Works for a headline, a strategy route or a visual, not just a moodboard.",
      "Volume across disciplines — 50 concepts, 50 headlines, 50 directions, in the time it took to make three.",
      "Tool selection by discipline — the right surface for thinking, for writing, for imagery.",
      "The Stop Rule — knowing when you've explored enough.",
    ],
  },
  {
    n: "02",
    name: "Converge",
    track: "Make",
    icon: "converge" as const,
    image: "/images/training/speaking-wide-2.png",
    imageAlt: "Live training session — convergence phase, taste applied to AI output",
    bg: "cobalt" as const,
    hook: "AI work clears the bar. Cost drops; quality doesn't.",
    description:
      "This is where most AI training falls apart. Teams learn to generate but never learn to choose.\n\nConverge is the discipline of human taste, brand standards and craft applied to AI output. It's the difference between 'we used AI' and 'we made something great, faster.'",
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
    icon: "systemize" as const,
    image: "/images/training/speaking-wide-3.png",
    imageAlt: "Live training session — Build phase, workflows the team owns",
    bg: "cream" as const,
    hook: "The team doesn't need us anymore. That's the point.",
    description:
      "The team that depends on a trainer isn't trained.\n\nBuild is where individual skill becomes a way the whole team works. The team stops running our workflows and starts writing its own — workflows that turn a one-off saving into a permanent one.",
    outcome:
      "The team doesn't need us anymore. They're building their own margin — workflows that run without a trainer in the room. That's the point. And it's where Ongoing begins.",
    whatLabel: "What Your Team Builds — not learns, builds",
    what: [
      "Claude Code workflows, stripped of the engineer framing — reads any file, writes any file, runs any task. Bulk operations, document transformation, repetitive prep, gone.",
      "Cowork workflows for the operational grind — file ops at scale, exports, handoffs, the sludge that eats a creative day.",
      "Agentic workflows the team builds itself — a brief agent, an asset agent, a review agent. Narrow, sharp, theirs to keep.",
      "The systems instinct — the reflex to spot a repeating task and build the way out, instead of doing it by hand again.",
    ],
  },
];

// ─── COMPARISON TABLE ───────────────────────────────────────────────────────
// Two new rows added: the margin row (the through-line of the whole rewrite)
// and the width row (capability, not creative-only). Plus the framing row
// adjusted to lead with the capability arc, not just creative output.

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

export default function MethodologyPage() {
  return (
    <>
      {/* ═══ HERO — Cobalt 60vh ═══ */}
      <section className="relative min-h-[60vh] bg-[#1338BE] text-white overflow-hidden flex items-end">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img src="/images/training/speaking-wide-3.png" alt="" className="h-full w-full object-cover opacity-[0.1] mix-blend-lighten" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1338BE] via-[#1338BE]/50 to-transparent" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-16 lg:pb-24 w-full">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/50 mb-6">
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
                className="inline-flex items-center justify-center h-14 px-10 bg-white text-[#1338BE] text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors"
              >
                Book a Discovery Call
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ INTRO — A methodology, not a tool list ═══ */}
      <section className="pb-8 pt-20 lg:pt-28 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
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

      {/* ═══ FLOW DIAGRAM ═══ */}
      <section className="pb-16 lg:pb-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal delay={150}>
            <svg viewBox="0 0 960 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full hidden sm:block" aria-hidden="true">
              {/* Phase 1: Diverge — explosion */}
              <g>
                <circle cx="160" cy="100" r="60" fill="#1338BE" opacity="0.04" />
                <circle cx="160" cy="100" r="40" fill="#1338BE" opacity="0.06" />
                <circle cx="160" cy="100" r="8" fill="#1338BE" opacity="0.3" />
                <line x1="168" y1="92" x2="220" y2="50" stroke="#1338BE" strokeWidth="1" opacity="0.2" />
                <line x1="168" y1="96" x2="225" y2="75" stroke="#1338BE" strokeWidth="1" opacity="0.25" />
                <line x1="168" y1="100" x2="230" y2="100" stroke="#1338BE" strokeWidth="1" opacity="0.3" />
                <line x1="168" y1="104" x2="225" y2="125" stroke="#1338BE" strokeWidth="1" opacity="0.25" />
                <line x1="168" y1="108" x2="220" y2="150" stroke="#1338BE" strokeWidth="1" opacity="0.2" />
                <circle cx="220" cy="50" r="3" fill="#1338BE" opacity="0.15" />
                <circle cx="225" cy="75" r="3" fill="#1338BE" opacity="0.2" />
                <circle cx="230" cy="100" r="3" fill="#1338BE" opacity="0.25" />
                <circle cx="225" cy="125" r="3" fill="#1338BE" opacity="0.2" />
                <circle cx="220" cy="150" r="3" fill="#1338BE" opacity="0.15" />
                <text x="160" y="185" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1338BE" opacity="0.4" letterSpacing="0.15em">DIVERGE</text>
              </g>

              {/* Arrow 1→2 */}
              <line x1="280" y1="100" x2="370" y2="100" stroke="#1338BE" strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
              <polygon points="370,96 380,100 370,104" fill="#1338BE" opacity="0.2" />

              {/* Phase 2: Converge — funnel */}
              <g>
                <rect x="420" y="50" width="120" height="100" rx="2" fill="#1338BE" opacity="0.03" />
                <line x1="420" y1="55" x2="480" y2="85" stroke="#1338BE" strokeWidth="1" opacity="0.15" />
                <line x1="420" y1="75" x2="480" y2="90" stroke="#1338BE" strokeWidth="1" opacity="0.2" />
                <line x1="420" y1="100" x2="480" y2="100" stroke="#1338BE" strokeWidth="1.5" opacity="0.3" />
                <line x1="420" y1="125" x2="480" y2="110" stroke="#1338BE" strokeWidth="1" opacity="0.2" />
                <line x1="420" y1="145" x2="480" y2="115" stroke="#1338BE" strokeWidth="1" opacity="0.15" />
                <line x1="480" y1="100" x2="540" y2="100" stroke="#1338BE" strokeWidth="2" opacity="0.35" />
                <circle cx="480" cy="100" r="6" fill="#1338BE" opacity="0.25" />
                <circle cx="540" cy="100" r="4" fill="#1338BE" opacity="0.35" />
                <text x="480" y="185" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1338BE" opacity="0.4" letterSpacing="0.15em">CONVERGE</text>
              </g>

              {/* Arrow 2→3 */}
              <line x1="590" y1="100" x2="680" y2="100" stroke="#1338BE" strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
              <polygon points="680,96 690,100 680,104" fill="#1338BE" opacity="0.2" />

              {/* Phase 3: Build — structured grid (renamed from Systemize) */}
              <g>
                <rect x="720" y="60" width="80" height="80" rx="2" fill="none" stroke="#1338BE" strokeWidth="1.5" opacity="0.2" />
                <line x1="720" y1="86" x2="800" y2="86" stroke="#1338BE" strokeWidth="0.5" opacity="0.15" />
                <line x1="720" y1="114" x2="800" y2="114" stroke="#1338BE" strokeWidth="0.5" opacity="0.15" />
                <line x1="747" y1="60" x2="747" y2="140" stroke="#1338BE" strokeWidth="0.5" opacity="0.15" />
                <line x1="773" y1="60" x2="773" y2="140" stroke="#1338BE" strokeWidth="0.5" opacity="0.15" />
                <rect x="721" y="61" width="26" height="25" fill="#1338BE" opacity="0.08" />
                <rect x="748" y="87" width="25" height="27" fill="#1338BE" opacity="0.12" />
                <rect x="774" y="115" width="25" height="24" fill="#1338BE" opacity="0.16" />
                <rect x="721" y="87" width="26" height="27" fill="#1338BE" opacity="0.06" />
                <rect x="774" y="61" width="25" height="25" fill="#1338BE" opacity="0.1" />
                <path d="M810 100 Q 830 100 830 80 Q 830 50 800 50" stroke="#1338BE" strokeWidth="1" opacity="0.2" fill="none" />
                <polygon points="802,47 798,53 794,47" fill="#1338BE" opacity="0.2" />
                <text x="760" y="185" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1338BE" opacity="0.4" letterSpacing="0.15em">BUILD</text>
              </g>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* ═══ PHASE BLOCKS — Foundations / Diverge / Converge / Build ═══ */}
      {phases.map((phase, i) => {
        const isCobalt = phase.bg === "cobalt";
        return (
          <section
            key={phase.n}
            className={
              isCobalt
                ? "py-24 lg:py-36 bg-[#1338BE] text-white relative overflow-hidden"
                : "py-24 lg:py-36 relative oci-grid-lines"
            }
          >
            {isCobalt && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
                  <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
                  <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
                </div>
              </div>
            )}

            <div className={(isCobalt ? "relative z-10 " : "") + "mx-auto max-w-7xl px-6 lg:px-8"}>
              <Reveal>
                <div
                  className={
                    isCobalt
                      ? "flex items-center justify-between border-b border-white/20 pb-3 mb-0 text-[11px] uppercase tracking-[0.15em] text-white/50"
                      : "oci-section-label"
                  }
                >
                  <span>Phase {phase.n} · {phase.track}</span>
                  <span>{phase.name}</span>
                </div>
              </Reveal>

              {/* Lead image — cream blocks only; cobalt block keeps its existing rhythm */}
              {!isCobalt && (
                <Reveal delay={50}>
                  <div className="mt-12 relative aspect-[21/9] overflow-hidden bg-[#1338BE]">
                    <img
                      src={phase.image}
                      alt={phase.imageAlt}
                      className="h-full w-full object-cover grayscale mix-blend-multiply opacity-60"
                    />
                  </div>
                </Reveal>
              )}

              <div className="mt-12 grid gap-16 lg:grid-cols-2">
                <div>
                  <Reveal delay={100}>
                    <div className="flex items-center gap-4 mb-6">
                      <ServiceIcon
                        icon={phase.icon}
                        size={36}
                        className={isCobalt ? "opacity-50 [&>svg]:stroke-white" : "opacity-50"}
                      />
                      <p
                        className={
                          "text-[11px] uppercase tracking-[0.15em] " +
                          (isCobalt ? "text-white/50" : "text-muted-foreground")
                        }
                      >
                        {phase.hook}
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={150}>
                    <h3 className={"oci-display-sm" + (isCobalt ? " text-white" : "")}>
                      {phase.name}.
                    </h3>
                  </Reveal>
                  <Reveal delay={200}>
                    <p
                      className={
                        "mt-6 text-sm leading-relaxed whitespace-pre-line " +
                        (isCobalt ? "text-white/60" : "text-muted-foreground")
                      }
                    >
                      {phase.description}
                    </p>
                  </Reveal>
                  <Reveal delay={250}>
                    <div
                      className={
                        "mt-8 p-6 " +
                        (isCobalt ? "border border-white/20" : "border border-[#1338BE]/20")
                      }
                    >
                      <p
                        className={
                          "text-[11px] uppercase tracking-[0.15em] mb-2 " +
                          (isCobalt ? "text-white/50" : "text-[#1338BE]")
                        }
                      >
                        The Outcome
                      </p>
                      <p className={"text-sm leading-relaxed" + (isCobalt ? " text-white" : "")}>
                        {phase.outcome}
                      </p>
                    </div>
                  </Reveal>
                </div>

                <Reveal delay={200} direction="right">
                  <div
                    className={
                      "p-8 " +
                      (isCobalt
                        ? "border border-white/20 bg-white/[0.05]"
                        : "border border-[#1338BE]/20 bg-[#1338BE]/[0.02]")
                    }
                  >
                    <p
                      className={
                        "text-[11px] uppercase tracking-[0.15em] mb-6 " +
                        (isCobalt ? "text-white/50" : "text-muted-foreground")
                      }
                    >
                      {phase.whatLabel}
                    </p>
                    <ul className="space-y-5">
                      {phase.what.map((item) => (
                        <li
                          key={item}
                          className={
                            "flex gap-4 text-sm leading-relaxed " +
                            (isCobalt ? "text-white/60" : "text-muted-foreground")
                          }
                        >
                          <span
                            className={
                              "mt-1.5 h-1.5 w-1.5 shrink-0 " +
                              (isCobalt ? "bg-white/40" : "bg-[#1338BE]/40")
                            }
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* ═══ IMPACT BAND — HELD until verified ═══
        TODO: Re-enable when Jeremy confirms each figure + client clearance.
        Reframe labels toward margin once real numbers land. Suggested:
          [CONFIRM] — production cost cut on a single campaign
          [CONFIRM] — output from the same budget, no added headcount
          [CONFIRM] — saved on a single product launch
        Source markup preserved below as a comment for fast restoration.

        <section className="py-20 lg:py-28 relative oci-grid-lines">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <div className="oci-section-label">
                <span>Impact</span>
                <span>[NC.1]</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
                {[
                  { n: "[TBC]", label: "Production cost cut on a single campaign" },
                  { n: "[TBC]", label: "Output from the same budget, no added headcount" },
                  { n: "[TBC]", label: "Saved on a single product launch" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-4xl lg:text-5xl font-medium tracking-tight text-[#1338BE]">
                      {stat.n}
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ═══ */}

      {/* ═══ COMPARISON TABLE — "Techniques over tools." framing ═══ */}
      <section className="py-24 lg:py-36 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Why This Works</span>
              <span>[NC.3]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mt-8 mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] text-foreground leading-[1.1] tracking-tight font-normal max-w-2xl">
                Techniques over <em className="font-serif italic text-[#1338BE]">tools.</em>
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
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Typical AI Training
              </p>
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
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

    </>
  );
}
