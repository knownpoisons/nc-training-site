// ═══════════════════════════════════════════════════════════════════════════════
// F4 — COMMAND HANDLER. Execute a parsed intent against the store and confirm.
//
// Non-negotiable: every state change gets a visible confirmation — a ✅ reaction
// and/or a one-line reply. Nothing is ever silent (handoff failure mode #5).
// Any inbound message also records "interaction" against today's brief so the
// Nudge (F8) knows the channel isn't silent.
//
// F5 (conversational) is a stub here — Phase 3 wires it to Claude.
// ═══════════════════════════════════════════════════════════════════════════════

import { addDays, mondayOf, parseNaturalDay, type Day } from "../cadence/dates";
import { DORMANT_DAYS, TOTAL_TOUCHES } from "../cadence/cadence";
import type { CockpitStore, ProspectDetail, SavedBrief, StoreProspect } from "../store/types";
import type { SlackClient } from "../slack/types";
import { parseCommand, type Intent } from "./parse";
import { placeholderRewrite } from "./drafts";
import { promoteLeads, resolveDigest } from "./digest";
import { clampVolume } from "./governor";
import { wayIn } from "./actions";
import { generateDraft, OUTREACH_MAX_WORDS } from "../draft/engine";
import { findTemplate } from "../draft/templates";
import type { DraftModel } from "../draft/model";
import type { Knowledge } from "../draft/knowledge";
import { DISTILL_SYSTEM } from "./debrief";

export interface HandleContext {
  channel: string;
  today: Day;
  nowIso: string;
  messageTs?: string; // the user's message ts, for ✅ reactions
  /** F5 hook. When provided, unmatched messages get a real Claude reply;
   *  when absent (e.g. Phase 2 tests), they get the stub. */
  respondConversational?: (text: string) => Promise<string>;
  /** F2 hook for reply-response drafting. When absent, a pasted reply is stored
   *  but the response draft is a placeholder. */
  draftCtx?: { model: DraftModel; knowledge: Knowledge };
  /** A1 hook: research a freshly-added prospect (dossier onto the card). */
  enrich?: (prospect: StoreProspect) => Promise<void>;
  /** F2-fun hook: the pipeline roast (built in converse.ts). */
  roast?: () => Promise<string>;
}

export interface HandleResult {
  intent: Intent["kind"];
  confirmed: boolean;
  note?: string;
}

export async function handleMessage(
  store: CockpitStore,
  slack: SlackClient,
  ctx: HandleContext,
  rawText: string
): Promise<HandleResult> {
  // Any inbound message counts as interaction — the nudge must stay quiet today.
  await store.recordInteraction(ctx.today, ctx.nowIso);

  const brief = await store.getBrief(ctx.today);
  const intent = parseCommand(rawText);

  // ── Pending consumption: "replied 3" / "call booked 5" asked a question; the
  //    NEXT free-text message is the answer. A recognised command escapes it. ──
  const pending = await store.getPending();
  if (pending && intent.kind === "conversational") {
    await store.clearPending();
    if (pending.kind === "reply_paste") {
      return consumeReplyPaste(store, slack, ctx, pending.prospectId, rawText, brief);
    }
    if (pending.kind === "call_date") {
      return consumeCallDate(store, slack, ctx, pending.prospectId, rawText, brief);
    }
    if (pending.kind === "call_debrief") {
      return consumeCallDebrief(store, slack, ctx, pending.prospectId, rawText, brief);
    }
  } else if (pending && intent.kind !== "conversational") {
    // He moved on to a real command — drop the stale question.
    await store.clearPending();
  }

  // Reply inline in the channel, right below Jem's message — not in a thread.
  const confirm = async (text: string) => {
    await slack.postMessage(ctx.channel, text);
  };
  const react = async (emoji: string) => {
    if (ctx.messageTs) await slack.addReaction(ctx.channel, ctx.messageTs, emoji);
  };

  switch (intent.kind) {
    case "done":
      return handleDone(store, ctx, brief, intent.indices, confirm, react);
    case "skip":
      return handleSkip(store, ctx, brief, intent.indices, confirm, react);
    case "snooze":
      return handleSnooze(store, ctx, brief, intent.indices, confirm, react);
    case "replied":
      return handleReplied(store, ctx, brief, intent.index, confirm);
    case "rewrite":
      return handleRewrite(store, brief, intent.index, intent.angle, confirm);
    case "add":
      return handleAdd(store, ctx, intent, confirm);
    case "call_booked":
      return handleCallBooked(store, brief, intent.index, confirm);
    case "closed":
      return handleClosed(store, ctx, brief, intent.result, intent.index, confirm);
    case "pause":
      return handlePause(store, intent.name, true, confirm);
    case "unpause":
      return handlePause(store, intent.name, false, confirm);
    case "promote":
      return handlePromote(store, ctx, intent.indices, confirm);
    case "bin":
      return handleBin(store, ctx, intent.indices, confirm);
    case "hold":
      await confirm(
        intent.indices.length
          ? `Held ${intent.indices.map((n) => `#${n}`).join(", ")} — they stay in the queue for next week.`
          : "`hold` needs a digest number."
      );
      return { intent: "hold", confirmed: true };
    case "set":
      return handleSet(store, intent.field, intent.value, confirm);
    case "note":
      return handleNote(store, ctx, intent.text, confirm);
    case "notes":
      return handleListNotes(store, ctx, confirm);
    case "show":
      return handleShow(store, intent.name, confirm);
    case "debrief":
      return handleDebrief(store, intent.name, confirm);
    case "roast": {
      if (ctx.roast) {
        try {
          await confirm(await ctx.roast());
        } catch {
          await confirm("The roast writer is having a moment. Your pipeline lives another day.");
        }
      } else {
        await confirm("Roasting needs the AI wired — live it works.");
      }
      return { intent: "roast", confirmed: true };
    }
    case "prospect_note":
      return handleProspectNote(store, ctx, intent.name, intent.text, confirm);
    case "set_prospect":
      return handleSetProspect(store, intent.name, intent.field, intent.value, confirm);
    case "stage_move":
      return handleStageMove(store, intent.name, intent.stage, confirm);
    case "pipeline":
      return handlePipeline(store, confirm);
    case "settings":
      return handleSettings(store, confirm);
    case "help":
      await confirm(HELP_TEXT);
      return { intent: "help", confirmed: true };
    case "conversational": {
      // F5 — real Claude reply when the responder is wired; stub otherwise.
      if (ctx.respondConversational) {
        let reply: string;
        try {
          reply = await ctx.respondConversational(intent.text);
        } catch {
          reply = "I couldn't reach the assistant just now — try again in a moment, or use `help`.";
        }
        await confirm(reply);
        return { intent: "conversational", confirmed: true, note: "f5" };
      }
      await confirm(
        "I didn't read that as a command. Ask me in plain English once the " +
          "assistant is wired, or try `help`."
      );
      return { intent: "conversational", confirmed: true, note: "f5-stub" };
    }
  }
}

