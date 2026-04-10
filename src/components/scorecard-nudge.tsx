"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const HIDDEN_PATHS = ["/assess", "/book"];

export function ScorecardNudge() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("scorecard-nudge-dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("scorecard-nudge-dismissed", "1");
  };

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
      <Link
        href="/assess"
        className="flex items-center gap-2 rounded-full bg-[#1549CD] px-5 py-3 text-[11px] uppercase tracking-[0.15em] text-white shadow-lg transition-all hover:bg-[#0e38a8] hover:shadow-xl"
      >
        Take the Readiness Scorecard →
      </Link>
      <button
        onClick={handleDismiss}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/80 text-white/60 text-xs transition-colors hover:bg-foreground hover:text-white"
        aria-label="Dismiss scorecard nudge"
      >
        ✕
      </button>
    </div>
  );
}
