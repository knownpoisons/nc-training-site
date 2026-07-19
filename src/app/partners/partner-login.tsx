"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginToPartners } from "@/lib/partners-actions";

// ─── Partner login — JD-aesthetic editorial form ──────────────────────────────
export function PartnerLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await loginToPartners(password);
      if (r.ok) {
        router.refresh();
      } else {
        setError(r.error ?? "Failed.");
        setPassword("");
      }
    });
  }

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

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              required
              className="login-input"
              aria-label="Partner password"
            />
            <button
              type="submit"
              disabled={pending || !password}
              className="login-submit"
            >
              {pending ? "Checking…" : "Sign in →"}
            </button>
            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
