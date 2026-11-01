import Link from "next/link";
import { FC, SESSIONS, TOOLS_OPENS_ISO, nextEvent, sessionHref, sessionTitle, toolsAreOpen, twoZones } from "./_data/foundations";
import { PROMPTS, RULES, SETUP_STEPS } from "./_data/hub";
import { CopyButton } from "./_ui/bits";
import { SetupMeter } from "./_ui/b-client";
import { Bento, IconArrow, IconClock, IconHash, IconLock, Lab, PageTitle, Tile, Win } from "./_ui/b";
import { NextUpTile, TmpTile } from "./_ui/b-parts";

const strip = (d: string) => d.replace(/ \d{4}$/, "");

export default function Home() {
  const now = new Date();
  const onboarding = PROMPTS.find((p) => p.id === "onboarding")!;
  // Feature the next session (Session 1 until it has run), preview the one after.
  const nxt = nextEvent(now);
  const featIdx = Math.max(0, SESSIONS.findIndex((s) => new Date(s.when.start_iso).getTime() + s.when.duration_min * 60000 > now.getTime()));
  const feat = SESSIONS[featIdx] ?? SESSIONS[0];
  const after = SESSIONS[featIdx + 1] ?? null;
  const rest = SESSIONS.filter((s) => s !== feat && s !== after);
  const toolsOpen = toolsAreOpen(now);
  const tz = twoZones(feat.when.start_iso);
  const nextIsFeat = nxt?.start_iso === feat.when.start_iso;

  return (
    <>
      <PageTitle title={FC.programme.hub_name} lede="Where Two Palms learns to work with AI. Sessions, homework, prompts and the rules, all here." right={<span className="lab-x">{FC.programme.through_line}</span>} />
      <Bento kind="home">
        {/* Set up Claude */}
        <Tile span={2} hue="mustard" label="Set up Claude">
          <Lab l="Before we begin" r="About 40 min" />
          <div className="split">
            <div className="split-c">
              <h2 className="tt">Set up your Claude account</h2>
              <p className="tp">Accept your invite, paste the onboarding prompt into your first chat and answer its questions (ten minutes), then work through the eight steps.</p>
              <SetupMeter total={SETUP_STEPS.length} />
              <div className="acts">
                <CopyButton text={onboarding.body} label="Copy the prompt" className="btn btn--pri" />
                <Link className="btn btn--sec" href="/two-palms/setup">See the 8 steps</Link>
              </div>
            </div>
            <Win src="/two-palms/img/l/setup.jpg" w={520} h={520} />
          </div>
        </Tile>

        <NextUpTile now={now} />

        <TmpTile now={now} compact />

        {/* AI Foundations module */}
        <Tile span={2} hue="mustard" label={FC.programme.name}>
          <Lab l={FC.programme.name} sub={`${SESSIONS.length} one-hour sessions`} r={<Link className="lnk" href="/two-palms/foundations#schedule">See the schedule <IconArrow /></Link>} />
          <div className="fo">
            <Link className="fo-feat" href={sessionHref(feat)}>
              <span className="fo-top"><span>S{feat.number}</span><span className={nextIsFeat ? "hot" : "w"}>{nextIsFeat ? "Next" : feat.phase}</span></span>
              <span className="fo-b">
                <Win src={`/two-palms/img/session-${feat.number}.jpg`} w={76} h={76} />
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
                  <Win src={`/two-palms/img/session-${after.number}.jpg`} w={52} h={52} wait />
                  <span>
                    <span className="tt" style={{ display: "block", fontSize: 18 }}>Session {after.n}: {sessionTitle(after)}</span>
                    <span className="fo-when" style={{ display: "block", color: "var(--text-2)" }}>{strip(after.when.date)} · {twoZones(after.when.start_iso).sydney} Sydney</span>
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
          <ol className="b-strip" aria-label="The other sessions">
            {rest.map((s) => (
              <li key={s.n}><Link className="cell" href={sessionHref(s)}><span className="cell-k">S{s.number}</span><span className="cell-n">{sessionTitle(s)}</span></Link></li>
            ))}
          </ol>
        </Tile>

        <Tile hue="sky" href="/two-palms/prompts" label="Prompt library">
          <Lab l="Prompt library" r={`${PROMPTS.length} prompts`} />
          <div className="area-b">
            <div className="area-c"><h3 className="tt">Good prompts to steal</h3><p className="tp">Every one has a copy button.</p></div>
            <Win src="/two-palms/img/prompts.jpg" w={64} h={48} className="win--area" />
          </div>
        </Tile>

        <Tile hue="blush" href="/two-palms/kit" label="Rules for use">
          <Lab l="Rules + Kit" r={`${RULES.length} rules`} />
          <div className="area-b">
            <div className="area-c"><h3 className="tt">Rules for use</h3><p className="tp">The policy on one page, the model board and the words.</p></div>
            <Win src="/two-palms/img/rules.jpg" w={64} h={48} className="win--area" />
          </div>
        </Tile>

        <Tile hue="bone" href="/two-palms/tools" label="Approved team-built tools">
          <Lab icon={toolsOpen ? undefined : <IconLock />} l="Approved tools" r={toolsOpen ? "Open" : "After S06"} />
          <div className="area-b">
            <div className="area-c">
              <h3 className="tt">{FC.pages_to_add.approved_tools.label}</h3>
              <p className="tp">{toolsOpen ? "The best of what the team has built." : `Opens after Session 6, ${twoZones(TOOLS_OPENS_ISO).sydneyDay}.`}</p>
            </div>
            <Win src="/two-palms/img/showcase.jpg" w={64} h={48} wait={!toolsOpen} className="win--area" />
          </div>
        </Tile>

        <Tile hue="sky" label="Slack">
          <Lab icon={<IconHash />} l="Slack" r="Link to confirm" />
          <div className="area-b">
            <div className="area-c"><h3 className="tt">#ai-training</h3><p className="tp">Meant to be loud. Post what you make, half-finished included.</p></div>
          </div>
        </Tile>

        <Tile hue="bone" label="Office hours">
          <Lab icon={<IconClock />} l="Office hours" r="To confirm" />
          <ul className="b-rows" style={{ marginTop: 10 }}>
            {FC.office_hours.map((o) => (
              <li key={o.n}><div className="row"><span className="row-c"><span className="row-t">{o.label}</span><span className="row-s">{o.format}</span></span><span className="row-st">{o.date.replace(/\s*\(to confirm\)/i, "")}<br />to confirm</span></div></li>
            ))}
          </ul>
        </Tile>

        <Tile hue="ember" href="/two-palms/creative" label="Creative Programme">
          <Lab l="Coming soon" r="Part two" />
          <div className="area-b">
            <div className="area-c"><h3 className="tt">Creative Programme</h3><p className="tp">AI production, the Two Palms way. Once everyone has the base.</p></div>
            <Win src="/two-palms/img/creative.jpg" w={64} h={48} wait className="win--area" />
          </div>
        </Tile>
      </Bento>
    </>
  );
}
