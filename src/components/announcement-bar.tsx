"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const EXCLUDED_PATHS = ["/assess", "/book"];
const STORAGE_KEY = "nc-announcement-dismissed";
const BAR_HEIGHT = 40;

export function AnnouncementBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isExcluded) {
      document.documentElement.style.removeProperty("--announcement-height");
      return;
    }

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }

    setVisible(true);
    document.documentElement.style.setProperty(
      "--announcement-height",
      `${BAR_HEIGHT}px`
    );

    return () => {
      document.documentElement.style.removeProperty("--announcement-height");
    };
  }, [isExcluded]);

  function dismiss() {
    setVisible(false);
    document.documentElement.style.removeProperty("--announcement-height");
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-foreground text-white"
      style={{ height: BAR_HEIGHT }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        <p className="text-[11px] tracking-[0.1em] text-white/70 truncate">
          Most teams think they&apos;re AI-ready. Almost none actually are.
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/assess"
            onClick={dismiss}
            className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD] font-medium hover:text-white transition-colors hidden sm:inline"
          >
            Take the Readiness Scorecard →
          </Link>
          <Link
            href="/assess"
            onClick={dismiss}
            className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD] font-medium hover:text-white transition-colors sm:hidden"
          >
            Scorecard →
          </Link>
          <button
            onClick={dismiss}
            className="text-white/30 hover:text-white transition-colors text-xs cursor-pointer"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
