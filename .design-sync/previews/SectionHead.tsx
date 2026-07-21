import { SectionHead } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Numbered = () => (
  <Ground>
    <div className="nc-section">
      <SectionHead n="01" title="Colour" />
    </div>
  </Ground>
);

export const Unnumbered = () => (
  <Ground>
    <div className="nc-section">
      <SectionHead title="How to use it" />
    </div>
  </Ground>
);
