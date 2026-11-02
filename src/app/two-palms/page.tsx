import Link from "next/link";
import type { CSSProperties } from "react";
import { FC, SESSIONS, nextEvent, sessionHref, sessionTitle, tmpIsOpen, toolsAreOpen, twoZones } from "./_data/foundations";
import { HUB, PROMPTS, SETUP_STEPS } from "./_data/hub";
import { POLICY_META } from "./_data/policy";
import { CopyButton } from "./_ui/bits";
import { SetupMeter } from "./_ui/b-client";
import { Bento, IconArrow, IconClock, IconHash, IconLock, Lab, PageTitle, PrintTile, Tile, Win } from "./_ui/b";
import { NextUpTile } from "./_ui/b-parts";

const strip = (d: string) => d.replace(/ \d{4}$/, "");
/** Column span at 4 / 3 / 2 columns, and order at 3 columns (no row ever ends with a lone tile). */
const g = (c4: number, c3: number, c2: number, o3: number) => ({ "--c4": c4, "--c3": c3, "--c2": c2, "--o3": o3 }) as CSSProperties;

export default function Home() {
  const now = new Date();
  const onboarding = PROMPTS.find((p) => p.id === "onboarding")!;
  // Feature the next session (Session 1 until it has run), preview the one after.
  const nxt = nextEvent(now);
  const featIdx = Math.max(0, SESSIONS.findIndex((s) => new Date(s.when.start_iso).getTime() + s.when.duration_min * 60000 > now.getTime()));
  const feat = SESSIONS[featIdx] ?? SESSIONS[0];
  // Between sessions, the last one's wrap-up (recap + homework) leads and the next sits beside it.
  const wrap = featIdx > 0 && now.getTime() >= new Date(SESSIONS[featIdx - 1].when.start_iso).getTime() ? SESSIONS[featIdx - 1] : null;
  const after = wrap ? null : SESSIONS[featIdx + 1] ?? null;
  const rest = SESSIONS.filter((s) => s !== feat && s !== after && s !== wrap);
  const short = (t: string) => t.split(/[.:(]/)[0].trim();
  const toolsOpen = toolsAreOpen(now);
  const tmpOpen = tmpIsOpen(now);
  const tz = twoZones(feat.when.start_iso);
  const nextIsFeat = nxt?.start_iso === feat.when.start_iso;
  const tmp = FC.forms.time_money_pain;

  return (
    <>
      <PageTitle title={FC.programme.hub_name} lede="Where Two Palms learns to work with AI." right={<span className="lab-x">{FC.programme.through_line}</span>} />
      <Bento kind="home">
        {/* Row 1: set up, then what's next */}
        <Tile hue="mustard" label="Set up Claude" style={g(2, 2, 2, 1)}>
          <Lab l="Before we begin" r="About 40 min" />
          <div className="split split--big">
            <div className="split-c">
              <h2 className="tt">Set up your Claude account</h2>
              <p className="tp">The onboarding prompt, then eight steps.</p>
              <SetupMeter total={SETUP_STEPS.length} />
              <div className="acts">
                <CopyButton text={onboarding.body} label="Copy the prompt" className="btn btn--pri" />
                <Link className="btn btn--sec" href="/two-palms/setup">The 8 steps</Link>
              </div>
            </div>
            <Win src="/two-palms/img/h/setup.jpg" w={800} h={600} eager />
          </div>
        </Tile>

        <NextUpTile now={now} print style={g(2, 2, 2, 3)} />

        {/* Row 2: the programme */}
        <Tile hue="mustard" label={FC.programme.name} style={g(3, 3, 2, 5)}>
          <Lab l={FC.programme.name} sub={`${SESSIONS.length} sessions`} r={<Link className="lnk" href="/two-palms/foundations#schedule">The schedule <IconArrow /></Link>} />
          <div className="fo fo--big">
            {wrap ? (
              <Link className="fo-feat" href={sessionHref(wrap)}>
                <span className="fo-top"><span>S{wrap.number} · Done</span><span className="hot">Wrap-up</span></span>
                <span className="fo-b">
                  <Win src={`/two-palms/img/l/session-${wrap.number}.jpg`} w={720} h={720} />
                  <span>
                    <span className="tt" style={{ display: "block" }}>Session {wrap.n} wrap-up</span>
                    <span className="tp" style={{ display: "block" }}>Cheat sheet, recap and this week&apos;s homework.</span>
                    <span className="fo-hw" style={{ display: "block" }}>
                      {wrap.homework.map((h, i) => <span key={i} className="fo-hw-i"><span className="mono">{String(i + 1).padStart(2, "0")}</span>{h.short ?? short(h.text)}</span>)}
                    </span>
                  </span>
                </span>
              </Link>
            ) : null}
            <Link className={wrap ? "fo-next" : "fo-feat"} href={sessionHref(feat)}>
              <span className="fo-top"><span>S{feat.number}</span><span className={nextIsFeat ? "hot" : "w"}>{nextIsFeat ? "Next" : feat.phase}</span></span>
              <span className="fo-b">
                <Win src={`/two-palms/img/l/session-${feat.number}.jpg`} w={720} h={720} />
                <span>
                  <span className="tt" style={{ display: "block" }}>Session {feat.n}: {sessionTitle(feat)}</span>
                  <span className="tp" style={{ display: "block" }}>{feat.line}</span>
                  <span className="fo-when" style={{ display: "block" }}>{tz.sydneyDay} · {tz.sydney} Sydney · {tz.munich} Munich</span>
                </span>
              </span>
            </Link>
            {after ? (
              <Link className="fo-next" href={sessionHref(after)}>
                <span className="fo-top"><span className="w">After that</span><span>S{after.number}</span></span>
                <span className="fo-b">
                  <Win src={`/two-palms/img/session-${after.number}.jpg`} w={240} h={240} wait />
                  <span>
                    <span className="tt" style={{ display: "block" }}>{sessionTitle(after)}</span>
                    <span className="fo-when" style={{ display: "block", color: "var(--text-2)" }}>{strip(after.when.date)} · {twoZones(after.when.start_iso).sydney} Sydney</span>
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
          <ol className="b-strip b-strip--thumbs" aria-label="The other sessions">
            {rest.map((s) => (
              <li key={s.n}>
                <Link className="cell" href={sessionHref(s)}>
                  <span className="cell-k">S{s.number}</span>
                  <span className="cell-row"><Win src={`/two-palms/img/session-${s.number}.jpg`} w={240} h={240} wait className="win--cell" /><span className="cell-n">{sessionTitle(s)}</span></span>
                </Link>
              </li>
            ))}
          </ol>
        </Tile>

        <PrintTile
          style={g(1, 1, 1, 2)} hue="ember" label={tmp.label}
          href={tmpOpen ? "/two-palms/time-money-pain" : undefined}
          lab={<Lab icon={tmpOpen ? undefined : <IconLock />} l="Time · Money · Pain" r={tmpOpen ? `Due ${strip(tmp.due)}` : "After S01"} hot={tmpOpen} />}
          img="/two-palms/img/h/notebook.jpg" w={640} h={640} wait={!tmpOpen}
          title={tmpOpen ? "Your three processes" : "Opens after Session 1"}
          line={<span className="mono">{tmpOpen ? `Due ${strip(tmp.due)} · about 5 min` : `Due ${strip(tmp.due)}`}</span>}
        />

        {/* Row 3: the kit */}
        <PrintTile
          style={g(1, 1, 1, 4)} hue="sky" href="/two-palms/prompts" label="Prompt library"
          lab={<Lab l="Prompt library" r={`${PROMPTS.length} prompts`} />}
          img="/two-palms/img/h/prompts.jpg" w={640} h={480}
          title="Good prompts to steal" line="Every one has a copy button."
        />
        <PrintTile
          style={g(1, 1, 1, 6)} hue="blush" href="/two-palms/policy" label="Rules for use"
          lab={<Lab l="AI policy" r={`V${POLICY_META.version.replace(/\.0$/, "")}`} />}
          img="/two-palms/img/h/rules.jpg" w={640} h={480}
          title="Rules for use" line="The AI policy, two pages, easy read."
        />
        <PrintTile
          style={g(1, 1, 1, 7)} hue="bone" href="/two-palms/tools" label="Approved team-built tools"
          lab={<Lab icon={toolsOpen ? undefined : <IconLock />} l="Approved tools" r={toolsOpen ? "Open" : "After S06"} />}
          img="/two-palms/img/h/showcase.jpg" w={640} h={480} wait={!toolsOpen}
          title="Team-built tools" line={toolsOpen ? "The best of what the team built." : "Opens after Session 6."}
        />
        <PrintTile
          style={g(1, 1, 1, 8)} hue="sky" href={HUB.slackUrl} ext label="#ai-training on Slack"
          lab={<Lab icon={<IconHash />} l="Slack" r="Open now" />}
          img="/two-palms/img/h/spotlight.jpg" w={640} h={480}
          title="#ai-training" line="Post what you make."
        />

        {/* Row 4 */}
        <PrintTile
          style={g(2, 2, 1, 9)} hue="bone" label="Office hours"
          lab={<Lab icon={<IconClock />} l="Office hours" r="To confirm" />}
          img="/two-palms/img/h/office-hours.jpg" w={720} h={540}
          title="Bring a real job" line="Drop in. Bring what's stuck."
        >
          <ul className="oh">
            {FC.office_hours.map((o) => <li key={o.n} className="mono"><span>OH{o.n}</span>{o.date.replace(/\s*\(to confirm\)/i, "").replace(/^around /, "~")} · to confirm</li>)}
          </ul>
        </PrintTile>
        <PrintTile
          style={g(2, 1, 2, 10)} hue="ember" href="/two-palms/creative" label="Creative Programme"
          lab={<Lab l="Coming soon" r="Part two" />}
          img="/two-palms/img/h/creative.jpg" w={800} h={600} wait
          title="Creative Programme" line="AI production, after Foundations."
        />
      </Bento>
    </>
  );
}
