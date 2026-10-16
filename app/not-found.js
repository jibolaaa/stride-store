import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page empty-state">
      <p className="kicker">Page not found</p>
      <h1 className="page-title">Nothing here</h1>
      <p>The link may be old, or the product may have been removed.</p>
      <div className="empty-actions">
        <Link className="btn" href="/collections/all">Shop all sneakers</Link>
        <Link className="btn outline" href="/">Go home</Link>
      </div>
    </div>
  );
}
