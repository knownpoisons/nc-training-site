import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Program 01 / Entry Point
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-4xl">
            AI Creative Foundations.
          </h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            Not ready to commit to a full program? Not sure where to even start?
            This is the right move. Half a day. Your whole team in the room.
            Everyone leaves having made real work with their own brand assets —
            and a clear picture of what AI actually means for how you operate.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button
              asChild
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book This Workshop</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              From $5,000 · Up to 25 people · Half-day
            </p>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Comparing programs?{" "}
            <Link
              href="/assess"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70"
            >
              Take the 2-min Scorecard →
            </Link>
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Format
              </p>
              <h2 className="nc-heading-lg mt-4">
                Four hours. Your brand. Real output.
              </h2>
              <p className="nc-body mt-6">
                Most AI workshops are someone talking at a screen. This is
                different. First half: the framework — why most teams get AI
                wrong and what to do instead. Second half: your team generates
                actual work using your own brand assets, style guides, and
                campaign briefs.
              </p>
              <p className="nc-body mt-4">
                By the end, every participant has made something real. Everyone
                understands the Diverge/Converge split. And the whole team
                leaves knowing exactly what to do Monday morning — together.
              </p>
            </div>
            <div className="space-y-6">
              <div className="border-l-2 border-foreground pl-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Hour 1-2
                </p>
                <h3 className="nc-heading-md mt-2">Framework & Philosophy</h3>
                <p className="nc-body mt-2">
                  The NotContent Method. Why most teams get AI wrong. The
                  Diverge/Converge model. The Stop Rule. Tool ecosystem overview.
                </p>
              </div>
              <div className="border-l-2 border-foreground pl-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Hour 3-4
                </p>
                <h3 className="nc-heading-md mt-2">Hands-On Production</h3>
                <p className="nc-body mt-2">
                  Live prompt engineering. Style references. Combinatorial
                  batching. Using your actual assets. Leaving with real output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-background/60">
            What&apos;s Included
          </p>
          <h2 className="nc-heading-lg mt-4">Everything in a half-day.</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {whatYouGet.map((item) => (
              <li key={item} className="flex gap-4 text-sm leading-relaxed text-background/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-background/40" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 border border-background/20 p-8">
            <p className="text-xs uppercase tracking-widest text-background/60">
              Available formats
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest">In-Person</h3>
                <p className="mt-2 text-sm text-background/60">We come to your office. Maximum energy, maximum output. Preferred for teams of 10+.</p>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest">Virtual</h3>
                <p className="mt-2 text-sm text-background/60">Zoom + shared workspace. Works well for remote teams or mixed locations.</p>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest">Hybrid</h3>
                <p className="mt-2 text-sm text-background/60">Some in-room, some remote. We've done it — it works if your tech setup is solid.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Who This Is For
          </p>
          <h2 className="nc-heading-lg mt-4 max-w-2xl">
            The right start for three kinds of teams.
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {whoItsFor.map((item) => (
              <div key={item.title} className="border border-foreground/10 p-8">
                <h3 className="nc-heading-md">{item.title}</h3>
                <p className="nc-body mt-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Path forward */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            What Comes Next
          </p>
          <h2 className="nc-heading-lg mt-4 max-w-2xl">
            Foundations is the start, not the finish.
          </h2>
          <p className="nc-body mt-6 max-w-xl">
            Most teams who do Foundations want to go further — usually within
            60 days. Half a day is enough to see what&apos;s possible, and
            what&apos;s possible tends to make the next investment obvious.
            When you&apos;re ready, the Accelerator and Transformation are the
            natural next steps.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book This Workshop</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/programs/transformation">
                See the Full Transformation Program
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
