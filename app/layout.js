import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "The Night Press",
  description: "A public desk that turns over every hour.",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="wrap">
          <header className="mast">
            <Link className="mark" href="/">
              The Night Press
            </Link>
            <nav className="nav">
              <Link href="/">Board</Link>
              {user ? <Link href="/desk">Desk</Link> : <Link href="/login">Sign in</Link>}
            </nav>
          </header>
          {children}
          <footer className="site">Printed on demand · Rotates on the hour · UTC</footer>
        </div>
      </body>
    </html>
  );
}
