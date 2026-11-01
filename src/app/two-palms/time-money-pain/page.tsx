import { FC, TMP_OPENS_ISO, tmpIsOpen, twoZones } from "../_data/foundations";
import { isAdminAuthed } from "../_lib/auth";
import { AdminUnlock } from "../_ui/b-client";
import { Bento, IconLock, Lab, PageTitle, Tile, Win } from "../_ui/b";
import { TmpForm } from "../_ui/tmp-form";

export const metadata = { title: "Time · Money · Pain" };

export default async function Page() {
  const f = FC.forms.time_money_pain;
  const now = new Date();
  const admin = await isAdminAuthed();
  const openForTeam = tmpIsOpen(now);
  const open = tmpIsOpen(now, admin);
  const opens = twoZones(TMP_OPENS_ISO);
  return (
    <>
      <PageTitle back={{ href: "/two-palms/foundations/1", label: "Session 1" }} title={f.label} lede="Homework you hand in. About 5 minutes." right={<span className="mono">Due {f.due}</span>} />
      <Bento>
        <Tile span={3} hue="ember" label={f.label}>
          <Lab icon={open ? undefined : <IconLock />} l={f.label} r={open ? `Due ${f.due}` : "Opens after S01"} hot={open} />
          {open ? (
            <>
              {!openForTeam ? <p className="note" style={{ marginTop: 12 }}>Open early for Backstage testing. The team sees it from {opens.sydney} Sydney, {opens.sydneyDay}.</p> : null}
              <TmpForm intro={f.intro} due={f.due} />
            </>
          ) : (
            <div className="t-body">
              <h2 className="tt-lg">Opens after Session 1, {opens.sydneyDay}</h2>
              <p className="tp" style={{ maxWidth: "56ch" }}>{f.intro}</p>
              <p className="note mono">Opens {opens.sydney} Sydney · {opens.munich} Munich · Due {f.due}</p>
              <div className="acts"><AdminUnlock label="Testing? Backstage password" /></div>
            </div>
          )}
        </Tile>
        <Tile label="Why it matters" className="fM">
          <Lab l="Why it matters" r="Private" />
          <div className="t-body">
            <Win src="/two-palms/img/prompt-04.jpg" w={240} h={240} wait={!open} style={{ width: "100%", aspectRatio: "4 / 3" }} />
            <p className="tp" style={{ marginTop: 12 }}>It&rsquo;s the only thing you hand in. Answers go to Jem only, never shown on the hub with names. We ask again in {f.reask}, to see what&rsquo;s changed.</p>
          </div>
        </Tile>
      </Bento>
    </>
  );
}
