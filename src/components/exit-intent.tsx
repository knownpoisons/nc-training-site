"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const EXCLUDED_PATHS = ["/assess", "/book"];
const STORAGE_KEY = "nc-exit-shown";
const ARM_DELAY = 3000;

export function ExitIntent() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const armed = useRef(false);
  const lastScrollY = useRef(0);

  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  const dismiss = useCallback(() => {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  const trigger = useCallback(() => {
    if (!armed.current) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {}
    setShow(true);
    armed.current = false;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || isExcluded) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }

    const armTimer = setTimeout(() => {
      armed.current = true;
    }, ARM_DELAY);

    // Desktop: cursor leaves viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener("mouseout", handleMouseLeave);

    // Mobile: scroll-up gesture detection
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = lastScrollY.current - currentY;
      // User scrolled up more than 100px from a deep position
      if (delta > 100 && lastScrollY.current > 400) {
        trigger();
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(armTimer);
      document.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isExcluded, trigger]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
      onClick={dismiss}
    >
      <div
        className="relative mx-4 max-w-lg w-full bg-[#1549CD] p-10 lg:p-14 text-white animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-sm"
          aria-label="Close"
        >
          ✕
        </button>
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/50">
          Before you go —
        </p>
        <h2 className="mt-4 text-2xl lg:text-3xl font-medium tracking-tight leading-snug">
          See where your team stands in 2 minutes.
        </h2>
        <p className="mt-4 text-sm text-white/60 leading-relaxed">
          The AI Training Readiness Scorecard gives you a personalized program
          recommendation based on your team&apos;s current situation.
        </p>
        <Link
          href="/assess"
          onClick={dismiss}
          className="mt-8 inline-block bg-white text-[#1549CD] px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors"
        >
          Take the Readiness Scorecard →
        </Link>
      </div>
    </div>
  );
}
