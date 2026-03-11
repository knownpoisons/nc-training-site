import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Maesa Case Study | AI Creative Training Results",
  description:
    "How Maesa saved $280,000 on a single brand launch in Target through NotContent's AI training program.",
};

export default function MaesaCaseStudy() {
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
              Beauty / CPG
            </p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Transformation (8 weeks)
            </p>
          </div>
          <h1 className="nc-heading-xl mt-4 max-w-3xl">Maesa</h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            $280,000 saved on a single brand launch in Target. One-fifth of
            the usual production time. Same quality bar.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "$280K", label: "Saved on one product launch" },
              { n: "80%", label: "Faster time-to-market" },
              { n: "8 weeks", label: "Training program duration" },
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
                A major launch on a compressed timeline.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Maesa — one of the largest indie beauty incubators in the world —
                needed to launch a new brand into Target. The creative production
                requirements were massive: packaging, in-store displays, digital
                assets, social content. The traditional production approach would
                have taken months and cost significantly more. They needed a way to
                compress the timeline without compromising the quality that Target
                demands.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Program
              </p>
              <h2 className="nc-heading-lg mt-4">
                8-week Transformation with a live launch.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                The Maesa team went through the full Transformation program while
                simultaneously applying the methodology to their active product
                launch. Training wasn't theoretical — every session produced
                real assets for the Target launch. The Diverge/Converge framework
                allowed the team to explore more creative directions in the first
                two weeks than they would have in two months of traditional
                production, then converge on the final direction with precision
                tooling.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Result
              </p>
              <h2 className="nc-heading-lg mt-4">
                $280K saved. 80% faster. Same quality.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                The brand launched in Target on time and on budget — $280,000 under
                what traditional production would have cost. The time savings came
                from compressed iteration cycles and reduced dependency on external
                production partners. The team now uses the NotContent Method as
                their default production workflow, applying it to every subsequent
                launch with compounding returns.
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
