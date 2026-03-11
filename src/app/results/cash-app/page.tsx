import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cash App Case Study | AI Creative Training Results",
  description:
    "How Cash App's creative team cut production time to 10% and estimated $3.5M in year-one savings after NotContent training.",
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
              Full Training Program
            </p>
          </div>
          <h1 className="nc-heading-xl mt-4 max-w-3xl">Cash App</h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            Part of Square and Block. Trained a small internal creative team —
            producers, designers, 3D artists. Production ready by halfway
            through. Process reduced to 10% of the usual time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "90%", label: "Reduction in production time" },
              { n: "$3.5M", label: "Estimated year-one savings" },
              { n: "30%", label: "Increase in campaign output" },
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
                A multi-billion dollar company. A small creative team.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Cash App — part of Square and Block — has a small but mighty
                internal creative team. Producers, designers, 3D artists. They
                needed to produce more campaigns, faster, while still securing
                the budgets for big hybrid productions — TVC, out-of-home,
                digital. The existing process was too slow to keep up with the
                pace the business demanded.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Program
              </p>
              <h2 className="nc-heading-lg mt-4">
                Every role. Production ready by halfway.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                We trained everyone — producers, designers, and 3D artists —
                on the NotContent Method. By halfway through the training, the
                team was production ready. They were using AI to pitch
                internally, get budgets approved, and prepare for hybrid big
                productions across TVC, out-of-home, and digital campaigns.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Result
              </p>
              <h2 className="nc-heading-lg mt-4">
                10% of the time. $3.5M in estimated savings.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                We refined their process down to 10% of the time it would
                usually take to pitch and get the budgets they need for actual
                campaigns. Estimated increase in campaign capacity: at least
                30%. Estimated cost savings over year one: in the range of
                $3.5 million. The team now moves faster, pitches stronger, and
                produces more — without adding headcount.
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="border-l-2 border-[#1549CD] pl-8">
            <p className="text-lg font-light leading-relaxed italic">
              &ldquo;Jeremy&apos;s training was fun and really gave us the
              strategies, frameworks, and tools that we needed to completely
              revolutionize how we produce creative — both internally for
              pitching and externally for production.&rdquo;
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              — Cash App Creative Team
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
