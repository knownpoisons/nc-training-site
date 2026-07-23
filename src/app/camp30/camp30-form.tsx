// Beehiiv "Camp30 Waitlist" form, embedded as a direct iframe.
//
// We deliberately do NOT use beehiiv's loader.js script: that loader relies on
// document.currentScript + a DOMContentLoaded handshake to find and size the
// form, both of which break when the script is injected after hydration from a
// client component (currentScript is null for dynamically-inserted scripts, and
// DOMContentLoaded has long since fired). The result was a blank slot.
//
// The form's own endpoint renders the real, working form and sets
// `content-security-policy: frame-ancestors *`, so a plain cross-origin iframe
// is both permitted and deterministic — no script, no timing race.
const FORM_URL =
  "https://subscribe-forms.beehiiv.com/244ebc68-bf10-4fab-b101-c6f3d6ce5838";

export function Camp30Form() {
  return (
    <iframe
      className="bh-embed"
      src={FORM_URL}
      title="Camp30 Waitlist — subscribe"
      loading="lazy"
      scrolling="no"
    />
  );
}
