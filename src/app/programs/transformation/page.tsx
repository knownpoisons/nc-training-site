import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI Creative Transformation | 8-Week Program",
  description:
    "Our flagship 8-week program. Full operational AI transformation for creative teams. Custom workflows, governance, and ongoing support.",
};

const curriculum = [
  {
    week: "01-02",
    title: "Audit & Foundation",
    items: [
      "AI Creative Audit of current workflows and bottlenecks",
      "Tool ecosystem setup (Midjourney, production tools, systemization layer)",
      "Team skill baseline assessment",
      "NotContent Methodology deep-dive: Diverge/Converge/Systemize",
    ],
  },
  {
    week: "03-04",
    title: "Divergence Mastery",
    items: [
      "Midjourney advanced techniques: style refs, image refs, combinatorial batching",
      "AI as a visual sparring partner for concepting",
      "Prompt engineering for brand-specific output",
      "The Stop Rule: knowing when to shift from exploration to execution",
    ],
  },
  {
    week: "05-06",
    title: "Convergence & Production",
    items: [
      "Production-grade tools for precision execution",
      "Brand asset integration into AI scenes",
      "Video transformation and extension workflows",
      "Quality control: maintaining brand standards at AI speed",
    ],
  },
  {
    week: "07-08",
    title: "Systemization & Governance",
    items: [
      "Building repeatable workflows for your specific operations",
      "AI governance policy development (approved tools, data protocols, disclosure)",
      "Proprietary prompt playbooks for your brand/category",
      "Before/After production benchmark report",
    ],
  },
];

const included = [
  "2-day in-person intensive kickoff",
  "Weekly 2-hour live sessions with Jeremy Somers",
  "Role-specific tracks (Creative Directors, Designers, Strategists, Production)",
  "Bi-weekly 1-on-1 coaching sessions",
  "Custom workflow buildout for your operations",
  "AI Governance Policy document (custom to your org)",
  "Proprietary prompt playbooks for your brand",
  "Slack channel for async Q&A throughout the program",
  "Before/After production benchmark report",
  "Certificate of completion",
];

const ongoing = [
  "Monthly maintenance call (new tech, models, workflows, troubleshooting)",
  "Slack access for real-time questions",
  "Tool update briefings as the landscape evolves",
  "Priority access to new training modules",
];

