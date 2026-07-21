import { RowList, Row } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Index = () => (
  <Ground>
    <RowList>
      <Row n="01" title="LinkedIn Prospect Intelligence"
           summary="Turn your LinkedIn export into a ranked, voice-matched outreach dashboard."
           meta="Outreach · Sales" href="#" />
      <Row n="02" title="The Copy Autopsy"
           summary="Eight rewrites. Five judges. Kill the weak ones. Ship what survives."
           meta="Conversion · Copy" href="#" />
      <Row n="03" title="The Content Taste Audit"
           summary="Point it at any site. It tells you which copy deserves to exist."
           meta="Content · Quality" href="#" />
    </RowList>
  </Ground>
);
