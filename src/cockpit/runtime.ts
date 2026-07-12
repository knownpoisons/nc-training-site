// ═══════════════════════════════════════════════════════════════════════════════
// RUNTIME WIRING — turn env + settings into a live store, Slack client, and the
// current LOCAL day/hour. The local hour is computed from the settings timezone,
// so the crons self-gate: they fire hourly and act only at the configured hour.
// When Jem moves HST → Thailand, he changes one setting — no redeploy.
// ═══════════════════════════════════════════════════════════════════════════════

import { getSupabaseServer } from "@/lib/supabase";
import { SupabaseStore } from "./store/supabase";
import { webSlackFromEnv } from "./slack/web";
import type { CockpitStore } from "./store/types";
import type { SlackClient } from "./slack/types";
import type { Day } from "./cadence/dates";

export interface LiveContext {
  store: CockpitStore;
  slack: SlackClient;
  channel: string;
}

/** Build the live context, or null with a reason if something isn't configured. */
export function getLiveContext(): { ctx: LiveContext | null; reason?: string } {
  const db = getSupabaseServer();
  if (!db) return { ctx: null, reason: "supabase_not_configured" };
  const slack = webSlackFromEnv();
  if (!slack) return { ctx: null, reason: "slack_token_missing" };
  const channel = process.env.SLACK_CHANNEL_ID;
  if (!channel) return { ctx: null, reason: "slack_channel_missing" };
  return { ctx: { store: new SupabaseStore(db), slack, channel } };
}

/** Which pieces are configured — powers the /health check during go-live. */
export interface ConfigStatus {
  supabase: boolean;
  slackToken: boolean;
  slackChannel: boolean;
  slackSigning: boolean;
  anthropic: boolean;
  cronSecret: boolean;
  allReady: boolean;
}

export function configStatus(): ConfigStatus {
  const supabase = !!(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const slackToken = !!process.env.SLACK_BOT_TOKEN;
  const slackChannel = !!process.env.SLACK_CHANNEL_ID;
  const slackSigning = !!process.env.SLACK_SIGNING_SECRET;
  const anthropic = !!process.env.ANTHROPIC_API_KEY;
  const cronSecret = !!process.env.CRON_SECRET;
  return {
    supabase,
    slackToken,
    slackChannel,
    slackSigning,
    anthropic,
    cronSecret,
    allReady: supabase && slackToken && slackChannel && slackSigning && anthropic && cronSecret,
  };
}

/** The local calendar day and hour (0–23) in a given IANA timezone. */
export function localParts(timezone: string, now: Date): { day: Day; hour: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = `${get("year")}-${get("month")}-${get("day")}`;
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0; // some ICU builds emit "24" at midnight
  return { day, hour };
}
