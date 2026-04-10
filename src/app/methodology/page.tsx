import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { ServiceIcon } from "@/components/service-icon";

export const metadata: Metadata = {
  title: "The NotContent Method | Diverge. Converge. Systemize.",
  description:
    "The methodology behind 96% time savings and 400% output increases. Learn how enterprise creative teams integrate AI without losing craft quality.",
};

const phases = [
  {
    n: "01",
    name: "Diverge",
    icon: "diverge" as const,
    hook: "Generate volume. Break habits. See what's possible.",
    description:
      "Most teams start AI adoption by trying to replace existing workflows. Wrong move. Diverge is about exploration — using AI to generate options at a speed and scale your team has never experienced. Midjourney for style discovery. ChatGPT for concept iteration. Runway for motion exploration. No judgment, no polish, no 'is this on-brand?' yet.",
    outcome: "Your team discovers that AI isn't replacing them — it's removing the bottlenecks that slow them down.",
    what: [
      "Prompt engineering for creative exploration",
      "Tool selection based on your team's actual discipline",
      "Combinatorial batching — generating 50 options in the time it took to make 3",
      "The Stop Rule: knowing when you've explored enough",
    ],
  },
  {
    n: "02",
    name: "Converge",
    icon: "converge" as const,
    hook: "Filter through craft. Ship what's actually good.",
    description:
      "This is where most AI training falls apart. Teams learn to generate but never learn to select. Converge is the discipline of applying human taste, brand standards, and craft expertise to AI output. It's the difference between 'we used AI' and 'we made something great, faster.'",
    outcome: "AI-generated work becomes portfolio-worthy. Your team directs AI like a junior creative — fast iteration, human curation.",
    what: [
      "Quality frameworks for evaluating AI output",
      "Brand alignment checks that actually work",
      "Precision refinement — switching from exploration tools to production tools",
      "The 80/20 split: what AI finishes vs. what humans finish",
    ],
  },
  {
    n: "03",
    name: "Systemize",
    icon: "systemize" as const,
    hook: "Build workflows that run without you.",
    description:
      "The team that depends on a trainer isn't trained. Systemize is where individual skill becomes organizational capability. Document what works. Build templates. Create processes that any team member can run on day one. This is where training becomes transformation.",
    outcome: "The team doesn't need Jeremy anymore. That's the point.",
    what: [
      "Workflow documentation that people actually follow",
      "Prompt libraries tuned to your brand voice and visual identity",
      "Quality gates — when to use AI, when to do it by hand",
      "Onboarding templates so new hires get up to speed in days, not months",
    ],
  },
];

