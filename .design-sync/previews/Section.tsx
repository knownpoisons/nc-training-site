import { Section, InlineLink } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Default = () => (
  <Ground>
    <Section n="04" title="How to use it">
      <p>
        Build pages by composing these components rather than writing markup and
        CSS each time. If a page needs something that doesn&rsquo;t exist here,
        add it here first — that&rsquo;s what keeps every surface consistent.
      </p>
      <p className="nc-muted">
        All values come from the brand tokens. Change the brand there and it
        propagates everywhere. See <InlineLink href="/library">the library</InlineLink>.
      </p>
    </Section>
  </Ground>
);
