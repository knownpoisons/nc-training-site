import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "NotContent Training is led by Jeremy Somers. 15+ years as a creative director. Career includes Nike, Apple, Pepsi, Spotify. Founded one of the first AI-assisted creative agencies.",
};

const press = [
  {
    outlet: "Mumbrella / Unmade",
    title:
      "AI agency founder Jeremy Somers on the disruption ahead",
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

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            About
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-4xl">
            We&apos;ve done the work. Now we teach it.
          </h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            NotContent isn&apos;t a training consultancy that read a book about
            AI. We built one of the first AI-assisted creative agencies —
            figuring out how to execute real campaigns for real brands before
            most agencies knew what Midjourney was. We teach what we&apos;ve
            shipped, at scale, for clients who couldn&apos;t afford for it not
            to work.
          </p>
        </div>
      </section>

      {/* Jeremy */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Your Trainer
              </p>
              <h2 className="nc-heading-lg mt-4">Jeremy Somers</h2>
              <p className="nc-body mt-6">
                Jeremy spent 15 years as a creative director — Nike, Apple,
                Pepsi, Spotify, Mercedes-Benz — and watched the creative
                industry change faster in the last three years than it did in
                the previous fifteen. So he stopped working for agencies and
                built one that ran on AI from day one.
              </p>
              <p className="nc-body mt-4">
                NotContent was one of the first AI-assisted creative agencies —
                producing real campaigns for real brands before most of the
                industry caught on. The agency delivers 2× content output in
                half the time. Work has appeared across 11,473+ retail
                locations. None of it was possible without figuring out, the
                hard way, what actually works.
              </p>
              <p className="nc-body mt-4">
                That operational knowledge — what works at production scale,
                what doesn&apos;t, and why — is what the training programs are
                built on. He&apos;s trained enterprise teams at Cash App, Herman
                Scheer, and Maesa. Not taught slides. Transformed operations.
              </p>

              <div className="mt-8">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Brand experience
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
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

            <div className="flex items-start justify-center">
              {/* Photo placeholder */}
              <div className="flex aspect-[3/4] w-full max-w-md items-center justify-center bg-muted">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Jeremy&apos;s photo here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Difference */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-background/60">
            Why NotContent
          </p>
          <h2 className="nc-heading-lg mt-4 max-w-3xl">
            Most AI trainers teach tools. We teach production.
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-background/20 p-8">
              <h3 className="text-sm font-medium uppercase tracking-widest">
                Earned in the Field
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-background/60">
                Everything we teach has been production-tested on real campaigns
                for real clients. Your team learns what actually works — not
                what sounds good in a seminar.
              </p>
            </div>
            <div className="border border-background/20 p-8">
              <h3 className="text-sm font-medium uppercase tracking-widest">
                Built to Outlast the Tools
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-background/60">
                Tools change every month. The Diverge/Converge/Systemize
                methodology is tool-agnostic — so when Midjourney changes (and
                it will), your team knows exactly how to adapt.
              </p>
            </div>
            <div className="border border-background/20 p-8">
              <h3 className="text-sm font-medium uppercase tracking-widest">
                Taste Stays in the Room
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-background/60">
                We train teams to use AI as a force multiplier for human
                creativity — not a replacement for it. Speed without taste
                produces mediocrity at scale. We don&apos;t teach that.
              </p>
            </div>
            <div className="border border-background/20 p-8">
              <h3 className="text-sm font-medium uppercase tracking-widest">
                Your Brand, Not a Generic Exercise
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-background/60">
                Every program is built around your brand assets, your style
                guides, your production needs. By the end, your team has
                workflows that work for <em>your</em> operation specifically.
              </p>
            </div>
            <div className="border border-background/20 p-8">
              <h3 className="text-sm font-medium uppercase tracking-widest">
                We Don&apos;t Disappear After Week 8
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-background/60">
                Monthly maintenance calls keep your team current as AI evolves.
                Most training fades within 60 days. Ours compounds — because
                we&apos;re still there when it matters.
              </p>
            </div>
            <div className="border border-background/20 p-8">
              <h3 className="text-sm font-medium uppercase tracking-widest">
                The Numbers Are Real
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-background/60">
                Maesa saved $280K on a single brand launch. Cash App went 10x
                on campaign velocity. We run before/after benchmarks on every
                program — so you can see exactly what changed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Featured In
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {press.map((item) => (
              <a
                key={item.outlet}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-foreground/10 p-6 transition-colors hover:bg-foreground hover:text-background"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-background/60">
                  {item.outlet}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {item.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nc-divider nc-section">
        <div className="nc-container text-center">
          <h2 className="nc-heading-lg mx-auto max-w-3xl">
            If this is the kind of training you&apos;ve been looking for,
            let&apos;s talk.
          </h2>
          <p className="nc-body-lg mx-auto mt-6 max-w-xl">
            Start with a 30-minute call. Jeremy will map your
            team&apos;s current state, identify where AI would have the highest
            impact, and recommend the right program. No obligation.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-10 cursor-pointer text-sm uppercase tracking-widest"
          >
            <Link href="/book">Book a Call</Link>
          </Button>
          <p className="mt-6 text-sm text-muted-foreground">
            Not sure which program fits?{" "}
            <Link
              href="/assess"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70"
            >
              Take the 2-min Scorecard →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
