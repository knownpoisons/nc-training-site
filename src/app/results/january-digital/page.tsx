import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "January Digital Case Study | AI Creative Training Results",
  description:
    "A performance media agency with no creative team — given a system to turn winning ad data into new creative on demand, then trained to run it. It became a new revenue line.",
};

export default function JanuaryDigitalCaseStudy() {
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
              Performance Media Agency
            </p>
            <span className="text-[11px] text-white/30">·</span>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
              Eight-Week Production System + Training
            </p>
          </div>
          <h1 className="oci-display-sm mt-4">January Digital</h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            A performance media agency — all data and results, and no creative
            team. We built them a system to turn their winning ad data into new
            creative on demand, then trained the team to run it. Within the
            eight weeks they were shipping their own work — and it became a
            heritage workwear brand&apos;s top-performing ad spend.
          </p>
        </div>
      </section>

      {/* Results pull quote */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-[#1338BE] text-6xl leading-none font-light">
            &ldquo;
          </p>
          <blockquote className="-mt-4 text-2xl sm:text-3xl lg:text-[2.5rem] font-light leading-[1.25] tracking-tight text-foreground">
            We saw ad conversion go up about 50%, ROAS went up about 50%.
            More importantly, these immediately took off to the top two spenders
            on Meta — a new pocket of audience, opened up by the diversified
            creative.
          </blockquote>
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-12 bg-[#1338BE]" />
            <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/50">
              Jeremy Ekes, January Digital
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "+50%", label: "Lift in ad conversion (Meta)" },
              { n: "+50%", label: "Improvement in ROAS" },
              {
                n: "Top 2",
                label: "The new creative became the account's two highest-spending ads",
              },
            ].map((stat) => (
              <div key={stat.label} className="border-l-2 border-white/20 pl-6">
                <p className="text-3xl font-light tracking-tight text-[#1338BE]">
                  {stat.n}
                </p>
                <p className="mt-1 text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge / New category / Program / Result */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8">
                <span>THE CHALLENGE</span>
                <span>[NC.1]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                All the data. None of the hands.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                January Digital is a performance media agency — they live in the
                numbers and know, in real time, which creative is winning. But
                knowing wasn&apos;t enough. When an ad started to take off, they
                had no way to act on it fast: new creative meant briefing it out
                and waiting weeks, and by the time it arrived the moment had
                passed. A results-driven agency, stuck at the exact point
                results are made.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8">
                <span>THE NEW CATEGORY</span>
                <span>[NC.2]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Turn the winning data into more of the winning creative —
                instantly.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                This is the part that changes the business. Because JD is
                data-driven, they see the winner the moment it emerges. Now they
                can produce dozens of versions of that exact winning creative in
                minutes and push them back into the ad account while it&apos;s
                still peaking — insight to asset to spend, in one loop, at the
                moment of maximum momentum.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                For a media agency with no creative team, that isn&apos;t a
                workflow tweak. It&apos;s an entirely new line of business.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8">
                <span>THE PROGRAM</span>
                <span>[NC.3]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                We built the system, then taught the team to run it.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                NotContent concepted the whole thing as a system — the
                production chain that turns a flat lay into finished, versioned
                creative, and the async protocol that protects the speed — then
                ran an eight-week training to install it. No watching demos: by
                the halfway mark the team was producing client-ready assets
                themselves, and shipping their own creative to the client before
                the program was over.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8">
                <span>THE RESULT</span>
                <span>[NC.4]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Their creative became the client&apos;s top-performing ad spend.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-sm leading-relaxed text-foreground/60">
                Roughly 60 diversified assets — built from flat-lay product
                shots with one piece of contextual detail — went live on Meta
                and lifted both ad conversion and ROAS by about 50%. Within
                days they were the account&apos;s top two spenders. The
                best-performing addition wasn&apos;t a stroke of genius: it was a
                wrench, placed next to the workwear.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                And it&apos;s a capability now, not a project. The team ships its
                own creative on demand, with new briefs already in the pipeline —
                a media agency that opened a new revenue line without hiring a
                creative department.
              </p>
            </div>
          </div>

          {/* THE WORK — placeholder for approved client creative */}
          <div>
            <div className="oci-section-label mb-8">
              <span>THE WORK</span>
              <span>[NC.5]</span>
            </div>
            <div className="aspect-video w-full border border-dashed border-foreground/25 flex items-center justify-center bg-foreground/[0.02]">
              <p className="text-xs uppercase tracking-[0.15em] text-foreground/30">
                Client creative — to be added
              </p>
            </div>
            <p className="mt-4 text-xs text-foreground/40">
              Diversified product creative produced by the January Digital team
              with the system — dozens of concepts from a single flat lay.
            </p>
          </div>

          {/* Testimonials */}
          <div className="space-y-8">
            <div className="border-l-2 border-[#1338BE] pl-8">
              <p className="text-lg font-light leading-relaxed italic">
                &ldquo;There is a different feeling when it comes from a creative
                that you put together from scratch. That has been the driving
                force for me.&rdquo;
              </p>
              <p className="mt-4 text-sm text-foreground/40">
                — Luisa Melo, January Digital
              </p>
            </div>
            <div className="border-l-2 border-[#1338BE] pl-8">
              <p className="text-lg font-light leading-relaxed italic">
                &ldquo;Got some great positive feedback from the client on all
                the great creative work.&rdquo;
              </p>
              <p className="mt-4 text-sm text-foreground/40">
                — Jeremy Ekes, January Digital
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scorecard callout */}
      <section className="py-10 bg-[#1338BE] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-light tracking-tight">
              You have the data and the strategy. Can your team make the
              creative?
            </p>
            <p className="mt-1 text-sm text-white/50">
              Two minutes. Ten questions. Find out where your team stands.
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
            Bring the creative in-house.
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