export default function TransformationPage() {
  return (
    <>
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Flagship Program / 8 Weeks
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-4xl">
            AI Creative Transformation.
          </h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            You&apos;ve seen what AI does for one person. This is what it does
            for a whole operation. Eight weeks. Custom workflows. Role-specific
            training. Governance policy. Ongoing support. Your team runs
            AI-assisted production independently when it&apos;s done.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Comparing programs?{" "}
            <Link
              href="/assess"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70"
            >
              Take the 2-min Scorecard →
            </Link>
          </p>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Problem
              </p>
              <h2 className="nc-heading-lg mt-4">
                You&apos;ve done some training. Nothing changed.
              </h2>
              <p className="nc-body mt-6">
                A few people attended a workshop. Someone got good at prompting.
                By Monday they were back to their old workflows. Output looks the
                same. Leadership isn&apos;t convinced. The operation hasn&apos;t
                moved. That&apos;s not a skills problem — it&apos;s an
                implementation problem.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Solution
              </p>
              <h2 className="nc-heading-lg mt-4">
                Implementation, not just instruction.
              </h2>
              <p className="nc-body mt-6">
                Over 8 weeks, we don&apos;t teach tools and leave. We build the
                operating model: custom workflows for your specific production
                setup, role-specific tracks for every function, a governance
                policy your team actually uses, and the ongoing support to keep
                it compounding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-background/60">
            Curriculum
          </p>
          <h2 className="nc-heading-lg mt-4">8 weeks. 4 phases.</h2>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {curriculum.map((phase) => (
              <div key={phase.week} className="border border-background/20 p-8">
                <p className="text-xs uppercase tracking-widest text-background/60">
                  Weeks {phase.week}
                </p>
                <h3 className="nc-heading-md mt-4">{phase.title}</h3>
                <ul className="mt-6 space-y-3">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-background/60"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-background/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="nc-heading-md max-w-xl">
                Sounds like the right fit?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Book a free 30-minute assessment. No pitch — just a clear recommendation for your team.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                What&apos;s Included
              </p>
              <h2 className="nc-heading-lg mt-4">
                Eight deliverables your team owns when it&apos;s done.
              </h2>
              <p className="nc-body mt-6 text-muted-foreground">
                Not slides from a seminar. Not recordings to watch later.
                Actual assets: the workflows, the policy, the playbooks, the
                prompt library — built around your brand and your production
                setup, so it works after we&apos;re gone.
              </p>
              <ul className="mt-8 space-y-4">
                {included.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Ongoing Support
              </p>
              <h2 className="nc-heading-lg mt-4">
                We don&apos;t disappear after week 8.
              </h2>
              <p className="nc-body mt-6">
                AI moves fast. Your team needs someone keeping them current.
                Every program includes ongoing monthly maintenance to ensure
                what you built keeps compounding.
              </p>
              <ul className="mt-8 space-y-4">
                {ongoing.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-background/60">
                Investment
              </p>
              <h2 className="nc-heading-lg mt-4">
                Custom-scoped. ROI-anchored.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-background/60">
                Every team gets a custom proposal based on size, AI maturity,
                and production goals. There&apos;s no generic tier — just a
                specific program scoped to what you actually need.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-background/60">
                Reference point: Maesa saved $280,000 on a single brand launch
                after the Transformation. Cash App went 10x on campaign
                velocity. The program pays for itself on the first project it
                touches.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <div className="border border-background/20 p-8">
                <p className="text-xs uppercase tracking-widest text-background/60">
                  What the call covers
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex gap-3 text-sm text-background/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-background/40" />
                    Current team workflow and AI maturity audit
                  </li>
                  <li className="flex gap-3 text-sm text-background/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-background/40" />
                    Identification of highest-impact AI opportunities
                  </li>
                  <li className="flex gap-3 text-sm text-background/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-background/40" />
                    Custom program recommendation and timeline
                  </li>
                  <li className="flex gap-3 text-sm text-background/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-background/40" />
                    30 minutes. No pitch. Just clarity.
                  </li>
                </ul>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="mt-8 w-full cursor-pointer border-background/20 text-xs uppercase tracking-widest text-background hover:bg-background hover:text-foreground"
                >
                  <Link href="/book">Book Your Assessment</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Not the right fit */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Not the Right Fit If
              </p>
              <h2 className="nc-heading-lg mt-4">
                This program isn&apos;t for everyone.
              </h2>
              <p className="nc-body mt-6 text-muted-foreground">
                The Transformation works when leadership is committed, the team
                is willing, and there&apos;s genuine intent to change how the
                operation runs. If any of these describe your situation, the
                Foundations workshop is the better starting point.
              </p>
            </div>
            <div className="space-y-4 lg:pt-16">
              {[
                "Leadership hasn't fully bought in — there's no mandate for this",
                "You want a one-off event, not an operational change",
                "You're looking for the cheapest way to tick an AI training box",
                "Your team isn't ready to change how they work, just learn some tools",
              ].map((item) => (
                <div key={item} className="flex gap-4 border border-foreground/10 p-4">
                  <span className="mt-0.5 text-foreground/30 text-xs shrink-0">✕</span>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Who This Is For
          </p>
          <h2 className="nc-heading-lg mt-4 max-w-3xl">
            Built for creative teams that ship real work.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "In-House Creative Teams",
                description:
                  "Brand teams at companies that want to produce more without growing headcount.",
              },
              {
                title: "Creative Agencies",
                description:
                  "Agencies that need to deliver faster, expand capabilities, and stay competitive.",
              },
              {
                title: "Production Studios",
                description:
                  "Studios that want AI-augmented workflows for photo, video, and campaign production.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-medium uppercase tracking-widest">
                  {item.title}
                </h3>
                <p className="nc-body mt-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container text-center">
          <h2 className="nc-heading-lg mx-auto max-w-3xl">
            The teams that move first win.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-background/60">
            We take on a limited number of Transformation clients each quarter
            to ensure the program stays genuinely custom. If you&apos;re
            considering this for your team, the assessment is the right first
            step — it costs nothing, and you&apos;ll leave with a clear picture
            regardless of whether we work together.
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-10 cursor-pointer border-background/20 text-xs uppercase tracking-widest text-background hover:bg-background hover:text-foreground"
          >
            <Link href="/book">Book a Call</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
