"use client";
// The + on a product card opens this: pick a size, add to cart, done.
import Link from "next/link";
import { useEffect, useState } from "react";
import Sheet from "./Sheet";
import { useUI } from "./UIProvider";
import { useCart } from "./CartProvider";
import { getProduct, sizeList, inStock } from "../lib/products";
import ProductImage from "./ProductImage";
import { Price } from "./ProductCard";
import { CloseIcon } from "./Icons";

export default function QuickAddSheet() {
  const { open, close, quickId, show } = useUI();
  const { add } = useCart();
  const product = quickId ? getProduct(quickId) : null;
  const [size, setSize] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => { setSize(null); setError(false); }, [quickId, open]);

  const addIt = () => {
    if (!size) { setError(true); return; }
    add(product.id, size, 1);
    show("cart");
  };

  return (
    <Sheet open={open === "quick" && !!product} onClose={close} side="bottom" label={product ? `Choose a size for ${product.name}` : "Quick add"} className="quick">
      {product && (
        <>
          <div className="quick-head">
            <div className="quick-thumb"><ProductImage src={product.images[0]} alt="" /></div>
            <div className="quick-info">
              <p className="quick-name">{product.name}</p>
              <p className="quick-colour">{product.colour}</p>
              <Price product={product} />
            </div>
            <button type="button" className="icon-btn" onClick={close} aria-label="Close"><CloseIcon /></button>
          </div>
          <fieldset className="size-pick">
            <legend className="opt-label">Size (EU)</legend>
            <div className="size-grid">
              {sizeList(product).map(s => (
                <button key={s} type="button" className={`size ${size === s ? "on" : ""}`} disabled={!inStock(product, s)}
                  aria-pressed={size === s} aria-label={inStock(product, s) ? `Size ${s}` : `Size ${s}, sold out`}
                  onClick={() => { setSize(s); setError(false); }}>{s}</button>
              ))}
            </div>
            {error && <p className="field-error" role="alert">Choose a size first.</p>}
          </fieldset>
          <button type="button" className="btn full" onClick={addIt}>Add to cart</button>
          <Link href={`/product/${product.id}`} className="text-link" onClick={close}>See full details</Link>
        </>
      )}
    </Sheet>
  );
}
