import Link from "next/link";
import Danfo from "../components/Danfo";

export default function NotFound() {
  return (
    <div className="wrap page empty-state">
      <div className="danfo-scene parked" aria-hidden="true"><Danfo /><span className="lane" /></div>
      <h1 className="page-title">Wrong bus stop</h1>
      <p>This page isn't on our route. The link may be old, or the product may have been removed.</p>
      <div className="empty-actions">
        <Link className="btn" href="/collections/all">Shop all sneakers</Link>
        <Link className="btn outline" href="/">Go home</Link>
      </div>
    </div>
  );
}
