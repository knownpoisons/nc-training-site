import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface Body {
  name?: string;
  email?: string;
  company?: string;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameOk = name.split(/\s+/).filter(Boolean).length >= 2; // first + last
  if (!nameOk || !emailOk || !company) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 }
    );
  }

  // Add to the Beehiiv newsletter (this submission IS the opt-in). Best-effort:
  // if Beehiiv is down we still open the library rather than trap the visitor.
  try {
    await subscribeToBeehiiv({ name, email, company });
  } catch (err) {
    console.error("[library-access] beehiiv failed:", err);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("nc_library_access", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return res;
}

async function subscribeToBeehiiv(args: {
  name: string;
  email: string;
  company: string;
}): Promise<{ ok: boolean; note?: string }> {
  const { name, email, company } = args;
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) {
    return { ok: true, note: "beehiiv_skipped_env_missing" };
  }

  const parts = name.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: false,
        utm_source: "prompt-library",
        utm_medium: "gate",
        custom_fields: [
          { name: "first_name", value: firstName },
          { name: "last_name", value: lastName },
          { name: "company", value: company },
        ],
        tags: ["library-access"],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`beehiiv_${res.status}: ${errText.slice(0, 200)}`);
  }
  return { ok: true };
}
