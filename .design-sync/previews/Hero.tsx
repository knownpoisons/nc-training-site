import { Hero, Accent } from "nc-training-site";
const Ground = ({ children }: { children: React.ReactNode }) => (
  <div className="nc" style={{ minHeight: "auto", padding: "20px 0" }}>
    {children}
  </div>
);

export const Default = () => (
  <Ground>
    <Hero
      eyebrow="The Library"
      eyebrowNum="00"
      title={<>Prompts that <Accent>ship</Accent>.</>}
      sub="These are the prompts I'm actually running this month. When I stop using one, it comes down."
    />
  </Ground>
);

export const TitleOnly = () => (
  <Ground>
    <Hero title={<>Techniques over <Accent>tools</Accent>.</>} />
  </Ground>
);

export const WithStandfirst = () => (
  <Ground>
    <Hero
      eyebrow="Case Study"
      eyebrowNum="02"
      title={<>Nine months of work, in three.</>}
      sub="A new brand into every Target store — built almost entirely on what we taught them."
    />
  </Ground>
);
