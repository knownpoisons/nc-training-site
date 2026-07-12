import { NextRequest, NextResponse, after } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { verifySlackSignature } from "@/cockpit/slack/verify";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { handleMessage } from "@/cockpit/ops/handle";
import { makeConversationalResponder, makeRoaster } from "@/cockpit/ops/converse";
import { claudeModelFromEnv } from "@/cockpit/draft/model";
import { loadKnowledge } from "@/cockpit/draft/knowledge";
import { claudeEnrichmentFromEnv } from "@/cockpit/engine-zero/claudeEnrichment";
import { enrichLead } from "@/cockpit/engine-zero/enrich";
import type { MergedLead, LeadSource } from "@/cockpit/engine-zero/types";

// Slack Events API webhook (F4 entry point). Verifies the signature, answers the
// URL handshake, and routes real channel messages to the command handler.
// Bot's own messages are ignored to avoid loops.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  // Record EVERY arrival before any checks — into the DB (cockpit_intake_log),
  // so "Slack never sent it" vs "sent but rejected" is verifiable after the
  // fact without log-streaming coordination. Setup diagnostic; cheap; keep.
  console.log("[cockpit/slack] knock", rawBody.slice(0, 80));
  try {
    const db = getSupabaseServer();
    if (db) {
      await db.from("cockpit_intake_log").insert({
        source: "slack-knock",
        raw_payload: {
          len: rawBody.length,
          hasSig: !!req.headers.get("x-slack-signature"),
          hint: rawBody.slice(0, 200),
        },
      });
    }
  } catch (e) {
    console.error("[cockpit/slack] knock log failed:", e);
  }

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
    // Process AFTER responding — Slack requires an ack within 3s, and a cold
    // serverless start plus DB/AI work can exceed that. after() runs post-response
    // so Slack never times out and stops delivering.
    const c = ctx;
    const channel = event.channel;
    const text = event.text;
    const messageTs = event.ts;
    after(async () => {
      try {
        const settings = await c.store.getSettings();
        const now = new Date();
        const { day } = localParts(settings.timezone, now);

        let respondConversational: ((t: string) => Promise<string>) | undefined;
        let draftCtx: { model: NonNullable<ReturnType<typeof claudeModelFromEnv>>; knowledge: ReturnType<typeof loadKnowledge> } | undefined;
        let roast: (() => Promise<string>) | undefined;
        const model = claudeModelFromEnv();
        if (model) {
          try {
            const knowledge = loadKnowledge();
            respondConversational = makeConversationalResponder(c.store, model, knowledge);
            roast = makeRoaster(c.store, model, knowledge);
            draftCtx = { model, knowledge };
          } catch (err) {
            console.error("[cockpit/slack] AI wiring unavailable:", err);
          }
        }

        // A1 — research hand-added prospects so touch 1 personalises itself.
        let enrich: ((p: import("@/cockpit/store/types").StoreProspect) => Promise<void>) | undefined;
        const provider = claudeEnrichmentFromEnv();
        if (provider) {
          enrich = async (p) => {
            const merged: MergedLead = {
              name: p.name, email: p.email, company: p.company, role: p.role,
              linkedinUrl: p.linkedinUrl ?? null, sources: (p.sources ?? []) as LeadSource[],
              consentLane: p.consentLane ?? "pipeline", engagementRecency: null, sourceDetail: {},
            };
            const dossier = await enrichLead(provider, merged);
            await c.store.setDossier(p.id, dossier.line, dossier.openerAngle);
          };
        }

        await handleMessage(
          c.store,
          c.slack,
          { channel, today: day, nowIso: now.toISOString(), messageTs, respondConversational, draftCtx, enrich, roast },
          text
        );
      } catch (err) {
        console.error("[cockpit/slack] handle failed:", err);
      }
    });
  }

  // Ack Slack immediately (before after() runs) so it never retries or disables.
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