// ── resolvers ────────────────────────────────────────────────────────────────
function resolve(brief: SavedBrief | null, n: number) {
  return brief?.actions.find((a) => a.n === n) ?? null;
}

// ── handlers ─────────────────────────────────────────────────────────────────
async function handleDone(
  store: CockpitStore,
  ctx: HandleContext,
  brief: SavedBrief | null,
  ns: number[],
  confirm: (t: string) => Promise<void>,
  react: (e: string) => Promise<void>
): Promise<HandleResult> {
  if (ns.length === 0) {
    await confirm("`done` needs an action number — e.g. `done 1 2`.");
    return { intent: "done", confirmed: true, note: "no-index" };
  }
  const donned: string[] = [];
  const misses: number[] = [];
  for (const n of ns) {
    const a = resolve(brief, n);
    if (!a || !a.touchId || a.touchNumber === null) {
      misses.push(n);
      continue;
    }
    await store.markTouchSent(a.touchId, ctx.today);
    // Touch 4 sent with no reply → the prospect goes dormant, resurfacing +90d.
    if (a.touchNumber === TOTAL_TOUCHES) {
      await store.setStage(a.prospectId, "DORMANT", addDays(ctx.today, DORMANT_DAYS));
    }
    donned.push(a.label);
  }
  await react("white_check_mark");
  const parts: string[] = [];
  if (donned.length) parts.push(`Logged sent: ${donned.join(", ")}.`);
  if (misses.length) parts.push(`No action ${misses.join(", ")} in today's brief.`);
  await confirm(parts.join(" "));
  return { intent: "done", confirmed: true };
}

async function handleSkip(
  store: CockpitStore,
  ctx: HandleContext,
  brief: SavedBrief | null,
  ns: number[],
  confirm: (t: string) => Promise<void>,
  react: (e: string) => Promise<void>
): Promise<HandleResult> {
  if (ns.length === 0) {
    await confirm("`skip` needs an action number — e.g. `skip 3`.");
    return { intent: "skip", confirmed: true, note: "no-index" };
  }
  const skipped: string[] = [];
  const misses: number[] = [];
  for (const n of ns) {
    const a = resolve(brief, n);
    if (!a || !a.touchId) {
      misses.push(n);
      continue;
    }
    const t = await store.skipTouch(a.touchId);
    await store.logEvent(a.prospectId, "skip", { touchId: a.touchId });
    const flag = t.skippedCount >= 2 ? " — flagged for Friday (skipped twice)" : "";
    skipped.push(`${a.label} → ${t.dueDate}${flag}`);
  }
  await react("white_check_mark");
  const parts: string[] = [];
  if (skipped.length) parts.push(`Pushed +2 days: ${skipped.join("; ")}.`);
  if (misses.length) parts.push(`No action ${misses.join(", ")} in today's brief.`);
  await confirm(parts.join(" "));
  return { intent: "skip", confirmed: true };
}

