"use client";

import { useState } from "react";
import { LibraryTopbar } from "./topbar";
import { LibraryFooter } from "./footer";

// The access gate. Rendered by the library pages whenever the visitor has no
// access cookie — so it stands in front of the index AND every direct prompt
// link. On success the API sets the cookie and we hard-reload; the page then
// sees the cookie and renders the real library.
type FieldErrors = { name?: string; email?: string; company?: string; form?: string };

export function LibraryGate({ total }: { total: number }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    // Validate on click and SHOW why — never a silently dead button.
    const errs: FieldErrors = {};
    if (name.trim().split(/\s+/).filter(Boolean).length < 2)
      errs.name = "Enter your first and last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Enter a valid email address.";
    if (!company.trim()) errs.company = "Enter your company.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
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
        setLoading(false);
        setErrors({ form: "Couldn't open the library. Please try again." });
        return;
      }
      // Cookie is set; reload so the page re-renders with access.
      window.location.reload();
    } catch {
      setLoading(false);
      setErrors({ form: "Network hiccup — please try again." });
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
                aria-invalid={!!errors.name}
              />
              {errors.name && <span className="gate-err">{errors.name}</span>}
            </label>
            <label>
              <span>Work email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="gate-err">{errors.email}</span>}
            </label>
            <label>
              <span>Company</span>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Where you work"
                autoComplete="organization"
                aria-invalid={!!errors.company}
              />
              {errors.company && (
                <span className="gate-err">{errors.company}</span>
              )}
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Opening…" : "Open the library →"}
            </button>

            {errors.form && <p className="gate-err">{errors.form}</p>}

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
