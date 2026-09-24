"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(mode) {
    setBusy(true);
    setMsg("");
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { error } = await fn;
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    if (mode === "up") setMsg("Account created. If email confirm is on, check your inbox. Otherwise you are in.");
    router.push("/desk");
    router.refresh();
  }

  return (
    <main className="article">
      <div className="kicker">Staff entrance</div>
      <h1>Sign in to the desk.</h1>
      <p className="lede">Email and a password. That is the whole lock.</p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          run("in");
        }}
      >
        <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required minLength={6} placeholder="password, six characters at least" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={busy}>Sign in</button>
          <button type="button" className="ghost" disabled={busy} onClick={() => run("up")}>Create account</button>
        </div>
        <div className="msg">{msg}</div>
      </form>
    </main>
  );
}
