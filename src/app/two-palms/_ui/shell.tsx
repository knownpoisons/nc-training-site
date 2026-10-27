"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clocks } from "./bits";

const NAV = [
  { href: "/two-palms", label: "Home" },
  { href: "/two-palms/foundations", label: "Foundations" },
  { href: "/two-palms/creative", label: "Creative" },
  { href: "/two-palms/setup", label: "Setup" },
  { href: "/two-palms/prompts", label: "Prompts" },
  { href: "/two-palms/kit", label: "Kit" },
  { href: "/two-palms/backstage", label: "Backstage" },
];

export function Header() {
  const p = usePathname() ?? "";
  return (
    <header className="tp-header">
      <div className="tp-wrap tp-header-in">
        <Link href="/two-palms" className="tp-logo" aria-label="Two Palms AI Hub">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/two-palms/wordmark-black.png" alt="Two Palms" style={{ height: 13 }} />
          <span className="tp-logo-x">x</span>
          <span className="tp-logo-t">AI Hub</span>
        </Link>
        <nav className="tp-nav" aria-label="Hub">
          {NAV.map((n) => {
            const active = n.href === "/two-palms" ? p === "/two-palms" : p.startsWith(n.href);
            return <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}>{n.label}</Link>;
          })}
        </nav>
        <Clocks />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="tp-footer">
      <div className="tp-wrap tp-footer-in">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/two-palms/wordmark-black.png" alt="Two Palms" />
          <span className="tp-hand tp-orange">x NotContent</span>
        </div>
        <div>Sydney · Munich · Private. Don&rsquo;t share the link outside the team.</div>
        <div>© {new Date().getFullYear()} Two Palms Media &amp; NotContent.ai</div>
      </div>
    </footer>
  );
}
