import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LIBRARY_GATE_ENABLED } from "../prompts";
import { LibraryGate } from "../gate";
import { LibraryTopbar } from "../topbar";
import { LibraryFooter } from "../footer";
import { Vault } from "./vault";
import { RESOURCES, VAULT_CATEGORIES } from "./_data/resources";
import "../library.css";
import "../_finder/finder.css";
import "./vault.css";

const TOTAL = RESOURCES.length;

export const metadata: Metadata = {
  title: "The Build Vault — NotContent Library",
  description: `${TOTAL} places to steal from: copy-paste animation and hover libraries, scroll engines, curated inspiration galleries and asset generators — each with what it is and when to reach for it.`,
};

export default async function BuildVaultPage() {
  // Email gate: no access cookie → render the gate, never the vault.
  const hasAccess =
    !LIBRARY_GATE_ENABLED ||
    (await cookies()).get("nc_library_access")?.value === "1";
  if (!hasAccess) return <LibraryGate total={TOTAL} />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Build Vault",
    description: metadata.description,
    numberOfItems: TOTAL,
    itemListElement: RESOURCES.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.name,
      description: r.what,
      url: r.url,
    })),
  };

  return (
    <div className="library">
      <LibraryTopbar total={TOTAL} noun="resource" />

      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{TOTAL}</span>
            &nbsp;/&nbsp; Collection · The Build Vault
          </span>
          <span className="rule" />
        </div>
        <h1>
          Places to <span className="accent">steal</span> from.
        </h1>
        <p className="sub">
          Every site worth knowing for motion, hover, scroll and taste — the copy-paste libraries,
          the engines underneath them, the galleries that are actually curated, and the generators
          that make the raw material. Each one says what it is and when to reach for it instead of
          the others.
        </p>
        <p className="vt-note">
          <strong>How to use it with an AI build:</strong> don&rsquo;t paste the code first. Send
          Claude the link and the effect you want (&ldquo;the sticky scroll reveal from Aceternity,
          in our type and colours&rdquo;), and let it fetch, adapt and wire the thing in. The vault
          is a shortlist of good sources — the taste is still yours.
        </p>
      </section>

      <Vault />

      <section className="section vt-legend-note">
        <p className="muted" style={{ fontSize: 13 }}>
          Four shelves —{" "}
          {VAULT_CATEGORIES.map((c, i) => (
            <span key={c.id}>
              {i > 0 ? " · " : ""}
              <strong>{c.label}</strong>
            </span>
          ))}
          . Anything marked <span style={{ whiteSpace: "nowrap" }}>◈ in our stack</span> has already
          been used on a NotContent build.
        </p>
      </section>

      <LibraryFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
