import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI Creative Accelerator | 4-Week Sprint",
  description:
    "Four weeks. Your team ships real AI-assisted work by week two. Hands-on training with custom prompt libraries, Slack support, and a certification. From $15,000.",
};

const weeks = [
  {
    week: "01",
    title: "Audit & Setup",
    description:
      "We map your current workflow bottlenecks and tool gaps. Everyone gets set up identically — no more 'it works on my machine.' By the end of week one, your team starts from the same place for the first time.",
    deliverable: "AI workflow audit report + tool ecosystem configured",
  },
  {
    week: "02",
    title: "Divergence Mastery",
    description:
      "Your Creative Director gets 50 concept directions in a morning instead of 5 in a day. This is where the realisation hits. Midjourney as a visual sparring partner, not a vending machine — style refs, image refs, combinatorial batching. This is the session where people stop being sceptical.",
    deliverable: "Custom prompt library built around your brand",
  },
  {
    week: "03",
    title: "Convergence & Production",
    description:
      "Shift from exploration to execution. Production-grade precision tools. Brand asset integration into AI scenes. Video transformation and extension workflows. The point where your team stops experimenting and starts shipping.",
    deliverable: "Production workflow documented for at least 2 use cases",
  },
  {
    week: "04",
    title: "Systemize & Ship",
    description:
      "Lock in what works. Build repeatable processes your whole team runs. AI governance basics — approved tools, data protocols, client disclosure standards. The team leaves with a system, not just skills they might use.",
    deliverable: "Documented workflows + governance policy starter + certificate",
  },
];

const included = [
  "4x 2-hour live sessions with Jeremy Somers",
  "Dedicated Slack channel for async Q&A throughout",
  "Custom prompt library built around your brand's style and assets",
  "1x 1-on-1 strategy session with Jeremy",
  "Recorded sessions (watch back anytime)",
  "AI Governance Policy starter document",
  "Before/After workflow comparison",
  "NotContent AI Creative Accelerator Certificate",
];

export default function AcceleratorPage() {
  return (
    <>
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Program 02 / Growth
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-4xl">
            AI Creative Accelerator.
          </h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            For teams that have tried AI and know it&apos;s not sticking yet.
            Four weeks. One live session per week, plus async Slack support.
            Your whole team ships real AI-assisted work by week two — not at
            the end of a course, halfway through it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button
              asChild
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book a Training Assessment</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              From $15,000 · Up to 15 people · 4 weeks
            </p>
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

      {/* The gap this fills */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Problem
              </p>
              <h2 className="nc-heading-lg mt-4">
                Your team has tried AI. It&apos;s not sticking.
              </h2>
              <p className="nc-body mt-6">
                A few people experiment with Midjourney. Someone figures out
                ChatGPT for briefs. But it&apos;s fragmented — no shared
                methodology, no quality standard, no system. Output is
                inconsistent. Leadership isn&apos;t convinced. And you&apos;re
                the one explaining why the investment isn&apos;t showing yet.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Fix
              </p>
              <h2 className="nc-heading-lg mt-4">
                A shared system that survives Monday morning.
              </h2>
              <p className="nc-body mt-6">
                The Accelerator builds a common language, workflow, and quality
                bar across your whole team. By week two everyone&apos;s
                producing. By week four it&apos;s embedded in how they work —
                not an experiment they do after hours, their actual process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Week by week */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-background/60">
            Curriculum
          </p>
          <h2 className="nc-heading-lg mt-4">Four weeks. One deliverable each.</h2>

          <div className="mt-12 space-y-0">
            {weeks.map((week, i) => (
              <div
                key={week.week}
                className={`grid gap-8 py-10 lg:grid-cols-[80px_1fr_1fr] ${i < weeks.length - 1 ? "border-b border-background/10" : ""}`}
              >
                <div>
                  <p className="text-4xl font-light text-background/30">
                    {week.week}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-widest">
                    {week.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-background/60">
                    {week.description}
                  </p>
                </div>
                <div className="border border-background/20 p-6">
                  <p className="text-xs uppercase tracking-widest text-background/40">
                    Deliverable
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-background/70">
                    {week.deliverable}
                  </p>
                </div>
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

      {/* What's included */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                What&apos;s Included
              </p>
              <h2 className="nc-heading-lg mt-4">
                Everything to go from stuck to shipping.
              </h2>
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
            <div className="space-y-6">
              <div className="border border-foreground/10 p-8">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Investment
                </p>
                <p className="mt-4 text-3xl font-medium">From $15,000</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Flat fee, up to 15 people. Scoped in your Training Assessment.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 w-full cursor-pointer text-sm uppercase tracking-widest"
                >
                  <Link href="/book">Book a Training Assessment</Link>
                </Button>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  30 minutes. No pitch. Just clarity on fit.
                </p>
              </div>
              <div className="border border-foreground/10 p-8">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Want to go deeper?
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  The Accelerator covers the essentials. The Transformation
                  program adds a 2-day in-person intensive, role-specific tracks,
                  custom workflow buildout, governance policy, and ongoing
                  monthly support.
                </p>
                <Link
                  href="/programs/transformation"
                  className="mt-4 inline-block text-xs uppercase tracking-widest underline underline-offset-4"
                >
                  See the Transformation Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container text-center">
          <h2 className="nc-heading-lg mx-auto max-w-2xl">
            Four weeks from now, AI isn&apos;t something your team should be
            doing. It&apos;s something they do.
          </h2>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-10 cursor-pointer border-background/20 text-xs uppercase tracking-widest text-background hover:bg-background hover:text-foreground"
          >
            <Link href="/book">Book a Training Assessment</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
