import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "NotContent Training is led by Jeremy Somers. 15+ years as a creative director. Career includes Nike, Apple, Pepsi, Spotify. Founded one of the first AI-assisted creative agencies.",
};

const press = [
  {
    outlet: "Mumbrella / Unmade",
    title: "AI agency founder Jeremy Somers on the disruption ahead",
    href: "https://www.unmade.media/p/i-dont-even-think-were-at-the-early",
  },
  {
    outlet: "The ChatGPT Experiment",
    title: "Taking Agency Creative To A New Level",
    href: "https://www.iheart.com/podcast/263-the-chatgpt-experiment-132648455/episode/ep-42-taking-agency-creative-to-225321064/",
  },
  {
    outlet: "CanvasRebel",
    title: "Meet Jeremy Somers",
    href: "https://canvasrebel.com/meet-jeremy-somers/",
  },
  {
    outlet: "The Neuron",
    title: "Featured AI creative studio",
    href: "https://www.theneurondaily.com/p/revealed-use-ai-neuron",
  },
];

const brandExperience = [
  "Nike",
  "Apple",
  "Pepsi",
  "Spotify",
  "Mercedes-Benz",
  "Adidas",
  "Google",
  "Tommy Hilfiger",
];

const differentiators = [
  {
    title: "Earned in the Field",
    description:
      "Everything we teach has been production-tested on real campaigns for real clients. Your team learns what actually works — not what sounds good in a seminar.",
  },
  {
    title: "Built to Outlast the Tools",
    description:
      "Tools change every month. The Diverge/Converge/Systemize methodology is tool-agnostic — so when Midjourney changes (and it will), your team knows exactly how to adapt.",
  },
  {
    title: "Taste Stays in the Room",
    description:
      "We train teams to use AI as a force multiplier for human creativity — not a replacement for it. Speed without taste produces mediocrity at scale. We don\u2019t teach that.",
  },
  {
    title: "Your Brand, Not a Generic Exercise",
    description:
      "Every program is built around your brand assets, your style guides, your production needs. By the end, your team has workflows that work for your operation specifically.",
  },
  {
    title: "We Don\u2019t Disappear After Week 8",
    description:
      "Monthly maintenance calls keep your team current as AI evolves. Most training fades within 60 days. Ours compounds — because we\u2019re still there when it matters.",
  },
  {
    title: "The Numbers Are Real",
    description:
      "Maesa saved $280K on a single brand launch. Cash App went 10x on campaign velocity. We run before/after benchmarks on every program — so you can see exactly what changed.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/training/speaking-wide-2.png"
            alt=""
            className="h-full w-full object-cover opacity-[0.12] mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1549CD] via-[#1549CD]/50 to-transparent" />
        </div>
        <div className="oci-grid-lines-light" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8">
            <span>ABOUT</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-4xl">
            We&apos;ve done the work.
            <br />
            Now we teach it.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            NotContent isn&apos;t a training consultancy that read a book about
            AI. We built one of the first AI-assisted creative agencies —
            figuring out how to execute real campaigns for real brands before
            most agencies knew what Midjourney was.
          </p>
        </div>
      </section>

      {/* Jeremy */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12">
            <span>YOUR TRAINER</span>
            <span>[NC.1]</span>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="oci-display-sm">Jeremy Somers</h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                Jeremy spent 15 years as a creative director — Nike, Apple,
                Pepsi, Spotify, Mercedes-Benz — and watched the creative
                industry change faster in the last three years than it did in
                the previous fifteen. So he stopped working for agencies and
                built one that ran on AI from day one.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                NotContent was one of the first AI-assisted creative agencies —
                producing real campaigns for real brands before most of the
                industry caught on. The agency delivers 2× content output in
                half the time. Work has appeared across 11,473+ retail
                locations. None of it was possible without figuring out, the
                hard way, what actually works.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                That operational knowledge — what works at production scale,
                what doesn&apos;t, and why — is what the training programs are
                built on. He&apos;s trained enterprise teams at Cash App, Herman
                Scheer, and Maesa. Not taught slides. Transformed operations.
              </p>
            </div>
            <div>
              <img
                src="/images/jeremy-somers.jpg"
                alt="Jeremy Somers"
                className="aspect-[3/4] w-full object-cover border border-foreground/10"
              />
            </div>
          </div>

          {/* Training in action */}
          <div className="mt-12">
            <img
              src="/images/training/speaking-wide-4.png"
              alt="Jeremy Somers leading a training session"
              className="w-full aspect-[21/9] object-cover border border-foreground/10"
            />
          </div>

          {/* Brand experience */}
          <div className="mt-12 border-t border-foreground/10 pt-8">
            <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40 mb-4">
              Brand Experience
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {brandExperience.map((brand) => (
                <span
                  key={brand}
                  className="text-sm text-foreground/60"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators — cobalt bg */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12 border-white/20 text-white/40">
            <span>WHY NOTCONTENT</span>
            <span>[NC.2]</span>
          </div>
          <h2 className="oci-display-sm max-w-3xl">
            Most AI trainers teach tools.
            <br />
            We teach production.
          </h2>
          <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((diff) => (
              <div key={diff.title} className="bg-foreground p-8">
                <h3 className="text-[11px] uppercase tracking-[0.15em] text-white/80">
                  {diff.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  {diff.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12">
            <span>FEATURED IN</span>
            <span>[NC.3]</span>
          </div>
          <div className="grid gap-px bg-foreground/10 sm:grid-cols-2">
            {press.map((item) => (
              <a
                key={item.outlet}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#E8E6E0] p-8 transition-colors hover:bg-[#1549CD] hover:text-white"
              >
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40 group-hover:text-white/50">
                  {item.outlet}
                </p>
                <p className="mt-3 text-sm font-medium group-hover:text-white">
                  {item.title} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-3xl">
            If this is the kind of training you&apos;ve been looking for, let&apos;s talk.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            Start with a 30-minute call. Jeremy will map your team&apos;s current
            state, identify where AI would have the highest impact, and recommend
            the right program. No obligation.
          </p>
          <Link
            href="/book"
            className="mt-10 inline-block border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
          >
            Book a Call
          </Link>
        </div>
      </section>
    </>
  );
}
