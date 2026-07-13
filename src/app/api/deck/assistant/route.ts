import { NextRequest, NextResponse } from "next/server";
import { isDeckAuthed } from "@/app/deck/guard";
import { getSupabaseServer } from "@/lib/supabase";
import { SupabaseStore } from "@/cockpit/store/supabase";
import { makeConversationalResponder } from "@/cockpit/ops/converse";
import { claudeModelFromEnv } from "@/cockpit/draft/model";
import { loadKnowledge } from "@/cockpit/draft/knowledge";

// The Deck's assistant panel — the same F5 brain as #cockpit, cookie-gated.
// It reviews and advises; it never changes state (only Slack commands do).
export async function POST(req: NextRequest) {
  if (!(await isDeckAuthed())) {
    return NextResponse.json({ error: "locked" }, { status: 401 });
  }
  const db = getSupabaseServer();
  const model = claudeModelFromEnv();
  if (!db || !model) {
    return NextResponse.json({ error: "assistant not wired (env missing)" }, { status: 200 });
  }
  let text = "";
  try {
    const body = (await req.json()) as { text?: string };
    text = String(body.text ?? "").slice(0, 2000);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!text.trim()) return NextResponse.json({ error: "say something" }, { status: 200 });

  try {
    const respond = makeConversationalResponder(new SupabaseStore(db), model, loadKnowledge());
    const reply = await respond(text);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[deck/assistant]", err);
    return NextResponse.json({ error: "the assistant stumbled — try again" }, { status: 200 });
  }
}
