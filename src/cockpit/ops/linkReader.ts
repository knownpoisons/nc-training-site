// ═══════════════════════════════════════════════════════════════════════════════
// LINK READER — opens a dropped URL and pulls its title + a short text excerpt so
// the newsletter builder can DECIPHER what's behind the link, not just cite it.
// A seam: FakeLinkReader (tests), WebLinkReader (production fetch). Best-effort —
// a link that won't load falls back to just the URL, never blocks the build.
// ═══════════════════════════════════════════════════════════════════════════════

export interface LinkSummary {
  url: string;
  title: string | null;
  excerpt: string | null;
}

export interface LinkReader {
  read(url: string): Promise<LinkSummary | null>;
}

export class FakeLinkReader implements LinkReader {
  constructor(private fn: (url: string) => LinkSummary | null) {}
  read(url: string): Promise<LinkSummary | null> {
    return Promise.resolve(this.fn(url));
  }
}

const EXCERPT_CHARS = 600;

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export class WebLinkReader implements LinkReader {
  constructor(private timeoutMs: number = 8000) {}

  async read(url: string): Promise<LinkSummary | null> {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "NotContentCockpit/1.0 (+newsletter)" },
        signal: AbortSignal.timeout(this.timeoutMs),
        redirect: "follow",
      });
      if (!res.ok) return { url, title: null, excerpt: null };
      const html = await res.text();
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
      const excerpt = stripHtml(html).slice(0, EXCERPT_CHARS) || null;
      return { url, title, excerpt };
    } catch {
      return null; // best-effort — never let a bad link break the build
    }
  }
}
