"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Programs", href: "/programs" },
  { name: "Imperative", href: "/programs/imperative" },
  { name: "About", href: "/about" },
  { name: "Methodology", href: "/methodology" },
  { name: "Results", href: "/results" },
  { name: "Blog", href: "/blog" },
  { name: "Readiness Scorecard", href: "/assess" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{ top: "var(--announcement-height, 0px)" }}
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#E8E6E0]/95 backdrop-blur-sm border-b border-[#1549CD]/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex h-14 items-center justify-between">
        <Link href="/" className="text-[11px] font-semibold uppercase tracking-[0.15em]">
          NOTCONTENT{" "}
          <span className="font-light text-foreground/40">/ training</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-[11px] uppercase tracking-[0.15em] text-foreground/50 transition-colors hover:text-foreground after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-[#1549CD] after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/book"
            className="ml-2 px-5 py-2 bg-[#1549CD] text-white text-[11px] uppercase tracking-[0.15em] hover:bg-[#0e38a8] transition-colors"
          >
            Book a Discovery Call
          </Link>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="cursor-pointer p-2" aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-l border-[#1549CD]/10 bg-[#E8E6E0] pt-16">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="flex flex-col gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-light tracking-tight"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="mt-4 block w-full py-4 bg-[#1549CD] text-white text-center text-[11px] uppercase tracking-[0.15em]"
              >
                Book a Discovery Call
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
