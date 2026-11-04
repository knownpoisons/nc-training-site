import Link from "next/link";
import { notFound } from "next/navigation";
import { hubConfigured, isAdminAuthed } from "../../../../../_lib/auth";
import { Lock } from "../../../../../_ui/gates";
import { IconArrow } from "../../../../../_ui/b";
import { big5Job } from "../../../../../_data/big5";
import { Md } from "../../../parts";

export const dynamic = "force-dynamic";
export const metadata = { title: "The Big 5" };

export default async function Page({ params }: { params: Promise<{ job: string; doc: string }> }) {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) return <Lock kind="admin" configured={cfg.admin} />;
  const p = await params;
  const j = big5Job(p.job);
  const doc = j?.docs.find((x) => x.id === p.doc);
  if (!j || !doc) notFound();
  return (
    <section className="tp-section" style={{ paddingTop: 20 }}>
      <div className="tp-wrap b5 b5-docpage">
        <div className="pc-back"><Link className="tpb-back" href={`/two-palms/backstage/big-5/${j.id}`}><IconArrow back />{j.name}</Link></div>
        <article className="t b5-doc">
          <span className="pl-k">{j.short} · <span className="mono">{doc.date}</span></span>
          <h1 className="b5-h1">{doc.title}</h1>
          <Md body={doc.body} />
        </article>
      </div>
    </section>
  );
}
