// ═══════════════════════════════════════════════════════════════════════════════
// SLACK CLIENT — the messaging seam.
// FakeSlack (tests) records every call; WebSlack (production) hits the Web API.
// Logic modules depend only on this interface.
// ═══════════════════════════════════════════════════════════════════════════════

export interface PostedMessage {
  ts: string;
}

export interface SlackClient {
  /** Post a top-level message to a channel. Returns the message timestamp (ts). */
  postMessage(channel: string, text: string): Promise<PostedMessage>;
  /** Reply inside a thread (used for confirmations under the brief). */
  postThreadReply(channel: string, threadTs: string, text: string): Promise<PostedMessage>;
  /** Add an emoji reaction to a message (the ✅ on "done"). */
  addReaction(channel: string, ts: string, emoji: string): Promise<void>;
}
