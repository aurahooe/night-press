import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prettyHour } from "@/lib/hour";

export const revalidate = 30;

export default async function HomePage() {
  const supabase = createClient();
  const [{ data: hour }, { data: notes }] = await Promise.all([
    supabase.from("press_hours").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase
      .from("press_notes")
      .select("id,title,body,created_at,author_id")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(24),
  ]);

  return (
    <main>
      <section className="hero">
        <div className="kicker">Public edition</div>
        <h1>What the hour is willing to keep.</h1>
        <p className="lede">
          Write on the desk. Keep it private, or mark it public and it goes on the board.
          Every hour the press chooses one piece — or prints a house note if the spike is empty.
        </p>
      </section>

      <article className="hour-card">
        <div className="kicker">This hour</div>
        <time>{prettyHour(hour?.hour_key)}</time>
        <h2>{hour?.headline || "The first edition has not been pulled."}</h2>
        <p className="lede" style={{ fontSize: 18, margin: 0 }}>
          {hour?.blurb ||
            "Sign in, leave a public note, and wait for the clock. The board updates itself."}
        </p>
      </article>

      <div className="kicker" style={{ marginBottom: 12 }}>
        Public copy
      </div>
      <section className="grid">
        {(notes || []).length === 0 && (
          <p className="lede">Nothing public yet. The first note sets the tone.</p>
        )}
        {(notes || []).map((n, i) => (
          <Link key={n.id} href={`/note/${n.id}`} className="piece" style={{ animationDelay: `${i * 40}ms` }}>
            <h3>{n.title}</h3>
            <p>{n.body.slice(0, 160)}{n.body.length > 160 ? "…" : ""}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
