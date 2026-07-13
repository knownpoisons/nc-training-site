import type { Metadata } from "next";
import "./deck.css";

// The Deck is private — never indexed, its own fonts, its own world.
export const metadata: Metadata = {
  title: "The Deck — Cockpit",
  robots: { index: false, follow: false },
};

export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dk">
      {/* Cobalt Paper type: Instrument Serif (display) + Geist (everything else) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
