"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Animation direction — default "up" */
  direction?: "up" | "left" | "right" | "none";
  /** Delay in ms before animation starts */
  delay?: number;
  /** IntersectionObserver threshold — default 0.15 */
  threshold?: number;
}

export function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediately check if already in viewport (avoids flash of invisible content)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const transforms: Record<string, string> = {
    up: "translate3d(0, 32px, 0)",
    left: "translate3d(-32px, 0, 0)",
    right: "translate3d(32px, 0, 0)",
    none: "translate3d(0, 0, 0)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0)" : transforms[direction],
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
