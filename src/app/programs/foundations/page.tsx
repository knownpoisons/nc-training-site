import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Creative Foundations | Half-Day Workshop",
  description:
    "Get your creative team aligned on AI tools and the NotContent methodology in a single half-day session. Up to 25 people. From $5,000.",
};

const whatYouGet = [
  "NotContent Methodology overview — Diverge, Converge, Systemize",
  "Live tool demonstrations using your team's actual brand assets",
  "Hands-on exercises (everyone leaves having made something)",
  "The Stop Rule: knowing when to explore vs. when to execute",
  "AI Ethics & Governance starter kit (approved tools, disclosure standards)",
  "Post-workshop resource pack with prompt templates and workflow guides",
];

const whoItsFor = [
  {
    title: "Teams that haven't aligned yet",
    description:
      "You know AI is important but different people have different tools, different opinions, and no shared language. One session gets everyone to the same starting line.",
  },
  {
    title: "Leaders who need to build the case",
    description:
      "Leadership hasn't fully committed. Use Foundations to produce real output with real brand assets — it tends to be more convincing than any deck you could build.",
  },
  {
    title: "Agencies entering the AI conversation",
    description:
      "Clients are asking about AI capability. This workshop gives your team enough to answer with confidence — and often becomes the starting point for a client training proposal.",
  },
];

export default function FoundationsPage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>PROGRAM 01 / ENTRY POINT</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-4xl">
            AI Creative
            <br />
            Foundations.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            Not ready to commit to a full program? Not sure where to even start?
            This is the right move. Half a day. Your whole team in the room.
            Everyone leaves having made real work with their own brand assets.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/book"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Book This Workshop
            </Link>
            <p className="text-sm text-white/40">
              From $5,000 · Up to 25 people · Half-day
            </p>
          </div>
        </div>
      </section>

      {/* Format */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12">
            <span>THE FORMAT</span>
            <span>[NC.1]</span>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Four hours. Your brand. Real output.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                Most AI workshops are someone talking at a screen. This is
                different. First half: the framework — why most teams get AI
                wrong and what to do instead. Second half: your team generates
                actual work using your own brand assets, style guides, and
                campaign briefs.
              </p>
            </div>
            <div className="space-y-6">
              <div className="border-l-2 border-[#1549CD] pl-6">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">Hour 1-2</p>
                <h3 className="mt-2 text-lg font-light">Framework & Philosophy</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  The NotContent Method. Why most teams get AI wrong. The
                  Diverge/Converge model. The Stop Rule. Tool ecosystem overview.
                </p>
              </div>
              <div className="border-l-2 border-[#1549CD] pl-6">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">Hour 3-4</p>
                <h3 className="mt-2 text-lg font-light">Hands-On Production</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  Live prompt engineering. Style references. Combinatorial
                  batching. Using your actual assets. Leaving with real output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's included — dark */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12 border-white/20 text-white/40">
            <span>WHAT&apos;S INCLUDED</span>
            <span>[NC.2]</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight">Everything in a half-day.</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {whatYouGet.map((item) => (
              <li key={item} className="flex gap-4 text-sm leading-relaxed text-white/60">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-white/30" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-3">
            {[
              { title: "In-Person", desc: "We come to your office. Maximum energy, maximum output." },
              { title: "Virtual", desc: "Zoom + shared workspace. Works well for remote teams." },
              { title: "Hybrid", desc: "Some in-room, some remote. It works if your tech is solid." },
            ].map((fmt) => (
              <div key={fmt.title} className="bg-foreground p-8">
                <h3 className="text-[11px] uppercase tracking-[0.15em] text-white/80">{fmt.title}</h3>
                <p className="mt-3 text-sm text-white/50">{fmt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12">
            <span>WHO THIS IS FOR</span>
            <span>[NC.3]</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight max-w-2xl">
            The right start for three kinds of teams.
          </h2>
          <div className="mt-12 grid gap-px bg-foreground/10 lg:grid-cols-3">
            {whoItsFor.map((item) => (
              <div key={item.title} className="bg-[#E8E6E0] p-8">
                <h3 className="text-[11px] uppercase tracking-[0.15em] font-medium">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scorecard callout */}
      <section className="py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 border border-foreground/10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div>
              <p className="text-lg font-light tracking-tight">Not sure where to start?</p>
              <p className="mt-2 text-sm text-foreground/60">
                The scorecard matches your team&apos;s current AI maturity to the right program — in 5 minutes.
              </p>
            </div>
            <Link
              href="/assess"
              className="shrink-0 border border-foreground/20 px-8 py-3 text-[11px] uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-white"
            >
              Take the Scorecard →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-2xl">
            Foundations is the start, not the finish.
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/book"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Book This Workshop
            </Link>
            <Link
              href="/programs/transformation"
              className="px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white"
            >
              See Full Transformation →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
