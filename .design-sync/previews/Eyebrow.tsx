import { Eyebrow } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Default = () => (
  <Ground>
    <div className="nc-hero">
      <Eyebrow>The Library</Eyebrow>
    </div>
  </Ground>
);

export const Numbered = () => (
  <Ground>
    <div className="nc-hero">
      <Eyebrow num="03">Content · Quality</Eyebrow>
    </div>
  </Ground>
);

export const NoRule = () => (
  <Ground>
    <div className="nc-hero">
      <Eyebrow rule={false}>Case Study</Eyebrow>
    </div>
  </Ground>
);