async function handleSnooze(
  store: CockpitStore,
  ctx: HandleContext,
  brief: SavedBrief | null,
  ns: number[],
  confirm: (t: string) => Promise<void>,
  react: (e: string) => Promise<void>
): Promise<HandleResult> {
  const moved: string[] = [];
  const misses: number[] = [];
  for (const n of ns) {
    const a = resolve(brief, n);
    if (!a || !a.touchId) {
      misses.push(n);
      continue;
    }
    const t = await store.snoozeTouch(a.touchId);
    await store.logEvent(a.prospectId, "snooze", { touchId: a.touchId });
    moved.push(`${a.label} → ${t.dueDate}`);
  }
  await react("white_check_mark");
  const parts: string[] = [];
  if (moved.length) parts.push(`Snoozed to next day: ${moved.join("; ")}.`);
  if (misses.length) parts.push(`No action ${misses.join(", ")} in today's brief.`);
  if (!moved.length && !misses.length) parts.push("`snooze` needs an action number.");
  await confirm(parts.join(" "));
  return { intent: "snooze", confirmed: true };
}

async function handleReplied(
  store: CockpitStore,
  ctx: HandleContext,
  brief: SavedBrief | null,
  n: number,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const a = resolve(brief, n);
  if (!a) {
    await confirm(`No action ${n} in today's brief.`);
    return { intent: "replied", confirmed: true, note: "miss" };
  }
  await store.setStage(a.prospectId, "REPLIED");
  await store.haltRemainingTouches(a.prospectId);
  await store.logEvent(a.prospectId, "reply", {}, ctx.nowIso);
  await store.setPending("reply_paste", a.prospectId);
  await confirm(
    `${a.label.split(" · ")[0]} → REPLIED. Sequence halted. ` +
      "Paste their reply as your next message and I'll draft the response."
  );
  return { intent: "replied", confirmed: true };
}

/** The next message after `replied N` — their actual reply. Store it, draft the answer. */
async function consumeReplyPaste(
  store: CockpitStore,
  slack: SlackClient,
  ctx: HandleContext,
  prospectId: string,
  replyText: string,
  brief: SavedBrief | null
): Promise<HandleResult> {
  const say = async (t: string) => {
    await slack.postMessage(ctx.channel, t);
  };
  const p = await store.getProspect(prospectId);
  if (!p) {
    await say("Couldn't find that prospect any more — reply not saved.");
    return { intent: "replied", confirmed: true, note: "lost-prospect" };
  }

  // Store the reply verbatim: event payload + a note on the card.
  await store.logEvent(prospectId, "reply", { text: replyText }, ctx.nowIso);
  await store.appendNote(prospectId, `${ctx.today} they replied: "${replyText.slice(0, 300)}"`);

  // Draft the response through the full engine (guards included).
  if (ctx.draftCtx) {
    const template = findTemplate("reply", 0);
    const out = await generateDraft(
      ctx.draftCtx.model,
      ctx.draftCtx.knowledge,
      {
        prospect: p,
        touchNumber: 0,
        lane: "reply",
        templateBody: template?.body ?? "Respond directly and propose two times.",
        maxWords: OUTREACH_MAX_WORDS,
        replyText,
        wayIn: wayIn(p),
        dossier: p.dossier ?? null,
        openerAngle: p.openerAngle ?? null,
      },
      false
    );
    const flag = out.requiresReview ? "\n⚠️ needs your eyes — couldn't auto-clear." : "";
    await say(`Got it — saved to ${p.name}'s card. Here's the response draft:\n\n${out.draft}${flag}\n\nSend it your way, then \`done\` isn't needed — just tell me what happens next (\`call booked …\`, \`won …\`).`);
  } else {
    await say(`Saved ${p.name}'s reply to their card. (Response drafting needs the AI wired — it'll appear here once live.)`);
  }
  return { intent: "replied", confirmed: true, note: "reply-captured" };
}

async function handleDebrief(
  store: CockpitStore,
  name: string,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const p = await store.findProspectByName(name);
  if (!p) {
    await confirm(`No prospect matching "${name}".`);
    return { intent: "debrief", confirmed: true, note: "not-found" };
  }
  await store.setPending("call_debrief", p.id);
  await confirm(`Paste the Granola transcript (or your notes) from the ${p.name} call — I'll mine it for the follow-ups.`);
  return { intent: "debrief", confirmed: true };
}

