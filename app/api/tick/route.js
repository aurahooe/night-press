import { createClient } from "@supabase/supabase-js";
import { hourKey, STAFF_HEADLINES, STAFF_BLURBS } from "@/lib/hour";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") || "";
  const q = request.nextUrl.searchParams.get("secret");
  if (secret && auth !== `Bearer ${secret}` && q !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const key = hourKey();
  const { data: existing } = await supabase
    .from("press_hours")
    .select("hour_key")
    .eq("hour_key", key)
    .maybeSingle();

  if (existing) return NextResponse.json({ ok: true, skipped: true, key });

  const { data: notes } = await supabase
    .from("press_notes")
    .select("id,title,body")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(12);

  const pick = notes && notes.length ? notes[Math.floor(Math.random() * Math.min(notes.length, 5))] : null;
  const headline = pick
    ? pick.title
    : STAFF_HEADLINES[Math.floor(Math.random() * STAFF_HEADLINES.length)];
  const blurb = pick
    ? pick.body.slice(0, 280)
    : STAFF_BLURBS[Math.floor(Math.random() * STAFF_BLURBS.length)];

  const { error } = await supabase.from("press_hours").insert({
    hour_key: key,
    note_id: pick?.id || null,
    headline,
    blurb,
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, key, featured: pick?.id || null });
}
