"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Programs", href: "/programs/transformation" },
  { name: "About", href: "/about" },
  { name: "Methodology", href: "/methodology" },
  { name: "Results", href: "/results" },
  { name: "Blog", href: "/blog" },
  { name: "Scorecard", href: "/assess" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="nc-container flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          NOTCONTENT{" "}
          <span className="font-light text-muted-foreground">/ training</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          <Button asChild size="sm" className="cursor-pointer text-xs uppercase tracking-widest">
            <Link href="/book">Book a Call</Link>
          </Button>
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
          <SheetContent side="right" className="w-full border-l border-foreground/10 bg-background pt-16">
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
              <Button asChild size="lg" className="mt-4 cursor-pointer text-sm uppercase tracking-widest">
                <Link href="/book" onClick={() => setOpen(false)}>
                  Book a Call
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
