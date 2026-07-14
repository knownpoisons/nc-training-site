import Link from "next/link";
import {
  CTA,
  HERO,
  MARQUEE,
  OPENING,
  PHASES_HEADING,
  QUOTES_HEADING,
  SCORECARD,
  TOPBAR,
} from "./copy";
import {
  DropSection,
  FramedVideo,
  GlitchFigure,
  PhasesSection,
  PresserSection,
  QuoteStack,
  RecordBook,
  Reveal,
  StoryShell,
} from "./ui";

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
        <h1 className="om-hero-title">{HERO.title}</h1>
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

      {/* the presser */}
      <PresserSection />

      {/* the record book */}
      <RecordBook />

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
        <span>NotContent · training.notcontent.ai</span>
        <Link href={CTA.secondaryHref}>{CTA.secondary} →</Link>
      </footer>
    </StoryShell>
  );
}
