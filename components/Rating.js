export default function Rating({ value, reviews, small = false }) {
  return (
    <span className={`rating ${small ? "small" : ""}`}>
      <span className="star" aria-hidden="true">★</span> {value.toFixed(1)}
      {reviews != null && <span className="rcount">({reviews})</span>}
    </span>
  );
}
