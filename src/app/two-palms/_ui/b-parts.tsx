// Foundations tiles shared by Home, the overview and the session pages.
// All copy comes from foundations-hub-content.json via _data/foundations.ts.

import Link from "next/link";
import { FC, TMP_OPENS_ISO, countEvents, nextEvent, tmpIsOpen, twoZones, type CountEvent } from "../_data/foundations";
import { NextUpBody } from "./b-client";
import { IconArrow, IconLock, Lab, Tile, Win } from "./b";

const strip = (d: string) => d.replace(/ \d{4}$/, "");

export function NextUpTile({ now, span }: { now: Date; span?: 2 }) {
  const ev = countEvents();
  const n = nextEvent(now);
  const fb: CountEvent | null = n ? ev.find((e) => e.start_iso === n.start_iso) ?? null : null;
  return (
    <Tile hue="orange" next span={span} label="Next up">
      <Lab l={<><i className="dot dot--live" aria-hidden="true" />Next up</>} r="Sydney · Munich" />
      <div className="t-body">
        <NextUpBody events={ev} fallback={fb} />
        {n?.kind === "prebrief" ? <p className="note">{FC.pre_brief.where}. {FC.pre_brief.munich_note}</p> : null}
        <div className="acts">
          {fb?.href ? <Link className="btn btn--pri" href={fb.href}>{n?.kind === "prebrief" ? "What it covers" : "Open the session"}</Link> : null}
          <Link className="btn btn--sec" href="/two-palms/foundations#schedule">Full schedule</Link>
        </div>
      </div>
    </Tile>
  );
}

export function TmpTile({ now, span, compact }: { now: Date; span?: 2; compact?: boolean }) {
  const f = FC.forms.time_money_pain;
  const open = tmpIsOpen(now);
  const opens = twoZones(TMP_OPENS_ISO);
  return (
    <Tile hue="ember" span={span} label={f.label} href={open ? "/two-palms/time-money-pain" : undefined}>
      <Lab icon={open ? undefined : <IconLock />} l={f.label} r={open ? `Due ${strip(f.due)}` : "After S01"} hot={open} />
      <div className="area-b">
        <div className="area-c">
          <h3 className="tt">{open ? "Your three processes" : `Opens after Session 1, ${opens.sydneyDay}`}</h3>
          <p className="tp">{compact ? "The only homework you hand in." : f.intro}</p>
          <p className="note mono" style={{ marginTop: 10 }}>Due {f.due}</p>
          {open ? <span className="btn btn--hot" style={{ marginTop: 14, alignSelf: "flex-start" }}>Fill it in <IconArrow /></span> : null}
        </div>
        <Win src="/two-palms/img/prompt-04.jpg" w={64} h={48} wait={!open} className="win--area" />
      </div>
    </Tile>
  );
}

/** "Mon 2 Nov · 5:30pm Sydney · 7:30am Munich" */
export function WhenLine({ iso }: { iso: string }) {
  const z = twoZones(iso);
  return <>{z.sydneyDay} · {z.sydney} Sydney · {z.munich} Munich</>;
}
