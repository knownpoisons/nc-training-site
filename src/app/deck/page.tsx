import { redirect } from "next/navigation";
import { isDeckAuthed, loginDeck } from "./guard";

// The lock screen. Single user, one password (DECK_PASSWORD, or CRON_SECRET
// until one is set). Authed visitors go straight to the Pipeline.
export default async function DeckLock({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  if (await isDeckAuthed()) redirect("/deck/pipeline");
  const { e } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const ok = await loginDeck(String(formData.get("password") ?? ""));
    redirect(ok ? "/deck/pipeline" : "/deck?e=1");
  }

  return (
    <main className="dk-login">
      <form action={login}>
        <div className="dk-label">Cockpit · private</div>
        <h1 className="dk-title">The Deck.</h1>
        <p className="dk-sub">Where the week gets reviewed. Slack runs the day.</p>
        {e && <p className="dk-err">Not it. Try again.</p>}
        <input type="password" name="password" placeholder="password" autoFocus aria-label="Password" />
        <button type="submit">Open the deck</button>
      </form>
    </main>
  );
}
