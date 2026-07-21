import { Footer, InlineLink } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Default = () => (
  <Ground>
    <Footer left="NotContent · The Prompt Library" right="notcontent.ai ↗" />
  </Ground>
);

export const WithLink = () => (
  <Ground>
    <Footer
      left="NotContent · Design System v1"
      right={<InlineLink href="#">The Library ↗</InlineLink>}
    />
  </Ground>
);
