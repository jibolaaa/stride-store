import Link from "next/link";

export default function OfficeNotFound() {
  return (
    <div className="ofc-form not-found">
      <h1 className="ofc-title">Not here</h1>
      <p className="ofc-sub">That sale, shoe or page doesn't exist, or your role can't open it.</p>
      <div className="ofc-row">
        <Link className="btn small" href="/office">Back to the office</Link>
      </div>
    </div>
  );
}
