import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Book a Training Assessment",
  description:
    "30 minutes. No pitch. A diagnostic of where your creative team stands with AI and what a training roadmap could look like.",
};

export default function BookPage() {
  return (
    <>
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="order-last lg:order-first">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Let&apos;s Talk
              </p>
              <h1 className="nc-heading-xl mt-4">
                Book your Training Assessment.
              </h1>
              <p className="nc-body-lg mt-6">
                30 minutes with Jeremy Somers. No pitch deck. No pressure. You
                describe where your team is, he maps what&apos;s possible and
                what the right program looks like. You leave with clarity
                regardless of whether you move forward.
              </p>

              <div className="mt-12 space-y-8">
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="text-sm font-medium uppercase tracking-widest">
                    What We&apos;ll Cover
                  </h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/40" />
                      Your team&apos;s current AI maturity and workflow gaps
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/40" />
                      Where AI would have the highest impact on your output
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/40" />
                      Which program tier fits your team&apos;s needs
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/40" />
                      A rough timeline and next steps
                    </li>
                  </ul>
                </div>

                <div className="border-l-2 border-foreground/20 pl-6">
                  <h3 className="text-sm font-medium uppercase tracking-widest">
                    About Jeremy
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    15+ years as a creative director — Nike, Apple, Pepsi,
                    Spotify. Founded NotContent as one of the first AI-assisted
                    creative agencies. Has trained enterprise teams at Cash App,
                    Herman Scheer, and Maesa. He&apos;s not teaching theory —
                    he&apos;s teaching what he ships.
                  </p>
                </div>

                <div className="border-l-2 border-foreground/20 pl-6">
                  <h3 className="text-sm font-medium uppercase tracking-widest">
                    What Happens Next
                  </h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/40" />
                      You book a time — it takes 30 seconds
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/40" />
                      Jeremy reviews your team context before the call
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/40" />
                      30-minute call — you leave with a clear recommendation and next step
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground/40" />
                      If it&apos;s a fit, we send a scoped proposal within 48 hours
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="order-first flex items-start justify-center lg:order-last lg:pt-12">
              <div className="w-full border border-foreground/10 p-10 flex flex-col gap-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    30 min · Free
                  </p>
                  <h2 className="nc-heading-md mt-3">
                    Training Assessment with Jeremy Somers
                  </h2>
                  <p className="nc-body mt-4 text-muted-foreground">
                    A diagnostic of where your creative team stands with AI,
                    what&apos;s possible, and what the right program looks like
                    for your specific context.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 bg-foreground/40" />
                    Video call (link sent on confirmation)
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 bg-foreground/40" />
                    No pitch. No deck. Just conversation.
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 bg-foreground/40" />
                    You&apos;ll leave with clarity on the right next step.
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="cursor-pointer text-sm uppercase tracking-widest"
                >
                  <Link
                    href="https://bit.ly/30minsofnotcontent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book a Time →
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground text-center -mt-4">
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
