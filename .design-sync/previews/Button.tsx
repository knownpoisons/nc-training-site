import { Button } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Ghost = () => (
  <Ground>
    <div style={{ padding: "0 40px" }}>
      <Button>Copy prompt</Button>
    </div>
  </Ground>
);

export const Solid = () => (
  <Ground>
    <div style={{ padding: "0 40px" }}>
      <Button variant="solid">Take the Scorecard</Button>
    </div>
  </Ground>
);

export const Large = () => (
  <Ground>
    <div style={{ padding: "0 40px" }}>
      <Button variant="solid" size="lg">Book a discovery call</Button>
    </div>
  </Ground>
);

export const Disabled = () => (
  <Ground>
    <div style={{ padding: "0 40px" }}>
      <Button disabled>Opening…</Button>
    </div>
  </Ground>
);
