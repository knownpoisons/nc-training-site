"use client";

import { useEffect, useState } from "react";

// Phase-aware sticky topbar for /methodology.
// Watches the phase sections via IntersectionObserver and updates the
// counter as the reader scrolls. "Phase 0X of 04" anchors the reader on
// a long page; pairs with the per-phase arc-position eyebrows below.
export function MethodologyTopbar() {
  const [activePhase, setActivePhase] = useState<string>("00");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const phaseEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-phase]"),
    );
    if (phaseEls.length === 0) return;

    // IO that finds the phase closest to the top of the viewport.
    const updateActivePhase = () => {
      const viewportMid = window.innerHeight * 0.3;
      let nearest: HTMLElement | null = null;
      let nearestDist = Infinity;
      for (const el of phaseEls) {
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top - viewportMid);
        if (r.top < window.innerHeight && r.bottom > 0 && dist < nearestDist) {
          nearestDist = dist;
          nearest = el;
        }
      }
      if (nearest) {
        const p = nearest.getAttribute("data-phase");
        if (p) setActivePhase(p);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
      updateActivePhase();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={[
        "sticky top-14 z-30 transition-all duration-200",
        "bg-background/85 backdrop-blur-md",
        scrolled
          ? "border-b border-foreground/10 shadow-[0_1px_0_0_rgba(19,56,190,0.06)]"
          : "border-b border-transparent",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8 h-11 flex items-center justify-between gap-4">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-foreground/65 font-medium truncate">
          <span className="hidden sm:inline">NotContent · </span>The Method
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#1338BE] font-semibold tabular-nums shrink-0">
          Phase {activePhase} <span className="text-foreground/40 font-normal mx-1">/</span> 04
        </span>
      </div>
    </div>
  );
}
