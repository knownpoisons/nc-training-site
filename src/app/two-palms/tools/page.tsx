import { FC, TOOLS_OPENS_ISO, toolsAreOpen, twoZones } from "../_data/foundations";
import { TOOLS } from "../_data/hub";
import { Bento, IconLock, Lab, PageTitle, Tile, Win } from "../_ui/b";

export const metadata = { title: "Approved team-built tools" };

export default function Page() {
  const cfg = FC.pages_to_add.approved_tools;
  const open = toolsAreOpen(new Date());
  const opens = twoZones(TOOLS_OPENS_ISO);
  return (
    <>
      <PageTitle back={{ href: "/two-palms", label: "Home" }} title={cfg.label} lede="The best skills and tools the team builds. One version of each." right={<span className="mono">{open ? `${String(TOOLS.length).padStart(2, "0")} tools` : "Opens after S06"}</span>} />
      <Bento>
        {!open ? (
          <>
            <Tile span={3} hue="bone" label={cfg.label}>
              <Lab icon={<IconLock />} l={cfg.label} r="Locked" />
              <div className="t-body">
                <h2 className="tt-lg">Opens after Session 6, {opens.sydneyDay}</h2>
                <p className="tp" style={{ maxWidth: "56ch" }}>{cfg.empty_state}</p>
                <p className="note mono">Opens {opens.sydney} Sydney · {opens.munich} Munich</p>
              </div>
            </Tile>
            <Tile className="fM" label="Print">
              <Lab l="Session 6" r="Share" />
              <div className="t-body"><Win src="/two-palms/img/showcase.jpg" w={240} h={240} wait style={{ width: "100%", aspectRatio: "4 / 3" }} /></div>
            </Tile>
          </>
        ) : TOOLS.length === 0 ? (
          <Tile span="F" hue="bone" label={cfg.label}>
            <Lab l={cfg.label} r="00 tools" />
            <div className="t-body"><h2 className="tt">Nothing here yet</h2><p className="tp">{cfg.empty_state}</p></div>
          </Tile>
        ) : (
          TOOLS.map((t) => (
            <Tile key={t.name} span={2} hue="bone" label={t.name} href={t.href}>
              <Lab l={t.forRole} r={`Added ${t.addedOn}`} />
              <div className="t-body">
                <h2 className="tt">{t.name}</h2>
                <p className="tp">{t.what}</p>
                <p className="lab-x" style={{ marginTop: 14 }}>How to use it</p>
                <p className="tp" style={{ marginTop: 4 }}>{t.how}</p>
              </div>
            </Tile>
          ))
        )}
      </Bento>
    </>
  );
}
