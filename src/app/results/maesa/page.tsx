import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Maesa Case Study | AI Creative Training Results",
  description:
    "How Maesa launched a new hair care brand into every Target store using AI — in 3 months instead of 9, saving $280,000 on a single launch.",
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
              Full Training Program
            </p>
          </div>
          <h1 className="nc-heading-xl mt-4 max-w-3xl">Maesa</h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            Trained two internal teams across a dozen beauty, hair, and
            fragrance brands. Launched a new brand into every Target store
            entirely with AI. 3 months instead of 9. $280,000 saved.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "$280K", label: "Saved on a single brand launch" },
              { n: "3 months", label: "Instead of the usual 9 months" },
              { n: "12+ brands", label: "Rolling out AI processes across all" },
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
                A dozen brands. Two teams. No AI process.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Maesa is one of the largest indie beauty incubators in the world,
                producing in-house brands of beauty, hair, and fragrance for
                Target. They had two internal creative teams covering over a dozen
                brands. The production process for launching a new brand typically
                took nine months and cost $280,000. They needed to move faster
                without sacrificing the quality Target demands.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Program
              </p>
              <h2 className="nc-heading-lg mt-4">
                Two teams trained. All creatives.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                We trained two internal teams comprising all of their creatives
                across a dozen brands. Every designer, every art director, every
                copywriter — working with their actual brand assets and real
                campaign briefs from day one. Before the training was finished,
                they were applying the methodology to a live product launch.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Result
              </p>
              <h2 className="nc-heading-lg mt-4">
                New brand in Target. 3 months. Near zero cost.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                They got from concept into market and into every Target store
                with a new brand of hair care — and did it all completely with
                AI based on the training we ran. What usually takes 9 months
                and costs $280,000 took 3 months and cost them close to zero.
                They are now rolling out those creative processes across every
                brand and are able to launch new brands at scale and fast.
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="border-l-2 border-[#1549CD] pl-8">
            <p className="text-lg font-light leading-relaxed italic">
              &ldquo;Jeremy and NotContent will save us tens of millions of
              dollars in the next year alone.&rdquo;
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              — Marketing Manager, Maesa (on stage at a national beauty
              conference)
            </p>
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
