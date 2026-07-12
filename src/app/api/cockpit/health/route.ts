import { NextResponse } from "next/server";
import { configStatus } from "@/cockpit/runtime";

// Go-live health check. Reports which pieces are configured (booleans only —
// never any secret values). Hit this in a browser during setup to see what's
// still red. Safe to leave public: it exposes no secrets.
export async function GET() {
  const status = configStatus();
  return NextResponse.json({
    ok: status.allReady,
    ready: status.allReady,
    checks: {
      "Database (Supabase)": status.supabase,
      "Slack bot token": status.slackToken,
      "Slack channel id": status.slackChannel,
      "Slack signing secret": status.slackSigning,
      "Anthropic API key": status.anthropic,
      "Cron secret": status.cronSecret,
    },
    message: status.allReady
      ? "All set — the cockpit is fully wired."
      : "Some pieces aren't configured yet. See SETUP.md for each one.",
    // Channel IDs are not secret (they appear in Slack URLs). Exposed for setup
    // debugging — a valid one starts with "C".
    debug: {
      channelId: process.env.SLACK_CHANNEL_ID ?? null,
      channelIdLooksValid: /^C[A-Z0-9]{6,}$/.test(process.env.SLACK_CHANNEL_ID ?? ""),
    },
  });
}
