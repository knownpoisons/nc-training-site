"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginToHub } from "@/lib/hub-actions";

interface Props {
  clientDisplayName: string;
}

export function LoginForm({ clientDisplayName }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const value = password;
    startTransition(async () => {
      const result = await loginToHub(value);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
        setPassword("");
      }
    });
  }

  return (
    <main className="min-h-[100svh] bg-[#E8E6E0] flex items-center justify-center px-6 py-20 oci-grid-lines">
      <div className="w-full max-w-md">
        <div className="oci-section-label mb-12">
          <span>{clientDisplayName.toUpperCase()}</span>
          <span>[NC]</span>
        </div>

        <h1 className="oci-display-sm text-[#1549CD]">
          Private hub. Password required.
        </h1>

        <form onSubmit={handleSubmit} className="mt-12">
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.15em] text-foreground/60">
              Password
            </span>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={pending}
              className="mt-3 block w-full border border-[#1549CD]/20 bg-white px-4 py-3 text-base text-foreground focus:border-[#1549CD] focus:outline-none focus:ring-1 focus:ring-[#1549CD]"
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-[#dc2626]" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || password.length === 0}
            className="hub-cta-full mt-6"
          >
            {pending ? "Signing in…" : "Enter hub"}
          </button>
        </form>

        <p className="mt-8 text-[11px] uppercase tracking-[0.15em] text-foreground/40">
          notcontent.ai · training
        </p>
      </div>
    </main>
  );
}
