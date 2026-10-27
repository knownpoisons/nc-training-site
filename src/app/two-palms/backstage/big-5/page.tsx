import Link from "next/link";
import { readBig5 } from "../../_lib/big5";
import { hubConfigured, isAdminAuthed } from "../../_lib/auth";
import { Reveal } from "../../_ui/bits";
import { Lock } from "../../_ui/gates";
import { Big5 } from "./big5";

export const metadata = { title: "The Big 5" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) return <Lock kind="admin" configured={cfg.admin} />;
  const data = await readBig5();

  return (
    <>
      <section className="tp-hero" style={{ paddingBottom: 20 }}>
        <div className="tp-wrap">
          <Reveal>
            <div className="tp-eyebrow" style={{ marginBottom: 16 }}>
              <span className="tp-dot" />
              <Link href="/two-palms/backstage" className="tp-b5-crumb">Backstage</Link> · core team only
            </div>
            <h1 className="tp-h1"><span className="tp-outline">The</span> Big 5.</h1>
            <p className="tp-lede" style={{ marginTop: 18 }}>Five jobs we&rsquo;re taking off people&rsquo;s plates. What&rsquo;s due, who owns it, where each one is.</p>
          </Reveal>
        </div>
      </section>
      <section className="tp-section" style={{ paddingTop: 4 }}>
        <div className="tp-wrap">
          <Big5 data={data} />
        </div>
      </section>
    </>
  );
}
