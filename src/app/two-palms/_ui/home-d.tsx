// Home, version D (preview): "cover, then contents". One huge moment for this week, then a tight contents grid.
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { FC, SESSIONS, sessionHref, sessionTitle, twoZones, type FSession } from "../_data/foundations";
import { HUB } from "../_data/hub";
import { CopyButton } from "./bits";
import { IconArrow, IconClock, IconHash, IconLock, Lab, Tile, Win } from "./b";

const strip = (d: string) => d.replace(/ \d{4}$/, "");
const sp = (c12: number, c6: number, extra?: CSSProperties) => ({ "--c12": c12, "--c6": c6, ...extra }) as CSSProperties;

/** "5:30pm" as split-flap characters: each drops in like the clock beside it. */
function Flap({ text }: { text: string }) {
  return (
    <span className="cv-flap" aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={`fl${/[0-9]/.test(ch) ? "" : " fl--s"}`} style={{ "--i": i } as CSSProperties} aria-hidden="true">{ch}</span>
      ))}
    </span>
  );
}

/** A photo-plate tile: the photo is the tile, the words sit on a small cream plate. */
function Plate({ href, ext, hue, label, lab, title, line, img, wait, big, style, children, cls = "" }: {
  href?: string; ext?: boolean; hue: "ember" | "sky" | "blush" | "bone" | "mustard"; label: string; lab: ReactNode; title: string; line?: ReactNode; img: string; wait?: boolean; big?: boolean; style: CSSProperties; children?: ReactNode; cls?: string;
}) {
  return (
    <Tile href={href} ext={ext} hue={hue} label={label} style={style} className={`t--plate${big ? " t--plate-big" : ""} ${cls}`}>
      <Win src={img} w={1200} h={900} wait={wait} className="pl-img" />
      <div className="pl-c">
        <span className="pl-k">{lab}</span>
        <h3 className="pl-t">{title}</h3>
        {line ? <p className="tp">{line}</p> : null}
        {children}
      </div>
    </Tile>
  );
}

