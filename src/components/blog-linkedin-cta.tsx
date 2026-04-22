/**
 * "Blog not doing it for ya?" LinkedIn CTA.
 * Renders on every blog post below the author bio card,
 * directing readers to Jeremy's LinkedIn activity for more.
 */
export function BlogLinkedInCta() {
  return (
    <section className="py-8 lg:py-10">
      <div className="mx-auto max-w-[680px] px-6 lg:px-8">
        <a
          href="https://www.linkedin.com/in/jeremy-somers/recent-activity/all/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-6 p-6 border-2 border-[#1549CD]/15 bg-[#1549CD]/[0.02] transition-colors hover:border-[#1549CD]/40 hover:bg-[#1549CD]/[0.04]"
        >
          <div>
            <p className="font-mono text-[15px] lg:text-[17px] font-medium text-foreground leading-snug">
              Blog not doing it for ya?
            </p>
            <p className="mt-1 font-sans text-[14px] text-foreground/60 leading-snug">
              Try some of Jeremy&apos;s rants and predictions on LinkedIn.
            </p>
          </div>
          <span
            aria-hidden
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] font-semibold text-[#1549CD] transition-transform duration-200 group-hover:translate-x-1"
          >
            LinkedIn →
          </span>
        </a>
      </div>
    </section>
  );
}
