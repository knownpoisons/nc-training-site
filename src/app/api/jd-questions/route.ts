import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, question } = (await req.json()) as {
      name?: string;
      question?: string;
    };

    if (!name?.trim() || !question?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name and question are required." },
        { status: 400 }
      );
    }

    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json(
        { ok: false, error: "Slack not configured." },
        { status: 500 }
      );
    }

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `*Q&A question from ${name.trim()}:*\n\n${question.trim()}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `Q&A Question — ${name.trim()}`,
              emoji: false,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: question.trim(),
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "Submitted via the training hub for the bonus session",
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Slack webhook error:", res.status, errText);
      return NextResponse.json(
        { ok: false, error: "Failed to submit." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
