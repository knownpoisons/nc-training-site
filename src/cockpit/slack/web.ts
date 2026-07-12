// ═══════════════════════════════════════════════════════════════════════════════
// WEB SLACK — the production SlackClient. Hits the Slack Web API with the bot
// token. Same interface as FakeSlack, so no logic module changes between test
// and live. Errors throw (the caller decides how loud to be).
// ═══════════════════════════════════════════════════════════════════════════════

import type { PostedMessage, SlackClient } from "./types";

const API = "https://slack.com/api";

async function call(method: string, token: string, body: Record<string, unknown>) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; ts?: string; error?: string };
  if (!json.ok) throw new Error(`slack_${method}: ${json.error ?? "unknown_error"}`);
  return json;
}

export class WebSlack implements SlackClient {
  constructor(private token: string) {}

  async postMessage(channel: string, text: string): Promise<PostedMessage> {
    const r = await call("chat.postMessage", this.token, { channel, text, unfurl_links: false });
    return { ts: r.ts ?? "" };
  }

  async postThreadReply(channel: string, threadTs: string, text: string): Promise<PostedMessage> {
    const r = await call("chat.postMessage", this.token, {
      channel,
      text,
      thread_ts: threadTs,
      unfurl_links: false,
    });
    return { ts: r.ts ?? "" };
  }

  async addReaction(channel: string, ts: string, emoji: string): Promise<void> {
    // reactions.add fails if the emoji is already present — swallow that one case.
    try {
      await call("reactions.add", this.token, { channel, timestamp: ts, name: emoji });
    } catch (err) {
      if (!(err instanceof Error) || !/already_reacted/.test(err.message)) throw err;
    }
  }
}

/** Build the live client from env, or null if the bot token isn't set yet. */
export function webSlackFromEnv(): WebSlack | null {
  const token = process.env.SLACK_BOT_TOKEN;
  return token ? new WebSlack(token) : null;
}
