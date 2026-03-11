import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cash App Case Study | AI Creative Training Results",
  description:
    "How Cash App's internal creative team achieved 96% time savings and 400% output increase through NotContent's AI training program.",
};

export default function CashAppCaseStudy() {
  return (
    <>
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <Link
            href="/results"
            className="text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Results
          </Link>
          <div className="mt-8 flex items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Fintech
            </p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Transformation (8 weeks)
            </p>
          </div>
          <h1 className="nc-heading-xl mt-4 max-w-3xl">Cash App</h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            Internal creative team trained to produce AI-assisted campaigns
            independently. No single point of failure, no bottleneck.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "96%", label: "Time savings on concept-to-visual" },
              { n: "400%", label: "Output increase per campaign" },
              { n: "8 weeks", label: "From kickoff to full capability" },
            ].map((stat) => (
              <div key={stat.n} className="border-l-2 border-background/30 pl-6">
                <p className="text-3xl font-light tracking-tight text-[#1549CD]">
                  {stat.n}
                </p>
                <p className="mt-1 text-sm text-background/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge / Solution / Result */}
      <section className="nc-divider nc-section">
        <div className="nc-container space-y-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Challenge
              </p>
              <h2 className="nc-heading-lg mt-4">
                An internal team experimenting solo.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Cash App's internal creative team had individuals experimenting
                with AI tools — producing interesting one-off results. But without
                a shared methodology, output quality was inconsistent. Some team
                members were skeptical. There was no governance framework. The team
                needed a structured approach to make AI a reliable part of their
                creative production, not a novelty.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Program
              </p>
              <h2 className="nc-heading-lg mt-4">
                8-week Transformation.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                The entire creative team trained together on the NotContent
                Method — Diverge, Converge, Systemize. The program started with
                a 2-day in-person intensive using Cash App's own brand assets and
                campaign briefs. Weekly sessions built progressive capability.
                By week two, the team was shipping real AI-assisted work. By week
                eight, they had documented workflows, a custom prompt library, and
                a governance policy.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Result
              </p>
              <h2 className="nc-heading-lg mt-4">
                A team that runs without a trainer.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Concept-to-visual processes that previously took 3-4 days now
                complete in under half a day. The team produces 4x more creative
                variations per campaign without additional headcount. Most
                importantly, the capability is organizational — not dependent on
                any single individual. New team members get onboarded using the
                documented workflows and prompt libraries built during the program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nc-divider nc-section">
        <div className="nc-container text-center">
          <h2 className="nc-heading-lg mx-auto max-w-xl">
            Want results like these?
          </h2>
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
