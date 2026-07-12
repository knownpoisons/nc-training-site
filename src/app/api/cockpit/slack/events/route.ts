import { NextRequest, NextResponse } from "next/server";
import { verifySlackSignature } from "@/cockpit/slack/verify";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { handleMessage } from "@/cockpit/ops/handle";
import { makeConversationalResponder } from "@/cockpit/ops/converse";
import { claudeModelFromEnv } from "@/cockpit/draft/model";
import { loadKnowledge } from "@/cockpit/draft/knowledge";

// Slack Events API webhook (F4 entry point). Verifies the signature, answers the
// URL handshake, and routes real channel messages to the command handler.
// Bot's own messages are ignored to avoid loops.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // 1) Verify it really came from Slack.
  const ok = verifySlackSignature({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    timestamp: req.headers.get("x-slack-request-timestamp"),
    signature: req.headers.get("x-slack-signature"),
    rawBody,
    nowSeconds: Math.floor(Date.now() / 1000),
  });
  if (!ok) return NextResponse.json({ ok: false, error: "bad_signature" }, { status: 401 });

  let body: SlackEventBody;
  try {
    body = JSON.parse(rawBody) as SlackEventBody;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // 2) URL verification handshake (one-time, when wiring the endpoint in Slack).
  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  // 3) Handle human messages. Slack only delivers message.channels events for
  //    channels the bot has been invited to, so we reply in whatever channel the
  //    message arrived in (event.channel) rather than gating on SLACK_CHANNEL_ID —
  //    that env value is only used for the bot's own proactive posts (crons).
  const event = body.event;
  const { ctx, reason } = getLiveContext();
  console.log(
    "[cockpit/slack] inbound",
    JSON.stringify({
      type: event?.type,
      subtype: event?.subtype ?? null,
      channel: event?.channel ?? null,
      hasText: typeof event?.text === "string",
      bot: !!event?.bot_id,
      ctxReady: !!ctx,
      ctxReason: reason ?? null,
    })
  );
  if (
    ctx &&
    event &&
    event.type === "message" &&
    !event.bot_id && // ignore the bot's own posts
    event.subtype === undefined && // ignore edits/joins/etc.
    typeof event.channel === "string" &&
    typeof event.text === "string"
  ) {
    const settings = await ctx.store.getSettings();
    const now = new Date();
    const { day } = localParts(settings.timezone, now);

    // F5 — wire the conversational responder when the API key + knowledge exist.
    let respondConversational: ((text: string) => Promise<string>) | undefined;
    const model = claudeModelFromEnv();
    if (model) {
      try {
        respondConversational = makeConversationalResponder(ctx.store, model, loadKnowledge());
      } catch (err) {
        console.error("[cockpit/slack] F5 responder unavailable:", err);
      }
    }

    // Await so state is written before we ack.
    try {
      await handleMessage(
        ctx.store,
        ctx.slack,
        {
          channel: event.channel,
          today: day,
          nowIso: now.toISOString(),
          messageTs: event.ts,
          respondConversational,
        },
        event.text
      );
    } catch (err) {
      console.error("[cockpit/slack] handle failed:", err);
    }
  }

  // Always 200 quickly so Slack doesn't retry.
  return NextResponse.json({ ok: true });
}

interface SlackEventBody {
  type: string;
  challenge?: string;
  event?: {
    type: string;
    subtype?: string;
    bot_id?: string;
    channel?: string;
    text?: string;
    ts: string;
  };
}
