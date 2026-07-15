import { cookies } from "next/headers";
import { PROMPTS } from "./prompts";
import { LibraryGate } from "./gate";

// Email gate for the ENTIRE library. Because this layout wraps both the index
// and every /library/<slug> page, a direct link into a prompt hits the gate
// too — no cookie, no prompts. The prompt content is never rendered into the
// response until the cookie is present. Reading cookies() makes this layout
// (and the whole /library subtree) render per-request automatically.
export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const hasAccess = jar.get("nc_library_access")?.value === "1";

  if (!hasAccess) {
    return <LibraryGate total={PROMPTS.length} />;
  }
  return <>{children}</>;
}
