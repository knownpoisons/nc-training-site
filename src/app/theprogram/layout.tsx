import type { Metadata } from "next";
import "./story.css";

// The story page is a public sales asset — indexable, chrome-free, its own
// type system (Instrument Serif display + DM Mono data).
export const metadata: Metadata = {
  title: "Eight Weeks — The Operating Model, told as a story",
  description:
    "The flagship NotContent program, told the way it actually happens: eight weeks, four phases, run four times — Cash App, Maesa, Herman Scheer. From $50,000.",
  openGraph: {
    title: "Eight Weeks — The Operating Model",
    description:
      "The flagship NotContent program, told the way it actually happens. Eight weeks. Four phases. Run four times.",
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
