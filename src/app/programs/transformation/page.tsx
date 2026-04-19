import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Creative Transformation | 8-Week Program",
  description:
    "Our flagship 8-week program. Full operational AI transformation for creative teams. Custom workflows, governance, and ongoing support.",
};

const curriculum = [
  {
    week: "01-02",
    title: "Audit & Foundation",
    items: [
      "AI Creative Audit of current workflows and bottlenecks",
      "Tool ecosystem setup and team configuration",
      "Team skill baseline assessment",
      "NotContent Methodology deep-dive: Diverge / Converge / Systemize",
    ],
  },
  {
    week: "03-04",
    title: "Divergence Mastery",
    items: [
      "Midjourney advanced: style refs, image refs, combinatorial batching",
      "AI as a visual sparring partner for concepting",
      "Prompt engineering for brand-specific output",
      "The Stop Rule: knowing when to shift from exploration to execution",
    ],
  },
  {
    week: "05-06",
    title: "Convergence & Production",
    items: [
      "Production-grade tools for precision execution",
      "Brand asset integration into AI scenes",
      "Video transformation and extension workflows",
      "Quality control: maintaining brand standards at AI speed",
    ],
  },
  {
    week: "07-08",
    title: "Systemization & Governance",
    items: [
      "Building repeatable workflows for your specific operation",
      "AI governance policy — approved tools, data protocols, client disclosure standards",
      "Role-specific documentation your team actually uses",
      "Onboarding templates so new hires get up to speed in days, not months",
    ],
  },
];

const included = [
  "2-day in-person intensive with Jeremy (your office or offsite)",
  "Weekly live sessions — role-specific tracks for CDs, designers, strategists, producers",
  "Custom workflow buildout for your specific production setup",
  "Dedicated Slack channel — async support throughout",
  "AI Governance Policy — built for your team, your clients, your risk profile",
  "Before/after workflow benchmarks so you can show leadership exactly what changed",
  "Ongoing monthly coaching calls",
  "NotContent AI Creative Transformation Certificate for every participant",
];

export default function TransformationPage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img src="/images/training/speaking-wide-2.png" alt="" className="h-full w-full object-cover opacity-[0.12] mix-blend-lighten" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1549CD] via-[#1549CD]/50 to-transparent" />
        </div>
        <div className="oci-grid-lines-light" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>FLAGSHIP PROGRAM / 8 WEEKS</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-4xl">
            AI Creative
            <br />
            Transformation.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            You&apos;ve seen what AI does for one person. This is what it does
            for a whole operation. Eight weeks. Custom workflows. Role-specific
            training. Governance policy. Ongoing support.
          </p>
          <p className="mt-4 text-sm font-light tracking-tight text-white/80">
            From $50,000
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8">
                <span>THE PROBLEM</span>
                <span>[NC.1]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                You&apos;ve done some training. Nothing changed.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                A few people attended a workshop. Someone got good at prompting.
                By Monday they were back to their old workflows. Output looks the
                same. Leadership isn&apos;t convinced. The operation hasn&apos;t
                moved.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                That&apos;s not a skills problem. It&apos;s an implementation
                problem.
              </p>
            </div>
            <div>
              <div className="oci-section-label mb-8">
                <span>THE SOLUTION</span>
                <span>[NC.2]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Implementation, not just instruction.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                Over 8 weeks, we don&apos;t teach tools and leave. We build the
                operating model: custom workflows for your specific production
                setup, role-specific tracks for every function, a governance
                policy your team actually uses, and ongoing support to keep
                it compounding.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                This is what we delivered to Cash App, Maesa, and Herman Scheer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum — dark */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12 border-white/20 text-white/40">
            <span>CURRICULUM</span>
            <span>[NC.3]</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight">8 weeks. 4 phases.</h2>

          <div className="mt-12 grid gap-px bg-white/10 lg:grid-cols-2">
            {curriculum.map((phase) => (
              <div key={phase.week} className="bg-foreground p-8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-white/30">
                  Weeks {phase.week}
                </p>
                <h3 className="mt-4 text-lg font-light">{phase.title}</h3>
                <ul className="mt-6 space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/50">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-white/30" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid CTA */}
      <section className="py-12 lg:py-16 border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-light tracking-tight">From $50,000</p>
              <p className="mt-2 text-sm text-foreground/60">
                30 minutes. We&apos;ll tell you straight whether we&apos;re the right fit.
              </p>
            </div>
            <Link
              href="/book"
              className="shrink-0 bg-[#1549CD] px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#0e38a8]"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included + Results */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-12">
                <span>WHAT&apos;S INCLUDED</span>
                <span>[NC.4]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Everything to change how your operation runs.
              </h2>
              <ul className="mt-8 space-y-4">
                {included.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#1549CD]/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="oci-section-label mb-12">
                <span>THE RESULTS</span>
                <span>[NC.5]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                What this looks like in practice.
              </h2>
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-sm font-medium">Cash App</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    Production time cut to 10%. $3.5M in estimated year-one savings. Team production-ready by halfway through the program.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Maesa</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    New brand launched into every Target store. 3 months instead of 9. $280K saved on a single launch. Now rolling out across 12+ brands.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Herman Scheer</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    Zero to full AI production. $4.5M in estimated year-one savings. Now offering new profitable AI services to their own clients.
                  </p>
                </div>
                <Link href="/case-studies" className="mt-4 inline-block text-sm text-[#1549CD] hover:underline">
                  Read the case studies &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment — dark */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8 border-white/20 text-white/40">
                <span>INVESTMENT</span>
                <span>[NC.6]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                From $50,000
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-white/50">
                Scoped to your team size, structure, and production needs.
                Confirmed on your discovery call with Jeremy.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-white/50">
                This isn&apos;t a course. It&apos;s a bespoke operational
                engagement. The price reflects that.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <div className="border border-white/10 p-8">
                <Link
                  href="/book"
                  className="mt-8 block w-full border border-white/20 px-8 py-4 text-center text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-foreground"
                >
                  Book a Discovery Call
                </Link>
                <p className="mt-4 text-sm text-white/40 text-center">
                  30 minutes. We&apos;ll tell you straight whether we&apos;re the right fit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12">
            <span>WHO THIS IS FOR</span>
            <span>[NC.7]</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight max-w-3xl">
            Built for creative teams that ship real work.
          </h2>
          <div className="mt-12 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "In-House Creative Teams",
                description: "Brand teams at companies that want to produce more without growing headcount.",
              },
              {
                title: "Creative Agencies",
                description: "Agencies that need to deliver faster, expand capabilities, and stay ahead of what clients are starting to demand.",
              },
              {
                title: "Production Studios",
                description: "Studios that want AI-augmented workflows for photo, video, and campaign production.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#E8E6E0] p-8">
                <h3 className="text-[11px] uppercase tracking-[0.15em] font-medium">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-3xl">
            The teams that move first win.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            We take on a limited number of Transformation clients each quarter.
          </p>
          <Link
            href="/book"
            className="mt-10 inline-block border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </>
  );
}
