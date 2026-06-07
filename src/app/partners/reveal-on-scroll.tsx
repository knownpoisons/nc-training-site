"use client";

import { useEffect } from "react";

// ─── Scroll-reveal for partner-playbook sections ─────────────────────────────
// Fades + slides each section in as it enters the viewport. Sections that are
// ALREADY in view at observe time (above the fold) appear instantly — no
// flash of invisible content during hydration. Respects prefers-reduced-motion.
export function RevealOnScroll() {
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const targets = document.querySelectorAll(
      ".partners .section, .partners .foot"
    );

    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).animate(
            [
              { opacity: 0, transform: "translateY(20px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 700, easing: ease, fill: "both" }
          );
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    // Skip above-fold sections so they paint instantly with no animation
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (alreadyVisible) return;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
