import type { Metadata } from "next";
import "./story.css";

// The story page is a public sales asset — indexable, chrome-free, its own
// type system (Instrument Serif display + DM Mono data).
// Tab + link-preview lead with the transformation, not the calendar. The root
// layout appends "| NotContent Training" to `title`.
export const metadata: Metadata = {
  title: "AI Creative Operators",
  description:
    "Ad-hoc AI experimenters walk in. AI Creative Operators walk out. The flagship NotContent programme for creative teams. From $50,000.",
  openGraph: {
    // the hook — this is what a prospect sees when the link is shared
    title: "Ad-hoc AI experimenters walk in. AI Creative Operators walk out.",
    description:
      "The flagship NotContent programme for creative teams — from sporadic knowledge to full production.",
    url: "https://training.notcontent.ai/theprogram",
    type: "website",
  },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