/** The next message after a debrief prompt — the transcript. Distill and store. */
async function consumeCallDebrief(
  store: CockpitStore,
  slack: SlackClient,
  ctx: HandleContext,
  prospectId: string,
  transcript: string,
  brief: SavedBrief | null
): Promise<HandleResult> {
  const say = async (t: string) => {
    await slack.postMessage(ctx.channel, t);
  };
  const p = await store.getProspect(prospectId);
  if (!p) {
    await say("Couldn't find that prospect any more — transcript not saved.");
    return { intent: "debrief", confirmed: true, note: "lost-prospect" };
  }

  // Full transcript into the event log; the distilled brief onto the card.
  await store.logEvent(prospectId, "call_debrief", { text: transcript.slice(0, 12000) }, ctx.nowIso);

  let callBrief: string;
  if (ctx.draftCtx) {
    try {
      callBrief = (
        await ctx.draftCtx.model.generate({
          system: DISTILL_SYSTEM,
          user: `Call with ${p.name}${p.company ? ` (${p.company})` : ""}. Transcript/notes:\n\n${transcript.slice(0, 24000)}`,
          attempt: 0,
          violations: [],
        })
      ).trim();
    } catch {
      callBrief = `raw notes (${ctx.today}): ${transcript.slice(0, 600)}`;
    }
  } else {
    callBrief = `raw notes (${ctx.today}): ${transcript.slice(0, 600)}`;
  }

  await store.updateProspect(prospectId, { callBrief });
  await store.appendNote(prospectId, `${ctx.today} call debrief captured`);
  await say(`Mined it. ${p.name}'s card now carries:\n${callBrief}\n\nThe day-2/7/30 follow-ups will write themselves from this.`);
  return { intent: "debrief", confirmed: true, note: "debrief-captured" };
}

/** The next message after `call booked N` — the date. Parse, log, schedule follow-ups. */
async function consumeCallDate(
  store: CockpitStore,
  slack: SlackClient,
  ctx: HandleContext,
  prospectId: string,
  text: string,
  brief: SavedBrief | null
): Promise<HandleResult> {
  const say = async (t: string) => {
    await slack.postMessage(ctx.channel, t);
  };
  const day = parseNaturalDay(text, ctx.today);
  const p = await store.getProspect(prospectId);
  if (!p) {
    await say("Couldn't find that prospect any more — date not saved.");
    return { intent: "call_booked", confirmed: true, note: "lost-prospect" };
  }
  if (!day) {
    // Re-arm so his next message can try again.
    await store.setPending("call_date", prospectId);
    await say(`Couldn't read that as a date — try \`2026-07-18\`, \`friday\`, or \`18/7\`.`);
    return { intent: "call_booked", confirmed: true, note: "bad-date" };
  }
  await store.updateProspect(prospectId, { callAt: day });
  await store.appendNote(prospectId, `${ctx.today} call booked for ${day}`);
  await store.logEvent(prospectId, "call_booked", { date: day }, ctx.nowIso);
  // PLAYBOOK follow-up doctrine: day-2 value, day-7 made-thing, day-30 news hook.
  await store.scheduleFollowUps(prospectId, day);
  await say(
    `📞 ${p.name} — call logged for *${day}*. That morning's brief will carry a prep card. ` +
      `Follow-ups scheduled for day 2, 7 and 30 after the call.`
  );
  return { intent: "call_booked", confirmed: true, note: "date-captured" };
}

async function handleRewrite(
  store: CockpitStore,
  brief: SavedBrief | null,
  n: number,
  angle: string | null,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const a = resolve(brief, n);
  if (!a || !a.touchId) {
    await confirm(`No touch action ${n} in today's brief to rewrite.`);
    return { intent: "rewrite", confirmed: true, note: "miss" };
  }
  // Phase 2: re-stamp the placeholder. Phase 3 regenerates via Claude.
  const existing = `Placeholder draft for ${a.label}`;
  const next = placeholderRewrite(existing, angle);
  await store.setDraft(a.touchId, next);
  await confirm(`Rewrote ${a.label}${angle ? ` (${angle})` : ""}:\n${next}`);
  return { intent: "rewrite", confirmed: true };
}

