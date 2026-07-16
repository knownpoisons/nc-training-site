import Link from "next/link";
import {
  CTA,
  FOOTER,
  HERO,
  INCLUDED,
  LOGOS,
  MARQUEE,
  OPENING,
  PHASES_HEADING,
  QUOTES_HEADING,
  SCORECARD,
  TOPBAR,
  type IncludedIcon,
} from "./copy";
import {
  DropSection,
  FramedVideo,
  GlitchFigure,
  PhasesSection,
  PresserSection,
  QuoteStack,
  Reveal,
  StoryShell,
} from "./ui";

// Hairline column icons for "What else is included".
function ColumnIcon({ name }: { name: IncludedIcon }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#3D63F0",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "dashboard") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    );
  }
  if (name === "support") {
    return (
      <svg {...common}>
        <path d="M3 5h18v11H8l-4 4z" />
        <path d="M7 9h10 M7 12.5h6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function StoryPage() {
  return (
    <StoryShell>
      {/* minimal top bar — wordmark + booking, nothing else */}
      <nav className="om-topbar" aria-label="Story">
        <Link href={TOPBAR.brandHref}>{TOPBAR.brand}</Link>
        <Link href={TOPBAR.ctaHref}>{TOPBAR.cta}</Link>
      </nav>

      {/* hero */}
      <header className="om-hero">
        <div className="om-hero-ghost" aria-hidden="true">
          {HERO.ghost}
        </div>
        <p className="om-hero-eyebrow">{HERO.eyebrow}</p>
        <h1 className="om-hero-title">
          {HERO.titleA}
          <br />
          <span className="om-accent">{HERO.titleB}</span>
        </h1>
        <p className="om-hero-subtitle">{HERO.subtitle}</p>
        <div className="om-hero-figure">
          <GlitchFigure src={HERO.image} alt={HERO.imageAlt} />
        </div>
        <p className="om-hero-credit">{HERO.credit}</p>
      </header>

      {/* scorecard — before / after the eight weeks */}
      <Reveal as="section" className="om-scorecard">
        <div className="om-scorecard-league">{SCORECARD.league}</div>
        <h2 className="om-scorecard-headline">{SCORECARD.headline}</h2>
        <p className="om-scorecard-framing">{SCORECARD.framing}</p>
        <div className="om-scorecard-row">
          <div className="om-scorecard-team">
            <span className="om-scorecard-team-name">{SCORECARD.leftName}</span>
            <span className="om-scorecard-score">{SCORECARD.leftScore}</span>
          </div>
          <div className="om-scorecard-bigwrap" aria-hidden="true">
            <div className="om-scorecard-big">{SCORECARD.bigNumber}</div>
            <div className="om-scorecard-biglabel">{SCORECARD.bigLabel}</div>
          </div>
          <div className="om-scorecard-team">
            <span className="om-scorecard-team-name">{SCORECARD.rightName}</span>
            <span className="om-scorecard-score om-accent">
              {SCORECARD.rightScore}
            </span>
          </div>
        </div>
        <p className="om-scorecard-statement">{SCORECARD.statement}</p>
      </Reveal>

      {/* records marquee */}
      <div className="om-marquee" aria-hidden="true">
        <div className="om-marquee-track">
          {[0, 1].map((dup) => (
            <span key={dup} style={{ display: "contents" }}>
              {MARQUEE.map((item) => (
                <span
                  key={`${dup}-${item.text}`}
                  className="om-marquee-item"
                >
                  <span className={"record" in item && item.record ? "om-record" : undefined}>
                    {item.text}
                  </span>
                  <span>·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* the drop — how week one begins */}
      <DropSection label={OPENING.courtLabel} globeSrc={OPENING.globeSrc}>
        <div className="om-swish-left">
          <div className="om-eyebrow">{OPENING.eyebrow}</div>
          <div className="om-swish-word">{OPENING.word}</div>
          <p className="om-swish-copy">
            {OPENING.copy.map((part, i) =>
              typeof part === "string" ? part : <em key={i}>{part.em}</em>,
            )}
          </p>
        </div>
        <FramedVideo
          src={OPENING.videoSrc}
          poster={OPENING.videoPoster}
          caption={OPENING.videoCaption}
        />
      </DropSection>

      {/* phase by phase */}
      <Reveal as="section" className="om-phases-heading">
        <div className="om-eyebrow">{PHASES_HEADING.eyebrow}</div>
        <h2>
          {PHASES_HEADING.titleA}
          <br />
          <em>{PHASES_HEADING.titleB}</em>
        </h2>
      </Reveal>
      <PhasesSection />

      {/* the quote wall */}
      <QuoteStack
        eyebrow={QUOTES_HEADING.eyebrow}
        titleA={QUOTES_HEADING.titleA}
        titleEm={QUOTES_HEADING.titleEm}
      />

      {/* what else is included */}
      <Reveal as="section" className="om-included">
        <div className="om-included-head">
          <div className="om-eyebrow">{INCLUDED.eyebrow}</div>
          <h2 className="om-included-title">{INCLUDED.title}</h2>
        </div>
        <div className="om-included-grid">
          {INCLUDED.columns.map((col) => (
            <div key={col.n} className="om-included-col">
              <div className="om-included-top">
                <span className="om-included-n">{col.n}</span>
                <ColumnIcon name={col.icon} />
              </div>
              <h3 className="om-included-coltitle">{col.title}</h3>
              {"note" in col && col.note && (
                <p className="om-included-note">{col.note}</p>
              )}
              <ul className="om-included-list">
                {col.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      {/* the presser */}
      <PresserSection />

      {/* scrolling client marquee — id om-final keeps the scroll badge's kill logic */}
      <section id="om-final" className="om-logos">
        <p className="om-logos-callout">{LOGOS.callout}</p>
        <div className="om-logos-track" aria-hidden="true">
          {[0, 1].map((dup) => (
            <span key={dup} style={{ display: "contents" }}>
              {LOGOS.names.map((n) => (
                <span key={`${dup}-${n}`} className="om-logos-name">
                  {n}
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Reveal as="section" className="om-cta">
        <h2 className="om-cta-title">{CTA.title}</h2>
        <p className="om-cta-sub">{CTA.sub}</p>
        <Link href={CTA.buttonHref} className="om-cta-button">
          {CTA.button}
        </Link>
        <p className="om-cta-note">{CTA.note}</p>
      </Reveal>

      <footer className="om-footer">
        <span className="om-footer-brand">{FOOTER.brand}</span>
        <div className="om-footer-links">
          {FOOTER.links.map((l) => (
            <Link key={l.href} href={l.href} className="om-footer-link">
              {l.label} →
            </Link>
          ))}
        </div>
      </footer>
    </StoryShell>
  );
}
