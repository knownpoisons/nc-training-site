"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  /** The display string, e.g. "$8M+" or "90%" or "3" */
  value: string;
  className?: string;
}

/**
 * Extracts a leading number from a stat string and animates it.
 * E.g. "$8M+" → animates 0→8, renders "$8M+"
 *      "90%" → animates 0→90, renders "90%"
 *      "Tens of millions" → no animation, renders as-is
 */
export function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.unobserve(el);
          animateValue();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  });

  function animateValue() {
    // Extract numeric part: "$3.5M" → prefix="$", num=3.5, suffix="M"
    const match = value.match(/^([^0-9]*)([\d.]+)(.*)$/);
    if (!match) {
      setDisplayed(value);
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      setDisplayed(`${prefix}${current.toFixed(decimals)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayed(value);
      }
    }

    requestAnimationFrame(tick);
  }

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}
