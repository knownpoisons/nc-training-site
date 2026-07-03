"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

// A serif phrase that wipes in left-to-right via clip-path when it enters view.
// Used on the editorial italic accents (anthem "tools.", etc.). Reduced motion
// renders it plainly. Inline by default so it sits mid-sentence.
export function ItalicWipe({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{children}</span>;

  return (
    <motion.span
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
