import { readBig5Ticks } from "../../_lib/big5";
import { hubConfigured, isAdminAuthed } from "../../_lib/auth";
import { Lock } from "../../_ui/gates";
import { PageTitle } from "../../_ui/b";
import { Big5Board } from "./board";
import { Rollout } from "./big5";

export const metadata = { title: "The Big 5" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) return <Lock kind="admin" configured={cfg.admin} />;
  const { ticks, rollout, persisted } = await readBig5Ticks();

  return (
    <>
      <PageTitle
        back={{ href: "/two-palms/backstage", label: "Backstage" }}
        title="The Big 5"
        lede="Five jobs we're taking off people's plates. Where each one is, what's next and whose it is. Updated after every call."
      />
      <section className="tp-section" style={{ paddingTop: 8 }}>
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
