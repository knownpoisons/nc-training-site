"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  // Multi-select: tracks which option indices are toggled for the current question
  const [multiSelections, setMultiSelections] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const q = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  // Reset multi-select state when question changes
  useEffect(() => {
    setMultiSelections([]);
  }, [currentQ]);

  // Scroll to top on step/question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQ, step]);

  function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    setStep("quiz");
  }

  // ── Advance to next question ─────────────────────────────────────────────────
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

  // ── Single-select click (Section 2 questions) ────────────────────────────────
  function handleOptionClick(optionIndex: number) {
    if (justSelected !== null) return; // debounce

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

  // ── Multi-select toggle ───────────────────────────────────────────────────────
  function handleMultiToggle(optionIndex: number) {
    setMultiSelections((prev) =>
      prev.includes(optionIndex)
        ? prev.filter((i) => i !== optionIndex)
        : [...prev, optionIndex]
    );
  }

  // ── Multi-select: commit and advance ─────────────────────────────────────────
  function handleMultiNext() {
    if (multiSelections.length === 0) return;

    // Collect selected options (preserve click order for scoring)
    const selectedOpts = multiSelections.map((i) => q.options[i]);
    // Use lowest index as the primary signal for getReasons
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
        <section className="nc-section pt-32 lg:pt-40">
          <div className="nc-container">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Free · 5 minutes
            </p>
            <h1 className="nc-heading-xl mt-4 max-w-3xl">
              Find the right training for your team.
            </h1>
            <p className="nc-body-lg mt-6 max-w-xl">
              12 questions about what you want to achieve, where your team is now,
              and what&apos;s in the way. We&apos;ll recommend the program that
              actually fits — not just the most expensive one.
            </p>

            <div className="mt-8 max-w-sm space-y-2">
              {[
                "A personalised program recommendation",
                "3 specific reasons it fits your situation",
                "Fit scores across all 3 programs",
                "Pricing, format, and a clear next step",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-foreground/40 text-xs">✓</span>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-2xl">
              {[
                {
                  n: "01",
                  label: "Your Goal",
                  q: "What are you trying to achieve?",
                },
                {
                  n: "02",
                  label: "Your Team",
                  q: "Where are you right now?",
                },
                {
                  n: "03",
                  label: "Your Context",
                  q: "What's in the way?",
                },
              ].map((s) => (
                <div key={s.n} className="border border-foreground/10 p-5">
                  <p className="text-2xl font-light text-foreground/20">{s.n}</p>
                  <p className="mt-2 text-xs uppercase tracking-widest font-medium">
                    {s.label}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {s.q}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Button
                size="lg"
                className="cursor-pointer text-sm uppercase tracking-widest"
                onClick={() => setStep("capture")}
              >
                Find My Program →
              </Button>
              <p className="text-xs text-muted-foreground">
                Free. No pitch required to see your recommendation.
              </p>
            </div>

            <div className="mt-16 border-t border-foreground/10 pt-10 max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Informed by training teams at
              </p>
              <p className="text-sm text-muted-foreground">
                Cash App · Maesa · Herman Scheer · Adidas · Google · Tommy Hilfiger
              </p>
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
        <section className="nc-section pt-32 lg:pt-40">
          <div className="nc-container max-w-lg">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Section 01 / Your Goal
            </p>
            <h2 className="nc-heading-lg mt-4">
              Where should we send your recommendation?
            </h2>
            <p className="nc-body mt-4 text-muted-foreground">
              Your personalised program recommendation — with the reasoning behind
              it — sent straight to your inbox when you&apos;re done.
            </p>

            <form onSubmit={handleCapture} className="mt-10 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  className="mt-2 w-full border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-foreground transition-colors"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full cursor-pointer text-sm uppercase tracking-widest mt-2"
                disabled={!name || !email}
              >
                Start →
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTION INTRO (transition screen between sections)
  // ═══════════════════════════════════════════════════════════════════════════════
  if (step === "section-intro" && pendingSection) {
    const intro = sectionIntros[pendingSection];
    return (
      <div className="min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-foreground/10">
          <div
            className="h-full bg-cobalt transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <section className="nc-section pt-32 lg:pt-40 bg-foreground text-background">
          <div className="nc-container max-w-lg">
            <p className="text-xs uppercase tracking-widest text-background/50">
              {intro.label}
            </p>
            <h2 className="nc-heading-lg mt-4 text-background">
              {intro.description}
            </h2>
            <Button
              size="lg"
              variant="outline"
              className="mt-10 cursor-pointer border-background/30 text-xs uppercase tracking-widest text-background hover:bg-background hover:text-foreground"
              onClick={() => {
                setPendingSection(null);
                setStep("quiz");
              }}
            >
              Continue →
            </Button>
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
            className="h-full bg-cobalt transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <section className="nc-section pt-32 lg:pt-40">
          <div className="nc-container max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {q.section} · {q.sectionIndex}/{q.sectionTotal}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentQ + 1} / {questions.length}
              </p>
            </div>

            {/* Question */}
            <h2 className="nc-heading-md mt-6 leading-snug">{q.text}</h2>

            {/* Multi-select hint */}
            {isMulti && (
              <p className="mt-2 text-xs text-muted-foreground uppercase tracking-widest">
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
                          ? "border-foreground bg-foreground text-background"
                          : isSelected
                          ? "border-cobalt bg-cobalt/8 text-foreground"
                          : isFading
                          ? "border-foreground/10 text-foreground/30 cursor-not-allowed"
                          : "border-foreground/15 hover:border-cobalt/50 text-foreground"
                      }`}
                  >
                    {/* Checkbox indicator for multi-select */}
                    {isMulti && (
                      <span
                        className={`mt-0.5 shrink-0 w-4 h-4 border flex items-center justify-center transition-all duration-150 ${
                          isSelected
                            ? "border-cobalt bg-cobalt"
                            : "border-foreground/30"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            className="text-background"
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
                <Button
                  size="lg"
                  className="cursor-pointer text-sm uppercase tracking-widest"
                  disabled={multiSelections.length === 0}
                  onClick={handleMultiNext}
                >
                  {currentQ + 1 === questions.length ? "See My Result →" : "Next →"}
                </Button>
              </div>
            )}

            {/* Step dots */}
            <div className="mt-10 flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 transition-all duration-300 ${
                    i < currentQ
                      ? "bg-foreground"
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
      {/* Hero — dark */}
      <section className="nc-section pt-32 lg:pt-40 bg-foreground text-background">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-background/50">
            {name ? `${name}'s Result` : "Your Result"} · Program Finder
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-3xl">
            {program.tagline}
          </h1>
          <div className="mt-6 inline-flex items-center border border-cobalt/40 bg-cobalt/10 px-5 py-2">
            <p className="text-xs uppercase tracking-widest text-cobalt/80">
              Recommended:
            </p>
            <p className="ml-3 text-sm font-medium text-background">
              {program.label}
            </p>
          </div>
        </div>
      </section>

      {/* Why this program */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Why this fits
              </p>
              <div className="mt-8 space-y-6">
                {reasons.map((reason, i) => (
                  <div key={i} className="flex gap-5">
                    <span className="mt-1 text-2xl font-light text-foreground/20 shrink-0 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="nc-body text-muted-foreground leading-relaxed">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
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
                        className={`text-xs uppercase tracking-widest w-28 shrink-0 ${
                          key === recommendation
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </p>
                      <div className="flex-1 h-1 bg-foreground/10">
                        <div
                          className={`h-full transition-all duration-1000 delay-300 ${
                            key === recommendation
                              ? "bg-cobalt"
                              : "bg-foreground/20"
                          }`}
                          style={{ width: `${normalised[key]}%` }}
                        />
                      </div>
                      {key === recommendation && (
                        <p className="text-xs text-cobalt shrink-0 font-medium">
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
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {program.label}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {program.detail}
                </p>
                <div className="mt-6 flex gap-4 text-sm">
                  <p className="font-medium">{program.pricing}</p>
                  <p className="text-muted-foreground">{program.duration}</p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 w-full cursor-pointer text-sm uppercase tracking-widest"
                >
                  <Link href="/book">Book a Training Assessment</Link>
                </Button>
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  30 min. No pitch. Just clarity on the right next step.
                </p>
              </div>

              {/* See program details */}
              <div className="border border-foreground/10 p-6">
                <Link
                  href={program.href}
                  className="text-xs uppercase tracking-widest underline underline-offset-4 hover:text-muted-foreground transition-colors"
                >
                  Full program details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative option */}
      <section className="nc-divider nc-section bg-foreground/[0.02]">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Alternatively
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] items-center">
            <div>
              <h3 className="text-lg font-light">{altProgram.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-xl">
                {altProgram.tagline}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {altProgram.pricing} · {altProgram.duration}
              </p>
            </div>
            <Link
              href={altProgram.href}
              className="text-xs uppercase tracking-widest underline underline-offset-4 whitespace-nowrap hover:text-muted-foreground transition-colors"
            >
              See details →
            </Link>
          </div>
        </div>
      </section>

      {/* Retake */}
      <section className="nc-divider nc-section">
        <div className="nc-container text-center">
          <p className="text-sm text-muted-foreground">
            Want to run this with your team?
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-4 cursor-pointer text-xs uppercase tracking-widest"
          >
            <Link href="/assess">Retake the Finder</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
