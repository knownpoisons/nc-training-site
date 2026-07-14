import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Two programs. One methodology — Diverge, Converge, Build — scaled to match where your team is now.",
};

const programs = [
  {
    n: "01",
    name: "Audit Workshop",
    format: "Half-day audit session",
    price: "$5,000",
    description:
      "A half-day audit of your team's current AI state. What's working, what's blocking, where the next 8 weeks of work should focus.",
    ideal: "Teams already using AI unevenly and ready to name what's blocking them",
    href: "/programs/foundations",
  },
  {
    n: "02",
    name: "The Operating Model",
    format: "8-week program · Bespoke to your team",
    price: "From $50,000",
    description:
      "A bespoke AI operating system, built around your team over 8 weeks — your workflows, your production, your risk profile. Prompt libraries, quality gates, and documentation that survives turnover.",
    ideal: "Teams ready to ship on AI as a system, not a side experiment",
    href: "/programs/transformation",
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1338BE] text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/training/speaking-wide-4.webp"
            alt=""
            className="h-full w-full object-cover opacity-[0.1] mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1338BE] via-[#1338BE]/50 to-transparent" />
        </div>
        <div className="oci-grid-lines-light" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>PROGRAMS</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-4xl">
            Two programs. One is a diagnosis. The other is surgery.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            Two programs. One methodology — Diverge, Converge,
            Build — scaled to match where your team is now.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
            This methodology cut Cash App&apos;s production time 90%, and put a Maesa brand in every Target store in 3 months instead of 9. Both engagements started the same way: a half-day audit.
          </p>
        </div>
      </section>

      {/* Programs grid */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-0">
            {programs.map((program, i) => (
              <Link
                key={program.name}
                href={program.href}
                className={`group block py-10 px-2 transition-colors hover:bg-[#1338BE]/[0.03] ${
                  i > 0 ? "border-t border-foreground/10" : ""
                }`}
              >
                <div className="grid gap-6 lg:grid-cols-[80px_200px_1fr_200px]  lg:items-start">
                  <span className="text-4xl font-light text-[#1338BE]/30">
                    {program.n}
                  </span>
                  <div>
                    <h2 className="text-2xl font-medium tracking-tight">
                      {program.name}
                    </h2>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {program.format}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
                      {program.description}
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      Best for: {program.ideal}
                    </p>
                  </div>
                  <div className="lg:text-right">
                    <p className="text-lg font-light tracking-tight">
                      {program.price}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#1338BE] opacity-0 group-hover:opacity-100 transition-opacity">
                      View details →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Scorecard callout */}
      <section className="py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 border border-foreground/10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div>
              <p className="text-lg font-light tracking-tight">
                Not sure which fits?
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                The Readiness Scorecard matches your team&apos;s AI maturity to the
                right program in 2 minutes.
              </p>
            </div>
            <Link
              href="/assess"
              className="shrink-0 border border-foreground/20 px-8 py-3 text-[11px] uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-white"
            >
              Take the Readiness Scorecard →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1338BE] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-2xl">
            Ready to talk?
          </h2>
          <p className="mt-6 text-sm text-white/50 max-w-lg mx-auto leading-relaxed">
            30 minutes with Jeremy. No pitch. You describe where your team is,
            he maps what&apos;s possible and recommends the right program.
          </p>
          <div className="mt-10">
            <Link
              href="/book"
              className="inline-block border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1338BE]"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
