// ═══════════════════════════════════════════════════════════════════════════════
// FAKE SLACK — records every call so tests can assert what the bot said/did.
// Deterministic timestamps (msg_1, msg_2, …) so round-trip tests are stable.
// ═══════════════════════════════════════════════════════════════════════════════

import type { PostedMessage, SlackClient } from "./types";

export interface RecordedMessage {
  channel: string;
  text: string;
  threadTs?: string;
  ts: string;
}

export interface RecordedReaction {
  channel: string;
  ts: string;
  emoji: string;
}

export class FakeSlack implements SlackClient {
  messages: RecordedMessage[] = [];
  reactions: RecordedReaction[] = [];
  private n = 0;

  private nextTs(): string {
    this.n += 1;
    return `msg_${this.n}`;
  }

  async postMessage(channel: string, text: string): Promise<PostedMessage> {
    const ts = this.nextTs();
    this.messages.push({ channel, text, ts });
    return { ts };
  }

  async postThreadReply(channel: string, threadTs: string, text: string): Promise<PostedMessage> {
    const ts = this.nextTs();
    this.messages.push({ channel, text, threadTs, ts });
    return { ts };
  }

  async addReaction(channel: string, ts: string, emoji: string): Promise<void> {
    this.reactions.push({ channel, ts, emoji });
  }

  /** All message text concatenated — handy for loose assertions. */
  get transcript(): string {
    return this.messages.map((m) => m.text).join("\n---\n");
  }

  reset(): void {
    this.messages = [];
    this.reactions = [];
    this.n = 0;
  }
}
