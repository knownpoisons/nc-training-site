/**
 * Author bio card shown at the end of every blog post.
 * Single source of truth for Jeremy's bio copy — edit here to update site-wide.
 */
export function BlogAuthorCard() {
  return (
    <section className="pb-6">
      <div className="mx-auto max-w-[680px] px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-5 border-t border-foreground/15 pt-8">
          <img
            src="/images/jeremy-somers.jpg"
            alt="Jeremy Somers"
            className="h-20 w-20 shrink-0 object-cover rounded-[2px] ring-1 ring-foreground/10"
          />
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD] font-semibold">
              Jeremy Somers
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-foreground/50">
              Founder, NotContent
            </p>
            <p className="mt-3 font-sans text-[15px] leading-[1.65] text-foreground/75">
              15 years as a creative director (Spotify, Nike, Pepsi, Samsung,
              Mercedes-Benz). Built the first AI-assisted creative agency in
              2022.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