async function handleAdd(
  store: CockpitStore,
  ctx: HandleContext,
  intent: Extract<Intent, { kind: "add" }>,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  // Dedupe first — same person twice makes two sequences, which is worse than a warning.
  const dupByEmail = intent.email ? await store.findProspectByEmail(intent.email) : null;
  const dupByName = dupByEmail ?? (await store.findProspectByName(intent.name));
  if (dupByEmail || (dupByName && dupByName.name.toLowerCase() === intent.name.toLowerCase())) {
    const d = (dupByEmail ?? dupByName)!;
    await confirm(`Already tracking *${d.name}* (stage ${d.stage}) — \`show ${d.name}\` for the card. Not added twice.`);
    return { intent: "add", confirmed: true, note: "duplicate" };
  }

  const p = await store.addProspect(
    { name: intent.name, role: intent.role, company: intent.company, email: intent.email },
    ctx.today
  );
  if (intent.linkedinUrl) await store.updateProspect(p.id, { linkedinUrl: intent.linkedinUrl });
  const bits = [p.name];
  if (p.role) bits.push(p.role);
  if (p.company) bits.push(p.company);
  const extras = [intent.email, intent.linkedinUrl].filter(Boolean).join(" · ");
  const researching = ctx.enrich ? " Researching them now — dossier lands on the card in ~1 min." : "";
  await confirm(
    `Added *${bits.join(", ")}*${extras ? ` (${extras})` : ""} and scheduled touches for days 1, 4, 12, 21.` +
      researching +
      " Touch 1 is due today — it'll be in tomorrow's brief (or today's if it hasn't posted yet)."
  );

  // A1: auto-research so touch 1 personalises itself (hand-adds get the same
  // treatment as queue leads). Best-effort — a failed lookup never blocks the add.
  if (ctx.enrich) {
    try {
      const fresh = await store.getProspect(p.id);
      if (fresh) await ctx.enrich(fresh);
    } catch (err) {
      console.error("[cockpit] enrich-on-add failed:", err);
    }
  }
  return { intent: "add", confirmed: true, note: p.id };
}

async function handleProspectNote(
  store: CockpitStore,
  ctx: HandleContext,
  name: string,
  text: string,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const p = await store.findProspectByName(name);
  if (!p) {
    await confirm(`No prospect matching "${name}" — note not saved. (Newsletter ideas are \`note <idea>\` without a colon.)`);
    return { intent: "prospect_note", confirmed: true, note: "not-found" };
  }
  await store.appendNote(p.id, `${ctx.today}: ${text}`);
  await confirm(`Noted on ${p.name}'s card. It'll feed their future drafts.`);
  return { intent: "prospect_note", confirmed: true };
}

async function handleSetProspect(
  store: CockpitStore,
  name: string,
  field: "email" | "linkedin" | "value",
  value: string,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const p = await store.findProspectByName(name);
  if (!p) {
    await confirm(`No prospect matching "${name}".`);
    return { intent: "set_prospect", confirmed: true, note: "not-found" };
  }
  if (field === "email") {
    await store.updateProspect(p.id, { email: value });
    await confirm(`${p.name} — email → ${value}.`);
  } else if (field === "linkedin") {
    await store.updateProspect(p.id, { linkedinUrl: value });
    await confirm(`${p.name} — LinkedIn → ${value}.`);
  } else {
    const num = parseMoney(value);
    if (num == null) {
      await confirm(`Couldn't read "${value}" as a value — try \`80k\` or \`120000\`.`);
      return { intent: "set_prospect", confirmed: true, note: "bad-value" };
    }
    await store.updateProspect(p.id, { dealValue: num });
    await confirm(`${p.name} — deal value → $${num.toLocaleString("en-US")}.`);
  }
  return { intent: "set_prospect", confirmed: true };
}

