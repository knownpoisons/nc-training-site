"use client";

import { useState } from "react";
import { LibraryTopbar } from "./topbar";
import { LibraryFooter } from "./footer";

// The access gate. Rendered by library/layout.tsx whenever the visitor has no
// access cookie — so it stands in front of the index AND every direct prompt
// link. On success the API sets the cookie and we hard-reload; the layout then
// sees the cookie and renders the real library.
export function LibraryGate({ total }: { total: number }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [err, setErr] = useState("");

  const nameOk = name.trim().split(/\s+/).filter(Boolean).length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const companyOk = company.trim().length > 0;
  const canSubmit = nameOk && emailOk && companyOk && status !== "loading";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setErr("");
    try {
      const r = await fetch("/api/library-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) {
        setStatus("error");
        setErr("Couldn't open the library. Check your details and try again.");
        return;
      }
      // Cookie is set; reload so the gated layout re-renders with access.
      window.location.reload();
    } catch {
      setStatus("error");
      setErr("Network hiccup. Try again.");
    }
  }

  return (
    <div className="library">
      <LibraryTopbar total={total} />

      <section className="gate">
        <div className="gate-card">
          <div className="gate-eyebrow">
            <span className="num">↓</span>&nbsp;/&nbsp; The Library
          </div>
          <h1>
            The prompts are <span className="accent">free</span>.
            <br />
            The key is your email.
          </h1>
          <p className="gate-sub">
            Every prompt in here is one I actually run. Tell me where to send
            you and the whole library opens &mdash; for good.
          </p>

          <form onSubmit={submit} className="gate-form" noValidate>
            <label>
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Last"
                autoComplete="name"
                required
              />
            </label>
            <label>
              <span>Work email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </label>
            <label>
              <span>Company</span>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Where you work"
                autoComplete="organization"
                required
              />
            </label>

            <button type="submit" disabled={!canSubmit}>
              {status === "loading" ? "Opening…" : "Open the library →"}
            </button>

            {status === "error" && <p className="gate-err">{err}</p>}

            <p className="gate-optin">
              By continuing you&rsquo;re opting in to the NotContent newsletter
              &mdash; very sporadic, genuinely useful, unsubscribe anytime.
            </p>
          </form>
        </div>
      </section>

      <LibraryFooter />
    </div>
  );
}
