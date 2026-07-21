import { InlineLink } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const InProse = () => (
  <Ground>
    <div className="nc-section nc-prose">
      <p>
        Every prompt in here is one I actually run. Start with{" "}
        <InlineLink href="#">the Content Taste Audit</InlineLink> if your copy
        reads clean but forgettable.
      </p>
    </div>
  </Ground>
);

export const External = () => (
  <Ground>
    <div className="nc-section nc-prose">
      <p>
        Read the source it riffs on at{" "}
        <InlineLink href="https://every.to" external>Every&rsquo;s Context Window ↗</InlineLink>.
      </p>
    </div>
  </Ground>
);
