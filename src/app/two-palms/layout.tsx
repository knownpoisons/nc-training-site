import { HUB } from "@/app/two-palms/_data/hub";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./tp.css";
import "./bento.css";
import { hubConfigured, isTeamAuthed } from "./_lib/auth";
import { Lock } from "./_ui/gates";
import { Header, type MenuArea, type MenuSession } from "./_ui/b-client";
import { IconHash, IconArrow } from "./_ui/b";
import { countEvents, sessionHref, sessionTitle, SESSIONS, tmpIsOpen, toolsAreOpen, FC } from "./_data/foundations";
import { PROMPTS } from "./_data/hub";

// Self-hosted (Fontsource builds), so the hub never calls Google.
const archivo = localFont({
  src: "./_fonts/archivo-latin-wdth-normal.woff2",
  weight: "100 900",
  variable: "--font-tpb-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
const serif = localFont({ src: "./_fonts/dm-serif-display-latin-400-normal.woff2", weight: "400", variable: "--font-tpb-serif", display: "swap" });
const mono = localFont({
  src: [
    { path: "./_fonts/dm-mono-latin-300-normal.woff2", weight: "300" },
    { path: "./_fonts/dm-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./_fonts/dm-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-tpb-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Two Palms AI Hub", template: "%s · Two Palms AI Hub" },
  description: "Two Palms x NotContent. The training hub.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TwoPalmsLayout({ children }: { children: React.ReactNode }) {
  const fonts = `${archivo.variable} ${serif.variable} ${mono.variable}`;
  const cfg = hubConfigured();
  const authed = await isTeamAuthed();
  if (!authed) {
    return <div className={`tp-root tpb ${fonts}`}><Lock kind="team" configured={cfg.team} /></div>;
  }
  const now = new Date();
  const tmpOpen = tmpIsOpen(now);
  const areas: MenuArea[] = [
    { href: "/two-palms", label: "Home", img: "/two-palms/img/spotlight.jpg", status: "Start here" },
    { href: "/two-palms/setup", label: "Set up Claude", img: "/two-palms/img/setup.jpg", status: "8 steps" },
    { href: "/two-palms/foundations", label: FC.programme.name, img: "/two-palms/img/foundations.jpg", status: `${SESSIONS.length} sessions` },
    { href: "/two-palms/time-money-pain", label: FC.forms.time_money_pain.label, img: "/two-palms/img/prompt-04.jpg", status: tmpOpen ? `Due ${FC.forms.time_money_pain.due.replace(/ \d{4}$/, "")}` : "After Session 1", wait: !tmpOpen },
    { href: "/two-palms/prompts", label: "Prompt library", img: "/two-palms/img/prompts.jpg", status: `${PROMPTS.length} prompts` },
    { href: "/two-palms/policy", label: "AI policy", img: "/two-palms/img/rules.jpg", status: "Version 6" },
    { href: "/two-palms/kit", label: "The Kit", img: "/two-palms/img/ai-level-dial.jpg", status: "Models + words" },
    { href: "/two-palms/tools", label: "Approved tools", img: "/two-palms/img/showcase.jpg", status: toolsAreOpen(now) ? "Open" : "After Session 6", wait: !toolsAreOpen(now) },
    { href: "/two-palms/creative", label: "Creative Programme", img: "/two-palms/img/creative.jpg", status: "Coming soon", wait: true },
  ];
  const sessions: MenuSession[] = SESSIONS.map((s) => ({ href: sessionHref(s), label: `${s.n}. ${sessionTitle(s)}`, when: s.when.date.replace(/ \d{4}$/, "") }));
  return (
    <div className={`tp-root tpb ${fonts}`}>
      <Header events={countEvents()} areas={areas} sessions={sessions} />
      <main id="main" tabIndex={-1} style={{ outline: "none" }}>{children}</main>
      <footer className="tpb-foot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tpb-arch" src="/two-palms/arch-black.png" alt="Two Palms" width={84} height={36} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><IconHash />Questions? Ask in <a href={HUB.slackUrl} target="_blank" rel="noreferrer">#ai-training</a></span>
        <Link className="lnk" href="/two-palms/backstage">Backstage, admin <IconArrow /></Link>
      </footer>
    </div>
  );
}
