import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Creative Accelerator | 4-Week Sprint",
  description:
    "Four weeks. Your team ships real AI-assisted work by week two. Hands-on training with custom prompt libraries, Slack support, and a certification. From $15,000.",
};

const weeks = [
  {
    week: "01",
    title: "Audit & Setup",
    description:
      "We map your current workflow bottlenecks and tool gaps. Everyone gets set up identically — no more 'it works on my machine.' By the end of week one, your team starts from the same place for the first time.",
    deliverable: "AI workflow audit report + tool ecosystem configured",
  },
  {
    week: "02",
    title: "Divergence Mastery",
    description:
      "Your Creative Director gets 50 concept directions in a morning instead of 5 in a day. Midjourney as a visual sparring partner, not a vending machine — style refs, image refs, combinatorial batching.",
    deliverable: "Custom prompt library built around your brand",
  },
  {
    week: "03",
    title: "Convergence & Production",
    description:
      "Shift from exploration to execution. Production-grade precision tools. Brand asset integration into AI scenes. Video transformation and extension workflows.",
    deliverable: "Production workflow documented for at least 2 use cases",
  },
  {
    week: "04",
    title: "Systemize & Ship",
    description:
      "Lock in what works. Build repeatable processes your whole team runs. AI governance basics — approved tools, data protocols, client disclosure standards.",
    deliverable: "Documented workflows + governance policy starter + certificate",
  },
];

const included = [
  "4x 2-hour live sessions with Jeremy Somers",
  "Dedicated Slack channel for async Q&A throughout",
  "Custom prompt library built around your brand's style and assets",
  "1x 1-on-1 strategy session with Jeremy",
  "Recorded sessions (watch back anytime)",
  "AI Governance Policy starter document",
  "Before/After workflow comparison",
  "NotContent AI Creative Accelerator Certificate",
];

export default function AcceleratorPage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img src="/images/training/speaking-wide-1.png" alt="" className="h-full w-full object-cover opacity-[0.12] mix-blend-lighten" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1549CD] via-[#1549CD]/50 to-transparent" />
        </div>
        <div className="oci-grid-lines-light" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>PROGRAM 02 / GROWTH</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-4xl">
            AI Creative
            <br />
            Accelerator.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            For teams that have tried AI and know it&apos;s not sticking yet.
            Four weeks. One live session per week, plus async Slack support.
            Your whole team ships real AI-assisted work by week two.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/book"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Book a Discovery Call
            </Link>
            <p className="text-sm text-white/40">
              From $15,000 · Up to 15 people · 4 weeks
            </p>
          </div>
        </div>
      </section>

      {/* Problem / Fix */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8">
                <span>THE PROBLEM</span>
                <span>[NC.1]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Your team has tried AI. It&apos;s not sticking.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                A few people experiment with Midjourney. Someone figures out
                ChatGPT for briefs. But it&apos;s fragmented — no shared
                methodology, no quality standard, no system. Output is
                inconsistent. Leadership isn&apos;t convinced.
              </p>
            </div>
            <div>
              <div className="oci-section-label mb-8">
                <span>THE FIX</span>
                <span>[NC.2]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                A shared system that survives Monday morning.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                The Accelerator builds a common language, workflow, and quality
                bar across your whole team. By week two everyone&apos;s
                producing. By week four it&apos;s embedded in how they work.
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
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
            Four weeks. One deliverable each.
          </h2>
          <div className="mt-12 space-y-0">
            {weeks.map((week, i) => (
              <div
                key={week.week}
                className={`grid gap-8 py-10 lg:grid-cols-[80px_1fr_1fr] ${i < weeks.length - 1 ? "border-b border-white/10" : ""}`}
              >
                <div>
                  <p className="text-4xl font-light text-white/20">{week.week}</p>
                </div>
                <div>
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.15em]">{week.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/50">{week.description}</p>
                </div>
                <div className="border border-white/10 p-6">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/30">Deliverable</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{week.deliverable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included + pricing */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-12">
                <span>WHAT&apos;S INCLUDED</span>
                <span>[NC.4]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Everything to go from stuck to shipping.
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
            <div className="space-y-6">
              <div className="border border-foreground/10 p-8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">Investment</p>
                <p className="mt-4 text-3xl font-light tracking-tight">From $15,000</p>
                <p className="mt-2 text-sm text-foreground/60">
                  Flat fee, up to 15 people. Scoped on your call with Jeremy.
                </p>
                <p className="mt-3 text-xs text-[#1549CD]/70">
                  Cash App&apos;s team was production-ready by halfway through.
                </p>
                <Link
                  href="/book"
                  className="mt-8 block w-full bg-[#1549CD] px-8 py-4 text-center text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#0e38a8]"
                >
                  Book a Discovery Call
                </Link>
                <p className="mt-4 text-xs text-foreground/40 text-center">
                  30 minutes. No pitch. Just clarity on fit.
                </p>
              </div>
              <div className="border border-foreground/10 p-8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                  Want to go deeper?
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                  The Accelerator covers the essentials. The Transformation
                  program adds a 2-day in-person intensive, role-specific tracks,
                  custom workflow buildout, governance policy, and ongoing support.
                </p>
                <Link
                  href="/programs/transformation"
                  className="mt-4 inline-block text-[11px] uppercase tracking-[0.15em] underline underline-offset-4"
                >
                  See the Transformation Program →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scorecard callout */}
      <section className="py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 border border-foreground/10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div>
              <p className="text-lg font-light tracking-tight">Is your team ready for this?</p>
              <p className="mt-2 text-sm text-foreground/60">
                Find out where you sit and whether the Accelerator is the right level.
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
      <section className="py-16 lg:py-24 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-2xl">
            Four weeks from now, AI isn&apos;t something your team should be doing. It&apos;s something they do.
          </h2>
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
