import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The NotContent Method | Diverge. Converge. Systemize.",
  description:
    "The methodology behind 96% time savings and 400% output increases. Learn how enterprise creative teams integrate AI without losing craft quality.",
};

const phases = [
  {
    n: "01",
    name: "Diverge",
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
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            The NotContent Method
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-4xl">
            Diverge. Converge. Systemize.
          </h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            Three phases. One principle: AI is a creative force multiplier, not
            a replacement engine. Separate exploration from execution so speed
            never compromises taste.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button
              asChild
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book a Call</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              See how this applies to your team
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "96%", label: "Average time savings across trained teams" },
              { n: "400%", label: "Output increase without adding headcount" },
              { n: "$280K", label: "Saved on a single product launch" },
            ].map((stat) => (
              <div key={stat.n} className="border-l-2 border-foreground pl-6">
                <p className="text-3xl font-light tracking-tight text-[#1549CD]">
                  {stat.n}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Phases */}
      {phases.map((phase) => (
        <section
          key={phase.n}
          className={`nc-divider nc-section ${
            phase.n === "02" ? "bg-foreground text-background" : ""
          }`}
        >
          <div className="nc-container">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p
                  className={`text-xs uppercase tracking-widest ${
                    phase.n === "02"
                      ? "text-background/60"
                      : "text-muted-foreground"
                  }`}
                >
                  Phase {phase.n}
                </p>
                <h2 className="nc-heading-lg mt-4">{phase.name}.</h2>
                <p
                  className={`mt-2 text-lg font-light ${
                    phase.n === "02" ? "text-background/80" : "text-muted-foreground"
                  }`}
                >
                  {phase.hook}
                </p>
                <p
                  className={`nc-body mt-6 ${
                    phase.n === "02" ? "text-background/70" : ""
                  }`}
                >
                  {phase.description}
                </p>
                <div
                  className={`mt-6 border p-6 ${
                    phase.n === "02"
                      ? "border-background/20"
                      : "border-foreground/10"
                  }`}
                >
                  <p
                    className={`text-xs uppercase tracking-widest ${
                      phase.n === "02"
                        ? "text-background/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    The Outcome
                  </p>
                  <p
                    className={`mt-2 text-sm font-medium leading-relaxed ${
                      phase.n === "02" ? "text-background" : ""
                    }`}
                  >
                    {phase.outcome}
                  </p>
                </div>
              </div>
              <div>
                <p
                  className={`text-xs uppercase tracking-widest ${
                    phase.n === "02"
                      ? "text-background/60"
                      : "text-muted-foreground"
                  }`}
                >
                  What Your Team Learns
                </p>
                <ul className="mt-6 space-y-4">
                  {phase.what.map((item) => (
                    <li
                      key={item}
                      className={`flex gap-4 text-sm leading-relaxed ${
                        phase.n === "02" ? "text-background/70" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 ${
                          phase.n === "02" ? "bg-background/40" : "bg-foreground/40"
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* What makes this different */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Why This Works
          </p>
          <h2 className="nc-heading-lg mt-4 max-w-2xl">
            Not another AI workshop.
          </h2>
          <p className="nc-body mt-6 max-w-xl">
            Most AI training teaches tools. Tools change every six months. The
            NotContent Method teaches a way of working that survives regardless
            of which platforms ship or die.
          </p>

          <div className="mt-12 space-y-0">
            <div className="grid grid-cols-2 border-b border-foreground/10 pb-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Typical AI Training
              </p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The NotContent Method
              </p>
            </div>
            {differences.map((diff) => (
              <div
                key={diff.ours}
                className="grid grid-cols-2 border-b border-foreground/5 py-4"
              >
                <p className="pr-8 text-sm text-muted-foreground line-through decoration-foreground/20">
                  {diff.theirs}
                </p>
                <p className="text-sm">{diff.ours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-background/60">
            Trusted By
          </p>
          <h2 className="nc-heading-lg mt-4">
            The teams already using this method.
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {["Nike", "Apple", "Cash App", "Maesa", "Adidas", "Google"].map(
              (brand) => (
                <div
                  key={brand}
                  className="flex items-center justify-center border border-background/10 py-6"
                >
                  <p className="text-sm font-medium uppercase tracking-widest text-background/60">
                    {brand}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nc-divider nc-section">
        <div className="nc-container text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Start Here
          </p>
          <h2 className="nc-heading-lg mx-auto mt-4 max-w-2xl">
            See how this applies to your team.
          </h2>
          <p className="nc-body mx-auto mt-6 max-w-lg">
            Take the 2-minute Scorecard to find out where your team stands — or
            skip straight to a conversation.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/assess">Take the Scorecard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
