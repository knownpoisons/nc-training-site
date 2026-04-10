import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cash App Case Study | AI Creative Training Results",
  description:
    "How Cash App's creative team cut production time to 10% and estimated $3.5M in year-one savings after NotContent training.",
};

export default function CashAppCaseStudy() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        {/* Header image — full bleed, faded behind content */}
        <div className="absolute inset-0">
          <img
            src="/images/case-studies/cash-app/header.png"
            alt=""
            className="h-full w-full object-cover object-center opacity-[0.15] mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1549CD] via-[#1549CD]/40 to-transparent" />
        </div>
        <div className="oci-grid-lines-light" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <Link
            href="/results"
            className="text-[11px] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white/70"
          >
            ← Back to Results
          </Link>
          <div className="mt-8 flex items-center gap-4">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
              Fintech
            </p>
            <span className="text-[11px] text-white/30">·</span>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
              Full Training Program
            </p>
          </div>
          <img src="/images/logos/cashapp.png" alt="Cash App" className="mt-4 h-8 brightness-0 invert opacity-80" />
          <h1 className="oci-display-sm mt-4">Cash App</h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            Part of Square and Block. Trained a small internal creative team —
            producers, designers, 3D artists. Production ready by halfway
            through. Process reduced to 10% of the usual time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "90%", label: "Reduction in production time" },
              { n: "$3.5M", label: "Estimated year-one savings" },
              { n: "30%", label: "Increase in campaign output" },
            ].map((stat) => (
              <div key={stat.n} className="border-l-2 border-white/20 pl-6">
                <p className="text-3xl font-light tracking-tight text-[#1549CD]">
                  {stat.n}
                </p>
                <p className="mt-1 text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge / Solution / Result */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8">
                <span>THE CHALLENGE</span>
                <span>[NC.1]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                A multi-billion dollar company. A small creative team.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
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
              <div className="oci-section-label mb-8">
                <span>THE PROGRAM</span>
                <span>[NC.2]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Every role. Production ready by halfway.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
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
              <div className="oci-section-label mb-8">
                <span>THE RESULT</span>
                <span>[NC.3]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                10% of the time. $3.5M in estimated savings.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                We refined their process down to 10% of the time it would
                usually take to pitch and get the budgets they need for actual
                campaigns. Estimated increase in campaign capacity: at least
                30%. Estimated cost savings over year one: in the range of
                $3.5 million. The team now moves faster, pitches stronger, and
                produces more — without adding headcount.
              </p>
            </div>
          </div>

          {/* Campaign Work */}
          <div>
            <div className="oci-section-label mb-8">
              <span>THE WORK</span>
              <span>[NC.4]</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="aspect-[4/5] overflow-hidden border border-foreground/10">
                <img
                  src="/images/case-studies/cash-app/campaign-1.png"
                  alt="Cash App campaign — AI-generated creative"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] overflow-hidden border border-foreground/10">
                <img
                  src="/images/case-studies/cash-app/campaign-2.png"
                  alt="Cash App campaign — product visualization"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] overflow-hidden border border-foreground/10">
                <img
                  src="/images/case-studies/cash-app/campaign-3.png"
                  alt="Cash App campaign — no hidden fees"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-foreground/40">
              Campaign work produced by the Cash App creative team after NotContent training.
            </p>
          </div>

          {/* Testimonial */}
          <div className="border-l-2 border-[#1549CD] pl-8">
            <p className="text-lg font-light leading-relaxed italic">
              &ldquo;Jeremy&apos;s training was fun and really gave us the
              strategies, frameworks, and tools that we needed to completely
              revolutionize how we produce creative — both internally for
              pitching and externally for production.&rdquo;
            </p>
            <p className="mt-4 text-sm text-foreground/40">
              — Jose Diaz, Head of Production, Cash App
            </p>
          </div>
        </div>
      </section>

      {/* Scorecard callout */}
      <section className="py-10 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-light tracking-tight">
              See where your team stands first.
            </p>
            <p className="mt-1 text-sm text-white/50">
              Take the 2-minute Readiness Scorecard and get a personalized program recommendation.
            </p>
          </div>
          <Link
            href="/assess"
            className="shrink-0 bg-white text-[#1549CD] px-8 py-3 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors"
          >
            Take the Readiness Scorecard →
          </Link>
        </div>
      </section>

      {/* CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-xl">
            Want results like these?
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/assess"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Take the Readiness Scorecard
            </Link>
            <Link
              href="/book"
              className="px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white"
            >
              Book a Discovery Call →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
