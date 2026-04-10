"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const EXCLUDED_PATHS = ["/assess", "/book"];
const STORAGE_KEY = "nc-scroll-popup-shown";
const SCROLL_THRESHOLD = 0.5; // 50% of page
const TIME_DELAY = 10000; // 10 seconds

export function ScrollPopup() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const timerReady = useRef(false);
  const scrollReady = useRef(false);
  const triggered = useRef(false);

  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  const dismiss = useCallback(() => {
    setShow(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  const tryTrigger = useCallback(() => {
    if (triggered.current) return;
    if (!timerReady.current || !scrollReady.current) return;

    // Don't fire if exit-intent already shown
    try {
      if (localStorage.getItem("nc-exit-shown") === "1") return;
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {}

    triggered.current = true;
    setShow(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || isExcluded) return;

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      if (localStorage.getItem("nc-exit-shown") === "1") return;
    } catch {
      return;
    }

    const timer = setTimeout(() => {
      timerReady.current = true;
      tryTrigger();
    }, TIME_DELAY);

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= SCROLL_THRESHOLD) {
        scrollReady.current = true;
        tryTrigger();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isExcluded, tryTrigger]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
      onClick={dismiss}
    >
      <div
        className="relative mx-4 max-w-lg w-full bg-white border border-[#1549CD]/20 p-10 lg:p-14 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-foreground/30 hover:text-foreground transition-colors text-sm cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
        <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
          While you&apos;re here —
        </p>
        <h2 className="mt-4 text-2xl lg:text-3xl font-medium tracking-tight leading-snug">
          See how your team compares.
        </h2>
        <p className="mt-4 text-sm text-foreground/60 leading-relaxed">
          Enterprise creative teams at Cash App, Maesa, and Herman Scheer have
          already transformed their operations. Find out where your team stands
          — it takes 2 minutes.
        </p>
        <Link
          href="/assess"
          onClick={dismiss}
          className="mt-8 inline-block bg-[#1549CD] text-white px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-[#0e38a8] transition-colors"
        >
          Take the Readiness Scorecard →
        </Link>
      </div>
    </div>
  );
}
