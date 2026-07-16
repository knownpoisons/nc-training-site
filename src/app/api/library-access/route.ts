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

  // Newsletter opt-in + Slack ping, in parallel and best-effort: if either is
  // down we still open the library rather than trap the visitor at the gate.
  const [beehiiv, slack] = await Promise.allSettled([
    subscribeToBeehiiv({ name, email, company }),
    notifySlack({ name, email, company }),
  ]);
  if (beehiiv.status === "rejected")
    console.error("[library-access] beehiiv failed:", beehiiv.reason);
  if (slack.status === "rejected")
    console.error("[library-access] slack failed:", slack.reason);

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

// ─── Slack — ping Jeremy on every library signup ─────────────────────────────
async function notifySlack(args: {
  name: string;
  email: string;
  company: string;
}): Promise<{ ok: boolean; note?: string }> {
  const { name, email, company } = args;
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return { ok: true, note: "slack_skipped_env_missing" };

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `New library signup: ${name} (${company}) — ${email}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📚 New Prompt Library signup",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Name:*\n${name}` },
            { type: "mrkdwn", text: `*Email:*\n${email}` },
            { type: "mrkdwn", text: `*Company:*\n${company}` },
            { type: "mrkdwn", text: `*Opted in:*\nNotContent newsletter` },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "via training.notcontent.ai/library — added to Beehiiv",
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`slack_${res.status}: ${errText.slice(0, 200)}`);
  }
  return { ok: true };
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
