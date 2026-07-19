"use client";

import { useFormStatus } from "react-dom";

// Submit button that reflects the form-action pending state.
export function PartnerLoginSubmit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="login-submit">
      {pending ? "Checking…" : "Sign in →"}
    </button>
  );
}
