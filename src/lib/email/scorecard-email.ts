// ═══════════════════════════════════════════════════════════════════════════════
// SCORECARD RESULT EMAIL
// Returns an HTML string designed to render cleanly in Gmail, Outlook, Apple Mail.
// Intentionally inline-styled, table-based layout where it matters, safe font stack.
// ═══════════════════════════════════════════════════════════════════════════════

import type { ScoreResult } from "@/app/assess/logic";
import { programs } from "@/app/assess/programs";
import { tierCopy, getStackAuditCopy } from "@/app/assess/tiers";

const COBALT = "#1549CD";
const COBALT_DARK = "#0e38a8";
const CREAM = "#E8E6E0";
const INK = "#111111";
const MUTED = "#666666";
const BORDER = "#E5E5E5";

export interface EmailPayload {
  name: string;
  result: ScoreResult;
  siteUrl: string; // e.g. https://training.notcontent.ai
}

export function renderScorecardEmailHTML(payload: EmailPayload): string {
  const { name, result, siteUrl } = payload;
  const tier = tierCopy[result.tier];
  const stack = getStackAuditCopy(result.stackBucket, result.stackCount);
  const program = programs[result.recommendedProgram];

  const bookUrl = `${siteUrl}/book`;
  const programUrl = `${siteUrl}${program.href}`;
  const scorecardUrl = `${siteUrl}/assess`;

  const dimensionRow = (
    label: string,
    score: number,
    max: number
  ): string => {
    const pct = Math.round((score / max) * 100);
    return `
      <tr>
        <td style="padding:8px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>
              <td style="font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${INK};padding-bottom:6px;">
                ${label}
              </td>
              <td align="right" style="font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;color:${MUTED};padding-bottom:6px;">
                ${score} / ${max}
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding:0;">
                <div style="background:#EFEFEF;height:4px;width:100%;">
                  <div style="background:${COBALT};height:4px;width:${pct}%;"></div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  };

  const bulletList = (items: string[]): string =>
    items
      .map(
        (it) => `
      <tr>
        <td style="padding:6px 0;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>
              <td style="padding-right:12px;vertical-align:top;font-family:'IBM Plex Mono','Courier New',monospace;color:${COBALT};font-size:12px;">→</td>
              <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:${INK};">${it}</td>
            </tr>
          </table>
        </td>
      </tr>
    `
      )
      .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Your AI Readiness Scorecard</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid ${BORDER};">

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid ${BORDER};">
              <p style="margin:0;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${INK};font-weight:600;">
                NOTCONTENT <span style="color:${MUTED};font-weight:400;">/ training</span>
              </p>
            </td>
          </tr>

          <!-- Hero: score + tier -->
          <tr>
            <td style="padding:40px 32px;background:${COBALT};color:#FFFFFF;text-align:center;">
              <p style="margin:0 0 16px;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);">
                ${escapeHTML(name)}'s AI Readiness Scorecard
              </p>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:64px;line-height:1;font-weight:300;letter-spacing:-0.02em;">
                ${result.normalizedScore} <span style="font-size:28px;opacity:0.6;">/ 100</span>
              </p>
              <p style="margin:16px 0 0;font-family:'IBM Plex Mono','Courier New',monospace;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;font-weight:500;">
                ${tier.label}
              </p>
            </td>
          </tr>

          <!-- Tier diagnosis -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 12px;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">
                What this means
              </p>
              <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:20px;line-height:1.35;font-weight:300;letter-spacing:-0.01em;color:${INK};">
                ${tier.tagline}
              </p>
              <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${MUTED};">
                ${tier.diagnosis}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                ${bulletList(tier.whatItMeans)}
              </table>
            </td>
          </tr>

          <!-- Dimensions -->
          <tr>
            <td style="padding:8px 32px 32px;border-top:1px solid ${BORDER};">
              <p style="margin:24px 0 16px;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">
                The Diagnosis
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                ${dimensionRow("Adoption", result.dimensions.adoption, 30)}
                ${dimensionRow("Readiness", result.dimensions.readiness, 40)}
                ${dimensionRow("Blockers", result.dimensions.blockers, 26)}
              </table>
            </td>
          </tr>

          <!-- Stack Audit -->
          <tr>
            <td style="padding:8px 32px 32px;border-top:1px solid ${BORDER};">
              <p style="margin:24px 0 16px;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">
                Your Stack
              </p>
              <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:500;color:${INK};">
                ${stack.headline}
              </p>
              <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${MUTED};">
                ${stack.body}
              </p>
              <p style="margin:0;padding:12px 16px;background:${CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:${INK};border-left:3px solid ${COBALT};">
                <strong>Priority:</strong> ${stack.takeaway.replace(/^Priority: /, "")}
              </p>
            </td>
          </tr>

          <!-- Program recommendation -->
          <tr>
            <td style="padding:32px;border-top:1px solid ${BORDER};background:${CREAM};">
              <p style="margin:0 0 12px;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">
                Recommended Program
              </p>
              <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:22px;font-weight:500;letter-spacing:-0.01em;color:${INK};">
                ${program.label}
              </p>
              <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:${INK};">
                ${program.tagline}
              </p>
              <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${MUTED};">
                ${program.detail}
              </p>
              <p style="margin:0 0 24px;font-family:'IBM Plex Mono','Courier New',monospace;font-size:12px;color:${INK};">
                ${program.pricing} · ${program.duration}
              </p>
              <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="background:${COBALT};padding:14px 28px;">
                    <a href="${bookUrl}" style="color:#FFFFFF;text-decoration:none;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;display:inline-block;">
                      Book a Discovery Call →
                    </a>
                  </td>
                  <td width="12"></td>
                  <td style="border:1px solid ${INK};padding:13px 20px;">
                    <a href="${programUrl}" style="color:${INK};text-decoration:none;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;display:inline-block;">
                      Program Details →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:32px;border-top:1px solid ${BORDER};">
              <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${INK};">
                Hi ${escapeHTML(name)} —
              </p>
              <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${MUTED};">
                Thanks for running the scorecard. If you want to talk through what this looks like for your team specifically — what you'd build in the first 30 days, who'd own it, what it actually costs — book 30 minutes and I'll map it out live.
              </p>
              <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:${INK};">
                — Jeremy Somers
              </p>
              <p style="margin:0;font-family:'IBM Plex Mono','Courier New',monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">
                Founder, NotContent Training
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:${INK};color:#FFFFFF;text-align:center;">
              <p style="margin:0 0 6px;font-family:'IBM Plex Mono','Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">
                training.notcontent.ai
              </p>
              <p style="margin:0;font-family:'IBM Plex Mono','Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.3);">
                <a href="${scorecardUrl}" style="color:rgba(255,255,255,0.5);text-decoration:underline;">Retake the scorecard</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Plain-text fallback (for clients that don't render HTML) ────────────────
export function renderScorecardEmailText(payload: EmailPayload): string {
  const { name, result, siteUrl } = payload;
  const tier = tierCopy[result.tier];
  const stack = getStackAuditCopy(result.stackBucket, result.stackCount);
  const program = programs[result.recommendedProgram];

  return [
    `${name}'s AI Readiness Scorecard`,
    `──────────────────────────────`,
    ``,
    `SCORE: ${result.normalizedScore} / 100`,
    `TIER: ${tier.label}`,
    ``,
    `${tier.tagline}`,
    ``,
    tier.diagnosis,
    ``,
    `WHAT THIS MEANS:`,
    ...tier.whatItMeans.map((w) => `  - ${w}`),
    ``,
    `DIMENSIONS:`,
    `  Adoption:  ${result.dimensions.adoption} / 30`,
    `  Readiness: ${result.dimensions.readiness} / 40`,
    `  Blockers:  ${result.dimensions.blockers} / 26`,
    ``,
    `YOUR STACK — ${stack.headline}`,
    stack.body,
    ``,
    stack.takeaway,
    ``,
    `RECOMMENDED: ${program.label}`,
    `${program.tagline}`,
    `${program.pricing} · ${program.duration}`,
    ``,
    `Book a Discovery Call: ${siteUrl}/book`,
    `Program details: ${siteUrl}${program.href}`,
    ``,
    `— Jeremy Somers, Founder, NotContent Training`,
    `${siteUrl}`,
  ].join("\n");
}

function escapeHTML(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
