// Five stars filled to the rating, then the score: ★★★★★ (5.0)
export default function Stars({ value, reviews, showCount = false }) {
  if (value == null) return null;
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="stars" aria-label={`Rated ${value.toFixed(1)} out of 5${reviews ? ` from ${reviews} reviews` : ""}`}>
      <span className="stars-track" aria-hidden="true">
        <span className="stars-fill" style={{ width: `${pct}%` }}>★★★★★</span>
        ★★★★★
      </span>
      <span className="stars-num" aria-hidden="true">({value.toFixed(1)}){showCount && reviews ? ` ${reviews} reviews` : ""}</span>
    </span>
  );
}
