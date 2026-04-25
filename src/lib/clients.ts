import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CLIENTS_DIR = path.join(process.cwd(), "content", "clients");

export type ProgrammeStatus =
  | "prep_week"
  | "in_progress"
  | "completed"
  | "paused"
  | "cancelled";

export type SessionStatus =
  | "upcoming"
  | "scheduled"
  | "delivered"
  | "rescheduled"
  | "skipped";

export type PaymentStatus = "upcoming" | "due" | "overdue" | "paid";

export type ThroughLineStatus = "pending" | "briefed" | "in_progress" | "shipped";

export interface ExternalResource {
  name: string;
  url: string;
  note?: string | null;
}

export interface ClientSession {
  number: number;
  title: string;
  phase: string;
  date: string;
  status: SessionStatus;
  recording_url: string | null;
  recording_duration_minutes: number | null;
  cheat_sheet_url: string | null;
  cheat_sheet_pdf_url: string | null;
  wrap_notes: string | null;
  homework: string | null;
  tools_used: string[];
  modules_taught: string[];
  external_resources: ExternalResource[];
}

export interface PaymentScheduleEntry {
  label: string;
  amount_usd: number;
  due_date: string;
  status: PaymentStatus;
  paid_date?: string | null;
}

export interface PublicFinancials {
  total_contract_value_usd: number;
  currency: string;
  payment_schedule: PaymentScheduleEntry[];
  paid_to_date_usd: number;
  outstanding_usd: number;
}

export interface ClientData {
  meta: {
    schema_version?: string;
    client_slug: string;
    last_updated: string;
  };
  client: {
    name: string;
    display_name: string;
    logo_url: string | null;
    primary_contact: string;
    industry: string;
  };
  programme: {
    shape: string;
    start_date: string;
    end_date: string;
    session_day: string;
    session_time: string;
    total_sessions: number;
    current_session: number | null;
    team_size: number;
    status: ProgrammeStatus;
  };
  through_line: {
    name: string | null;
    description: string | null;
    chosen_in_session: number | null;
  };
  sessions: ClientSession[];
  financials: PublicFinancials | null;
  hub_links: {
    slack_channel: string | null;
    drive_folder: string | null;
    shared_brand_brain_project: string | null;
  };
  deliverables: {
    sessions_delivered: number;
    sessions_total: number;
    cheat_sheets_posted: number;
    recordings_posted: number;
    through_line_status: ThroughLineStatus;
  };
}

export interface CheatSheet {
  slug: string;
  sessionNumber: number;
  title: string;
  content: string;
}

function clientsDirExists(): boolean {
  return fs.existsSync(CLIENTS_DIR) && fs.statSync(CLIENTS_DIR).isDirectory();
}

export function getAllClientSlugs(): string[] {
  if (!clientsDirExists()) return [];
  return fs
    .readdirSync(CLIENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !name.startsWith("."));
}

interface RawJson {
  meta?: ClientData["meta"];
  public?: {
    client?: ClientData["client"];
    programme?: ClientData["programme"];
    through_line?: Partial<ClientData["through_line"]>;
    sessions?: Partial<ClientSession>[];
    financials?: PublicFinancials;
    hub_links?: Partial<ClientData["hub_links"]>;
    deliverables?: ClientData["deliverables"];
  };
}

function normaliseSession(raw: Partial<ClientSession>): ClientSession {
  return {
    number: raw.number ?? 0,
    title: raw.title ?? "",
    phase: raw.phase ?? "",
    date: raw.date ?? "",
    status: (raw.status as SessionStatus) ?? "upcoming",
    recording_url: raw.recording_url ?? null,
    recording_duration_minutes: raw.recording_duration_minutes ?? null,
    cheat_sheet_url: raw.cheat_sheet_url ?? null,
    cheat_sheet_pdf_url: raw.cheat_sheet_pdf_url ?? null,
    wrap_notes: raw.wrap_notes ?? null,
    homework: raw.homework ?? null,
    tools_used: raw.tools_used ?? [],
    modules_taught: raw.modules_taught ?? [],
    external_resources: raw.external_resources ?? [],
  };
}

export function getClient(slug: string): ClientData | null {
  if (!clientsDirExists()) return null;
  const filePath = path.join(CLIENTS_DIR, slug, "client.json");
  if (!fs.existsSync(filePath)) return null;

  const raw: RawJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!raw.public || !raw.public.client || !raw.public.programme) return null;

  const sessions = (raw.public.sessions ?? []).map(normaliseSession);
  const totalSessions = raw.public.programme.total_sessions ?? sessions.length;
  if (raw.public.programme.total_sessions !== undefined && raw.public.programme.total_sessions !== sessions.length) {
    console.warn(
      `[clients] ${slug}: total_sessions=${raw.public.programme.total_sessions} but sessions[] length=${sessions.length}`
    );
  }

  return {
    meta: raw.meta ?? { client_slug: slug, last_updated: "" },
    client: raw.public.client,
    programme: raw.public.programme,
    through_line: {
      name: raw.public.through_line?.name ?? null,
      description: raw.public.through_line?.description ?? null,
      chosen_in_session: raw.public.through_line?.chosen_in_session ?? null,
    },
    sessions,
    financials: raw.public.financials ?? null,
    hub_links: {
      slack_channel: raw.public.hub_links?.slack_channel ?? null,
      drive_folder: raw.public.hub_links?.drive_folder ?? null,
      shared_brand_brain_project:
        raw.public.hub_links?.shared_brand_brain_project ?? null,
    },
    deliverables: raw.public.deliverables ?? {
      sessions_delivered: 0,
      sessions_total: totalSessions,
      cheat_sheets_posted: 0,
      recordings_posted: 0,
      through_line_status: "pending",
    },
  };
}

export function getCheatSheet(slug: string, sessionNumber: number): CheatSheet | null {
  const padded = String(sessionNumber).padStart(2, "0");
  const sourcePath = path.join(
    CLIENTS_DIR,
    slug,
    "cheat-sheets",
    "source",
    `session-${padded}.md`
  );
  if (!fs.existsSync(sourcePath)) return null;

  const raw = fs.readFileSync(sourcePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    sessionNumber,
    title: data.title ?? `Session ${padded}`,
    content,
  };
}

/**
 * Format an ISO date as "April 2, 2026". UTC locale fixed for SSR/CSR parity.
 */
export function formatHubDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatHubDateShort(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatMoney(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cheatSheetPath(slug: string, sessionNumber: number): string {
  const padded = String(sessionNumber).padStart(2, "0");
  return `/${slug}/cheat-sheets/session-${padded}`;
}
