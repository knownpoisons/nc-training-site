import type { Metadata } from "next";
import {
  Page,
  Topbar,
  Hero,
  Accent,
  Eyebrow,
  Section,
  SectionHead,
  RowList,
  Row,
  Button,
  InlineLink,
  Footer,
} from "@/components/ds";

export const metadata: Metadata = {
  title: "Design System — NotContent",
  description:
    "The NotContent brand system: tokens, typography and components. The single reference for anyone building a NotContent surface.",
  robots: { index: false, follow: false },
};

const COLORS = [
  ["--nc-cobalt", "#1338BE", "The one true cobalt. Accents, links, numbers."],
  ["--nc-cobalt-deep", "#0F2DA0", "Hover/pressed on solid cobalt."],
  ["--nc-cobalt-soft", "rgba(19,56,190,.07)", "Row hover, tint blocks."],
  ["--nc-hot", "#C03A1F", "Secondary accent. Use sparingly."],
  ["--nc-ink", "#0E0E0C", "Headlines and body text."],
  ["--nc-platinum", "#E5E4E2", "Editorial page ground."],
  ["--nc-cream", "#E8E6E0", "Marketing page ground."],
  ["--nc-surface", "#EFEEEC", "Raised card on the ground."],
  ["--nc-muted", "#5F5F60", "Secondary text."],
  ["--nc-rule", "#C2C1BF", "Hairlines and dividers."],
];

const TYPE = [
  ["Display", "--nc-size-display", "clamp(40px, 8.5vw, 124px)", "One per page. Serif, tight."],
  ["Section head", "--nc-size-h1", "clamp(38px, 6vw, 76px)", "Numbered section titles."],
  ["Row title", "--nc-size-h2", "clamp(22px, 2.6vw, 32px)", "Index rows, card titles."],
  ["Lead", "--nc-size-lead", "clamp(20px, 2.2vw, 28px)", "Italic serif standfirst."],
  ["Body", "--nc-size-body", "18px", "Running prose."],
  ["Label", "--nc-size-label", "12px", "Uppercase, 0.2em tracked."],
];

export default function DesignSystemPage() {
  return (
    <Page>
      <Topbar
        brand={
          <>
            NotContent <span className="nc-dot">·</span> Design System
          </>
        }
        meta={<span>v1</span>}
      />

      <Hero
        eyebrow="The Brand System"
        eyebrowNum="00"
        title={
          <>
            One system. <Accent>Every</Accent> surface.
          </>
        }
        sub="Tokens, type and components. Everything a NotContent page is built from — change it here, it changes everywhere."
      />

      {/* ───────── Colour ───────── */}
      <section className="nc-section">
        <SectionHead n="01" title="Colour" />
        <div style={{ display: "grid", gap: 1, background: "var(--nc-rule)" }}>
          {COLORS.map(([token, value, use]) => (
            <div
              key={token}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: 20,
                alignItems: "center",
                background: "var(--nc-platinum)",
                padding: "14px 0",
              }}
            >
              <div
                style={{
                  height: 44,
                  background: `var(${token})`,
                  border: "1px solid var(--nc-rule)",
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--nc-mono)",
                    fontSize: 13,
                    color: "var(--nc-ink)",
                  }}
                >
                  {token} <span style={{ color: "var(--nc-muted)" }}>{value}</span>
                </div>
                <div style={{ fontSize: 14, color: "var(--nc-muted)", marginTop: 3 }}>
                  {use}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Type ───────── */}
      <section className="nc-section">
        <SectionHead n="02" title="Type" />
        <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--nc-muted)", maxWidth: 720, margin: "0 0 32px" }}>
          Serif for statement, sans for utility. The serif is{" "}
          <strong style={{ color: "var(--nc-ink)" }}>Iowan Old Style</strong>;
          uppercase labels are sans, tracked at 0.2em.
        </p>
        <div style={{ display: "grid", gap: 26 }}>
          {TYPE.map(([name, token, value, use]) => (
            <div key={token} style={{ borderTop: "1px solid var(--nc-rule)", paddingTop: 16 }}>
              <div
                style={{
                  fontFamily: "var(--nc-mono)",
                  fontSize: 12,
                  color: "var(--nc-muted)",
                  marginBottom: 10,
                }}
              >
                {name} · {token} · {value} — {use}
              </div>
              <div
                style={{
                  fontFamily: "var(--nc-serif)",
                  fontSize: `var(${token})`,
                  lineHeight: 1.05,
                  color: "var(--nc-ink)",
                }}
              >
                Techniques over tools.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Components ───────── */}
      <section className="nc-section">
        <SectionHead n="03" title="Components" />
        <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--nc-muted)", maxWidth: 720, margin: "0 0 40px" }}>
          Import from <code style={{ fontFamily: "var(--nc-mono)", fontSize: 15, color: "var(--nc-cobalt)" }}>@/components/ds</code>{" "}
          and compose. Never re-write these by hand.
        </p>

        <Eyebrow num="A">Eyebrow</Eyebrow>
        <div style={{ height: 28 }} />

        <div style={{ fontFamily: "var(--nc-mono)", fontSize: 12, color: "var(--nc-muted)", margin: "36px 0 12px" }}>
          Buttons — ghost (default), solid, large
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Button>Ghost</Button>
          <Button variant="solid">Solid</Button>
          <Button variant="solid" size="lg">
            Large solid
          </Button>
        </div>

        <div style={{ fontFamily: "var(--nc-mono)", fontSize: 12, color: "var(--nc-muted)", margin: "44px 0 12px" }}>
          Inline link — <InlineLink href="/library">a cobalt link in prose</InlineLink>
        </div>

        <div style={{ fontFamily: "var(--nc-mono)", fontSize: 12, color: "var(--nc-muted)", margin: "44px 0 0" }}>
          Rows — featured, standard, quiet (coming soon)
        </div>
      </section>

      <RowList>
        <Row
          n="01"
          title="A featured row"
          summary="Solid cobalt. Use for exactly one item — never several."
          meta="Featured"
          href="/design-system"
          featured
        />
        <Row
          n="02"
          title="A standard row"
          summary="The workhorse. Hover tints it and slides the arrow."
          meta="Category · Tag"
          href="/design-system"
        />
        <Row
          n="03"
          title="A quiet row"
          summary="Greyed and non-interactive — for coming-soon items."
          meta="Coming soon"
          quiet
        />
      </RowList>

      <Section n="04" title="How to use it">
        <p>
          Build pages by composing these components rather than writing markup
          and CSS each time. If a page needs something that doesn&rsquo;t exist
          here, add it here first &mdash; that&rsquo;s what keeps every surface
          consistent.
        </p>
        <p className="nc-muted">
          All values come from{" "}
          <code style={{ fontFamily: "var(--nc-mono)", fontSize: 15 }}>
            src/styles/tokens.css
          </code>
          . Change the brand there and it propagates everywhere.
        </p>
      </Section>

      <Footer
        left="NotContent · Design System v1"
        right={<InlineLink href="/library">The Library ↗</InlineLink>}
      />
    </Page>
  );
}
