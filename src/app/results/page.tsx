import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyVideo } from "@/components/case-study-video";
import { AmbientVideo } from "@/components/ambient-video";

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
    video: "/videos/case-studies/cash-app-main.mp4",
    poster: "/videos/case-studies/cash-app-main.jpg",
    orientation: "landscape" as const,
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
    headline: "A new brand into every Target store. 3 months instead of 9.",
    summary:
      "The world's largest mass-beauty incubator — Kristin Ess, Hairitage, Being Frenshe and a dozen more, in Target, Walmart, Ulta and beyond. We trained the two teams behind all of them.",
    video: "/videos/case-studies/maesa-main.mp4",
    poster: "/videos/case-studies/maesa-main.jpg",
    orientation: "portrait" as const,
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
    video: "/videos/case-studies/herman-scheer-main.mp4",
    poster: "/videos/case-studies/herman-scheer-main.jpg",
    orientation: "landscape" as const,
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
      <section className="relative min-h-[60vh] bg-[#1338BE] text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <AmbientVideo
            src="/videos/case-studies/results-hero.mp4"
            poster="/videos/case-studies/results-hero.jpg"
            className="h-full w-full object-cover opacity-[0.14] mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1338BE] via-[#1338BE]/55 to-[#1338BE]/20" />
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
            <img src="/images/logos/cashapp.webp" alt="Cash App" className="h-6 opacity-40" />
            <img src="/images/logos/maesa.webp" alt="Maesa" className="h-4 opacity-40" />
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
              { n: "3", label: "Enterprise teams shipped" },
              { n: "Tens of millions", label: "Projected savings (Maesa, on stage)" },
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

      {/* Case Studies — video-led, alternating */}
      {caseStudies.map((study, i) => {
        const flip = i % 2 === 1;
        return (
          <section
            key={study.client}
            className="relative py-20 lg:py-28 oci-grid-lines border-b border-foreground/10"
          >
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
              <div className="oci-section-label mb-12">
                <span>{study.industry.toUpperCase()}</span>
                <span>[NC.{i + 1}]</span>
              </div>

              <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 lg:items-center">
                {/* The creative — the work itself, links into the case study */}
                <div className={flip ? "lg:order-2" : ""}>
                  <CaseStudyVideo
                    src={study.video}
                    poster={study.poster}
                    orientation={study.orientation}
                    href={study.slug}
                  />
                </div>

                {/* The story */}
                <div className={flip ? "lg:order-1" : ""}>
                  <Link href={study.slug} className="group/title inline-block">
                    <h2 className="oci-display-sm transition-colors group-hover/title:text-[#1338BE]">
                      {study.client}
                    </h2>
                  </Link>
                  <p className="mt-5 text-xl lg:text-2xl font-light leading-snug tracking-tight text-foreground">
                    {study.headline}
                  </p>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/60">
                    {study.summary}
                  </p>

                  <div className="mt-8 grid grid-cols-3 gap-5">
                    {study.stats.map((stat) => (
                      <div key={stat.label} className="border-l-2 border-[#1338BE] pl-4">
                        <p className="text-xl lg:text-2xl font-light tracking-tight text-[#1338BE] leading-none">
                          {stat.n}
                        </p>
                        <p className="mt-2 text-[11px] leading-tight text-foreground/40">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={study.slug}
                    className="mt-10 inline-flex items-center gap-2 bg-[#1338BE] px-7 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0e38a8]"
                  >
                    Read full case study →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

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
      <section className="py-16 lg:py-24 bg-[#1338BE] text-white">
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
