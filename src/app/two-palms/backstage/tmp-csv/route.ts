import { isAdminAuthed } from "../../_lib/auth";
import { readTmp } from "../../_lib/tmp";
import { tmpCsv } from "../../_data/tmp";

export const dynamic = "force-dynamic";

/** Time · Money · Pain answers as CSV. Backstage password only. */
export async function GET() {
  if (!(await isAdminAuthed())) return new Response("Not found", { status: 404 });
  const rows = await readTmp();
  return new Response(tmpCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="two-palms-time-money-pain-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
