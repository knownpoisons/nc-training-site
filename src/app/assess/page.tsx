"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { questions, DIMENSION_MAX } from "./questions";
import { computeResult, type AnswerRecord } from "./logic";
import { programs, alternativeProgram } from "./programs";
import { tierCopy, getStackAuditCopy } from "./tiers";

// ─── Section transitions ──────────────────────────────────────────────────────
const sectionIntros: Record<string, { label: string; description: string }> = {
  "Your Team": {
    label: "Section 02 / Your Team",
    description: "Now a quick read on the team itself.",
  },
  "Your Stack": {
    label: "Section 03 / Your Stack",
    description: "Last section — this audits the tools and blockers in play.",
  },
};

type Step = "landing" | "capture" | "section-intro" | "quiz" | "results";

export default function AssessPage() {
  const [step, setStep] = useState<Step>("landing");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [justSelected, setJustSelected] = useState<number | null>(null);
  const [multiSelections, setMultiSelections] = useState<number[]>([]);

  const q = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  // Reset multi-select state when question changes
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

  function advance(newAnswers: AnswerRecord[]) {
    const nextIndex = currentQ + 1;

    if (nextIndex >= questions.length) {
      // Last question answered — fire submission + go to results
      submitLead(newAnswers);
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

  function handleSingleClick(optionIndex: number) {
    if (justSelected !== null) return;
    setJustSelected(optionIndex);

    setTimeout(() => {
      const newAnswers: AnswerRecord[] = [
        ...answers,
        { questionId: q.id, indices: [optionIndex] },
      ];
      setAnswers(newAnswers);
      setJustSelected(null);
      advance(newAnswers);
    }, 320);
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
    const newAnswers: AnswerRecord[] = [
      ...answers,
      { questionId: q.id, indices: [...multiSelections].sort((a, b) => a - b) },
    ];
    setAnswers(newAnswers);
    advance(newAnswers);
  }

  async function submitLead(finalAnswers: AnswerRecord[]) {
    if (!email) return;
    const result = computeResult(finalAnswers);
    try {
      await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, result, answers: finalAnswers }),
      });
    } catch {
      // silent — user already has result client-side
    }
  }

  // Compute result client-side for rendering
  const result = answers.length === questions.length ? computeResult(answers) : null;

  // ═══════════════════════════════════════════════════════════════════════════════
  // LANDING
  // ═══════════════════════════════════════════════════════════════════════════════
  if (step === "landing") {
    return (
      <div className="min-h-screen" style={{ paddingTop: "calc(var(--announcement-height, 0px) + 3.5rem)" }}>
        <section className="min-h-[calc(100vh-3.5rem)] bg-[#1549CD] text-white flex items-center relative overflow-hidden">
          <div className="oci-grid-lines-light" />
          <div className="relative z-10 mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <img
              src="/images/logos/brand/NCT-Icon-blueonplatinum.png"
              alt=""
              className="mx-auto h-14 w-14 rounded-[2px] shadow-md ring-1 ring-white/10 mb-8"
            />
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
              AI Training Readiness Scorecard
            </p>
            <h1 className="mt-6 text-4xl lg:text-5xl font-light tracking-tight leading-tight">
              Find out where your team
              <br />
              actually stands.
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-white/60 max-w-md mx-auto">
              10 questions. 2 minutes. You&apos;ll get a readiness score, a tier diagnosis,
              a stack audit, and a program recommendation.
            </p>
            <button
              onClick={() => setStep("capture")}
              className="mt-10 cursor-pointer bg-white text-[#1549CD] px-10 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors"
            >
              Start the Scorecard →
            </button>
            <p className="mt-4 text-[11px] text-white/30">
              Free · No pitch to see results
            </p>
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
      <div className="min-h-screen" style={{ paddingTop: "calc(var(--announcement-height, 0px) + 3.5rem)" }}>
        <section className="py-32 lg:py-40 relative oci-grid-lines">
          <div className="mx-auto max-w-lg px-6 lg:px-8">
            <div className="oci-section-label mb-8">
              <span>SECTION 01 / YOUR SITUATION</span>
              <span>[NC]</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
              Where should we send your scorecard?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">
              The full readiness scorecard — score, tier, diagnosis, stack audit,
              and a program recommendation — sent to your inbox when you&apos;re done.
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
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company"
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
      <div className="min-h-screen" style={{ paddingTop: "calc(var(--announcement-height, 0px) + 3.5rem)" }}>
        <div className="fixed left-0 right-0 z-40 h-1 bg-foreground/10" style={{ top: "calc(var(--announcement-height, 0px) + 3.5rem)" }}>
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
    const isMulti = q.kind === "multi" || q.kind === "stack";
    const isFinal = !!q.isFinal;

    return (
      <div className="min-h-screen" style={{ paddingTop: "calc(var(--announcement-height, 0px) + 3.5rem)" }}>
        {/* Progress bar */}
        <div className="fixed left-0 right-0 z-40 h-1 bg-foreground/10" style={{ top: "calc(var(--announcement-height, 0px) + 3.5rem)" }}>
          <div
            className="h-full bg-[#1549CD] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <section className="py-32 lg:py-40 relative oci-grid-lines">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD]">
                {q.sectionLabel}
              </p>
              <p className="text-[11px] text-[#1549CD]">
                {currentQ + 1} of {questions.length} · Total Progress
              </p>
            </div>

            {/* Back button */}
            {currentQ > 0 && (
              <button
                onClick={() => {
                  setAnswers(answers.slice(0, -1));
                  setCurrentQ(currentQ - 1);
                }}
                className="mt-4 text-[11px] uppercase tracking-[0.15em] text-foreground/40 hover:text-[#1549CD] transition-colors cursor-pointer flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 3L4 7l4 4" />
                </svg>
                Back
              </button>
            )}

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
                      isMulti ? handleMultiToggle(i) : handleSingleClick(i)
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
                  {isFinal ? "See My Results →" : "Next →"}
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
  if (!result) {
    // Defensive — shouldn't happen. Kick them back to landing.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => setStep("landing")}
          className="text-[11px] uppercase tracking-[0.15em] underline"
        >
          ← Start over
        </button>
      </div>
    );
  }

  const tier = tierCopy[result.tier];
  const stack = getStackAuditCopy(result.stackBucket, result.stackCount);
  const program = programs[result.recommendedProgram];
  const altProgram = programs[alternativeProgram[result.recommendedProgram]];

  return (
    <div className="min-h-screen" style={{ paddingTop: "calc(var(--announcement-height, 0px) + 3.5rem)" }}>
      {/* ── Hero: score + tier ─────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] bg-[#1549CD] text-white overflow-hidden flex items-center">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 w-full">
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
            {name ? `${name}'s Scorecard` : "Your Scorecard"} · AI Readiness
          </p>

          <div className="mt-8 flex flex-col items-start">
            <p className="font-light leading-none tracking-tight text-white" style={{ fontSize: "clamp(6rem, 18vw, 13rem)" }}>
              {result.normalizedScore}
              <span className="text-white/30 font-light" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
                {" / 100"}
              </span>
            </p>
            <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.25em] text-white">
              {tier.label}
            </p>
          </div>

          <p className="mt-10 max-w-2xl text-base lg:text-lg leading-relaxed text-white/80 font-light">
            {tier.tagline}
          </p>
        </div>
      </section>

      {/* ── What this means (tier diagnosis) ──────────────────────────────── */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-8">
            <span>WHAT THIS MEANS</span>
            <span>[NC.1]</span>
          </div>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="text-lg leading-relaxed text-foreground/80 max-w-2xl">
                {tier.diagnosis}
              </p>
              <div className="mt-10 space-y-5">
                {tier.whatItMeans.map((w, i) => (
                  <div key={i} className="flex gap-5">
                    <span className="mt-1 text-2xl font-light text-[#1549CD]/30 shrink-0 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-foreground/70 leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Score summary card */}
            <div className="border border-foreground/10 p-8 self-start">
              <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                Summary
              </p>
              <p className="mt-4 text-5xl font-light text-[#1549CD]">
                {result.normalizedScore}
                <span className="text-foreground/30 text-xl">/100</span>
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] font-medium">
                {tier.label}
              </p>
              <div className="mt-6 space-y-2 text-xs text-foreground/60">
                <p>
                  Stack: <span className="text-foreground">Bucket {result.stackBucket}</span>{" "}
                  · {result.stackCount} tools
                </p>
                <p>
                  Recommended: <span className="text-foreground">{program.label}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The diagnosis: dimensions ─────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>THE DIAGNOSIS</span>
            <span>[NC.2]</span>
          </div>
          <p className="oci-display-sm max-w-3xl">Three dimensions. One picture.</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            Your score isn&apos;t one number — it&apos;s a composite. Here&apos;s how
            each dimension shakes out on its own.
          </p>

          <div className="mt-12 space-y-8 max-w-3xl">
            <DimensionBar
              label="Adoption"
              description="How embedded AI is in day-to-day work right now."
              score={result.dimensions.adoption}
              max={DIMENSION_MAX.adoption}
            />
            <DimensionBar
              label="Readiness"
              description="Prior training, urgency, team size, and where you want to land."
              score={result.dimensions.readiness}
              max={DIMENSION_MAX.readiness}
            />
            <DimensionBar
              label="Blockers"
              description="How much of the work to unblock AI adoption has been done."
              score={result.dimensions.blockers}
              max={DIMENSION_MAX.blockers}
            />
          </div>
        </div>
      </section>

      {/* ── Stack audit ───────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-8">
            <span>YOUR STACK</span>
            <span>[NC.3]</span>
          </div>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="oci-display-sm max-w-2xl">{stack.headline}</p>
              <p className="mt-6 text-base leading-relaxed text-foreground/70 max-w-2xl">
                {stack.body}
              </p>
              <div className="mt-8 border-l-2 border-[#1549CD] pl-6 max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40 mb-2">
                  Priority
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {stack.takeaway.replace(/^Priority: /, "")}
                </p>
              </div>
            </div>

            <div className="border border-foreground/10 p-8 self-start">
              <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                Tools in rotation
              </p>
              <p className="mt-4 text-5xl font-light text-[#1549CD]">
                {result.stackCount}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] font-medium">
                Bucket {result.stackBucket}
              </p>
              <p className="mt-6 text-xs text-foreground/60 leading-relaxed">
                {result.stackBucket === "A"
                  ? "Light stack. Methodology is your unlock."
                  : "Deep stack. Consolidation is your unlock."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Program recommendation ────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-[#E8E6E0] relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-8">
            <span>RECOMMENDED PROGRAM</span>
            <span>[NC.4]</span>
          </div>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                Based on your tier
              </p>
              <h3 className="mt-3 text-4xl lg:text-5xl font-light tracking-tight">
                {program.label}
              </h3>
              <p className="mt-4 text-lg text-foreground/70 max-w-2xl">
                {program.tagline}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-foreground/70 max-w-2xl">
                {program.detail}
              </p>
              <p className="mt-8 text-[11px] uppercase tracking-[0.15em] text-foreground/50">
                {program.pricing} · {program.duration}
              </p>
            </div>

            {/* CTA card */}
            <div className="space-y-4 self-start">
              <div className="border border-foreground/20 bg-background p-8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                  Next Step
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                  30 minutes with Jeremy. No pitch. He maps the program to your
                  specific team and timeline.
                </p>
                <Link
                  href="/book"
                  className="mt-6 block w-full bg-[#1549CD] px-8 py-4 text-center text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#0e38a8]"
                >
                  Book a Discovery Call
                </Link>
                <Link
                  href={program.href}
                  className="mt-3 block w-full border border-foreground/20 px-8 py-4 text-center text-[11px] uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-white"
                >
                  Program Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alternative program ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>ALTERNATIVELY</span>
            <span>[NC.5]</span>
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

      {/* ── Retake + inbox nudge ──────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm text-foreground/60">
            Check your inbox — the full scorecard is on its way to{" "}
            <span className="text-foreground">{email}</span>.
          </p>
          <Link
            href="/assess"
            className="mt-4 inline-block border border-foreground/20 px-8 py-3 text-[11px] uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:bg-foreground hover:text-white"
          >
            Retake the Scorecard
          </Link>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DimensionBar
// ═══════════════════════════════════════════════════════════════════════════════
function DimensionBar({
  label,
  description,
  score,
  max,
}: {
  label: string;
  description: string;
  score: number;
  max: number;
}) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-medium">
            {label}
          </p>
          <p className="mt-1 text-xs text-white/50 max-w-md">{description}</p>
        </div>
        <p className="text-[11px] font-light text-white/70 whitespace-nowrap ml-4">
          {score} / {max}
        </p>
      </div>
      <div className="mt-3 h-[3px] w-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
