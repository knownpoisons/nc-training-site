import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { BrandIcon, type BrandIconName } from "@/components/brand-icon";
import { TestimonialsSection } from "@/components/home/testimonials";
import { Magnetic } from "@/components/motion/magnetic";
import { ItalicWipe } from "@/components/motion/italic-wipe";
import { CaseStudyVideo } from "@/components/case-study-video";

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

export default function Home() {
  return (
    <>
      {/* ═══ SECTION 1: HERO — Full-viewport cobalt with brand logo feature ═══ */}
      <section className="relative min-h-screen bg-[#1338BE] text-white overflow-hidden oci-grid-lines-light">
        {/* Grid overlay lines */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        {/* Main hero content — compact stack, H1 + CTA always above fold */}
        <div className="relative z-20 flex flex-col items-center justify-center pb-16 lg:pb-20 pt-16 lg:pt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full text-center">
            {/* Transparent logo — floats on the cobalt with no frame */}
            <Reveal>
              <img
                src="/images/logos/brand/NCT-Logo-Platinum-Transparent.webp"
                alt="NotContent — AI Creative Training for Creative Teams and Brands"
                className="mx-auto w-full max-w-[200px] lg:max-w-[260px] h-auto"
              />
            </Reveal>

            {/* H1 + subhead + CTA stack */}
            <Reveal delay={200}>
              <div className="mt-7 lg:mt-9 max-w-3xl mx-auto space-y-5">
                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.875rem] xl:text-5xl text-white leading-[1.08] tracking-tight font-normal">
                  Two people on your team got good at AI.{" "}
                  <em className="not-italic text-white/70 font-editorial italic">The other twelve are watching.</em>
                </h1>
                <p className="text-base lg:text-lg text-white/80 leading-snug max-w-2xl mx-auto font-light">
                  You&rsquo;ve tried the fix. A half-day workshop, a certificate, a PDF nobody opens again. This is the other thing — eight weeks, one operating model, installed across the whole team.
                </p>
              </div>
            </Reveal>

            {/* CTA hierarchy: Discovery Call primary, Scorecard demoted to text link */}
            <Reveal delay={400}>
              <div className="mt-7 lg:mt-9 flex flex-col items-center gap-3">
                <Magnetic>
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 bg-white text-[#1338BE] px-10 py-4 text-[12px] uppercase tracking-[0.18em] font-semibold transition-colors hover:bg-white/90"
                  >
                    Book a Discovery Call →
                  </Link>
                </Magnetic>
                <Link
                  href="/assess"
                  className="text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-0.5"
                >
                  Not ready? Take the 2-minute AI Readiness Scorecard →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

      </section>

      {/* ═══ JEREMY — Built by an operator, not a consultant ═══ */}
      <section className="py-20 lg:py-28 bg-background border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16 items-center">
              <div className="shrink-0 mx-auto lg:mx-0">
                <img
                  src="/images/jeremy-somers.jpg"
                  alt="Jeremy Somers — founder, NotContent"
                  className="w-44 h-44 lg:w-60 lg:h-60 object-cover ring-1 ring-foreground/10"
                  loading="lazy"
                />
              </div>
              <div>
                <div className="oci-section-label">
                  <span>About the trainer</span>
                  <span>[NC]</span>
                </div>
                <h2 className="mt-5 oci-display-sm text-foreground max-w-3xl">
                  Built by an operator, not a consultant.
                </h2>
                <div className="mt-7 max-w-2xl space-y-3 text-base lg:text-lg text-foreground/80 leading-relaxed">
                  <p>Jeremy Somers spent 15 years directing creative at Spotify, Pepsi, Samsung, Mercedes-Benz, Google and Microsoft.</p>
                  <p>He founded the first AI-assisted creative agency in 2022.</p>
                  <p>
                    NotContent Training is the operating model that agency runs — the same system behind Cash App&rsquo;s 90% production cut, Maesa&rsquo;s $280K single-launch saving, and Herman Scheer&rsquo;s $4.5M in year-one savings.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ANTHEM — Techniques over tools ═══ */}
      <section className="py-20 lg:py-32 border-b border-foreground/10">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <Reveal>
            <div className="border-l-[3px] border-[#1338BE] pl-8 lg:pl-12">
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] text-foreground leading-[1.1] tracking-tight font-normal">
                Techniques over{" "}
                <ItalicWipe className="font-editorial italic text-[#1338BE]">tools.</ItalicWipe>
              </h2>
              <p className="mt-6 lg:mt-8 text-base lg:text-lg text-foreground/70 leading-relaxed max-w-2xl">
                The tools change every six months. The way of working doesn&rsquo;t. We teach the technique layer that survives every release — so the work compounds instead of restarting each quarter.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SCORECARD BAND — Cream with cobalt left rule (per design system pullquote pattern) ═══ */}
      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border-l-[3px] border-[#1338BE] pl-6 lg:pl-8 py-6 lg:py-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm lg:text-base text-foreground">
                Most teams think they&apos;re AI-ready. Almost none actually are.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Find out exactly where your team stands — and what to do about it.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:items-end gap-2">
              <Link
                href="/assess"
                className="shrink-0 border border-[#1338BE] text-[#1338BE] px-7 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors hover:bg-[#1338BE] hover:text-white"
              >
                Take the AI Readiness Scorecard →
              </Link>
              <p className="text-[11px] text-muted-foreground">
                2 minutes. Free. No pitch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ "THIS ISN'T" MANIFESTO ═══ */}
      <section className="py-16 lg:py-24 bg-foreground text-white relative overflow-hidden">
        <img
          src="/images/illustrations/chaos-dark.webp"
          alt=""
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] object-contain opacity-25 pointer-events-none hidden lg:block"
          role="presentation"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <p className="text-xl lg:text-2xl font-light text-white/40 line-through decoration-white/20">
              Not a webinar.
            </p>
            <p className="text-xl lg:text-2xl font-light text-white/40 line-through decoration-white/20">
              Not tool tutorials.
            </p>
            <p className="text-xl lg:text-2xl font-light text-white/40 line-through decoration-white/20">
              Not a certification for LinkedIn.
            </p>
          </div>
          <div>
            <p className="text-2xl lg:text-3xl font-light tracking-tight leading-snug">
              If a workshop was going to fix this, it already would have. This is the other thing: eight weeks, one hour a week, your whole team — dangerous with AI in weeks, not quarters.
            </p>
            <Link
              href="/blog/ai-training-your-team-doesnt-need"
              className="mt-6 inline-block text-[11px] uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
            >
              Read why →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ INTRO — Oversized statement + stats + Maesa quote + logos ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="oci-display-sm text-foreground max-w-5xl">
              Every creative team I work with has the same shape. One or two people quietly dangerous with AI. Everyone else experimenting alone.
            </p>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground max-w-3xl">
              That&rsquo;s not a skills problem. Nobody built a system.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-3xl">
              Every week the gap compounds — in output, in speed, in what leadership sees when they compare your team to the one down the hall.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="oci-section-label mt-16 lg:mt-24">
              <span>By the Numbers</span>
              <span>[NC]</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xl">
              Real results from real training engagements — not projections.
            </p>
          </Reveal>

          {/* Hairline stat strip — 3 stats, no card fills (per design system) */}
          <Reveal delay={200}>
            <div className="mt-8 border-t border-b border-foreground/15 divide-y sm:divide-y-0 sm:divide-x divide-foreground/15 grid grid-cols-1 sm:grid-cols-3">
              {[
                { value: "$8M+", label: "Combined client savings" },
                { value: "90%", label: "Avg. production-time reduction" },
                { value: "3", label: "Enterprise teams shipped" },
              ].map((stat) => (
                <div key={stat.label} className="px-6 py-8 lg:py-10">
                  <p className="font-editorial text-4xl lg:text-5xl tracking-tight text-[#1338BE] font-normal leading-none">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Maesa pull-quote — editorial pattern (cobalt left rule, cream fill) */}
          <Reveal delay={250}>
            <div className="mt-16 lg:mt-24 border-l-[3px] border-[#1338BE] bg-foreground/[0.02] pl-8 lg:pl-12 pr-6 lg:pr-10 py-10 lg:py-14 max-w-4xl">
              <blockquote className="font-editorial text-xl sm:text-2xl lg:text-3xl text-foreground leading-snug tracking-tight font-normal">
                &ldquo;Jeremy and NotContent will save us tens of millions of dollars in the next year alone.&rdquo;
              </blockquote>
              <p className="mt-6 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                — Oshyia Savur, VP Marketing, Maesa · On stage at Shoptalk, 2025. Unprompted.
              </p>
            </div>
          </Reveal>

          {/* Client logos marquee */}
          <Reveal delay={350}>
            <div className="mt-20 lg:mt-28 pt-12 pb-4 border-t border-foreground/10">
              <p className="text-sm font-medium tracking-tight text-foreground mb-8">
                Creative clients include Adidas, Google, Cash App, Maesa, Tommy Hilfiger, Target.
              </p>
              <div className="overflow-hidden">
                <div className="animate-marquee-slow flex w-max gap-x-16">
                  {[...clients, ...clients].map((client, i) => (
                    <span
                      key={`${client}-${i}`}
                      className="shrink-0 text-2xl lg:text-3xl font-light tracking-tight text-foreground/50"
                    >
                      {client}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ RESULTS — Proof before process ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Results</span>
              <span>[NC.1]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="oci-display-sm mb-12">Recent Training Results</h2>
          </Reveal>

          {/* Featured case study — the actual work, in motion (subtle: one contained, in-view, muted clip) */}
          <Reveal delay={150}>
            <div className="mb-16 grid gap-8 lg:gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <CaseStudyVideo
                src="/videos/case-studies/cash-app-main.mp4"
                poster="/videos/case-studies/cash-app-main.jpg"
                orientation="landscape"
              />
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#1338BE] mb-4">
                  Featured case study · Cash App
                </p>
                <p className="text-lg lg:text-xl font-light leading-snug tracking-tight text-foreground max-w-md">
                  The campaign work the team produced with the operating model —
                  production time cut to 10%, an estimated $3.5M in year-one savings.
                </p>
                <div className="mt-7 flex items-baseline gap-3">
                  <p className="text-4xl lg:text-5xl font-medium tracking-tight text-[#1338BE] leading-none">
                    $3.5M
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    Estimated year-one savings
                  </p>
                </div>
                <Link
                  href="/results/cash-app"
                  className="mt-8 inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-[#1338BE] hover:text-[#1338BE]/70 transition-colors"
                >
                  See the Cash App story →
                </Link>
              </div>
            </div>
          </Reveal>

          {/* 3-column grid with vertical dividers */}
          <div className="grid lg:grid-cols-3 gap-0">
            {[
              {
                n: "01",
                category: "Fintech",
                name: "Cash App",
                stat: "90%",
                statLabel: "Reduction in production time",
                desc: "Production time cut to 10%. $3.5M in estimated year-one savings. Team production-ready by halfway through training.",
                href: "/results/cash-app",
              },
              {
                n: "02",
                category: "Beauty",
                name: "Maesa",
                stat: "$280K",
                statLabel: "Saved on a single brand launch",
                desc: "New brand launched into every Target store. 3 months instead of 9. $280K saved on a single launch.",
                href: "/results/maesa",
              },
              {
                n: "03",
                category: "Agency",
                name: "Herman Scheer",
                stat: "$4.5M",
                statLabel: "Estimated year-one savings",
                desc: "Zero to full AI production. $4.5M in estimated year-one savings. Now offering new profitable AI services to clients.",
                href: "/results/herman-scheer",
              },
            ].map((study, i) => (
              <Reveal key={study.name} delay={i * 120}>
                <Link
                  href={study.href}
                  className={`group block p-8 lg:p-10 transition-colors hover:bg-[#1338BE]/[0.03] ${
                    i > 0 ? "lg:border-l border-t lg:border-t-0 border-[#1338BE]/20" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-sm text-muted-foreground font-light">
                      {study.n}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-[#1338BE]">
                      {study.category}
                    </span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-medium tracking-tight mb-4">
                    {study.name}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground mb-8">
                    {study.desc}
                  </p>

                  {/* Big stat */}
                  <div className="border-t border-foreground/10 pt-6">
                    <p className="text-3xl lg:text-4xl font-medium tracking-tight text-[#1338BE]">
                      <AnimatedCounter value={study.stat} />
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {study.statLabel}
                    </p>
                  </div>

                  <p className="mt-6 text-[11px] uppercase tracking-[0.15em] text-[#1338BE] opacity-0 group-hover:opacity-100 transition-opacity">
                    Read case study &rarr;
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <Link href="/results" className="oci-button-full mt-0 block">
              View All Results
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — Editorial quote carousel (client, extracted) ═══ */}
      <TestimonialsSection />

      {/* ═══ THE METHOD, IN MOTION (static) ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.12] tracking-tight font-normal max-w-3xl">
              Fifty options in.{" "}
              <em className="font-editorial italic text-[#1338BE]">One direction out.</em>{" "}
              Documented.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-0 lg:grid-cols-3">
            {[
              { n: "01", name: "Diverge", tag: "Range", body: "Fifty options at a speed the team has never had. No judgement yet." },
              { n: "02", name: "Converge", tag: "Refine", body: "Human taste applied. The cost of the work drops, the quality doesn\u2019t." },
              { n: "03", name: "Build", tag: "Document", body: "The way of working, written down. A one-off saving made permanent." },
            ].map((phase, i) => (
              <Reveal key={phase.n} delay={i * 120}>
                <div className={"p-8 lg:p-10 " + (i > 0 ? "lg:border-l border-t lg:border-t-0 border-foreground/10" : "")}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm text-muted-foreground font-light">{phase.n}</span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#1338BE]">{phase.tag}</span>
                  </div>
                  <h3 className="mt-5 text-2xl lg:text-3xl font-medium tracking-tight">{phase.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{phase.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY NOTCONTENT ═══ */}
      <section className="py-32 lg:py-44 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-0 text-[11px] uppercase tracking-[0.15em] text-white/40">
              <span className="flex items-center gap-2.5">
                <img
                  src="/images/logos/brand/NCT-Icon-PlatinumonBlue.webp"
                  alt=""
                  className="h-5 w-5 rounded-[2px]"
                />
                Why NotContent
              </span>
              <span>[NC]</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="oci-display-sm text-white mt-8 max-w-3xl">
              Most AI trainers teach tools.
              <br />
              Tools change every six months.
              <br />
              We teach a way of working.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Production-tested, not theory-tested.",
                  icon: "shield" as BrandIconName,
                  description:
                    "Everything we teach has shipped on real campaigns — for Cash App, Maesa, Herman Scheer. Your team learns what works in production, not what sounds good in a seminar.",
                },
                {
                  title: "Built on your brief, not a stock playbook.",
                  icon: "fingerprint" as BrandIconName,
                  description:
                    "Every engagement starts with your brand assets, your workflows, your production bottlenecks. You end with a system your team owns and runs — not notes from a course.",
                },
                {
                  title: "We don’t disappear after week 8.",
                  icon: "team" as BrandIconName,
                  description:
                    "Tools change quarterly. The methodology doesn’t. Monthly coaching keeps your team current as the landscape shifts — most training fades within 60 days; ours compounds.",
                },
              ].map((diff) => (
                <div key={diff.title} className="bg-foreground p-10 lg:p-12">
                  <BrandIcon icon={diff.icon} color="#E8E6E0" size={56} className="mb-6" />
                  <h3 className="text-base lg:text-lg leading-snug text-white">
                    {diff.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">
                    {diff.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ URGENCY BLOCK ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines overflow-hidden">
        {/* Illustration — right side, behind text */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
          <img
            src="/images/illustrations/cloud-cream.webp"
            alt=""
            className="w-[480px] max-h-[400px] object-contain opacity-[0.15]"
            role="presentation"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="oci-display-sm text-foreground max-w-5xl">
              For creative and media teams of 8&ndash;30 with real production volume — and a leadership team that&rsquo;s done experimenting.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 text-xl lg:text-2xl font-light text-foreground/60 max-w-3xl leading-relaxed">
              Your team&apos;s next 90 days will matter more than the last 18 months. Twenty minutes. No pitch deck.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6 items-start">
              <Magnetic>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 bg-[#1338BE] text-white px-10 py-4 text-[12px] uppercase tracking-[0.18em] font-semibold transition-colors hover:bg-[#0e2c95]"
                >
                  Book a Discovery Call →
                </Link>
              </Magnetic>
              <Link
                href="/assess"
                className="inline-block text-[11px] uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground transition-colors border-b border-foreground/20 hover:border-foreground/60 pb-1 mt-4 sm:mt-3"
              >
                Not ready? Take the 2-minute AI Readiness Scorecard →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
