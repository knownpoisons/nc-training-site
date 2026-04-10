import Link from "next/link";

export function BlogInlineCta() {
  return (
    <div className="my-10 border-l-2 border-[#1549CD] bg-[#1549CD]/5 px-6 py-5">
      <p className="text-sm font-medium tracking-tight">
        Not sure where your team stands with AI?
      </p>
      <p className="mt-1 text-sm text-foreground/60">
        The 2-minute Readiness Scorecard maps your current capability and
        recommends the right program.
      </p>
      <Link
        href="/assess"
        className="mt-3 inline-block text-[11px] uppercase tracking-[0.15em] text-[#1549CD] font-medium hover:underline"
      >
        Take the Readiness Scorecard →
      </Link>
    </div>
  );
}
