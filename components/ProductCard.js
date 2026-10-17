"use client";
import Link from "next/link";
import { naira } from "../lib/format";
import { isSoldOut, onSale, salePercent } from "../lib/products";
import { useUI } from "./UIProvider";
import ProductImage from "./ProductImage";
import Stars from "./Stars";
import { CardSwatches } from "./Swatches";
import { PlusIcon } from "./Icons";

export function badgeFor(p) {
  if (isSoldOut(p)) return { text: "Sold out", kind: "muted" };
  if (onSale(p)) return { text: `${salePercent(p)}% off`, kind: "sale" };
  if (p.tags.includes("limited")) return { text: "Limited", kind: "dark" };
  if (p.tags.includes("new")) return { text: "New", kind: "" };
  return null;
}

export function Price({ product, className = "" }) {
  return (
    <p className={`price ${className}`}>
      {onSale(product) ? (
        <>
          <span className="now"><span className="sr-only">Now </span>{naira(product.price_kobo)}</span>
          <span className="was"><span className="sr-only">, was </span>{naira(product.compare_kobo)}</span>
        </>
      ) : naira(product.price_kobo)}
    </p>
  );
}

export default function ProductCard({ product, priority = false }) {
  const { quickAdd } = useUI();
  const badge = badgeFor(product);
  const soldOut = isSoldOut(product);
  const href = `/product/${product.id}`;

  return (
    <article className={`pcard ${soldOut ? "sold" : ""}`}>
      <div className="pcard-tile">
        <Link href={href} className={`pcard-img ${product.images[1] ? "has-alt" : ""}`} tabIndex={-1} aria-hidden="true" draggable={false}>
          <ProductImage src={product.images[0]} alt="" priority={priority} />
          {product.images[1] && <ProductImage src={product.images[1]} alt="" className="alt" />}
        </Link>
        {badge && <span className={`badge ${badge.kind}`}>{badge.text}</span>}
        {!soldOut && (
          <button type="button" className="pcard-add" onClick={() => quickAdd(product.id)} aria-label={`Quick add ${product.name}, ${product.colour}`}>
            <PlusIcon />
          </button>
        )}
      </div>
      <div className="pcard-info">
        <Link href={href} className="pcard-name" draggable={false}>{product.name}</Link>
        <p className="pcard-meta">{product.colour}</p>
        <Price product={product} className="pcard-price" />
        <div className="pcard-foot">
          <CardSwatches product={product} />
          <Stars value={product.rating} reviews={product.reviews} />
        </div>
      </div>
    </article>
  );
}
