"use client";
import Link from "next/link";
import { naira } from "../lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, featured = false }) {
  return (
    <Link href={`/product/${product.id}`} className={`card ${featured ? "is-featured" : ""}`}>
      <div className="card-img">
        <ProductImage src={product.image} alt={product.name} />
        {product.tag && <span className="tag">{product.tag}</span>}
      </div>
      <div className="card-body">
        <div>
          <h3>{product.name}</h3>
          <p className="price">{naira(product.price_kobo)}</p>
        </div>
        <span className="arrow" aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
