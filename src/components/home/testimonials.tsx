"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";

const testimonials = [
  {
    company: "Cash App",
    quote:
      "Jeremy’s training was fun and really gave us the strategies, frameworks, and tools that we needed to completely revolutionize how we produce creative — both internally for pitching and externally for production.",
    name: "Jose Diaz",
    title: "Head of Production, Cash App",
    context: "Post-training debrief",
  },
  {
    company: "Herman Scheer",
    quote:
      "Jeremy taught our group to fish. In the deep, murky, ever-changing seas of generative AI, Jeremy has provided guidance and solutions for our creative challenges that have fundamentally changed how we deliver value and world-class creative to our partners. And made it fun to boot.",
    name: "John Scheer",
    title: "CEO, Herman Scheer",
    context: "On the 8-week engagement",
  },
  {
    company: "HP",
    quote:
      "Jeremy Somers is one of the most capable AI practitioners I know, and one of the most generous. He doesn’t guard his best ideas; he shares them freely, and that generosity has directly shaped my business. Using tools Jeremy shared, I landed my first client and became far more confident using AI to deliver better results.",
    name: "Mike Gonzales",
    title: "Chief of Staff, HP",
    context: "On learning from Jeremy",
  },
];

// Editorial quote carousel — the one stateful section on the homepage.
// Extracted so the rest of page.tsx can render as a server component.
export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index]!;

  return (
    <section className="py-32 lg:py-44 relative oci-grid-lines">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="oci-section-label">
            <span>Testimonials</span>
            <span>[NC.2]</span>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[200px_1fr] gap-12 lg:gap-16 items-start">
          {/* Left: company name + pagination */}
          <div>
            <Reveal delay={100}>
              <p className="text-2xl font-medium tracking-tight">{t.company}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}/
                  {String(testimonials.length).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() =>
                      setIndex(index > 0 ? index - 1 : testimonials.length - 1)
                    }
                    className="text-[#1338BE] hover:text-[#0e38a8] transition-colors cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 10l4-4 4 4" />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setIndex(index < testimonials.length - 1 ? index + 1 : 0)
                    }
                    className="text-[#1338BE] hover:text-[#0e38a8] transition-colors cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: quote */}
          <div>
            <Reveal delay={200}>
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light leading-snug tracking-tight">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-foreground/10" />
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {t.name}, {t.title}
                </p>
              </div>
              <p className="mt-2 text-right text-[11px] text-muted-foreground/60">
                {t.context}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
