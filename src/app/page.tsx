"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";

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

const testimonials = [
  {
    company: "Maesa",
    quote:
      "Jeremy and NotContent will save us tens of millions of dollars in the next year alone.",
    name: "O. Savur",
    title: "VP Marketing, Maesa",
    context: "On stage at a national beauty conference",
  },
  {
    company: "Cash App",
    quote:
      "Jeremy\u2019s training was fun and really gave us the strategies, frameworks, and tools that we needed to completely revolutionize how we produce creative \u2014 both internally for pitching and externally for production.",
    name: "Jose Diaz",
    title: "Head of Production, Cash App",
    context: "Post-training debrief",
  },
  {
    company: "Herman Scheer",
    quote:
      "We\u2019ve been able to offer new and very profitable services to existing clients and use our skills to package new offerings to new clients as well. We feel comfortable moving into this new AI-powered world.",
    name: "Adam",
    title: "Creative Director, Herman Scheer",
    context: "Six months post-engagement",
  },
];

export default function Home() {
  const [openProgram, setOpenProgram] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const currentTestimonial = testimonials[testimonialIndex];

  return (
    <>
      {/* ═══ SECTION 1: HERO — Full-viewport cobalt ═══ */}
      <section className="relative min-h-screen bg-[#1549CD] text-white overflow-hidden oci-grid-lines-light">
        {/* Grid overlay lines */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>

        {/* Main hero content */}
        <div className="relative z-20 flex flex-col justify-end min-h-[calc(100vh-120px)] pb-16 lg:pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
            <Reveal>
              <h1 className="oci-display text-white leading-[0.93]">
                NotContent
                <br />
                Training
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
                <p className="text-white/50 text-[11px] uppercase tracking-[0.15em]">
                  AI Creative Training for Enterprise Teams
                </p>
                <div className="max-w-md lg:text-right">
                  <p className="text-lg lg:text-xl text-white/80 leading-relaxed">
                    The biggest shift in creative work since the internet. Most creative teams are watching it happen.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

      </section>

      {/* ═══ SCORECARD BAND — Right at the fold ═══ */}
      <section className="py-6 lg:py-8 bg-[#1549CD] text-white border-y-2 border-white/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/80">
              Most teams think they&apos;re AI-ready. Almost none actually are.
            </p>
            <p className="text-sm text-white/40">
              Find out exactly where your team stands — and what to do about it.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <Link
              href="/assess"
              className="shrink-0 border border-[#1549CD] bg-[#1549CD] px-8 py-3 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-foreground"
            >
              Take the AI Readiness Scorecard →
            </Link>
            <p className="text-[11px] text-white/40">
              2 minutes. Free. No pitch.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ "THIS ISN'T" MANIFESTO ═══ */}
      <section className="py-16 lg:py-24 bg-foreground text-white relative overflow-hidden">
        <img
          src="/images/illustrations/chaos-dark.png"
          alt=""
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] object-contain opacity-25 pointer-events-none hidden lg:block"
          role="presentation"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <p className="text-xl lg:text-2xl font-light text-white/40 line-through decoration-white/20">
              This isn&apos;t Midjourney training.
            </p>
            <p className="text-xl lg:text-2xl font-light text-white/40 line-through decoration-white/20">
              This isn&apos;t your mom&apos;s ChatGPT workshop.
            </p>
            <p className="text-xl lg:text-2xl font-light text-white/40 line-through decoration-white/20">
              This isn&apos;t a webinar with a PDF.
            </p>
          </div>
          <div>
            <p className="text-2xl lg:text-3xl font-light tracking-tight leading-snug">
              This is operational change. Your whole team. Dangerous with AI — in weeks, not quarters.
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
              Most creative teams have one or two people who figured out AI. The rest are watching.
            </p>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground max-w-3xl">
              Every week that gap compounds — in output, in speed, in what leadership sees when they compare your team to the one down the hall.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-3xl">
              The teams that trained together are already hard to compete with.
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

          <Reveal delay={200}>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
              {[
                { value: "$8M+", label: "Combined client savings" },
                { value: "96%", label: "Average time savings" },
                { value: "400%", label: "Output increase" },
                { value: "$280K", label: "Saved on a single launch" },
                { value: "$3.5M", label: "Year-one savings (Cash App)" },
                { value: "3", label: "Enterprise teams transformed" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl lg:text-3xl font-medium tracking-tight text-[#1549CD]">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Maesa quote callout */}
          <Reveal delay={250}>
            <div className="mt-16 lg:mt-24 bg-[#1549CD] text-white px-8 lg:px-16 py-12 lg:py-16">
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-light leading-snug tracking-tight">
                &ldquo;Jeremy and NotContent will save us tens of millions of dollars in the next year alone.&rdquo;
              </blockquote>
              <p className="mt-6 text-[11px] uppercase tracking-[0.15em] text-white/50">
                — O. Savur, VP Marketing, Maesa · On stage at a national beauty conference
              </p>
            </div>
          </Reveal>

          {/* Client logos marquee */}
          <Reveal delay={350}>
            <div className="mt-20 lg:mt-28 pt-12 pb-4 border-t border-foreground/10">
              <p className="text-sm font-medium tracking-tight text-foreground mb-8">
                Trusted by teams at Adidas, Google, Cash App, Maesa, Tommy Hilfiger, Target — and growing.
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
            <h2 className="oci-display-sm mb-16">Recent Training Results</h2>
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
                  className={`group block p-8 lg:p-10 transition-colors hover:bg-[#1549CD]/[0.03] ${
                    i > 0 ? "lg:border-l border-t lg:border-t-0 border-[#1549CD]/20" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-sm text-muted-foreground font-light">
                      {study.n}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD]">
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
                    <p className="text-3xl lg:text-4xl font-medium tracking-tight text-[#1549CD]">
                      <AnimatedCounter value={study.stat} />
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {study.statLabel}
                    </p>
                  </div>

                  <p className="mt-6 text-[11px] uppercase tracking-[0.15em] text-[#1549CD] opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* ═══ TESTIMONIALS — Editorial quote carousel ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Testimonials</span>
              <span>[NC.2]</span>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-[200px_1fr] gap-12 lg:gap-16 items-start">
            {/* Left: company name + pagination */}
            <div>
              <Reveal delay={100}>
                <p className="text-2xl font-medium tracking-tight">
                  {currentTestimonial.company}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {String(testimonialIndex + 1).padStart(2, "0")}/{String(testimonials.length).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() =>
                        setTestimonialIndex(
                          testimonialIndex > 0 ? testimonialIndex - 1 : testimonials.length - 1
                        )
                      }
                      className="text-[#1549CD] hover:text-[#0e38a8] transition-colors cursor-pointer"
                      aria-label="Previous testimonial"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 10l4-4 4 4" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setTestimonialIndex(
                          testimonialIndex < testimonials.length - 1 ? testimonialIndex + 1 : 0
                        )
                      }
                      className="text-[#1549CD] hover:text-[#0e38a8] transition-colors cursor-pointer"
                      aria-label="Next testimonial"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: quote */}
            <div>
              <Reveal delay={200}>
                <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light leading-snug tracking-tight">
                  &ldquo;{currentTestimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-foreground/10" />
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {currentTestimonial.name}, {currentTestimonial.title}
                  </p>
                </div>
                <p className="mt-2 text-right text-[11px] text-muted-foreground/60">
                  {currentTestimonial.context}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ METHODOLOGY — Tilted cards ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Method</span>
              <span>[NC.3]</span>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: heading + body + photo */}
            <div>
              <Reveal delay={100}>
                <h2 className="oci-display-sm">
                  A methodology,
                  <br />
                  not a tool list.
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-8 text-sm leading-relaxed text-muted-foreground max-w-md">
                  AI is a creative force multiplier, not a replacement engine. The NotContent Method separates exploration from execution — so speed never compromises taste.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-md">
                  When a whole team learns the same framework, the gains compound. Everyone explores smarter, executes cleaner, and builds on each other&apos;s work instead of reinventing it.
                </p>
              </Reveal>
              <Reveal delay={250}>
                <Link
                  href="/methodology"
                  className="mt-6 inline-block text-[11px] uppercase tracking-[0.15em] text-[#1549CD] hover:text-[#0e38a8] transition-colors"
                >
                  Explore the methodology &rarr;
                </Link>
              </Reveal>
              <Reveal delay={300}>
                <img
                  src="/images/training/speaking-tall-2.png"
                  alt="Jeremy Somers speaking on stage"
                  className="mt-10 w-full aspect-[3/4] object-cover border border-foreground/10"
                />
              </Reveal>
            </div>

            {/* Right: tilted cards */}
            <div className="flex flex-col gap-6">
              {[
                {
                  n: "01",
                  name: "Diverge",
                  desc: "Generate volume, discover styles, break habits. AI as your visual sparring partner — not a vending machine.",
                },
                {
                  n: "02",
                  name: "Converge",
                  desc: "Lock direction. Switch to precision tools. Production-grade, brand-aligned output.",
                },
                {
                  n: "03",
                  name: "Systemize",
                  desc: "Encode what works into repeatable processes anyone on the team can run. That\u2019s when training becomes transformation.",
                },
              ].map((step, i) => (
                <Reveal key={step.n} delay={150 + i * 100} direction="right">
                  <div className="oci-card-tilted p-8">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-3xl lg:text-4xl font-light text-[#1549CD]/30">
                        {step.n}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD]">
                        {step.name}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY NOTCONTENT ═══ */}
      <section className="py-32 lg:py-44 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-0 text-[11px] uppercase tracking-[0.15em] text-white/40">
              <span>Why NotContent</span>
              <span>[NC]</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="oci-display-sm text-white mt-8 max-w-3xl">
              Most AI trainers teach tools.
              <br />
              We teach production.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Earned in the Field", description: "Everything we teach has been production-tested on real campaigns for real clients. Your team learns what actually works — not what sounds good in a seminar." },
                { title: "Built to Outlast the Tools", description: "Tools change every month. The Diverge / Converge / Systemize methodology is tool-agnostic — so when the landscape shifts, your team knows exactly how to adapt." },
                { title: "Taste Stays in the Room", description: "We train teams to use AI as a force multiplier for human creativity — not a replacement for it. Speed without taste produces mediocrity at scale." },
                { title: "Your Brand, Not a Generic Exercise", description: "Every program is built around your brand assets, your style guides, your production needs. By the end, your team has workflows built for your operation specifically." },
                { title: "We Don\u2019t Disappear After Week 8", description: "Monthly coaching keeps your team current as AI evolves. Most training fades within 60 days. Ours compounds — because we\u2019re still there when it matters." },
                { title: "The Numbers Are Real", description: "Maesa saved $280K on a single brand launch. Cash App went 10x on campaign velocity. We run before/after benchmarks on every program." },
              ].map((diff) => (
                <div key={diff.title} className="bg-foreground p-8">
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-white/80">{diff.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/50">{diff.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PROGRAMS — Accordion ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Programs</span>
              <span>[NC.4]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-16">
              <h2 className="oci-display-sm">Two ways in.</h2>
              <p className="max-w-sm text-sm text-muted-foreground leading-relaxed lg:text-right">
              </p>
            </div>
          </Reveal>

          {/* Accordion */}
          <div>
            {[
              {
                name: "Foundations",
                duration: "Half-day workshop",
                price: "$5,000",
                description:
                  "Align your whole team on AI tools, workflows, and a shared methodology in a single session. Everyone in the room. Everyone at the same level. Everyone with the same language.",
                ideal: "Teams that haven\u2019t aligned yet",
                href: "/programs/foundations",
              },
              {
                name: "Transformation",
                duration: "8-week program",
                price: "From $50,000",
                description:
                  "Full operational transformation. Custom workflows and role-specific training across your entire team. The whole operation changes — not just the individuals in it.",
                ideal: "Teams going all-in on AI creative",
                href: "/programs/transformation",
              },
            ].map((program, i) => (
              <Reveal key={program.name} delay={i * 80}>
                <div
                  className="oci-accordion-item"
                  onClick={() => setOpenProgram(openProgram === i ? null : i)}
                >
                  <div className="py-6 px-2 flex items-center justify-between">
                    <div className="flex items-baseline gap-4 lg:gap-8">
                      <span className="text-sm text-muted-foreground font-light">
                        0{i + 1}
                      </span>
                      <h3 className="text-xl lg:text-2xl font-medium tracking-tight">
                        {program.name}
                      </h3>
                      <span className="hidden sm:inline text-sm text-muted-foreground">
                        {program.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden sm:inline text-sm text-muted-foreground">
                        {program.price}
                      </span>
                      <span className="text-xl text-[#1549CD] transition-transform duration-200"
                        style={{ transform: openProgram === i ? "rotate(45deg)" : "rotate(0)" }}
                      >
                        +
                      </span>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: openProgram === i ? "300px" : "0",
                      opacity: openProgram === i ? 1 : 0,
                    }}
                  >
                    <div className="pb-8 px-2 pl-10 lg:pl-16">
                      <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
                        {program.description}
                      </p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                        Best for: {program.ideal}
                      </p>
                      <Link
                        href={program.href}
                        className="mt-4 inline-block text-[11px] uppercase tracking-[0.15em] text-[#1549CD] hover:text-[#0e38a8] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Learn More &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <Link href="/programs" className="oci-button-full mt-0 block">
              View All Programs
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ URGENCY BLOCK ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines overflow-hidden">
        {/* Illustration — right side, behind text */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
          <img
            src="/images/illustrations/cloud-cream.png"
            alt=""
            className="w-[480px] max-h-[400px] object-contain opacity-[0.15]"
            role="presentation"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="oci-display-sm text-foreground max-w-5xl">
              One third of creative teams are now using AI regularly.
              Most are stuck experimenting alone.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 text-xl lg:text-2xl font-light text-foreground/60 max-w-3xl leading-relaxed">
              Your team&apos;s next 90 days will matter more than the last 18 months.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/assess"
                className="inline-block px-10 py-4 bg-[#1549CD] text-white text-[11px] uppercase tracking-[0.15em] transition-colors hover:bg-[#0e38a8]"
              >
                Take the Readiness Scorecard →
              </Link>
              <Link
                href="/book"
                className="inline-block px-10 py-4 border border-foreground/20 text-[11px] uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-white"
              >
                Book a Discovery Call
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ BLOG GRID — Alternating blue/cream ═══ */}
      <section className="py-32 lg:py-44 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="oci-section-label">
              <span>Insights</span>
              <span>[NC.5]</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="oci-display-sm mb-16">From the Blog</h2>
          </Reveal>

          {/* 2x2 grid */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Large blue card */}
            <Reveal delay={150}>
              <Link href="/blog/raise-the-ceiling-not-the-floor" className="block h-full">
                <div className="oci-blog-card-blue h-full">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-white/50">
                    Strategy
                  </span>
                  <div className="mt-auto pt-12">
                    <h3 className="text-xl lg:text-2xl font-medium tracking-tight leading-snug">
                      Raise the Ceiling, Not the Floor
                    </h3>
                    <p className="mt-3 text-sm text-white/60">
                      AI mandates fail. Find your believers, make them dangerous.
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* Right column: 2 stacked cream cards */}
            <div className="flex flex-col gap-4">
              <Reveal delay={200}>
                <Link href="/blog/stop-teaching-ai-start-building" className="block">
                  <div className="oci-blog-card-cream">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD]">
                      Methodology
                    </span>
                    <div className="mt-auto pt-6">
                      <h3 className="text-lg font-medium tracking-tight">
                        Stop Teaching AI. Start Building With It.
                      </h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
              <Reveal delay={250}>
                <Link href="/blog/the-confidence-gap-is-killing-your-ai-strategy" className="block">
                  <div className="oci-blog-card-cream">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD]">
                      Insight
                    </span>
                    <div className="mt-auto pt-6">
                      <h3 className="text-lg font-medium tracking-tight">
                        83% Confident. 15% Ready. The Gap That&apos;s Killing Your AI Strategy.
                      </h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
