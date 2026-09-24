"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DeskPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
      load(data.user.id);
    });
  }, []);

  async function load(id) {
    const { data } = await supabase
      .from("press_notes")
      .select("*")
      .eq("author_id", id)
      .order("created_at", { ascending: false });
    setNotes(data || []);
  }

  async function save(e) {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.from("press_notes").insert({
      author_id: user.id,
      title,
      body,
      is_public: isPublic,
    });
    if (error) {
      setMsg(error.message);
      return;
    }
    setTitle("");
    setBody("");
    setMsg(isPublic ? "Filed. It is on the public board." : "Filed privately.");
    load(user.id);
    router.refresh();
  }

  async function toggle(note) {
    await supabase.from("press_notes").update({ is_public: !note.is_public, updated_at: new Date().toISOString() }).eq("id", note.id);
    load(user.id);
    router.refresh();
  }

  async function remove(note) {
    await supabase.from("press_notes").delete().eq("id", note.id);
    load(user.id);
    router.refresh();
  }

  async function out() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (!user) return <main className="article"><p>Opening the desk…</p></main>;

  return (
    <main className="article">
      <div className="kicker">Your desk</div>
      <h1>File a piece.</h1>
      <p className="lede">
        Public notes appear on the board immediately and can be chosen for the next hourly edition.
        Private notes stay here.
      </p>
      <form className="form" onSubmit={save}>
        <input required maxLength={120} placeholder="Headline" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea required maxLength={8000} placeholder="The copy" value={body} onChange={(e) => setBody(e.target.value)} />
        <label className="check">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Mark public
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">File it</button>
          <button type="button" className="ghost" onClick={out}>Sign out</button>
        </div>
        <div className="msg">{msg}</div>
      </form>
      <h2 style={{ marginTop: 48 }}>Spike</h2>
      <div className="grid">
        {notes.map((n) => (
          <div key={n.id} className="piece">
            <h3><Link href={`/note/${n.id}`}>{n.title}</Link></h3>
            <p>{n.is_public ? "Public" : "Private"}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="ghost" type="button" onClick={() => toggle(n)}>{n.is_public ? "Make private" : "Make public"}</button>
              <button className="ghost" type="button" onClick={() => remove(n)}>Destroy</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
