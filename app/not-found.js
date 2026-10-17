import Link from "next/link";

// A plain fallback. Unknown shop addresses use app/(store)/not-found.js and
// the back office uses its own, so this one stays small: Next.js sends it
// along with every page.
export default function NotFound() {
  return (
    <main id="main" className="wrap page empty-state">
      <h1 className="page-title">Page not found</h1>
      <p>The link may be old or mistyped.</p>
      <div className="empty-actions">
        <Link className="btn" href="/">Go to STRIDE</Link>
      </div>
    </main>
  );
}
