import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <section className="relative min-h-[80vh] bg-[#1549CD] text-white overflow-hidden flex items-center">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
                404 — Page not found
              </p>
              <h1 className="oci-display-sm mt-4">
                This page doesn&apos;t exist.
                <br />
                But we do.
              </h1>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
                Whatever you were looking for, it&apos;s not here. But if
                you&apos;re looking for AI training that actually transforms how
                your team works — you&apos;re in the right place.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
                >
                  Go Home
                </Link>
                <Link
                  href="/blog"
                  className="px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white"
                >
                  Read the Blog →
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/images/404.png"
                alt="Jeremy Somers — contact sheet"
                className="w-full max-w-md mx-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
