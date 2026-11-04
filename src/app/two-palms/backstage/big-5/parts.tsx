import type { ReactNode } from "react";
import { B5_STAGES, type B5Job } from "../../_data/big5";
import type { Big5Tick } from "../../_lib/big5";

export const stageName = (j: B5Job) => (j.stage < 0 ? "Not started" : B5_STAGES[j.stage as number]);
export const doneCount = (j: B5Job, ticks: Record<string, Big5Tick>) => j.todos.filter((t) => (ticks[t.id] ? ticks[t.id].done : !!t.done)).length;

export function Meter({ stage }: { stage: number }) {
  return (
    <span className="b5-meter" role="img" aria-label={stage < 0 ? "Not started" : `Stage ${stage + 1} of 5: ${B5_STAGES[stage]}`}>
      {B5_STAGES.map((s, i) => <i key={s} className={i < stage ? "is-done" : i === stage ? "is-now" : ""} />)}
    </span>
  );
}


/** Small markdown renderer for Big 5 docs: headings, lists, bold, paragraphs. */
function inline(t: string): ReactNode[] {
  return t.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((x, i) =>
    x.startsWith("**") ? <b key={i}>{x.slice(2, -2)}</b> : x.startsWith("*") && x.length > 2 ? <em key={i}>{x.slice(1, -1)}</em> : x);
}
export function Md({ body }: { body: string }) {
  const out: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => { if (list) { const L = list; out.push(L.ordered ? <ol key={out.length}>{L.items.map((x, i) => <li key={i}>{inline(x)}</li>)}</ol> : <ul key={out.length}>{L.items.map((x, i) => <li key={i}>{inline(x)}</li>)}</ul>); list = null; } };
  for (const raw of body.split("\n")) {
    const l = raw.trimEnd();
    const ol = l.match(/^\d+\.\s+(.*)$/), ul = l.match(/^[-*]\s+(.*)$/);
    if (ol || ul) { const ordered = !!ol; if (!list || list.ordered !== ordered) { flush(); list = { ordered, items: [] }; } list.items.push((ol ?? ul)![1]); continue; }
    flush();
    if (!l) continue;
    if (l.startsWith("# ")) continue; // the page already carries the title
    if (l.startsWith("## ")) out.push(<h2 key={out.length}>{l.slice(3)}</h2>);
    else if (l.startsWith("### ")) out.push(<h3 key={out.length}>{l.slice(4)}</h3>);
    else out.push(<p key={out.length}>{inline(l)}</p>);
  }
  flush();
  return <div className="b5-md">{out}</div>;
}
