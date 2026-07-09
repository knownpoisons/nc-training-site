import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyVideo } from "@/components/case-study-video";

export const metadata: Metadata = {
  title: "Maesa Case Study | AI Creative Training Results",
  description:
    "How the creative teams behind Kristin Ess, Hairitage, Being Frenshe and a dozen more Maesa brands — sold in Target, Walmart, Ulta and beyond — rebuilt their entire production model with AI. A new brand into every Target store in 3 months instead of 9.",
};

export default function MaesaCaseStudy() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1338BE] text-white overflow-hidden flex items-end">
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
              8-Week Operating Model
            </p>
          </div>
          <img src="/images/logos/maesa.webp" alt="Maesa" className="mt-4 h-6 brightness-0 invert opacity-80" />
          <h1 className="oci-display-sm mt-4">Maesa</h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/60">
            The world&apos;s largest mass-beauty incubator — Kristin Ess,
            Hairitage, Being Frenshe, Fine&apos;ry and a dozen more, on shelves
            in Target, Walmart, Ulta, CVS, Kroger and Amazon. You&apos;ve walked
            past their work in every aisle in America. We trained the two teams
            who make it.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "$280K", label: "Saved on a single brand launch" },
              { n: "3 months", label: "Instead of the usual 9" },
              { n: "12+ brands", label: "Now running the AI model" },
              { n: "Nationwide", label: "Target · Walmart · Ulta · CVS · Kroger · Amazon" },
            ].map((stat) => (
              <div key={stat.n} className="border-l-2 border-white/20 pl-6">
                <p className="text-3xl font-light tracking-tight text-[#1338BE]">
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
                A dozen brands. Two teams. One bottleneck.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                Maesa is the world&apos;s largest mass-beauty incubator — the
                company behind Kristin Ess, Hairitage, Being Frenshe,
                Fine&apos;ry, MIX:BAR and a dozen more, on shelves in Target,
                Walmart, Ulta, CVS, Kroger and Amazon. Two internal creative
                teams carry that entire portfolio: every identity, every
                package, every campaign.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                The catch: launching a new brand took nine months and roughly
                $280,000. At portfolio scale, that timeline was the ceiling on
                how fast the whole business could grow.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                You&apos;ve seen their work in every aisle in America. Most
                people just don&apos;t know Maesa made it.
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
                Both teams. Every discipline. Every brand.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                We trained both internal creative teams — every designer, every
                art director, every copywriter — on one AI operating model,
                using their actual brand assets and live campaign briefs from
                day one.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                Not a tool demo. A repeatable system for producing identity,
                packaging and campaigns at the quality Target and Walmart
                demand. Before the training was finished, they were running it
                on a live launch.
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
                A new brand into every Target store. 3 months. Near-zero cost.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                A new hair-care brand went from concept to every Target shelf in
                the country in three months instead of nine — built almost
                entirely on what we taught them.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                The saving on that single launch was about $280,000. Work that
                used to cost six figures now costs close to nothing.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                That model is now rolling out across all 12+ brands — the way
                every launch, every refresh and every campaign gets made.
              </p>
            </div>
          </div>

          {/* THE WORK — video showcase */}
          <div>
            <div className="oci-section-label mb-8">
              <span>THE WORK</span>
              <span>[NC.4]</span>
            </div>
            {/* Featured brand film */}
            <CaseStudyVideo
              src="/videos/case-studies/maesa-brand.mp4"
              poster="/videos/case-studies/maesa-brand.jpg"
            />
            <p className="mt-4 mb-10 text-xs text-foreground/40">
              The brand film — produced in-house by the teams we trained,
              running the AI operating model.
            </p>
            <CaseStudyVideo
              src="/videos/case-studies/maesa-main.mp4"
              poster="/videos/case-studies/maesa-main.jpg"
              orientation="portrait"
            />
            <div className="mt-4">
              <CaseStudyVideo
                src="/videos/case-studies/maesa-sub.mp4"
                poster="/videos/case-studies/maesa-sub.jpg"
              />
            </div>
            <p className="mt-4 text-xs text-foreground/40">
              A new hair-care brand — concept to Target shelves — produced with the operating model after training.
            </p>
          </div>

          {/* Testimonial */}
          <div className="border-l-2 border-[#1338BE] pl-8">
            <p className="text-lg font-light leading-relaxed italic">
              &ldquo;Jeremy and NotContent will save us tens of millions of
              dollars in the next year alone.&rdquo;
            </p>
            <p className="mt-4 text-sm text-foreground/40">
              — Oshyia Savur, VP Marketing, Maesa / On stage at Shoptalk, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Scorecard callout */}
      <section className="py-10 bg-[#1338BE] text-white">
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
            className="shrink-0 bg-white text-[#1338BE] px-8 py-3 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors"
          >
            Take the Readiness Scorecard →
          </Link>
        </div>
      </section>

      {/* CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1338BE] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-xl">
            Want results like these?
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/assess"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1338BE]"
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
