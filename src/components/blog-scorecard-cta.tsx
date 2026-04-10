import Link from "next/link";

export function BlogScorecardCta() {
  return (
    <section className="py-12 lg:py-16 bg-[#1549CD] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg lg:text-xl font-medium tracking-tight">
            See where your team stands
          </p>
          <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-md">
            Take the 2-minute Readiness Scorecard and get a personalized program
            recommendation.
          </p>
        </div>
        <Link
          href="/assess"
          className="shrink-0 bg-white text-[#1549CD] px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors"
        >
          Take the Readiness Scorecard →
        </Link>
      </div>
    </section>
  );
}
