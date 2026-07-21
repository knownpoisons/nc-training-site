import { Topbar } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Default = () => (
  <Ground>
    <Topbar brand={<>NotContent · Library</>} />
  </Ground>
);

export const WithCounter = () => (
  <Ground>
    <Topbar
      brand={<>NotContent <span className="nc-dot">·</span> Design System</>}
      meta={<span>06 Prompts</span>}
    />
  </Ground>
);
