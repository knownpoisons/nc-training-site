import { PageTitle } from "../_ui/b";
import { GreenLight } from "./game";
import "./green-light.css";

export const metadata = { title: "Green Light" };

type Props = { searchParams?: Promise<{ mode?: string }> };

export default async function Page({ searchParams }: Props) {
  const mode = (await searchParams)?.mode === "room" ? "room" : "solo";
  return (
    <>
      <PageTitle back={{ href: "/two-palms/policy", label: "AI policy" }} title="Green Light" lede="The AI policy, one moment at a time." right={<span className="lab-x">Session 2 · Brief</span>} />
      <div className="gl-wrap">
        <GreenLight startMode={mode} />
      </div>
    </>
  );
}
