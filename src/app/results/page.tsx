import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies | Real Results from AI Creative Training",
  description:
    "Real results from enterprise creative teams trained by NotContent. $8M+ in combined savings. Case studies from Cash App, Maesa, and Herman Scheer.",
};

const caseStudies = [
  {
    client: "Cash App",
    slug: "/results/cash-app",
    industry: "Fintech · Enterprise",
    headline: "Production time cut to 10%. $3.5M in estimated year-one savings.",
    summary:
      "Part of Square and Block. Trained a small internal creative team — producers, designers, 3D artists. Production-ready by halfway through.",
    image: "/images/case-studies/cash-app/campaign-1.png",
    stats: [
      { n: "90%", label: "Reduction in production time" },
      { n: "$3.5M", label: "Estimated year-one savings" },
      { n: "30%", label: "Increase in campaign output" },
    ],
  },
  {
    client: "Maesa",
    slug: "/results/maesa",
    industry: "Beauty · CPG",
    headline: "New brand launched into every Target store. 3 months instead of 9.",
    summary:
      "Trained two internal teams across a dozen beauty, hair, and fragrance brands. Launched a new brand into every Target store entirely with AI.",
    image: null as string | null,
    stats: [
      { n: "$280K", label: "Saved on a single brand launch" },
      { n: "3 months", label: "Instead of the usual 9" },
      { n: "12+", label: "Brands rolling out AI processes" },
    ],
  },
  {
    client: "Herman Scheer",
    slug: "/results/herman-scheer",
    industry: "Brand Agency · LA",
    headline: "$4.5M in estimated year-one production savings.",
    summary:
      "Big Los Angeles branding and design agency. Trained their entire team from zero to full AI production.",
    image: null as string | null,
    stats: [
      { n: "$4.5M", label: "Estimated year-one savings" },
      { n: "Zero to full", label: "AI production capability" },
      { n: "New", label: "Profitable AI offerings to clients" },

    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/training/speaking-wide-3.png"
            alt=""
            className="h-full w-full object-cover opacity-[0.1] mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1549CD] via-[#1549CD]/50 to-transparent" />
        </div>
        <div className="oci-grid-lines-light" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>CASE STUDIES</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-4xl">
            What happens
            <br />
            after training.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            These aren&apos;t hypothetical projections. These are real outcomes
            from enterprise creative teams that completed NotContent training
            programs.
          </p>
          <div className="mt-12 flex items-center gap-6 sm:gap-10 flex-wrap">
            <img src="/images/logos/cashapp.png" alt="Cash App" className="h-6 opacity-40" />
            <img src="/images/logos/maesa.png" alt="Maesa" className="h-4 opacity-40" />
            <img src="/images/logos/hermanscheer.jpg" alt="Herman Scheer" className="h-5 opacity-40" />
          </div>
        </div>
      </section>

      {/* Aggregate stats */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { n: "$8M+", label: "Combined estimated client savings" },
              { n: "90%", label: "Average reduction in production time" },
              { n: "3", label: "Enterprise teams transformed" },
              { n: "Tens of millions", label: "Projected savings (Maesa, on stage)" },
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

      {/* Case Studies */}
      {caseStudies.map((study, i) => (
        <section
          key={study.client}
          className="relative py-16 lg:py-24 oci-grid-lines border-b border-foreground/10"
        >
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="oci-section-label mb-12">
              <span>{study.industry.toUpperCase()}</span>
              <span>[NC.{i + 1}]</span>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              <div className="relative overflow-hidden">
                {study.image && (
                  <div className="absolute -inset-6 overflow-hidden">
                    <img
                      src={study.image}
                      alt=""
                      className="h-full w-full object-cover opacity-[0.07]"
                    />
                  </div>
                )}
                <div className="relative">
                  <h2 className="oci-display-sm">{study.client}</h2>
                  <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                    {study.summary}
                  </p>
                  <Link
                    href={study.slug}
                    className="mt-8 inline-block text-[11px] font-medium uppercase tracking-[0.15em] text-[#1549CD] transition-colors hover:text-[#1549CD]/70"
                  >
                    Read full case study →
                  </Link>
                </div>
              </div>

              <div>
                <div className="grid gap-6 sm:grid-cols-3">
                  {study.stats.map((stat) => (
                    <div key={stat.label} className="border-l-2 border-[#1549CD] pl-5">
                      <p className="text-2xl font-light tracking-tight text-[#1549CD]">
                        {stat.n}
                      </p>
                      <p className="mt-1 text-xs text-foreground/40">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-sm leading-relaxed text-foreground/60">
                  {study.headline}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Scorecard mid-page callout */}
      <section className="py-8 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-light tracking-tight">Where does your team sit?</p>
            <p className="mt-1 text-sm text-white/50">
              See how you compare in 2 minutes.
            </p>
          </div>
          <Link
            href="/assess"
            className="shrink-0 border border-white/20 px-8 py-3 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-foreground"
          >
            Take the Readiness Scorecard →
          </Link>
        </div>
      </section>

      {/* CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-xl">
            Your team could be next.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-white/60">
            Take the Readiness Scorecard to find out where your team stands — or
            skip straight to a conversation.
          </p>
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
