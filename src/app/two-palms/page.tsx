import { FC, SESSIONS } from "./_data/foundations";
import { PROMPTS } from "./_data/hub";
import { tmpIsOpen, toolsAreOpen } from "./_data/foundations";
import { PageTitle } from "./_ui/b";
import { HomeD } from "./_ui/home-d";

// Home: "cover, then contents" (approved 2 Nov). Design rules: ./DESIGN.md
export default function Home() {
  const now = new Date();
  const onboarding = PROMPTS.find((p) => p.id === "onboarding")!;
  // The featured session is the next one that hasn't finished; between sessions the last one's wrap-up leads.
  const featIdx = Math.max(0, SESSIONS.findIndex((s) => new Date(s.when.start_iso).getTime() + s.when.duration_min * 60000 > now.getTime()));
  const feat = SESSIONS[featIdx] ?? SESSIONS[0];
  const wrap = featIdx > 0 && now.getTime() >= new Date(SESSIONS[featIdx - 1].when.start_iso).getTime() ? SESSIONS[featIdx - 1] : null;
  return (
    <div className="tidy tidy--d">
      <PageTitle title={FC.programme.hub_name} lede="Where Two Palms learns to work with AI." right={<span className="lab-x">{FC.programme.through_line}</span>} />
      <HomeD now={now} onboardingBody={onboarding.body} feat={feat} featIdx={featIdx} wrap={wrap} tmpOpen={tmpIsOpen(now)} toolsOpen={toolsAreOpen(now)} />
    </div>
  );
}
