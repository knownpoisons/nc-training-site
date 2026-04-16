import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Herman Scheer Case Study | AI Creative Training Results",
  description:
    "How Herman Scheer went from zero AI capability to $4.5M in estimated year-one production savings after NotContent training.",
};

export default function HermanScheerCaseStudy() {
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
              Brand Agency
            </p>
            <span className="text-[11px] text-white/30">·</span>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
              8-Week Transformation
            </p>
          </div>
          <h1 className="oci-display-sm mt-4">Herman Scheer</h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            Big Los Angeles branding and design agency. Trained their entire
            team from zero to full AI production. Now producing client-ready
            campaigns visible in supermarkets across America.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "$4.5M", label: "Estimated year-one production savings" },
              { n: "Zero to full", label: "AI production capability" },
              { n: "New services", label: "Profitable AI offerings to clients" },
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
                Clients asking about AI. Agency at zero.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                Herman Scheer is a major Los Angeles branding and design agency
                working with CPG brands on campaigns that end up in every
                supermarket across America. Their clients were asking about AI
                capability. The agency had zero structured AI processes — no
                shared methodology, no quality standard, no way to offer AI as
                a reliable production service.
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
                Full team. Zero to production.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                We trained their entire team from zero. Before the training was
                even finished, they were producing client-ready assets — image,
                copy, video, and full campaigns ready to go out into the world
                for major CPG launches.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                Work that can now be seen in every supermarket across America.
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
                $4.5M in estimated year-one savings. New revenue streams.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                Herman Scheer now offers new and very profitable AI-powered
                services to existing clients — and uses their new capability
                to package offerings for new clients entirely.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                Estimated production cost savings for year one: $4.5 million.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                The team went from zero AI capability to full production in a
                matter of weeks.
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-8">
            <div className="border-l-2 border-[#1549CD] pl-8">
              <p className="text-lg font-light leading-relaxed italic">
                &ldquo;We&apos;ve been able to offer new and very profitable
                services to existing clients and use our skills to package new
                offerings to new clients as well. We feel comfortable moving
                into this new AI-powered world — that we are not falling
                behind, nor will we get eaten up by another agency or any AI
                creative agencies that are out there.&rdquo;
              </p>
              <p className="mt-4 text-sm text-foreground/40">
                — Adam, Creative Director, Herman Scheer
              </p>
            </div>
            <div className="border-l-2 border-[#1549CD] pl-8">
              <p className="text-lg font-light leading-relaxed italic">
                &ldquo;Jeremy&apos;s training very quickly showed us what was
                possible and very soon after that taught us how to do it.
                It&apos;s insane what we are able to do now compared to what we
                were able to do just three months ago.&rdquo;
              </p>
              <p className="mt-4 text-sm text-foreground/40">
                — Ludovic Bertron, Executive Creative Director, Herman Scheer
              </p>
            </div>
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
              Take the 2-minute Readiness Scorecard and get a personalised program recommendation.
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