const differences = [
  {
    theirs: "Generic AI overview for any industry",
    ours: "Built specifically for creative teams — design, copy, motion, production",
  },
  {
    theirs: "One-day workshop, then you're on your own",
    ours: "Structured programs from half-day to 8 weeks with ongoing support",
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
];

export default function MethodologyPage() {
  return (
    <>
      {/* ═══ HERO — Cobalt 60vh ═══ */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
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
              Diverge.
              <br />
              Converge.
              <br />
              Systemize.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
              <p className="max-w-md text-lg text-white/70 leading-relaxed">
                Three phases. One principle: AI is a creative force multiplier,
                not a replacement engine.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center justify-center h-14 px-10 bg-white text-[#1549CD] text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors"
              >
                Book a Call
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
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
                { n: "96%", label: "Average time savings across trained teams" },
                { n: "400%", label: "Output increase without adding headcount" },
                { n: "$280K", label: "Saved on a single product launch" },
              ].map((stat) => (
                <div key={stat.n}>
                  <p className="text-4xl lg:text-5xl font-medium tracking-tight text-[#1549CD]">
                    <AnimatedCounter value={stat.n} />
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

      {/* ═══ THREE PHASES INTRO ═══ */}
      <section className="pb-8 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>The Method</span>
              <span>[NC.2]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mt-8">
              <h2 className="oci-display-sm">
                A methodology,
                <br />
                not a tool list.
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground leading-relaxed lg:text-right">
                Separate exploration from execution so speed never compromises
                taste.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FLOW DIAGRAM ═══ */}
      <section className="pb-16 lg:pb-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal delay={150}>
            <svg viewBox="0 0 960 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" aria-hidden="true">
              {/* Phase 1: Diverge — explosion */}
              <g>
                <circle cx="160" cy="100" r="60" fill="#1549CD" opacity="0.04" />
                <circle cx="160" cy="100" r="40" fill="#1549CD" opacity="0.06" />
                <circle cx="160" cy="100" r="8" fill="#1549CD" opacity="0.3" />
                {/* Diverging lines */}
                <line x1="168" y1="92" x2="220" y2="50" stroke="#1549CD" strokeWidth="1" opacity="0.2" />
                <line x1="168" y1="96" x2="225" y2="75" stroke="#1549CD" strokeWidth="1" opacity="0.25" />
                <line x1="168" y1="100" x2="230" y2="100" stroke="#1549CD" strokeWidth="1" opacity="0.3" />
                <line x1="168" y1="104" x2="225" y2="125" stroke="#1549CD" strokeWidth="1" opacity="0.25" />
                <line x1="168" y1="108" x2="220" y2="150" stroke="#1549CD" strokeWidth="1" opacity="0.2" />
                <circle cx="220" cy="50" r="3" fill="#1549CD" opacity="0.15" />
                <circle cx="225" cy="75" r="3" fill="#1549CD" opacity="0.2" />
                <circle cx="230" cy="100" r="3" fill="#1549CD" opacity="0.25" />
                <circle cx="225" cy="125" r="3" fill="#1549CD" opacity="0.2" />
                <circle cx="220" cy="150" r="3" fill="#1549CD" opacity="0.15" />
                <text x="160" y="185" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1549CD" opacity="0.4" letterSpacing="0.15em">DIVERGE</text>
              </g>

              {/* Arrow 1→2 */}
              <line x1="280" y1="100" x2="370" y2="100" stroke="#1549CD" strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
              <polygon points="370,96 380,100 370,104" fill="#1549CD" opacity="0.2" />

              {/* Phase 2: Converge — funnel */}
              <g>
                <rect x="420" y="50" width="120" height="100" rx="2" fill="#1549CD" opacity="0.03" />
                {/* Converging lines */}
                <line x1="420" y1="55" x2="480" y2="85" stroke="#1549CD" strokeWidth="1" opacity="0.15" />
                <line x1="420" y1="75" x2="480" y2="90" stroke="#1549CD" strokeWidth="1" opacity="0.2" />
                <line x1="420" y1="100" x2="480" y2="100" stroke="#1549CD" strokeWidth="1.5" opacity="0.3" />
                <line x1="420" y1="125" x2="480" y2="110" stroke="#1549CD" strokeWidth="1" opacity="0.2" />
                <line x1="420" y1="145" x2="480" y2="115" stroke="#1549CD" strokeWidth="1" opacity="0.15" />
                {/* Output arrow */}
                <line x1="480" y1="100" x2="540" y2="100" stroke="#1549CD" strokeWidth="2" opacity="0.35" />
                <circle cx="480" cy="100" r="6" fill="#1549CD" opacity="0.25" />
                <circle cx="540" cy="100" r="4" fill="#1549CD" opacity="0.35" />
                <text x="480" y="185" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1549CD" opacity="0.4" letterSpacing="0.15em">CONVERGE</text>
              </g>

              {/* Arrow 2→3 */}
              <line x1="590" y1="100" x2="680" y2="100" stroke="#1549CD" strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
              <polygon points="680,96 690,100 680,104" fill="#1549CD" opacity="0.2" />

              {/* Phase 3: Systemize — structured grid */}
              <g>
                <rect x="720" y="60" width="80" height="80" rx="2" fill="none" stroke="#1549CD" strokeWidth="1.5" opacity="0.2" />
                {/* Internal grid lines */}
                <line x1="720" y1="86" x2="800" y2="86" stroke="#1549CD" strokeWidth="0.5" opacity="0.15" />
                <line x1="720" y1="114" x2="800" y2="114" stroke="#1549CD" strokeWidth="0.5" opacity="0.15" />
                <line x1="747" y1="60" x2="747" y2="140" stroke="#1549CD" strokeWidth="0.5" opacity="0.15" />
                <line x1="773" y1="60" x2="773" y2="140" stroke="#1549CD" strokeWidth="0.5" opacity="0.15" />
                {/* Filled cells showing system */}
                <rect x="721" y="61" width="26" height="25" fill="#1549CD" opacity="0.08" />
                <rect x="748" y="87" width="25" height="27" fill="#1549CD" opacity="0.12" />
                <rect x="774" y="115" width="25" height="24" fill="#1549CD" opacity="0.16" />
                <rect x="721" y="87" width="26" height="27" fill="#1549CD" opacity="0.06" />
                <rect x="774" y="61" width="25" height="25" fill="#1549CD" opacity="0.1" />
                {/* Repeat arrow */}
                <path d="M810 100 Q 830 100 830 80 Q 830 50 800 50" stroke="#1549CD" strokeWidth="1" opacity="0.2" fill="none" />
                <polygon points="802,47 798,53 794,47" fill="#1549CD" opacity="0.2" />
                <text x="760" y="185" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1549CD" opacity="0.4" letterSpacing="0.15em">SYSTEMIZE</text>
              </g>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* ═══ PHASE 01 — DIVERGE (cream bg) ═══ */}
      <section className="py-24 lg:py-36 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Phase 01</span>
              <span>Diverge</span>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-16 lg:grid-cols-2">
            <div>
              <Reveal delay={100}>
                <div className="flex items-center gap-4 mb-6">
                  <ServiceIcon icon={phases[0].icon} size={36} className="opacity-50" />
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {phases[0].hook}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <h3 className="oci-display-sm">{phases[0].name}.</h3>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  {phases[0].description}
                </p>
              </Reveal>
              <Reveal delay={250}>
                <div className="mt-8 border border-[#1549CD]/20 p-6">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD] mb-2">
                    The Outcome
                  </p>
                  <p className="text-sm leading-relaxed">
                    {phases[0].outcome}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} direction="right">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
                  What Your Team Learns
                </p>
                <ul className="space-y-5">
                  {phases[0].what.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#1549CD]/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ PHASE 02 — CONVERGE (cobalt bg) ═══ */}
      <section className="py-24 lg:py-36 bg-[#1549CD] text-white relative overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-0 text-[11px] uppercase tracking-[0.15em] text-white/50">
              <span>Phase 02</span>
              <span>Converge</span>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-16 lg:grid-cols-2">
            <div>
              <Reveal delay={100}>
                <div className="flex items-center gap-4 mb-6">
                  <ServiceIcon icon={phases[1].icon} size={36} className="opacity-50 [&>svg]:stroke-white" />
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/50">
                    {phases[1].hook}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <h3 className="oci-display-sm text-white">{phases[1].name}.</h3>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-sm text-white/60 leading-relaxed">
                  {phases[1].description}
                </p>
              </Reveal>
              <Reveal delay={250}>
                <div className="mt-8 border border-white/20 p-6">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/50 mb-2">
                    The Outcome
                  </p>
                  <p className="text-sm text-white leading-relaxed">
                    {phases[1].outcome}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} direction="right">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-white/50 mb-6">
                  What Your Team Learns
                </p>
                <ul className="space-y-5">
                  {phases[1].what.map((item) => (
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

      {/* ═══ PHASE 03 — SYSTEMIZE (cream bg) ═══ */}
      <section className="py-24 lg:py-36 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Phase 03</span>
              <span>Systemize</span>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-16 lg:grid-cols-2">
            <div>
              <Reveal delay={100}>
                <div className="flex items-center gap-4 mb-6">
                  <ServiceIcon icon={phases[2].icon} size={36} className="opacity-50" />
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {phases[2].hook}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <h3 className="oci-display-sm">{phases[2].name}.</h3>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  {phases[2].description}
                </p>
              </Reveal>
              <Reveal delay={250}>
                <div className="mt-8 border border-[#1549CD]/20 p-6">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD] mb-2">
                    The Outcome
                  </p>
                  <p className="text-sm leading-relaxed">
                    {phases[2].outcome}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} direction="right">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
                  What Your Team Learns
                </p>
                <ul className="space-y-5">
                  {phases[2].what.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#1549CD]/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="py-24 lg:py-36 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Why This Works</span>
              <span>[NC.3]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mt-8 mb-16">
              <h2 className="oci-display-sm">
                Not another
                <br />
                AI workshop.
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground leading-relaxed lg:text-right">
                Most AI training teaches tools. Tools change every six months.
                The NotContent Method teaches a way of working that survives
                regardless of which platforms ship or die.
              </p>
            </div>
          </Reveal>

          {/* Table header */}
          <Reveal delay={150}>
            <div className="grid grid-cols-2 border-b border-[#1549CD]/20 pb-3">
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
              <div className="grid grid-cols-2 border-b border-[#1549CD]/10 py-5">
                <p className="pr-8 text-sm text-muted-foreground line-through decoration-foreground/20">
                  {diff.theirs}
                </p>
                <p className="text-sm font-medium">{diff.ours}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CLIENTS ═══ */}
      <section className="py-24 lg:py-36 bg-[#1549CD] text-white relative overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-0 text-[11px] uppercase tracking-[0.15em] text-white/50">
              <span>Trusted By</span>
              <span>[NC.4]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="oci-display-sm text-white mt-8">
              The teams already using this method.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Nike", "Apple", "Cash App", "Maesa", "Adidas", "Google"].map(
              (brand, i) => (
                <Reveal key={brand} delay={150 + i * 60}>
                  <div className="flex items-center justify-center border border-white/15 py-8 transition-colors hover:border-white/30 hover:bg-white/5">
                    <p className="text-sm font-medium uppercase tracking-[0.15em] text-white/60">
                      {brand}
                    </p>
                  </div>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══ CTA BAND ═══ */}
      <section className="py-24 lg:py-36 bg-[#1549CD] text-white relative overflow-hidden border-t border-white/10">
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="oci-display-sm text-white mx-auto max-w-3xl">
              See how this applies
              <br />
              to your team.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
              Take the 2-minute Scorecard to find out where your team stands
              &mdash; or skip straight to a conversation.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assess"
                className="inline-flex items-center justify-center h-14 px-10 bg-white text-[#1549CD] text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors"
              >
                Take the Scorecard
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center h-14 px-10 border border-white/30 text-white text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/10 transition-colors"
              >
                Book a Call
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
