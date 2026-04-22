import Link from "next/link";

interface EndCtaProps {
  href: string;
  children: React.ReactNode;
}

/**
 * In-post CTA block. Sits at the end of a blog post's MDX body,
 * visually pulled out from the prose with cobalt hairlines above
 * and below. Bold cobalt text, arrow icon that nudges right on hover.
 */
export function EndCta({ href, children }: EndCtaProps) {
  const isExternal = href.startsWith("http");

  const content = (
    <div className="flex items-center justify-between gap-6 group">
      <p className="font-mono text-[17px] lg:text-[19px] font-semibold tracking-tight text-[#1549CD] leading-snug">
        {children}
      </p>
      <span
        aria-hidden
        className="shrink-0 text-[#1549CD] text-2xl transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </div>
  );

  return (
    <div className="my-14 py-8 border-y-2 border-[#1549CD]/15">
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block no-underline"
        >
          {content}
        </a>
      ) : (
        <Link href={href} className="block no-underline">
          {content}
        </Link>
      )}
    </div>
  );
}
