import type { Metadata } from "next";
import localFont from "next/font/local";
import "./tp.css";
import { hubConfigured, isIntakeDone, isTeamAuthed } from "./_lib/auth";
import { Intake, Lock } from "./_ui/gates";
import { Footer, Header } from "./_ui/shell";

// Self-hosted (Fontsource builds of the Google Fonts), so the hub never calls Google.
const koulen = localFont({ src: "./_fonts/koulen-latin-400-normal.woff2", weight: "400", variable: "--font-tp-koulen", display: "swap" });
const mulish = localFont({
  src: [
    { path: "./_fonts/mulish-latin-300-normal.woff2", weight: "300" },
    { path: "./_fonts/mulish-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-tp-mulish",
  display: "swap",
});
const grace = localFont({ src: "./_fonts/covered-by-your-grace-latin-400-normal.woff2", weight: "400", variable: "--font-tp-grace", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Two Palms AI Hub", template: "%s · Two Palms AI Hub" },
  description: "Two Palms x NotContent. The training hub.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TwoPalmsLayout({ children }: { children: React.ReactNode }) {
  const fonts = `${koulen.variable} ${mulish.variable} ${grace.variable}`;
  const cfg = hubConfigured();
  const authed = await isTeamAuthed();
  if (!authed) {
    return <div className={`tp-root ${fonts}`}><Lock kind="team" configured={cfg.team} /></div>;
  }
  const intake = await isIntakeDone();
  if (!intake) {
    return <div className={`tp-root ${fonts}`}><Intake /></div>;
  }
  return (
    <div className={`tp-root ${fonts}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
