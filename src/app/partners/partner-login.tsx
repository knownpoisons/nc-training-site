import Link from "next/link";
import { submitPartnerLogin } from "@/lib/partners-actions";
import { PartnerLoginSubmit } from "./partner-login-submit";

// ─── Partner login — JD-aesthetic editorial form ──────────────────────────────
// Server component. Uses a form action (not a programmatic action + refresh) so
// the auth cookie commits during the redirect navigation and persists on Vercel.
export function PartnerLogin({
  error = false,
  next = "/partners",
}: {
  error?: boolean;
  next?: string;
}) {
  return (
    <div className="partners">
      {/* Topbar */}
      <div className="topbar">
        <Link href="/" className="brand">
          NotContent <span className="dot">·</span> Partner Hub
        </Link>
        <span className="counter">
          <strong>Internal</strong> · partner use
        </span>
      </div>

      {/* Login shell */}
      <main className="login-shell">
        <div className="login-card">
          <p className="login-eyebrow">Partner access</p>
          <h1 className="login-title">
            Howdy, <span className="login-title-accent">partner</span>.
          </h1>
          <p className="login-body">
            Drop the partner password to open your kit — the site, the playbook,
            and a sample hub. Ask Jem if you don&rsquo;t have it.
          </p>

          <form action={submitPartnerLogin} className="login-form">
            <input type="hidden" name="next" value={next} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoFocus
              required
              className="login-input"
              aria-label="Partner password"
            />
            <PartnerLoginSubmit />
            {error && <p className="login-error">Wrong password.</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
