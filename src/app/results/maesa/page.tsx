import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Maesa Case Study | AI Creative Training Results",
  description:
    "How Maesa launched a new hair care brand into every Target store using AI — in 3 months instead of 9, saving $280,000 on a single launch.",
};

export default function MaesaCaseStudy() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <Link
            href="/results"
            className="text-[11px] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white/70"
          >
            ← Back to Results
          </Link>
          <div className="mt-8 flex items-center gap-4">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
              Beauty / CPG
            </p>
            <span className="text-[11px] text-white/30">·</span>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
              8-Week Transformation
            </p>
          </div>
          <img src="/images/logos/maesa.png" alt="Maesa" className="mt-4 h-6 brightness-0 invert opacity-80" />
          <h1 className="oci-display-sm mt-4">Maesa</h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            Trained two internal teams across a dozen beauty, hair, and
            fragrance brands. Launched a new brand into every Target store
            entirely with AI. 3 months instead of 9. $280,000 saved.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "$280K", label: "Saved on a single brand launch" },
              { n: "3 months", label: "Instead of the usual 9 months" },
              { n: "12+ brands", label: "Rolling out AI processes across all" },
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
                A dozen brands. Two teams. No AI process.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                Maesa is one of the largest indie beauty incubators in the
                world, producing in-house brands of beauty, hair, and fragrance
                for Target. Two internal creative teams. Over a dozen brands.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                The production process for launching a new brand typically
                took nine months and cost $280,000. They needed to move faster
                without sacrificing the quality Target demands.
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
                Two teams trained. All creatives.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                We trained two internal teams — every designer, every art
                director, every copywriter — working with their actual brand
                assets and real campaign briefs from day one.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                Before the training was finished, they were applying the
                methodology to a live product launch.
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
                New brand in Target. 3 months. Near zero cost.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                They got from concept to market and into every Target store
                with a new brand of hair care — built entirely on what we
                taught them.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                What usually takes 9 months and costs $280,000 took 3 months
                and cost them close to zero.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                They are now rolling out those creative processes across every
                brand — and are able to launch new brands at scale, fast.
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="border-l-2 border-[#1549CD] pl-8">
            <p className="text-lg font-light leading-relaxed italic">
              &ldquo;Jeremy and NotContent will save us tens of millions of
              dollars in the next year alone.&rdquo;
            </p>
            <p className="mt-4 text-sm text-foreground/40">
              — Oshyia Savur, VP Marketing, Maesa / On stage at a national
              beauty conference
            </p>
          </div>
        </div>
      </section>

      {/* Scorecard callout */}
      <section className="py-10 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-light tracking-tight">
              Could your team move this fast?
            </p>
            <p className="mt-1 text-sm text-white/50">
              Two minutes. Ten questions. Honest answer on whether you&apos;re ready.
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
