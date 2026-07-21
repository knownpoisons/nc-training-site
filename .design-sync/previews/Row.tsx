import { RowList, Row } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Standard = () => (
  <Ground>
    <RowList>
      <Row n="02" title="The Copy Autopsy"
           summary="Eight rewrites. Five judges. Kill the weak ones. Ship what survives."
           meta="Conversion · Copy" href="#" />
    </RowList>
  </Ground>
);

export const Featured = () => (
  <Ground>
    <RowList>
      <Row n="01" title="The Camera Prompt Finder"
           summary="Every shot, move and angle — with the prompt language that gets it."
           meta="Featured" href="#" featured />
    </RowList>
  </Ground>
);

export const ComingSoon = () => (
  <Ground>
    <RowList>
      <Row n="04" title="The Voice Card"
           summary="Sit for a 20-minute interrogation. Walk away with a card that makes any AI write like you."
           meta="Coming soon" quiet />
    </RowList>
  </Ground>
);
