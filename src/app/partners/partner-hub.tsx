import Link from "next/link";

// ─── Partner Hub — the gated launcher ─────────────────────────────────────────
// One card + detail per section, JD-editorial, brand-only (cobalt / platinum /
// ink). Two cards point at public URLs (open in a new tab so the partner keeps
// the hub open behind them); the sales-assist card is partner-only and stays
// in-tab. Art panels are brand-tone blocks with a ghosted serif numeral — swap
// in imagery later without touching layout.

interface HubCard {
  n: string;
  tone: "cobalt" | "platinum" | "ink";
  tag: string;
  eyebrow: string;
  title: string;
  desc: string;
  items: string[];
  href: string;
  external: boolean;
  cta: string;
}

const CARDS: HubCard[] = [
  {
    n: "01",
    tone: "cobalt",
    tag: "The One-Pager",
    eyebrow: "The one-pager · Public",
    title: "The pitch, in one scroll.",
    desc: "The public one-pager — the whole story, start to finish. Send it to anyone.",
    items: ["The pitch & the promise", "The eight-week phases", "Real client results"],
    href: "/theprogram",
    external: true,
    cta: "Open the one-pager",
  },
  {
    n: "02",
    tone: "platinum",
    tag: "Sales Assist",
    eyebrow: "Partner playbook · Partners only",
    title: "Turn a coffee into a referral.",
    desc: "Your weapon, not a brochure — the moves that turn a good chat into a warm intro.",
    items: ["The one-line reframe", "The three moves", "Copy-ready lines"],
    href: "/partners/playbook",
    external: false,
    cta: "Open the playbook",
  },
  {
    n: "03",
    tone: "ink",
    tag: "Sample Hub",
    eyebrow: "Sample client hub · Public",
    title: "Show them what they'll get.",
    desc: "A real programme hub, demo-branded — exactly what a client lives inside for eight weeks. Great to show a prospect.",
    items: ["Eight weeks of sessions", "Recordings & cheat sheets", "Team & resources"],
    href: "/samplehub",
    external: true,
    cta: "Open the sample hub",
  },
];

function Card({ card }: { card: HubCard }) {
  const inner = (
    <>
      <div className={`hub-art hub-art--${card.tone}`} aria-hidden="true">
        <span className="hub-art-num">{card.n}</span>
        <span className="hub-art-tag">{card.tag}</span>
      </div>
      <div className="hub-main">
        <span className="hub-eyebrow">{card.eyebrow}</span>
        <h2 className="hub-title">{card.title}</h2>
      </div>
      <div className="hub-detail">
        <p className="hub-desc">{card.desc}</p>
        <ul className="hub-items">
          {card.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
        <span className="hub-go">
          {card.cta}{" "}
          <span className="hub-arrow" aria-hidden="true">
            {card.external ? "↗" : "→"}
          </span>
          {card.external && <span className="hub-sr-only"> (opens in a new tab)</span>}
        </span>
      </div>
    </>
  );

  if (card.external) {
    return (
      <a className="hub-card" href={card.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link className="hub-card" href={card.href}>
      {inner}
    </Link>
  );
}

export function PartnerHub() {
  return (
    <div className="partners">
      {/* Topbar */}
      <div className="topbar">
        <Link href="/" className="brand">
          NotContent <span className="dot">·</span> Partner Hub
        </Link>
        <span className="counter">
          <strong>Internal</strong> · partner use
        </span>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">
          <span>Howdy, partner — everything in one place</span>
          <span className="rule" />
        </div>
        <h1>
          Your <span className="accent">kit</span>.
        </h1>
        <p className="hero-intro">
          Three things, one page. The site to send anyone, the playbook that turns
          a chat into a referral, and a real sample hub to show a prospect exactly
          what they&rsquo;ll get. Open any card.
        </p>
      </section>

      {/* Cards */}
      <section className="hub-list" aria-label="Partner resources">
        {CARDS.map((card) => (
          <Card key={card.n} card={card} />
        ))}
      </section>
    </div>
  );
}
