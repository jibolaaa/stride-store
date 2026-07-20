"use client";
import Link from "next/link";
import { naira } from "../lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="card">
      <div className="card-img">
        <ProductImage src={product.image} alt={product.name} />
        {product.tag && <span className="tag">{product.tag}</span>}
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="price">{naira(product.price_kobo)}</p>
      </div>
    </Link>
  );
}
