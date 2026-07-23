import type { Metadata } from "next";
import { existsSync } from "fs";
import { join } from "path";
import { Camp30Form } from "./camp30-form";
import "./camp30.css";

// noindex — not meant to be discovered via search yet.
export const metadata: Metadata = {
  title: "Camp30",
  description:
    "A 30-day course teaching you to build with Claude. Not launched yet — get on the list.",
  robots: { index: false, follow: false },
};

const PATCH_SRC = "/images/camp30/camp30-patch.jpg";

export default function Camp30Page() {
  // Show the embroidered-patch hero once the asset exists in the repo; until
  // then fall back to a clean typographic block. Adding the file + redeploying
  // switches it over automatically.
  const hasPatch = existsSync(join(process.cwd(), "public", PATCH_SRC));

  return (
    <div className="camp30">
      <div className="wrap">
        <div className="card">
          {hasPatch ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="patch"
              src={PATCH_SRC}
              alt="Camp30 by Jeremy Somers — NotContent AI Training. Learn. Build. Fun."
            />
          ) : (
            <div
              className="patch-fallback"
              role="img"
              aria-label="Camp30 by Jeremy Somers — NotContent AI Training. Learn. Build. Fun."
            >
              <span className="pf-mark">
                CAMP<em>30</em>
              </span>
              <span className="pf-sub">Learn · Build · Fun</span>
              <span className="pf-by">Jeremy Somers · NotContent AI Training</span>
            </div>
          )}

          <h1>
            A 30-day course teaching you to <em>build</em> with Claude.
          </h1>
          <p className="lede">
            Not launched yet. Get on the list and you&rsquo;ll hear first.
          </p>

          <Camp30Form />

          <p className="fine">
            No spam, no dates promised yet. Just first access when doors open.
          </p>
        </div>

        <footer>
          NotContent · <a href="https://notcontent.ai">notcontent.ai</a>
        </footer>
      </div>
    </div>
  );
}
