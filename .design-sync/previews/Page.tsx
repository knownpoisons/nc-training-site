import { Page, Topbar, Hero, Accent, Footer } from "nc-training-site";

export const FullSurface = () => (
  <div style={{ minHeight: "auto" }}>
    <Page>
      <Topbar brand={<>NotContent · Library</>} meta={<span>06 Prompts</span>} />
      <Hero
        eyebrow="The Library"
        eyebrowNum="00"
        title={<>Prompts that <Accent>ship</Accent>.</>}
        sub="These are the prompts I'm actually running this month."
      />
      <Footer left="NotContent · The Prompt Library" right="notcontent.ai" />
    </Page>
  </div>
);
