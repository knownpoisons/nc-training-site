import { readBig5Ticks } from "../../_lib/big5";
import { hubConfigured, isAdminAuthed } from "../../_lib/auth";
import { Lock } from "../../_ui/gates";
import Link from "next/link";
import { IconArrow } from "../../_ui/b";
import { BIG5 } from "../../_data/big5";
import { Big5Board } from "./board";
import { Rollout } from "./big5";

export const metadata = { title: "The Big 5" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) return <Lock kind="admin" configured={cfg.admin} />;
  const { ticks, rollout, persisted } = await readBig5Ticks();
  const started = BIG5.filter((j) => j.stage >= 0).length;
  const waiting = BIG5.length - started;

  return (
    <>
      <header className="b5-hero">
        <div className="b5-hero-in">
          <Link className="b5-crumb" href="/two-palms/backstage"><IconArrow back /> Backstage</Link>
          <div className="b5-hero-g">
            <div>
              <p className="b5-eyebrow">Leadership · Operations</p>
              <h1 className="b5-hero-t">The Big 5</h1>
              <p className="b5-hero-sub">Five jobs we&rsquo;re taking off people&rsquo;s plates.</p>
              <p className="b5-hero-lede">Where each one is, what&rsquo;s next and whose it is. Updated after every call.</p>
            </div>
            <dl className="b5-hero-stats">
              <div><dt>Under way</dt><dd>{started}</dd></div>
              <div><dt>Starting next</dt><dd>{waiting}</dd></div>
            </dl>
          </div>
        </div>
      </header>
      <section className="tp-section" style={{ paddingTop: 0 }}>
        <div className="tp-wrap b5">
          <Big5Board ticks={ticks} title={false} />

          {rollout.length ? (
            <details className="t b5-rollout">
              <summary><span className="b5-card-t">Training rollout</span><span className="tp-small tp-mute">Micky&rsquo;s and Jem&rsquo;s set-up lists</span></summary>
              <Rollout items={rollout} persisted={persisted} />
            </details>
          ) : null}
        </div>
      </section>
    </>
  );
}
