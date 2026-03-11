import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Results | Case Studies & Outcomes",
  description:
    "Real results from enterprise creative teams trained by NotContent. Case studies from Cash App, Maesa, Herman Scheer and more.",
};

const caseStudies = [
  {
    client: "Cash App",
    slug: "/results/cash-app",
    industry: "Fintech",
    headline: "Production time cut to 10%. $3.5M in estimated year-one savings.",
    stats: [
      { n: "90%", label: "Reduction in production time" },
      { n: "$3.5M", label: "Estimated year-one savings" },
    ],
    program: "Full Training Program",
  },
  {
    client: "Maesa",
    slug: "/results/maesa",
    industry: "Beauty / CPG",
    headline: "New brand launched into every Target store. 3 months instead of 9. $280K saved on a single launch.",
    stats: [
      { n: "$280K", label: "Saved on one brand launch" },
      { n: "3 months", label: "Instead of the usual 9" },
    ],
    program: "Full Training Program",
  },
  {
    client: "Herman Scheer",
    slug: "/results/herman-scheer",
    industry: "Brand Agency",
    headline: "$4.5M in estimated year-one production savings. Zero to full AI production.",
    stats: [
      { n: "$4.5M", label: "Estimated year-one savings" },
      { n: "Zero → full", label: "AI production capability" },
    ],
    program: "Full Training Program",
  },
];

const logos = ["Nike", "Apple", "Cash App", "Maesa", "Adidas", "Google"];

export default function ResultsPage() {
  return (
    <>
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Results
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-4xl">
            What happens after training.
          </h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            These aren't hypothetical projections. These are real outcomes from
            enterprise creative teams that completed NotContent training programs.
          </p>
        </div>
      </section>

      {/* Aggregate stats */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "$8M+", label: "Combined estimated client savings" },
              { n: "90%", label: "Average reduction in production time" },
              { n: "Tens of millions", label: "Projected savings (Maesa, on stage)" },
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

      {/* Case Studies */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Case Studies
          </p>
          <div className="mt-12 space-y-16">
            {caseStudies.map((study) => (
              <Link
                key={study.client}
                href={study.slug}
                className="group block border border-foreground/10 p-8 transition-colors hover:border-foreground/30 lg:p-12"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {study.industry}
                      </p>
                      <span className="text-xs text-muted-foreground">·</span>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {study.program}
                      </p>
                    </div>
                    <h2 className="nc-heading-lg mt-4">{study.client}</h2>
                    <p className="nc-body mt-4">{study.headline}</p>
                    <p className="mt-6 text-sm font-medium uppercase tracking-widest text-[#1549CD] transition-colors group-hover:text-[#1549CD]/80">
                      Read case study →
                    </p>
                  </div>
                  <div className="flex gap-8 lg:gap-12">
                    {study.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="text-2xl font-light tracking-tight text-[#1549CD]">
                          {stat.n}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Teams We&apos;ve Trained
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-center border border-foreground/10 py-6"
              >
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  {brand}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container text-center">
          <h2 className="nc-heading-lg mx-auto max-w-xl">
            Your team could be next.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-background/60">
            Take the 2-minute Scorecard to find out where your team stands — or
            skip straight to a conversation.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="cursor-pointer bg-background text-foreground text-sm uppercase tracking-widest hover:bg-background/90"
            >
              <Link href="/assess">Take the Scorecard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer border-background/30 text-background text-sm uppercase tracking-widest hover:bg-background/10"
            >
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
