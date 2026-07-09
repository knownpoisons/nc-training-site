import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { Magnetic } from "@/components/motion/magnetic";
import { ItalicWipe } from "@/components/motion/italic-wipe";
import { CaseStudyVideo } from "@/components/case-study-video";

const proofLogos = [
  "Adidas",
  "Google",
  "Cash App",
  "Maesa",
  "Tommy Hilfiger",
  "Target",
];

const proofCards = [
  {
    n: "01",
    category: "Fintech",
    name: "Cash App",
    stat: "90%",
    statLabel: "Production time cut",
    desc: "Production time cut 90%. Est. $3.5M first-year savings. Production-ready by week four.",
    href: "/results/cash-app",
  },
  {
    n: "02",
    category: "Beauty",
    name: "Maesa",
    stat: "$280K",
    statLabel: "Saved on one launch",
    desc: "New brand into every Target store. Three months instead of nine. $280K saved on one launch.",
    href: "/results/maesa",
  },
  {
    n: "03",
    category: "Agency",
    name: "Herman Scheer",
    stat: "$4.5M",
    statLabel: "Estimated year-one savings",
    desc: "$4.5M in estimated year-one savings. Now selling AI services to their own clients.",
    href: "/results/herman-scheer",
  },
];

export default function Home() {
  return (
    <>
      {/* ═══ HERO — Full-viewport cobalt with brand logo feature ═══ */}
      <section className="relative min-h-screen bg-[#1338BE] text-white overflow-hidden oci-grid-lines-light">
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center pb-16 lg:pb-20 pt-16 lg:pt-20 min-h-screen">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full text-center">
            <Reveal>
              <img
                src="/images/logos/brand/NCT-Logo-Platinum-Transparent.webp"
                alt="NotContent — AI Creative Training for Creative Teams and Brands"
                className="mx-auto w-full max-w-[200px] lg:max-w-[260px] h-auto"
              />
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-7 lg:mt-9 max-w-3xl mx-auto space-y-5">
                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.875rem] xl:text-5xl text-white leading-[1.08] tracking-tight font-normal">
                  Two people on your team got good at AI.{" "}
                  <em className="not-italic text-white/70 font-editorial italic">
                    The other twelve are watching.
                  </em>
                </h1>
                <p className="text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-light">
                  You&rsquo;ve tried the fix. A half-day workshop, a certificate, a
                  PDF nobody opens again. Nothing changed by Friday. This is the
                  other thing — eight weeks, one operating model, installed across
                  the whole team.
                </p>
              </div>
            </Reveal>

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
                  Not ready? Take the 2-minute Readiness Scorecard →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ PROOF BAR — Maesa quote + logo strip, directly under hero ═══ */}
      <section className="py-16 lg:py-24 border-b border-foreground/10 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="border-l-[3px] border-[#1338BE] bg-foreground/[0.02] pl-8 lg:pl-12 pr-6 lg:pr-10 py-10 lg:py-12 max-w-4xl">
              <blockquote className="font-editorial text-xl sm:text-2xl lg:text-3xl text-foreground leading-snug tracking-tight font-normal">
                &ldquo;Jeremy and NotContent will save us tens of millions of
                dollars in the next year alone.&rdquo;
              </blockquote>
              <p className="mt-6 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                — Oshyia Savur, VP Marketing, Maesa
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/70">
                Said on stage at a national beauty conference. Unprompted.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
              {proofLogos.map((name, i) => (
                <span key={name} className="flex items-center gap-x-6 sm:gap-x-8">
                  {i > 0 && <span className="text-foreground/20">·</span>}
                  <span className="text-lg lg:text-xl font-light tracking-tight text-foreground/45">
                    {name}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ THE PROBLEM ═══ */}
      <section className="py-28 lg:py-40 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>The Problem</span>
              <span>[NC.1]</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 max-w-3xl space-y-6 text-lg lg:text-xl text-foreground/80 leading-relaxed">
              <p>
                Every creative team I work with has the same shape. One or two
                people quietly dangerous with AI. Everyone else experimenting
                alone, or not at all.
              </p>
              <p>
                That&rsquo;s not a skills problem.{" "}
                <span className="text-foreground font-medium">
                  Nobody built a system.
                </span>
              </p>
              <p className="text-foreground/60">
                Every week the gap compounds — in output, in speed, in what
                leadership sees when they compare your team to the one down the
                hall.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ THE PROOF — head + featured work + 3 cards ═══ */}
      <section className="py-28 lg:py-40 relative oci-grid-lines border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>The Proof</span>
              <span>[NC.2]</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="oci-display-sm mt-8 mb-12 max-w-3xl">
              Three teams. Three industries. Same eight-week programme.
            </h2>
          </Reveal>

          {/* Featured creative — the actual work, in motion */}
          <Reveal delay={150}>
            <div className="mb-14">
              <CaseStudyVideo
                src="/videos/case-studies/cash-app-main.mp4"
                poster="/videos/case-studies/cash-app-main.jpg"
                orientation="landscape"
              />
              <p className="mt-3 text-xs text-foreground/40">
                Real campaign work — produced with the operating model, weeks after training.
              </p>
            </div>
          </Reveal>

          {/* 3-column grid */}
          <div className="grid lg:grid-cols-3 gap-0">
            {proofCards.map((study, i) => (
              <Reveal key={study.name} delay={i * 120}>
                <Link
                  href={study.href}
                  className={`group block p-8 lg:p-10 transition-colors hover:bg-[#1338BE]/[0.03] ${
                    i > 0
                      ? "lg:border-l border-t lg:border-t-0 border-[#1338BE]/20"
                      : ""
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
            <p className="mt-10 text-sm text-muted-foreground">
              Real results from real engagements — not projections.{" "}
              <Link
                href="/results"
                className="text-[#1338BE] font-medium hover:text-[#1338BE]/70 transition-colors"
              >
                Check the numbers. →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ THE OFFER — cobalt band ═══ */}
      <section className="py-28 lg:py-40 bg-[#1338BE] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center justify-between border-b border-white/20 pb-3 text-[11px] uppercase tracking-[0.15em] text-white/40">
              <span>The Offer</span>
              <span>[NC.3]</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="oci-display-sm text-white mt-8 max-w-4xl">
              Eight weeks. One hour a week. Your whole creative team.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 max-w-2xl space-y-5 text-base lg:text-lg text-white/70 leading-relaxed">
              <p>
                Week by week: audit your production bottlenecks, install the
                operating model, build working systems on your real briefs,
                document everything. You end with a system your team owns and
                runs — not notes from a course.
              </p>
              <p className="text-white/90">
                One hour a week for eight weeks. Do the maths on what that costs
                you against the numbers above.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ WHY IT HOLDS ═══ */}
      <section className="py-24 lg:py-36 border-b border-foreground/10">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <Reveal>
            <div className="border-l-[3px] border-[#1338BE] pl-8 lg:pl-12">
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.12] tracking-tight font-normal max-w-3xl">
                The tools change every six months. The way of working{" "}
                <ItalicWipe className="font-editorial italic text-[#1338BE]">
                  doesn&rsquo;t.
                </ItalicWipe>
              </h2>
              <p className="mt-6 lg:mt-8 text-base lg:text-lg text-foreground/70 leading-relaxed max-w-2xl">
                We don&rsquo;t teach Midjourney. We teach the technique layer
                that survives every release — so the work compounds instead of
                restarting each quarter. Monthly coaching after week eight keeps
                it current.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ WHAT IT ISN'T — dark manifesto ═══ */}
      <section className="py-20 lg:py-28 bg-foreground text-white relative overflow-hidden">
        <img
          src="/images/illustrations/chaos-dark.webp"
          alt=""
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] object-contain opacity-25 pointer-events-none hidden lg:block"
          role="presentation"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
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
              If a workshop was going to fix this, it already would have.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <section className="py-24 lg:py-32 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Who It&rsquo;s For</span>
              <span>[NC.4]</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-10 max-w-3xl text-2xl lg:text-3xl font-light leading-snug tracking-tight text-foreground">
              Creative and media teams of 8–30 with real production volume — and
              a leadership team that&rsquo;s done experimenting.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ CLOSE — cobalt band ═══ */}
      <section className="py-28 lg:py-40 bg-[#1338BE] text-white relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
          <img
            src="/images/illustrations/cloud-cream.webp"
            alt=""
            className="w-[480px] max-h-[400px] object-contain opacity-[0.12]"
            role="presentation"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="oci-display-sm text-white max-w-4xl">
              Your team&rsquo;s next 90 days will matter more than the last 18
              months.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
              Book the call. Twenty minutes. No pitch deck.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6 items-start">
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
                className="inline-block text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-1 mt-4 sm:mt-3"
              >
                Take the Readiness Scorecard →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
