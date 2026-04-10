"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { questions, type Option } from "./questions";
import { computeScores, getRecommendation, normalisedScores, getReasons } from "./logic";
import { programs, alternativeProgram } from "./programs";

// ─── Section transition screen ────────────────────────────────────────────────
const sectionIntros: Record<string, { label: string; description: string }> = {
  "Your Team": {
    label: "Section 02 / Your Team",
    description: "Now let's understand where your team actually stands.",
  },
  "Your Context": {
    label: "Section 03 / Your Context",
    description: "Last section — this helps us personalise the recommendation.",
  },
};

type Step = "landing" | "capture" | "section-intro" | "quiz" | "results";

export default function AssessPage() {
  const [step, setStep] = useState<Step>("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [answerIndices, setAnswerIndices] = useState<number[]>([]);
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [justSelected, setJustSelected] = useState<number | null>(null);
  const [multiSelections, setMultiSelections] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const q = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  useEffect(() => {
    setMultiSelections([]);
  }, [currentQ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQ, step]);

  function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    setStep("quiz");
  }

  function advance(newOptions: Option[], newIndices: number[]) {
    const nextIndex = currentQ + 1;

    if (nextIndex >= questions.length) {
      submitLead(newOptions, newIndices);
      setStep("results");
      return;
    }

    const nextSection = questions[nextIndex].section;
    const currentSection = q.section;

    if (nextSection !== currentSection && sectionIntros[nextSection]) {
      setPendingSection(nextSection);
      setCurrentQ(nextIndex);
      setStep("section-intro");
    } else {
      setCurrentQ(nextIndex);
    }
  }

  function handleOptionClick(optionIndex: number) {
    if (justSelected !== null) return;

    const opt = q.options[optionIndex];
    setJustSelected(optionIndex);

    setTimeout(() => {
      const newOptions = [...selectedOptions, opt];
      const newIndices = [...answerIndices, optionIndex];
      setSelectedOptions(newOptions);
      setAnswerIndices(newIndices);
      setJustSelected(null);
      advance(newOptions, newIndices);
    }, 350);
  }

  function handleMultiToggle(optionIndex: number) {
    setMultiSelections((prev) =>
      prev.includes(optionIndex)
        ? prev.filter((i) => i !== optionIndex)
        : [...prev, optionIndex]
    );
  }

  function handleMultiNext() {
    if (multiSelections.length === 0) return;

    const selectedOpts = multiSelections.map((i) => q.options[i]);
    const primaryIndex = Math.min(...multiSelections);

    const newOptions = [...selectedOptions, ...selectedOpts];
    const newIndices = [...answerIndices, primaryIndex];
    setSelectedOptions(newOptions);
    setAnswerIndices(newIndices);
    advance(newOptions, newIndices);
  }

  async function submitLead(opts: Option[], indices: number[]) {
    const scores = computeScores(opts);
    const rec = getRecommendation(scores);
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    if (!email) return;
    try {
      await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, tier: rec, score: totalScore }),
      });
    } catch {
      // silent fail
    }
  }

  // ── Results data ─────────────────────────────────────────────────────────────
  const scores = computeScores(selectedOptions);
  const recommendation = getRecommendation(scores);
  const normalised = normalisedScores(scores);
  const reasons = getReasons(answerIndices, recommendation);
  const program = programs[recommendation];
  const altProgram = programs[alternativeProgram[recommendation]];

  // ═══════════════════════════════════════════════════════════════════════════════
  // LANDING
  // ═══════════════════════════════════════════════════════════════════════════════
  if (step === "landing") {
    return (
      <div className="min-h-screen">
        {/* Cobalt hero */}
        <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
          <div className="oci-grid-lines-light" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
            <div className="oci-section-label mb-8 border-white/20 text-white/40">
              <span>AI TRAINING READINESS SCORECARD</span>
              <span>[NC]</span>
            </div>
            <h1 className="oci-display-sm max-w-3xl">
              Find the right training
              <br />
              for your team.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
              Most teams think they&apos;re AI-ready. Almost none actually are.
              12 questions. 2 minutes. A personalized program recommendation
              based on where your team actually stands — not where you hope
              they are.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24 relative oci-grid-lines">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <div className="oci-section-label mb-8">
                  <span>WHAT YOU GET</span>
                  <span>[NC.1]</span>
                </div>
                <div className="space-y-3">
                  {[
                    "A personalised program recommendation",
                    "3 specific reasons it fits your situation",
                    "Fit scores across all 3 programs",
                    "Pricing, format, and a clear next step",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-[#1549CD] text-xs">✓</span>
                      <p className="text-sm text-foreground/60">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 grid gap-px bg-foreground/10 sm:grid-cols-3">
                  {[
                    { n: "01", label: "Your Goal", q: "What are you trying to achieve?" },
                    { n: "02", label: "Your Team", q: "Where are you right now?" },
                    { n: "03", label: "Your Context", q: "What's in the way?" },
                  ].map((s) => (
                    <div key={s.n} className="bg-[#E8E6E0] p-6">
                      <p className="text-2xl font-light text-[#1549CD]/30">{s.n}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.15em] font-medium">
                        {s.label}
                      </p>
                      <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                        {s.q}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start justify-center lg:pt-12">
                <div className="w-full border border-foreground/10 p-10">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                    Free · 2 minutes
                  </p>
                  <h2 className="mt-4 text-2xl font-light tracking-tight">
                    Ready to find the right fit?
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                    No pitch required to see your recommendation.
                  </p>
                  <button
                    onClick={() => setStep("capture")}
                    className="mt-8 w-full cursor-pointer bg-[#1549CD] px-8 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#0e38a8]"
                  >
                    Start the Scorecard →
                  </button>

                  <div className="mt-8 border-t border-foreground/10 pt-6">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40 mb-3">
                      Informed by training teams at
                    </p>
                    <p className="text-sm text-foreground/40">
                      Cash App · Maesa · Herman Scheer · Adidas · Google
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // EMAIL CAPTURE
  // ═══════════════════════════════════════════════════════════════════════════════
  if (step === "capture") {
    return (
      <div className="min-h-screen">
        <section className="py-32 lg:py-40 relative oci-grid-lines">
          <div className="mx-auto max-w-lg px-6 lg:px-8">
            <div className="oci-section-label mb-8">
              <span>SECTION 01 / YOUR GOAL</span>
              <span>[NC]</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
              Where should we send your recommendation?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">
              Your personalised program recommendation — with the reasoning behind
              it — sent straight to your inbox when you&apos;re done.
            </p>

            <form onSubmit={handleCapture} className="mt-10 space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  className="mt-2 w-full border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-foreground/20 focus:border-[#1549CD] transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-foreground/20 focus:border-[#1549CD] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={!name || !email}
                className="w-full cursor-pointer bg-[#1549CD] px-8 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#0e38a8] disabled:opacity-30 disabled:cursor-not-allowed mt-2"
              >
                Start →
              </button>
              <p className="text-xs text-foreground/40 text-center">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTION INTRO
  // ═══════════════════════════════════════════════════════════════════════════════
  if (step === "section-intro" && pendingSection) {
    const intro = sectionIntros[pendingSection];
    return (
      <div className="min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-foreground/10">
          <div
            className="h-full bg-[#1549CD] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <section className="min-h-screen bg-[#1549CD] text-white flex items-center overflow-hidden relative">
          <div className="oci-grid-lines-light" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
              {intro.label}
            </p>
            <h2 className="oci-display-sm mt-4 max-w-2xl">
              {intro.description}
            </h2>
            <button
              onClick={() => {
                setPendingSection(null);
                setStep("quiz");
              }}
              className="mt-10 cursor-pointer border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Continue →
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // QUIZ
  // ═══════════════════════════════════════════════════════════════════════════════
  if (step === "quiz") {
    const isMulti = !!q.multiSelect;

    return (
      <div className="min-h-screen" ref={containerRef}>
        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-foreground/10">
          <div
            className="h-full bg-[#1549CD] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <section className="py-32 lg:py-40 relative oci-grid-lines">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                {q.section} · {q.sectionIndex}/{q.sectionTotal}
              </p>
              <p className="text-[11px] text-foreground/40">
                {currentQ + 1} / {questions.length}
              </p>
            </div>

            {/* Question */}
            <h2 className="mt-6 text-2xl lg:text-3xl font-light tracking-tight leading-snug">
              {q.text}
            </h2>

            {/* Multi-select hint */}
            {isMulti && (
              <p className="mt-2 text-[11px] text-foreground/40 uppercase tracking-[0.15em]">
                Select all that apply
              </p>
            )}

            {/* Options */}
            <div className="mt-8 space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = multiSelections.includes(i);
                const isFading = !isMulti && justSelected !== null && justSelected !== i;
                const isHighlighted = !isMulti && justSelected === i;

                return (
                  <button
                    key={i}
                    onClick={() =>
                      isMulti ? handleMultiToggle(i) : handleOptionClick(i)
                    }
                    className={`w-full border text-left px-6 py-4 text-sm leading-relaxed transition-all duration-200 cursor-pointer flex items-start gap-4
                      ${
                        isHighlighted
                          ? "border-[#1549CD] bg-[#1549CD] text-white"
                          : isSelected
                          ? "border-[#1549CD] bg-[#1549CD]/5 text-foreground"
                          : isFading
                          ? "border-foreground/10 text-foreground/30 cursor-not-allowed"
                          : "border-foreground/15 hover:border-[#1549CD]/50 text-foreground"
                      }`}
                  >
                    {/* Checkbox indicator for multi-select */}
                    {isMulti && (
                      <span
                        className={`mt-0.5 shrink-0 w-4 h-4 border flex items-center justify-center transition-all duration-150 ${
                          isSelected
                            ? "border-[#1549CD] bg-[#1549CD]"
                            : "border-foreground/30"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            className="text-white"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Next button for multi-select */}
            {isMulti && (
              <div className="mt-8">
                <button
                  className="cursor-pointer bg-[#1549CD] px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#0e38a8] disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={multiSelections.length === 0}
                  onClick={handleMultiNext}
                >
                  {currentQ + 1 === questions.length ? "See My Result →" : "Next →"}
                </button>
              </div>
            )}

            {/* Step dots */}
            <div className="mt-10 flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 transition-all duration-300 ${
                    i < currentQ
                      ? "bg-[#1549CD]"
                      : i === currentQ
                      ? "bg-foreground/30"
                      : "bg-foreground/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen">
      {/* Hero — cobalt */}
      <section className="relative min-h-[50vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
            {name ? `${name}'s Result` : "Your Result"} · Program Finder
          </p>
          <h1 className="oci-display-sm mt-4 max-w-3xl">
            {program.tagline}
          </h1>
          <div className="mt-6 inline-flex items-center border border-white/20 bg-white/10 px-5 py-2">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/60">
              Recommended:
            </p>
            <p className="ml-3 text-sm font-medium text-white">
              {program.label}
            </p>
          </div>
        </div>
      </section>

      {/* Why this program */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="oci-section-label mb-8">
                <span>WHY THIS FITS</span>
                <span>[NC.1]</span>
              </div>
              <div className="space-y-6">
                {reasons.map((reason, i) => (
                  <div key={i} className="flex gap-5">
                    <span className="mt-1 text-2xl font-light text-[#1549CD]/30 shrink-0 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40 mb-6">
                  Program Fit
                </p>
                <div className="space-y-4">
                  {(
                    [
                      ["foundations", "Foundations"],
                      ["accelerator", "Accelerator"],
                      ["transformation", "Transformation"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-4">
                      <p
                        className={`text-[11px] uppercase tracking-[0.15em] w-28 shrink-0 ${
                          key === recommendation
                            ? "text-foreground font-medium"
                            : "text-foreground/40"
                        }`}
                      >
                        {label}
                      </p>
                      <div className="flex-1 h-1 bg-foreground/10">
                        <div
                          className={`h-full transition-all duration-1000 delay-300 ${
                            key === recommendation
                              ? "bg-[#1549CD]"
                              : "bg-foreground/20"
                          }`}
                          style={{ width: `${normalised[key]}%` }}
                        />
                      </div>
                      {key === recommendation && (
                        <p className="text-[11px] text-[#1549CD] shrink-0 font-medium">
                          ← recommended
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="space-y-6">
              <div className="border border-foreground/10 p-8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                  {program.label}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                  {program.detail}
                </p>
                <div className="mt-6 flex gap-4 text-sm">
                  <p className="font-medium">{program.pricing}</p>
                  <p className="text-foreground/60">{program.duration}</p>
                </div>
                <Link
                  href="/book"
                  className="mt-8 block w-full bg-[#1549CD] px-8 py-4 text-center text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#0e38a8]"
                >
                  Book a Discovery Call
                </Link>
                <p className="mt-3 text-xs text-foreground/40 text-center">
                  30 min. No pitch. Just clarity on the right next step.
                </p>
              </div>

              <div className="border border-foreground/10 p-6">
                <Link
                  href={program.href}
                  className="text-[11px] uppercase tracking-[0.15em] underline underline-offset-4 hover:text-foreground/60 transition-colors"
                >
                  Full program details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative option */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>ALTERNATIVELY</span>
            <span>[NC.2]</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] items-center">
            <div>
              <h3 className="text-xl font-light">{altProgram.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60 max-w-xl">
                {altProgram.tagline}
              </p>
              <p className="mt-2 text-[11px] text-white/40">
                {altProgram.pricing} · {altProgram.duration}
              </p>
            </div>
            <Link
              href={altProgram.href}
              className="text-[11px] uppercase tracking-[0.15em] border border-white/20 px-8 py-3 text-white/60 transition-colors hover:bg-white hover:text-foreground whitespace-nowrap"
            >
              See details →
            </Link>
          </div>
        </div>
      </section>

      {/* Retake */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm text-foreground/60">
            Want to run this with your team?
          </p>
          <Link
            href="/assess"
            className="mt-4 inline-block border border-foreground/20 px-8 py-3 text-[11px] uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:bg-foreground hover:text-white"
          >
            Retake the Finder
          </Link>
        </div>
      </section>
    </div>
  );
}
