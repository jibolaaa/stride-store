import Link from "next/link";
import { naira } from "../lib/format";
import { ALL_SIZES } from "../lib/products";
import ProductImage from "./ProductImage";
import Rating from "./Rating";

// One product in the grid. Look B shows the label like the end of a
// shoebox: name, style code, price and the size run.
export default function ProductCard({ product, priority = false }) {
  return (
    <Link href={`/product/${product.id}`} className="card">
      <div className="card-img">
        <ProductImage src={product.image} alt={product.name} priority={priority} />
        {product.tag && <span className="tag">{product.tag}</span>}
      </div>
      <div className="label">
        <h3 className="name">{product.name}</h3>
        <div className="label-row">
          <span className="price">{naira(product.price_kobo)}</span>
          <Rating value={product.rating} reviews={product.reviews} small />
          <span className="code">{product.code}</span>
        </div>
        <SizeRun sizes={product.sizes} />
      </div>
    </Link>
  );
}

export function SizeRun({ sizes }) {
  return (
    <p className="size-run" aria-label={`Sizes in stock: EU ${sizes.join(", ")}`}>
      <span aria-hidden="true">EU</span>
      {ALL_SIZES.map(s => (
        <span key={s} aria-hidden="true" className={sizes.includes(s) ? "in" : "out"}>{s}</span>
      ))}
    </p>
  );
}
