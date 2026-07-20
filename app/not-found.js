import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap center-col">
      <p className="eyebrow">404</p>
      <h1>Lost your<br />footing?</h1>
      <p className="sub">This page does not exist. The sneakers, however, very much do.</p>
      <Link className="btn" href="/">Back to the shop</Link>
    </div>
  );
}
