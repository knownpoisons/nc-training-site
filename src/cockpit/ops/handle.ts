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

import { addDays, mondayOf, type Day } from "../cadence/dates";
import { DORMANT_DAYS, TOTAL_TOUCHES } from "../cadence/cadence";
import type { CockpitStore, ProspectDetail, SavedBrief } from "../store/types";
import type { SlackClient } from "../slack/types";
import { parseCommand, type Intent } from "./parse";
import { placeholderRewrite } from "./drafts";
import { promoteLeads, resolveDigest } from "./digest";
import { clampVolume } from "./governor";

export interface HandleContext {
  channel: string;
  today: Day;
  nowIso: string;
  messageTs?: string; // the user's message ts, for ✅ reactions
  /** F5 hook. When provided, unmatched messages get a real Claude reply;
   *  when absent (e.g. Phase 2 tests), they get the stub. */
  respondConversational?: (text: string) => Promise<string>;
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

  const confirm = async (text: string) => {
    if (brief?.slackTs) await slack.postThreadReply(ctx.channel, brief.slackTs, text);
    else await slack.postMessage(ctx.channel, text);
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
      return handleClosed(store, brief, intent.result, intent.index, confirm);
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
  await store.logEvent(a.prospectId, "reply", {});
  await confirm(
    `${a.label.split(" · ")[0]} → REPLIED. Sequence halted. ` +
      "Paste their reply here and I'll draft a response (drafting lands in Phase 3)."
  );
  return { intent: "replied", confirmed: true };
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
  const p = await store.addProspect(
    { name: intent.name, role: intent.role, company: intent.company },
    ctx.today
  );
  const bits = [p.name];
  if (p.role) bits.push(p.role);
  if (p.company) bits.push(p.company);
  await confirm(
    `Added *${bits.join(", ")}* and scheduled touches for days 1, 4, 12, 21. ` +
      "Touch 1 is due today — it'll be in tomorrow's brief (or today's if it hasn't posted yet)."
  );
  return { intent: "add", confirmed: true, note: p.id };
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
  await store.logEvent(a.prospectId, "call_booked", {});
  await confirm(`${a.label.split(" · ")[0]} → CALL booked. What date? Reply with it and I'll log it.`);
  return { intent: "call_booked", confirmed: true };
}

async function handleClosed(
  store: CockpitStore,
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
  await store.logEvent(a.prospectId, result === "won" ? "closed_won" : "closed_lost", {});
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
  }
  if (!patch) {
    await confirm(`I can set: volume, brief hour, nudge hour, timezone. "${field}" isn't one.`);
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

  // status line
  const bits = [`Stage *${p.stage}*`, `Source ${p.sourceEngine}`];
  if (p.tier) bits.push(`Tier ${p.tier}`);
  if (p.score != null) bits.push(`Score ${Math.round(p.score)}`);
  if (p.paused) bits.push("⏸ paused");
  L.push(bits.join("  ·  "));
  if (p.sources && p.sources.length) L.push(`_Found via: ${p.sources.join(" + ")}_`);
  if (p.consentLane === "broadcast_only") L.push("_🔒 broadcast-only — cannot be sequenced_");

  // dossier / opener
  if (p.dossier) L.push(`\n*Dossier*\n${p.dossier}`);
  if (p.openerAngle) L.push(`*Opener angle:* ${p.openerAngle}`);

  // links
  const links: string[] = [];
  if (p.linkedinUrl) links.push(p.linkedinUrl);
  if (p.email) links.push(p.email);
  if (links.length) L.push(links.join(" · "));

  // touches
  if (d.touches.length) {
    L.push("\n*Touches*");
    for (const t of d.touches.sort((a, b) => a.touchNumber - b.touchNumber)) {
      let state: string;
      if (t.sentAt) state = `✅ sent ${t.sentAt}`;
      else if (t.halted) state = "— halted";
      else state = `⏳ due ${t.dueDate}`;
      const skips = t.skippedCount > 0 ? ` (skipped ${t.skippedCount}×)` : "";
      L.push(`  ${t.touchNumber}. ${state}${skips}`);
    }
  }

  // events
  if (d.events.length) {
    L.push("\n*History*");
    for (const e of d.events) {
      const day = /^\d{4}-\d{2}-\d{2}/.test(e.at) ? e.at.slice(0, 10) : "";
      L.push(`  • ${e.type.replace(/_/g, " ")}${day ? ` — ${day}` : ""}`);
    }
  }

  if (p.notes) L.push(`\n*Notes:* ${p.notes}`);
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
      `Nudge: ${s.nudgeHour}:00  ·  Timezone: ${s.timezone}  ·  Streak: ${s.streakWeeks}w`
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
  "`pipeline` — stage counts  ·  `settings` — current settings",
  "ask me anything in plain English about your leads",
].join("\n");
