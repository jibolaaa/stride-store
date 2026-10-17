import { StarIcon } from "./Icons";

// Ratings. Cards use the short form (★ 4.8); the product page shows the
// five stars filled to the score, with the number of reviews.
export default function Stars({ value, reviews, full = false }) {
  if (value == null) return null;
  const label = `Rated ${value.toFixed(1)} out of 5${reviews ? ` from ${reviews} reviews` : ""}`;
  if (!full) {
    return <span className="rating" aria-label={label}><StarIcon aria-hidden="true" /><span aria-hidden="true">{value.toFixed(1)}</span></span>;
  }
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="stars" aria-label={label}>
      <span className="stars-track" aria-hidden="true">
        <span className="stars-fill" style={{ width: `${pct}%` }}>★★★★★</span>
        ★★★★★
      </span>
      <span className="stars-num" aria-hidden="true">{value.toFixed(1)}{reviews ? `, ${reviews} reviews` : ""}</span>
    </span>
  );
}
