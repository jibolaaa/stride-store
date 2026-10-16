import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page-narrow empty-state">
      <h1>This page doesn't exist</h1>
      <p>The link may be old, or the product may have been removed.</p>
      <Link className="btn" href="/#shop">Shop sneakers</Link>
    </div>
  );
}