function parseMoney(v: string): number | null {
  const m = v.toLowerCase().replace(/[$,]/g, "").match(/^(\d+(?:\.\d+)?)(k|m)?$/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (m[2] === "k") n *= 1_000;
  if (m[2] === "m") n *= 1_000_000;
  return Math.round(n);
}

const STAGES = ["NEW", "IN_SEQUENCE", "REPLIED", "CALL", "PROPOSAL", "WON", "LOST", "DORMANT"] as const;

async function handleStageMove(
  store: CockpitStore,
  name: string,
  stage: string,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const target = STAGES.find((s) => s === stage || s.startsWith(stage));
  if (!target) {
    await confirm(`"${stage}" isn't a stage. Stages: ${STAGES.join(", ")}.`);
    return { intent: "stage_move", confirmed: true, note: "bad-stage" };
  }
  const p = await store.findProspectByName(name);
  if (!p) {
    await confirm(`No prospect matching "${name}".`);
    return { intent: "stage_move", confirmed: true, note: "not-found" };
  }
  await store.setStage(p.id, target);
  await confirm(`${p.name} → ${target}.`);
  return { intent: "stage_move", confirmed: true };
}

async function handleCallBooked(
  store: CockpitStore,
  brief: SavedBrief | null,
  n: number,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const a = resolve(brief, n);
  if (!a) {
    await confirm(`No action ${n} in today's brief.`);
    return { intent: "call_booked", confirmed: true, note: "miss" };
  }
  await store.setStage(a.prospectId, "CALL");
  await store.setPending("call_date", a.prospectId);
  await confirm(`${a.label.split(" · ")[0]} → CALL booked. What date? (\`friday\`, \`18/7\`, or \`2026-07-18\` — I'll log it and schedule the follow-ups.)`);
  return { intent: "call_booked", confirmed: true };
}

const WIN_TOASTS = [
  "The machine hums.",
  "Taught another one to fish.",
  "Pixel pushing pays. Again.",
  "Signed, not demoed — shipped.",
  "Lock the quote. Prices only go up.",
];

/** F1 — the Deal Receipt. Wins get a ceremony, not a "Logged." */
export function renderDealReceipt(args: {
  dealNumber: number;
  name: string;
  company: string | null;
  value: number;
  daysToClose: number;
  lane: string;
  wonValue: number;
  target: number;
}): string {
  const k = (v: number) => `$${Math.round(v / 1000)}k`;
  const TICKS = 20;
  const fill = Math.max(0, Math.min(TICKS, Math.round((args.wonValue / args.target) * TICKS)));
  const bar = "▮".repeat(fill) + "▯".repeat(TICKS - fill);
  const toast = WIN_TOASTS[(args.dealNumber - 1) % WIN_TOASTS.length];
  const who = args.company ? `${args.name} · ${args.company}` : args.name;
  return [
    `*${toast}*`,
    "```",
    `══════════ DEAL RECEIPT ══════════`,
    ` No.       ${String(args.dealNumber).padStart(3, "0")}`,
    ` Client    ${who}`,
    ` Value     ${k(args.value)}`,
    ` Door→close ${args.daysToClose} days`,
    ` Lane      ${args.lane}`,
    `──────────────────────────────────`,
    ` ${bar}`,
    ` ${k(args.wonValue)} of ${k(args.target)}`,
    `══════════════════════════════════`,
    "```",
  ].join("\n");
}

async function handleClosed(
  store: CockpitStore,
  ctx: HandleContext,
  brief: SavedBrief | null,
  result: "won" | "lost",
  n: number,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const a = resolve(brief, n);
  if (!a) {
    await confirm(`No action ${n} in today's brief.`);
    return { intent: "closed", confirmed: true, note: "miss" };
  }
  const stage = result === "won" ? "WON" : "LOST";
  await store.setStage(a.prospectId, stage);
  await store.logEvent(a.prospectId, result === "won" ? "closed_won" : "closed_lost", {}, ctx.nowIso);

  if (result === "won") {
    const [p, v] = await Promise.all([store.getProspect(a.prospectId), store.getPipelineValue()]);
    if (p) {
      const days = Math.max(0, Math.round((Date.parse(`${ctx.today}T00:00:00Z`) - Date.parse(`${p.addedAt}T00:00:00Z`)) / 86_400_000));
      await confirm(
        renderDealReceipt({
          dealNumber: v.wonCount,
          name: p.name,
          company: p.company,
          value: p.dealValue ?? 50000,
          daysToClose: days,
          lane: (p.sources ?? [])[0] ?? p.sourceEngine,
          wonValue: v.wonValue,
          target: v.target,
        })
      );
      return { intent: "closed", confirmed: true };
    }
  }
  await confirm(`${a.label.split(" · ")[0]} → ${stage}. Logged.`);
  return { intent: "closed", confirmed: true };
}

async function handlePause(
  store: CockpitStore,
  name: string,
  paused: boolean,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const p = await store.findProspectByName(name);
  if (!p) {
    await confirm(`I couldn't find a prospect matching "${name}".`);
    return { intent: paused ? "pause" : "unpause", confirmed: true, note: "not-found" };
  }
  await store.setPaused(p.id, paused);
  await confirm(`${p.name} ${paused ? "paused — no touches will schedule" : "resumed"}.`);
  return { intent: paused ? "pause" : "unpause", confirmed: true };
}

async function handlePromote(
  store: CockpitStore,
  ctx: HandleContext,
  ns: number[],
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  if (ns.length === 0) {
    await confirm("`promote` needs a digest number — e.g. `promote 1 3 4`.");
    return { intent: "promote", confirmed: true, note: "no-index" };
  }
  const digest = await store.getDigest(mondayOf(ctx.today));
  const ids: string[] = [];
  const misses: number[] = [];
  for (const n of ns) {
    const id = resolveDigest(digest, n);
    if (id) ids.push(id);
    else misses.push(n);
  }
  if (ids.length === 0) {
    await confirm(`No lead ${misses.join(", ")} in this week's digest.`);
    return { intent: "promote", confirmed: true, note: "miss" };
  }
  const settings = await store.getSettings();
  const summary = await promoteLeads(store, ids, ctx.today, settings.weeklyVolume, "promoted from digest");

  const parts: string[] = [];
  if (summary.promotedThisWeek.length) parts.push(`Promoted into sequence now: ${summary.promotedThisWeek.join(", ")}.`);
  if (summary.deferred.length) {
    const d = summary.deferred.map((x) => `${x.label} → week of ${x.date}`).join("; ");
    parts.push(`Over the ${settings.weeklyVolume}/week cap, so staggered: ${d}.`);
  }
  if (summary.blocked?.length) {
    parts.push(
      `🔒 Left alone: ${summary.blocked.join(", ")} — they only ever opted into the newsletter, ` +
        `so they can't go into outreach. They'll still get the newsletter.`
    );
  }
  if (misses.length) parts.push(`No lead ${misses.join(", ")} in the digest.`);
  await confirm(parts.join(" "));
  return { intent: "promote", confirmed: true };
}

async function handleBin(
  store: CockpitStore,
  ctx: HandleContext,
  ns: number[],
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const digest = await store.getDigest(mondayOf(ctx.today));
  const binned: string[] = [];
  for (const n of ns) {
    const id = resolveDigest(digest, n);
    if (!id) continue;
    await store.binLead(id, "binned from digest");
    binned.push(`#${n}`);
  }
  await confirm(binned.length ? `Binned ${binned.join(", ")} — out of the queue.` : "No matching digest leads to bin.");
  return { intent: "bin", confirmed: true };
}

async function handleSet(
  store: CockpitStore,
  field: string,
  value: string,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const num = Number(value.replace(/[^\d.]/g, ""));
  let patch: Record<string, unknown> | null = null;
  let readback = "";
  if (/^(weekly\s+)?volume$/.test(field)) {
    const v = clampVolume(num);
    patch = { weeklyVolume: v };
    readback = `Weekly volume → ${v}/week${v !== num ? " (clamped to the 1–8 range)" : ""}.`;
  } else if (/^brief\s+hour$/.test(field)) {
    patch = { briefHour: Math.max(0, Math.min(23, num)) };
    readback = `Brief hour → ${patch.briefHour}:00.`;
  } else if (/^nudge\s+hour$/.test(field)) {
    patch = { nudgeHour: Math.max(0, Math.min(23, num)) };
    readback = `Nudge hour → ${patch.nudgeHour}:00.`;
  } else if (/^time\s?zone$/.test(field)) {
    patch = { timezone: value };
    readback = `Timezone → ${value}.`;
  } else if (/^booking(\s+link|\s+url)?$/.test(field)) {
    patch = { bookingUrl: value };
    readback = `Booking link → ${value}. Ask-stage drafts will offer it.`;
  }
  if (!patch) {
    await confirm(`I can set: volume, brief hour, nudge hour, timezone, booking. "${field}" isn't one.`);
    return { intent: "set", confirmed: true, note: "unknown-field" };
  }
  await store.updateSettings(patch);
  await confirm(readback);
  return { intent: "set", confirmed: true };
}

async function handleNote(
  store: CockpitStore,
  ctx: HandleContext,
  text: string,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const month = ctx.today.slice(0, 7); // YYYY-MM
  const url = text.match(/https?:\/\/\S+/)?.[0] ?? null;
  await store.addNewsletterNote(month, text, url, ctx.nowIso);
  const notes = await store.getNewsletterNotes(month);
  await confirm(
    `Saved to the ${month} newsletter${url ? " (link noted)" : ""}. ` +
      `${notes.length} idea${notes.length === 1 ? "" : "s"} banked this month.`
  );
  return { intent: "note", confirmed: true };
}

async function handleListNotes(
  store: CockpitStore,
  ctx: HandleContext,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const month = ctx.today.slice(0, 7);
  const notes = await store.getNewsletterNotes(month);
  if (notes.length === 0) {
    await confirm(`No newsletter ideas banked for ${month} yet. Drop one with \`note ...\` or \`idea ...\`.`);
    return { intent: "notes", confirmed: true };
  }
  const list = notes.map((n, i) => `${i + 1}. ${n.text}`).join("\n");
  await confirm(`*${month} newsletter — ${notes.length} banked:*\n${list}`);
  return { intent: "notes", confirmed: true };
}

async function handleShow(
  store: CockpitStore,
  name: string,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const p = await store.findProspectByName(name);
  if (!p) {
    await confirm(`No prospect matching "${name}". Try \`pipeline\` to see who's in the system.`);
    return { intent: "show", confirmed: true, note: "not-found" };
  }
  const detail = await store.getProspectDetail(p.id);
  if (!detail) {
    await confirm(`Couldn't load ${p.name}'s details.`);
    return { intent: "show", confirmed: true, note: "no-detail" };
  }
  await confirm(renderProfile(detail));
  return { intent: "show", confirmed: true };
}

/** The full prospect card — everything the system knows, in one Slack message. */
export function renderProfile(d: ProspectDetail): string {
  const p = d.prospect;
  const L: string[] = [];
  const header = [p.name, p.role, p.company].filter(Boolean).join(" · ");
  L.push(`*${header}*`);

  // status line — everything at-a-glance
  const bits = [`Stage *${p.stage}*`];
  if (p.track) bits.push(`Track ${p.track}`);
  if (p.tier) bits.push(`Tier ${p.tier}`);
  if (p.score != null) bits.push(`Score ${Math.round(p.score)}`);
  bits.push(`$${Math.round((p.dealValue ?? 50000) / 1000)}k`);
  if (p.callAt) bits.push(`📞 call ${p.callAt}`);
  if (p.paused) bits.push(`⏸ paused — \`resume ${p.name}\``);
  L.push(bits.join("  ·  "));

  // provenance
  const via = (p.sources && p.sources.length ? p.sources.join(" + ") : p.sourceEngine);
  L.push(`_Found via: ${via}${p.consentLane === "broadcast_only" ? " · 🔒 broadcast-only" : ""} · added ${p.addedAt}${p.resurfaceAt ? ` · resurfaces ${p.resurfaceAt}` : ""}_`);

  // contact details — labelled
  const contact: string[] = [];
  if (p.email) contact.push(`✉️ ${p.email}`);
  if (p.linkedinUrl) contact.push(`🔗 ${p.linkedinUrl}`);
  if (contact.length) L.push(contact.join("  ·  "));

  // dossier / opener (full, never truncated)
  if (p.dossier) L.push(`\n*Who they are*\n${p.dossier}`);
  if (p.openerAngle) L.push(`*Opener angle:* ${p.openerAngle}`);

  // distilled call intelligence
  if (p.callBrief) L.push(`\n*Call brief*\n${p.callBrief}`);

  // touches
  if (d.touches.length) {
    L.push("\n*Touches*");
    for (const t of [...d.touches].sort((a, b) => a.touchNumber - b.touchNumber)) {
      let state: string;
      if (t.sentAt) state = `✅ sent ${t.sentAt}`;
      else if (t.halted) state = "— halted";
      else state = `⏳ due ${t.dueDate}`;
      const skips = t.skippedCount > 0 ? ` (skipped ${t.skippedCount}×)` : "";
      const label = t.touchNumber >= 5 ? `follow-up ${t.touchNumber - 4}` : `touch ${t.touchNumber}`;
      L.push(`  ${label}: ${state}${skips}`);
    }
  }

  // full history — with the content, not just the label
  if (d.events.length) {
    L.push("\n*History*");
    for (const e of d.events) {
      const day = /^\d{4}-\d{2}-\d{2}/.test(e.at) ? e.at.slice(0, 10) : "";
      const pay = (e.payload ?? {}) as { text?: string; date?: string; reason?: string };
      let detail = "";
      if (e.type === "reply" && pay.text) detail = ` — “${pay.text.slice(0, 240)}”`;
      else if (e.type === "call_booked" && pay.date) detail = ` — for ${pay.date}`;
      else if (e.type === "call_debrief") detail = " — transcript captured";
      else if (pay.reason) detail = ` — ${pay.reason}`;
      L.push(`  • ${day || "—"} · ${e.type.replace(/_/g, " ")}${detail}`);
    }
  }

  // notes — every appended line, in full
  if (p.notes) {
    L.push("\n*Notes*");
    for (const line of p.notes.split("\n")) L.push(`  · ${line}`);
  }

  return L.join("\n");
}

async function handlePipeline(
  store: CockpitStore,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const c = await store.pipelineCounts();
  const line = (["NEW", "IN_SEQUENCE", "REPLIED", "CALL", "PROPOSAL", "WON", "LOST", "DORMANT"] as const)
    .map((s) => `${s} ${c[s]}`)
    .join("  ·  ");
  await confirm(`*Pipeline*\n${line}`);
  return { intent: "pipeline", confirmed: true };
}

async function handleSettings(
  store: CockpitStore,
  confirm: (t: string) => Promise<void>
): Promise<HandleResult> {
  const s = await store.getSettings();
  await confirm(
    `*Settings*\nWeekly volume: ${s.weeklyVolume}/wk  ·  Brief: ${s.briefHour}:00  ·  ` +
      `Nudge: ${s.nudgeHour}:00  ·  Timezone: ${s.timezone}  ·  Streak: ${s.streakWeeks}w` +
      (s.bookingUrl ? `\nBooking: ${s.bookingUrl}` : "")
  );
  return { intent: "settings", confirmed: true };
}

const HELP_TEXT = [
  "*Commands*",
  "`done 1 2` — log those actions as sent",
  "`skip 3` — push a touch +2 days",
  "`snooze 4` — push a touch to tomorrow",
  "`replied 2` — mark a reply, halt the sequence",
  "`rewrite 1 shorter` — redraft a touch",
  "`add Dana Lee, Head of Brand, Acme` — new prospect",
  "`call booked 5` · `won 5` · `lost 5` — move stage",
  "`pause dana` · `resume dana` — pause/resume a prospect",
  "`show dana` — a prospect's full card (touches, history, dossier)",
  "`note dana: budget approved` — add context to their card",
  "`set dana email x@y.com` · `set dana value 80k` — edit a prospect",
  "`move dana to proposal` — manual stage move",
  "`pipeline` — stage counts  ·  `settings` — current settings",
  "ask me anything in plain English about your leads",
].join("\n");
