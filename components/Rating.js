export default function Rating({ value, reviews, small = false }) {
  return (
    <span className={`rating ${small ? "small" : ""}`} aria-label={`Rated ${value.toFixed(1)} out of 5 from ${reviews} reviews`}>
      <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true"><path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" fill="currentColor" /></svg>
      <span aria-hidden="true">{value.toFixed(1)}</span>
      {!small && reviews != null && <span className="rcount" aria-hidden="true">{reviews} reviews</span>}
    </span>
  );
}