export function HomeD({ now, onboardingBody, feat, featIdx, wrap, tmpOpen, toolsOpen }: {
  now: Date; onboardingBody: string; feat: FSession; featIdx: number; wrap: FSession | null; tmpOpen: boolean; toolsOpen: boolean;
}) {
  const tz = twoZones(feat.when.start_iso);
  const tmp = FC.forms.time_money_pain;
  const short = (t: string) => t.split(/[.:(]/)[0].trim();
  const live = now.getTime() >= new Date(feat.when.start_iso).getTime();
  return (
    <div className="tpb-bento tpb-bento--d">
      {/* Set up: a one-off job, so a ticket band, not a cover */}
      <Tile hue="mustard" label="Set up Claude" style={sp(12, 6)} className="t--band">
        <Win src="/two-palms/img/h/setup.jpg" w={800} h={600} eager className="bd-img" />
        <div className="bd-c">
          <span className="pl-k">Before we begin · about 40 min</span>
          <h2 className="bd-t">Set up your Claude account</h2>
        </div>
        <div className="bd-a">
          <CopyButton text={onboardingBody} label="Copy the prompt" className="btn btn--pri" />
          <Link className="btn btn--sec" href="/two-palms/setup">See the steps</Link>
        </div>
      </Tile>

      {/* The cover: this week's session */}
      <Tile hue="orange" label="Next up" style={sp(12, 6)} className="t--cover">
        <div className="cv-c">
          <span className="pl-k"><i className="dot dot--live" aria-hidden="true" />{live ? "On now" : "Next up"}</span>
          <h2 className="cv-h"><span className="cv-k">Session {feat.n}</span>{sessionTitle(feat)}</h2>
          <p className="cv-line">{feat.line}</p>
          <div className="cv-time">
            <Flap text={tz.sydney} /><span className="pl-k">Sydney</span>
          </div>
          <p className="cv-z"><b>{tz.munich}</b> Munich · {tz.sydneyDay}</p>
          <div className="acts">
            <Link className="btn btn--pri" href={sessionHref(feat)}>Open the session</Link>
            <Link className="btn btn--sec" href="/two-palms/foundations#schedule">Full schedule</Link>
          </div>
        </div>
        <Win src="/two-palms/img/h/session.jpg" w={1600} h={1200} eager className="cv-img" />
      </Tile>

      {/* The programme: wrap-up, then the rack of eight disks */}
      <Tile hue="mustard" label={FC.programme.name} style={sp(12, 6)} className="t--fo gap-lg">
        <Lab l={FC.programme.name} r={<Link className="lnk" href="/two-palms/foundations#schedule">The schedule <IconArrow /></Link>} />
        {wrap ? (
          <Link className="fd-wrap" href={sessionHref(wrap)}>
            <Win src={`/two-palms/img/l/session-${wrap.number}.jpg`} w={720} h={720} className="fd-wrap-img" />
            <span className="fd-wrap-c">
              <span className="pl-k">Start here</span>
              <span className="fd-wrap-t">Session {wrap.n} wrap-up</span>
              <span className="fd-hw">{wrap.homework.map((h, i) => <span key={i}>{h.short ?? short(h.text)}</span>)}</span>
              <span className="fd-go">Open the wrap-up <IconArrow /></span>
            </span>
          </Link>
        ) : null}
        <ol className="rack" aria-label="All eight sessions">
          {SESSIONS.map((s, i) => {
            const state = i < featIdx ? "is-done" : i === featIdx ? "is-now" : "is-later";
            return (
              <li key={s.n} className={state}>
                <Link href={sessionHref(s)} aria-current={i === featIdx ? "step" : undefined}>
                  <Win src={`/two-palms/img/l/session-${s.number}.jpg`} w={480} h={480} wait={i > featIdx} className="rack-img" />
                  <span className="rack-n">{sessionTitle(s)}</span>
                  <span className="rack-d">{i === featIdx ? "Next" : i < featIdx ? "Done" : strip(s.when.date).replace(/^\w+ /, "")}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Tile>

      {/* Contents */}
      <Plate
        style={sp(5, 3)} hue="ember" label={tmp.label} href={tmpOpen ? "/two-palms/time-money-pain" : undefined}
        lab={<>{tmpOpen ? null : <IconLock />}Time · Money · Pain · {tmpOpen ? `due ${strip(tmp.due)}` : "after Session 1"}</>}
        img="/two-palms/img/h/notebook.jpg" wait={!tmpOpen} title="Your three processes" line="The one piece of homework you hand in."
      />
      <Plate style={sp(7, 3)} hue="sky" href="/two-palms/prompts" label="Prompt library" lab="Prompt library" img="/two-palms/img/h/prompts.jpg" title="Good prompts to steal" line="Copy, paste, done." />
      <Plate style={sp(4, 2)} hue="blush" href="/two-palms/policy" label="Rules for use" lab="AI policy" img="/two-palms/img/h/rules.jpg" title="Rules for use" line="What you can and can't do with AI." />
      <Plate style={sp(4, 2)} hue="bone" href="/two-palms/tools" label="Approved tools" lab={<>{toolsOpen ? null : <IconLock />}Approved tools</>} img="/two-palms/img/h/showcase.jpg" wait={!toolsOpen} title="Team-built tools" line={toolsOpen ? "The best of what the team built." : "Opens after Session 6."} />
      <Plate cls="pl-wide-phone" style={sp(4, 2)} hue="sky" href={HUB.slackUrl} ext label="#ai-training on Slack" lab={<><IconHash />Slack</>} img="/two-palms/img/h/spotlight.jpg" title="#ai-training" line="Post what you make." />

      <Plate style={sp(5, 3, { marginTop: 30 })} hue="bone" label="Office hours" lab={<><IconClock />Office hours · dates to confirm</>} img="/two-palms/img/h/office-hours.jpg" title="Bring a real job" line="Drop in. Bring what's stuck.">
        <ul className="oh">{FC.office_hours.map((o) => <li key={o.n} className="mono">{o.date.replace(/\s*\(to confirm\)/i, "").replace(/^around /, "")}</li>)}</ul>
      </Plate>
      <Plate style={sp(7, 3, { marginTop: 30 })} hue="ember" href="/two-palms/creative" label="Creative Programme" lab="Coming soon" img="/two-palms/img/h/creative.jpg" wait big title="Creative Programme" line="AI production, after Foundations." />
    </div>
  );
}
