import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { HeroPattern } from "@/components/hero-pattern";
import { ServiceIcon } from "@/components/service-icon";

const clients = [
  "Adidas",
  "Google",
  "Tommy Hilfiger",
  "Cash App",
  "Fine'ry",
  "Maesa",
  "SuperGoop",
  "Fazit Beauty",
  "Target",
];

const stats = [
  { value: "90%", label: "Reduction in production time" },
  { value: "$8M+", label: "Combined estimated client savings" },
  { value: "$280K", label: "Saved on a single brand launch" },
  { value: "3", label: "Enterprise teams transformed" },
];

const programs = [
  {
    name: "Foundations",
    duration: "Half-day workshop",
    description:
      "Align your whole team on AI tools, workflows, and a shared methodology in a single session. Everyone in the room. Everyone at the same level. Everyone with the same language.",
    ideal: "Teams starting the journey together",
    href: "/programs/foundations",
    icon: "team" as const,
  },
  {
    name: "Accelerator",
    duration: "4-week sprint",
    description:
      "Intensive, hands-on training for your whole team. Everyone ships real AI-assisted work by week two — not just the one person who already figured out Midjourney.",
    ideal: "Teams ready to implement together",
    href: "/programs/accelerator",
    icon: "speed" as const,
  },
  {
    name: "Transformation",
    duration: "8-week program",
    description:
      "Full operational transformation. Custom workflows, governance, and role-specific training across your entire team. The whole operation changes — not just the individuals in it.",
    ideal: "Teams going all-in on AI creative",
    href: "/programs/transformation",
    icon: "workflow" as const,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="nc-section relative pt-32 lg:pt-40">
        <HeroPattern variant="grid" />
        <div className="nc-container relative">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              AI Creative Training
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="nc-heading-xl mt-4 max-w-4xl">
              The biggest shift in creative work — for your whole team, together.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="nc-body-lg mt-6 max-w-2xl">
              Most creative teams have one or two people who figured out AI. The rest
              are watching and waiting — and every week that gap compounds. The teams
              that figure this out <em>together</em> will produce work that makes
              everyone else look like they&apos;re standing still.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="cursor-pointer text-sm uppercase tracking-widest"
              >
                <Link href="/book">Book a Call</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="cursor-pointer text-sm uppercase tracking-widest"
              >
                <Link href="/programs/transformation">View Programs</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-6 text-xs text-muted-foreground">
              Led by Jeremy Somers — Creative Director · Nike · Apple · Spotify · Pepsi
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Not sure which program fits?{" "}
              <Link
                href="/assess"
                className="nc-underline-grow font-medium text-foreground transition-colors hover:text-foreground/70"
              >
                Take the 2-min Scorecard →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Client Logos — Auto-scrolling marquee */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Trusted by teams at
            </p>
          </Reveal>
          <div className="mt-8 overflow-hidden">
            <div className="animate-marquee-slow flex w-max gap-x-12">
              {/* Double the list for seamless loop */}
              {[...clients, ...clients].map((client, i) => (
                <span
                  key={`${client}-${i}`}
                  className="shrink-0 text-lg font-light tracking-tight text-foreground/60"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The whole-team argument */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <Reveal>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Why it matters
                </p>
                <h2 className="nc-heading-lg mt-4">
                  One person learning AI doesn&apos;t change how a team works.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="nc-body mt-6 text-muted-foreground">
                  It creates a two-speed operation. The AI champion does more,
                  faster. Everyone else waits. Output becomes inconsistent.
                  Resentment builds quietly. And you — the person responsible for
                  the team — are the one watching it happen.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="nc-body mt-4 text-muted-foreground">
                  The shift that matters happens when the whole team moves together —
                  same methodology, same language, same standard. That&apos;s when
                  the operation changes. That&apos;s when the results show up in
                  the numbers.
                </p>
              </Reveal>
            </div>
            <Reveal delay={150} direction="right">
              <div className="space-y-0">
                {[
                  {
                    before: "One person learns AI",
                    after: "The whole team trains together",
                  },
                  {
                    before: "Inconsistent quality and output",
                    after: "A shared standard everyone holds",
                  },
                  {
                    before: "Experimental, individual workflows",
                    after: "Documented, repeatable processes",
                  },
                  {
                    before: "AI champion + everyone else",
                    after: "A team that operates at the frontier",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 border-b border-foreground/10 py-5"
                  >
                    <p className="text-sm text-muted-foreground line-through decoration-foreground/20">
                      {row.before}
                    </p>
                    <p className="text-sm font-medium pl-6 border-l border-foreground/10">
                      {row.after}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats — with animated counters */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div>
                  <p className="text-4xl font-medium tracking-tight lg:text-5xl">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="mt-2 text-sm text-background/60">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              How It Works
            </p>
            <h2 className="nc-heading-lg mt-4 max-w-3xl">
              Three steps. No obligation until step three.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Book a free call with Jeremy",
                body: "30 minutes with Jeremy. We map your team's current state, where AI would have the highest impact, and which program is the right fit.",
              },
              {
                n: "02",
                title: "Get a custom proposal",
                body: "Scoped to your team size, goals, and timeline. Not a generic package — a specific program built around what you actually need.",
              },
              {
                n: "03",
                title: "Your team trains together",
                body: "Everyone in the room. Same methodology, same quality bar. Real AI-assisted work by week two — not at the end, halfway through.",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 120}>
                <div>
                  <p className="text-4xl font-light text-foreground/20">{step.n}</p>
                  <h3 className="nc-heading-md mt-4">{step.title}</h3>
                  <p className="nc-body mt-4 text-muted-foreground">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programs — with icons and hover micro-interactions */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Programs
            </p>
            <h2 className="nc-heading-lg mt-4 max-w-3xl">
              Three formats. One goal: your whole team at the frontier.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {programs.map((program, i) => (
              <Reveal key={program.name} delay={i * 100}>
                <Link
                  href={program.href}
                  className="nc-card-hover group block border border-foreground/10 p-8 transition-colors hover:bg-foreground hover:text-background"
                >
                  <ServiceIcon
                    icon={program.icon}
                    className="mb-6 opacity-40 transition-opacity group-hover:opacity-70"
                  />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-background/60">
                    {program.duration}
                  </p>
                  <h3 className="nc-heading-md mt-4">{program.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground group-hover:text-background/60">
                    {program.description}
                  </p>
                  <p className="mt-6 text-xs uppercase tracking-widest">
                    Best for: {program.ideal}
                  </p>
                  <span className="mt-6 inline-block text-xs uppercase tracking-widest underline underline-offset-4">
                    Learn more
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Teaser — with icons */}
      <section id="methodology" className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  The NotContent Method
                </p>
                <h2 className="nc-heading-lg mt-4">
                  Diverge. Converge. Systemize.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="nc-body mt-6">
                  AI is a creative force multiplier, not a replacement engine. Our
                  methodology separates exploration from execution, ensuring speed
                  never compromises taste.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="nc-body mt-4 text-muted-foreground">
                  When a whole team learns the same framework, the gains compound.
                  Everyone explores smarter, executes cleaner, and builds
                  on each other&apos;s work instead of reinventing it.
                </p>
              </Reveal>
            </div>
            <div className="space-y-8">
              {[
                { icon: "diverge" as const, n: "01", name: "Diverge", desc: "Use AI for volume, surprise, and style discovery. Midjourney as your visual sparring partner." },
                { icon: "converge" as const, n: "02", name: "Converge", desc: "Lock in direction. Switch to precision tools for production-grade, brand-aligned execution." },
                { icon: "systemize" as const, n: "03", name: "Systemize", desc: "Encode your best workflows into repeatable processes. Make AI output predictable and scalable." },
              ].map((phase, i) => (
                <Reveal key={phase.n} delay={i * 120} direction="right">
                  <div className="flex gap-6 border-l-2 border-foreground pl-6">
                    <ServiceIcon icon={phase.icon} size={32} className="shrink-0 mt-0.5 opacity-50" />
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-widest">
                        {phase.n} / {phase.name}
                      </h3>
                      <p className="nc-body mt-2">{phase.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results / Case Studies */}
      <section
        id="results"
        className="nc-divider nc-section bg-foreground text-background"
      >
        <div className="nc-container">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-background/60">
              Results
            </p>
            <h2 className="nc-heading-lg mt-4">
              Real teams. Measurable transformation.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[
              {
                href: "/results/cash-app",
                industry: "Fintech / Enterprise",
                name: "Cash App",
                desc: "Production time cut to 10%. $3.5M in estimated year-one savings. Team production-ready by halfway through the training.",
                stat: "90%",
                statLabel: "Reduction in production time",
              },
              {
                href: "/results/herman-scheer",
                industry: "Brand Agency / LA",
                name: "Herman Scheer",
                desc: "Zero to full AI production. $4.5M in estimated year-one savings. Now offering new profitable AI services to clients.",
                stat: "$4.5M",
                statLabel: "Estimated year-one savings",
              },
              {
                href: "/results/maesa",
                industry: "Beauty / CPG",
                name: "Maesa",
                desc: "New brand launched into every Target store. 3 months instead of 9. $280K saved on a single launch.",
                stat: "$280K",
                statLabel: "Saved on a single brand launch",
              },
            ].map((study, i) => (
              <Reveal key={study.name} delay={i * 100}>
                <Link
                  href={study.href}
                  className="nc-glow-hover group block border border-background/20 p-8 transition-colors hover:border-background/40"
                >
                  <p className="text-xs uppercase tracking-widest text-background/60">
                    {study.industry}
                  </p>
                  <h3 className="nc-heading-md mt-4">{study.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-background/60">
                    {study.desc}
                  </p>
                  <p className="mt-6 text-2xl font-medium">
                    <AnimatedCounter value={study.stat} />
                  </p>
                  <p className="text-xs text-background/60">
                    {study.statLabel}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-widest text-[#1549CD] transition-colors group-hover:text-[#1549CD]/80">
                    Read case study →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial — Pull-quote style */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <Reveal>
            <div className="mx-auto max-w-4xl py-8 lg:py-16">
              <div className="nc-pull-quote">
                <p className="text-2xl font-light leading-relaxed tracking-tight sm:text-3xl lg:text-4xl">
                  &ldquo;Jeremy and NotContent will save us tens of millions of
                  dollars in the next year alone.&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-foreground/10" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Oshyia Savur, VP Marketing, Maesa — on stage at a national
                  beauty conference
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Video Section — placeholder for Loom/recorded video */}
      <section className="nc-divider nc-section bg-foreground/[0.02]">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  See It In Action
                </p>
                <h2 className="nc-heading-lg mt-4">
                  60 seconds on what we do and why it works.
                </h2>
                <p className="nc-body mt-4">
                  Watch how enterprise creative teams go from scattered AI experiments
                  to a unified, faster operation — in their own words.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150} direction="right">
              {/* Video embed placeholder — replace src with actual video URL */}
              <div className="relative aspect-video w-full overflow-hidden border border-foreground/10 bg-foreground/[0.03]">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  {/* Play button */}
                  <div className="flex h-16 w-16 items-center justify-center border-2 border-foreground/20 transition-colors hover:border-[#1549CD] hover:bg-[#1549CD]/5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-foreground/40">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground/50">
                    Video coming soon
                  </p>
                  <p className="text-[10px] text-muted-foreground/30">
                    Drop your Loom or MP4 embed here
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nc-divider nc-section">
        <div className="nc-container text-center">
          <Reveal>
            <h2 className="nc-heading-lg mx-auto max-w-3xl">
              The creative teams that figure this out together are going to be
              very hard to compete with.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="nc-body-lg mx-auto mt-6 max-w-xl text-muted-foreground">
              The ones who don&apos;t will be the ones lowering rates to compete
              with teams that produce twice as much at half the cost. We&apos;ve
              trained Cash App, Herman Scheer, and Maesa. Let&apos;s talk about
              your team.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Button
              asChild
              size="lg"
              className="mt-10 cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book a Call</Link>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              30 minutes. No pitch. Just a clear picture of where your team stands and what to do about it.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
