"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ALL_SIZES, getProduct, products } from "../lib/products";
import { naira } from "../lib/format";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";
import ProductCard from "./ProductCard";
import Rating from "./Rating";

export default function ProductView({ id }) {
  const product = getProduct(id);
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [toast, setToast] = useState(null);
  const sizesRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const related = products.filter(p => p.id !== product.id).slice(0, 4);

  const needSize = () => {
    if (size) return false;
    setSizeError(true);
    sizesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    sizesRef.current?.querySelector("button")?.focus({ preventScroll: true });
    return true;
  };

  const addToCart = () => {
    if (needSize()) return;
    add(product.id, size, qty);
    setToast(`${product.name}, size ${size}${qty > 1 ? `, ×${qty}` : ""}`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 4000);
  };

  const buyNow = () => {
    if (needSize()) return;
    add(product.id, size, qty);
    router.push("/checkout");
  };

  return (
    <>
      <div className="wrap product">
        <div className="product-img">
          <ProductImage src={product.image} alt={product.name} priority />
          {product.tag && <span className="tag">{product.tag}</span>}
        </div>

        <div className="product-info">
          <p className="crumb"><Link href="/#shop">All sneakers</Link><span aria-hidden="true"> / </span>{product.name}</p>
          <div className="label product-label">
            <div className="label-row">
              <h1 className="name">{product.name}</h1>
              <span className="code">{product.code}</span>
            </div>
            <div className="label-row">
              <span className="price">{naira(product.price_kobo)}</span>
              <Rating value={product.rating} reviews={product.reviews} />
            </div>
          </div>
          <p className="desc">{product.description}</p>

          <fieldset className="sizes-block" ref={sizesRef}>
            <legend>Choose your size <span>(EU)</span></legend>
            <div className="sizes">
              {ALL_SIZES.map(s => {
                const inStock = product.sizes.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    className={`size ${size === s ? "on" : ""}`}
                    disabled={!inStock}
                    aria-pressed={size === s}
                    aria-label={inStock ? `Size ${s}` : `Size ${s}, sold out`}
                    onClick={() => { setSize(s); setSizeError(false); }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {sizeError
              ? <p className="field-error" role="alert">Choose a size to continue.</p>
              : <p className="note">Greyed-out sizes are sold out.</p>}
          </fieldset>

          <div className="qty-row">
            <span className="qty-label" id="qty-label">Quantity</span>
            <div className="stepper" role="group" aria-labelledby="qty-label">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="One less" disabled={qty <= 1}>−</button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="One more" disabled={qty >= 10}>+</button>
            </div>
          </div>

          <div className="buy">
            <div className="buy-price">
              <b>{naira(product.price_kobo * qty)}</b>
              <span>{size ? `Size ${size}` : "No size chosen"}</span>
            </div>
            <button className="btn" onClick={addToCart}>Add to cart</button>
            <button className="btn ghost buy-now" onClick={buyNow}>Buy now</button>
          </div>

          <ul className="perks">
            <li>Free delivery anywhere in Lagos, 1 to 2 working days</li>
            <li>Pay by card, transfer or USSD through Paystack</li>
            <li>Return unworn pairs within 7 days</li>
          </ul>
        </div>
      </div>

      <section className="wrap related" aria-labelledby="related-title">
        <h2 id="related-title">You might also like</h2>
        <div className="grid related-grid">
          {related.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span><b>Added to cart</b>{toast}</span>
            <Link href="/cart" className="toast-link">View cart</Link>
          </>
        )}
      </div>
    </>
  );
}
