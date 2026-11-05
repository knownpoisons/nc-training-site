import Link from "next/link";
import { readBig5Ticks } from "../../_lib/big5";
import { hubConfigured, isAdminAuthed } from "../../_lib/auth";
import { Lock } from "../../_ui/gates";
import { PageTitle, IconArrow } from "../../_ui/b";
import { BIG5 } from "../../_data/big5";
import { Meter, doneCount, stageName } from "./parts";
import { Rollout } from "./big5";

export const metadata = { title: "The Big 5" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) return <Lock kind="admin" configured={cfg.admin} />;
  const { ticks, rollout, persisted } = await readBig5Ticks();
  const dated = BIG5.filter((j) => j.next.when !== "to confirm");

  return (
    <>
      <PageTitle
        back={{ href: "/two-palms/backstage", label: "Backstage" }}
        title="The Big 5"
        lede="Five jobs we're taking off people's plates. Where each one is, what's next and whose it is. Updated after every call."
      />
      <section className="tp-section" style={{ paddingTop: 8 }}>
        <div className="tp-wrap b5">
          {dated.length ? (
            <div className="b5-week">
              <span className="pl-k">Coming up</span>
              <ul>
                {dated.map((j) => (
                  <li key={j.id}><Link href={`/two-palms/backstage/big-5/${j.id}`}><span className="mono">{j.next.when}</span><b>{j.short}</b><span>{j.next.what}</span></Link></li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="b5-grid">
            {BIG5.map((j) => {
              const d = doneCount(j, ticks);
              return (
                <Link key={j.id} href={`/two-palms/backstage/big-5/${j.id}`} className={`t b5-card${j.stage < 0 ? " is-wait" : ""}`}>
                  <span className="b5-card-top"><span className="pl-k">{stageName(j)}</span><Meter stage={j.stage} /></span>
                  <h2 className="b5-card-t">{j.name}</h2>
                  <p className="b5-own">{j.owner}</p>
                  <p className="b5-now">{j.now}</p>
                  <span className="b5-next">
                    <span className="pl-k">Next</span>
                    <span className="b5-next-t">{j.next.what}</span>
                    <span className="b5-next-m">{j.next.who} · <span className={j.next.when === "to confirm" ? "is-tbc" : "mono"}>{j.next.when}</span></span>
                  </span>
                  <span className="b5-card-foot"><span>{d} of {j.todos.length} to-dos done</span><span className="lnk">Open <IconArrow /></span></span>
                </Link>
              );
            })}
          </div>

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
