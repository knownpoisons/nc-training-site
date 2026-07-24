import { NextRequest, NextResponse } from "next/server";

const SLACK_CHANNEL = "C0B4L4CU7PA"; // #project-creative-training

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

    const token = process.env.SLACK_BOT_TOKEN;
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Slack not configured." },
        { status: 500 }
      );
    }

    const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
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

    const slackData = await slackRes.json();

    if (!slackData.ok) {
      console.error("Slack error:", slackData.error);
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
