import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ExitIntent } from "@/components/exit-intent";
import { AnnouncementBar } from "@/components/announcement-bar";
import { MarketingChrome } from "@/components/marketing-chrome";
import { getAllClientSlugs } from "@/lib/clients";

// Aggressively reduced font weights — was 21 weights across 3 families.
// Now ~7 weights total. Cuts initial font payload ~67% per the panel finding.
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NotContent Training | Think. Make. Build. — The AI operating model for creative teams",
    template: "%s | NotContent Training",
  },
  description:
    "The AI operating model for creative and media teams. Built by the team behind Adidas, Google, and Tommy Hilfiger campaigns. Techniques over tools — the work that compounds.",
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
    title: "NotContent Training | Think. Make. Build.",
    description:
      "The AI operating model for creative and media teams. Built by the team behind Adidas, Google, and Tommy Hilfiger campaigns.",
    url: "https://training.notcontent.ai",
    siteName: "NotContent Training",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NotContent Training",
    description:
      "The AI operating model for creative and media teams. Techniques over tools.",
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
  const hubSlugs = getAllClientSlugs();
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${ibmPlexSans.variable} ${sourceSerif.variable} font-mono antialiased`}>
        <MarketingChrome hubSlugs={hubSlugs}>
          <AnnouncementBar />
          <Header />
        </MarketingChrome>
        <main>{children}</main>
        <MarketingChrome hubSlugs={hubSlugs}>
          <Footer />
          <ExitIntent />
        </MarketingChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
