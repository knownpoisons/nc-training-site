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
  description: `${TOTAL} places to steal from: copy-paste animation and hover libraries, scroll engines, curated inspiration galleries and asset generators — each with what it is and when to reach for it. Culled from 47 by a three-lens panel.`,
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
          Motion, hover, scroll and taste. Seventy-one candidates have gone in across three rounds
          and a three-lens panel has cut fifty-six of them — including nine it had previously let
          through. Fifteen is the ceiling now, so nothing new gets added here: it has to displace
          something.
        </p>
        <p className="sub sub-second">
          Two ways in. The shelves sort by what you walk away with — code to paste, an engine to
          wire up, work to look at, an asset to make, something to read. The words under the search
          box are the jobs you actually arrive with: click one and it searches across every shelf,
          because a gallery of scroll examples and a scroll library are not the same thing even
          though you wanted both.
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
          . A <span style={{ whiteSpace: "nowrap" }}>◈</span> badge means the entry was vouched for
          rather than found by searching — a link a designer you trust sent over, or a package
          already running in this repo. Nothing here has ten thousand options in it: every
          open-submission archive, every identikit component kit and, in the last round, every
          catalogue of ready-made effects was cut on purpose. Prebuilt components are where the
          generated look comes from.
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
