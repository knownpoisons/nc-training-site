import { Accent } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const InHeadline = () => (
  <Ground>
    <div className="nc-hero">
      <h1>Prompts that <Accent>ship</Accent>.</h1>
    </div>
  </Ground>
);

export const InSectionHead = () => (
  <Ground>
    <div className="nc-section">
      <div className="nc-hed">
        <h2>One system. <Accent>Every</Accent> surface.</h2>
        <div className="nc-rule" />
      </div>
    </div>
  </Ground>
);
