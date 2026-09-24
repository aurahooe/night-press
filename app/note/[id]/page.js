import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NotePage({ params }) {
  const supabase = createClient();
  const { data: note } = await supabase
    .from("press_notes")
    .select("id,title,body,created_at,is_public,author_id")
    .eq("id", params.id)
    .maybeSingle();

  if (!note) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!note.is_public && user?.id !== note.author_id) notFound();

  const { data: profile } = await supabase
    .from("press_profiles")
    .select("handle,display_name")
    .eq("id", note.author_id)
    .maybeSingle();

  return (
    <article className="article">
      <div className="kicker">{note.is_public ? "Public" : "Private"}</div>
      <h1>{note.title}</h1>
      <p style={{ color: "var(--mute)", fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>
        {profile?.display_name || "A reader"} · @{profile?.handle || "anon"} ·{" "}
        {new Date(note.created_at).toUTCString()}
      </p>
      <p>{note.body}</p>
    </article>
  );
}
