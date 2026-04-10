import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description:
    "30 minutes. No pitch. A diagnostic of where your creative team stands with AI and what a training roadmap could look like.",
};

export default function BookPage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>BOOK A DISCOVERY CALL</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-3xl">
            Let&apos;s talk.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            30 minutes with Jeremy Somers. No pitch deck. No pressure. You
            describe where your team is, he maps what&apos;s possible and
            what the right program looks like.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-12">
                <span>WHAT WE COVER</span>
                <span>[NC.1]</span>
              </div>

              <div className="space-y-4">
                {[
                  "Your team's current AI maturity and workflow gaps",
                  "Where AI would have the highest impact on your output",
                  "Which program tier fits your team's needs",
                  "A rough timeline and next steps",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/60">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-[#1549CD]/40" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-12 border-t border-foreground/10 pt-8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40 mb-4">
                  About Jeremy
                </p>
                <p className="text-sm leading-relaxed text-foreground/60">
                  15+ years as a creative director — Nike, Apple, Pepsi,
                  Spotify. Founded NotContent as one of the first AI-assisted
                  creative agencies. Has trained enterprise teams at Cash App,
                  Herman Scheer, and Maesa. He&apos;s not teaching theory —
                  he&apos;s teaching what he ships.
                </p>
              </div>

              <div className="mt-12 border-t border-foreground/10 pt-8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40 mb-4">
                  What Happens Next
                </p>
                <div className="space-y-3">
                  {[
                    "You book a time — it takes 30 seconds",
                    "Jeremy reviews your team context before the call",
                    "30-minute call — you leave with a clear recommendation and next step",
                    "If it's a fit, we send a scoped proposal within 48 hours",
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/60">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/30" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="flex items-start justify-center lg:pt-12">
              <div className="w-full border border-foreground/10 p-10">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                  30 min · Free
                </p>
                <h2 className="mt-4 text-2xl font-light tracking-tight">
                  30-Minute Call with Jeremy Somers
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                  A diagnostic of where your creative team stands with AI,
                  what&apos;s possible, and what the right program looks like
                  for your specific context.
                </p>

                <div className="mt-6 space-y-3 text-sm text-foreground/60">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 bg-[#1549CD]/40" />
                    Video call (link sent on confirmation)
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 bg-[#1549CD]/40" />
                    No pitch. No deck. Just conversation.
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 bg-[#1549CD]/40" />
                    You&apos;ll leave with clarity on the right next step.
                  </div>
                </div>

                <Link
                  href="https://bit.ly/30minsofnotcontent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 block w-full bg-[#1549CD] px-8 py-4 text-center text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#0e38a8]"
                >
                  Book a Time →
                </Link>

                <p className="mt-4 text-xs text-foreground/40 text-center">
                  Opens Google Calendar · Pick a time that works
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
