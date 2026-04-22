import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScorecardNudge } from "@/components/scorecard-nudge";
import { ExitIntent } from "@/components/exit-intent";
import { AnnouncementBar } from "@/components/announcement-bar";
import { ScrollPopup } from "@/components/scroll-popup";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "NotContent Training | AI Creative Training for Enterprise Teams",
    template: "%s | NotContent Training",
  },
  description:
    "Transform your creative team with AI. 96% time savings. 400% output increase. Hands-on training from the team behind Adidas, Google, and Tommy Hilfiger campaigns.",
  keywords: [
    "AI training",
    "creative teams",
    "AI creative training",
    "enterprise AI training",
    "Midjourney training",
    "AI workflow training",
    "creative agency AI",
    "generative AI training",
  ],
  openGraph: {
    title: "NotContent Training | AI Creative Training for Enterprise Teams",
    description:
      "Transform your creative team with AI. Hands-on training from the team behind Adidas, Google, and Tommy Hilfiger campaigns.",
    url: "https://training.notcontent.ai",
    siteName: "NotContent Training",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NotContent Training",
    description:
      "AI Creative Training for Enterprise Teams. 96% time savings. 400% output increase.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${ibmPlexSans.variable} ${sourceSerif.variable} font-mono antialiased`}>
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <ScorecardNudge />
        <ExitIntent />
        <ScrollPopup />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
