"use client";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import { getProduct } from "../../lib/products";
import { naira } from "../../lib/format";
import ProductImage from "../../components/ProductImage";

export default function CartPage() {
  const { items, setQty, remove, count, subtotal_kobo, loaded } = useCart();

  if (!loaded) return <div className="wrap page-narrow" aria-busy="true" />;

  if (!items.length) {
    return (
      <div className="wrap page-narrow empty-state">
        <h1>Your cart is empty</h1>
        <p>Pick a pair from the shop and it will show up here.</p>
        <Link className="btn" href="/#shop">Shop sneakers</Link>
      </div>
    );
  }

  return (
    <div className="wrap page-narrow cart">
      <h1>Your cart <span className="h-count">{count} {count === 1 ? "item" : "items"}</span></h1>
      <ul className="lines">
        {items.map(({ id, size, qty }) => {
          const p = getProduct(id);
          if (!p) return null;
          return (
            <li className="line" key={`${id}-${size}`}>
              <Link href={`/product/${id}`} className="line-thumb" tabIndex={-1} aria-hidden="true">
                <ProductImage src={p.image} alt="" />
              </Link>
              <div className="line-mid">
                <Link href={`/product/${id}`} className="line-name">{p.name}</Link>
                <p className="line-meta">Size {size ?? "not set"}, {naira(p.price_kobo)} each</p>
                <div className="line-controls">
                  <div className="stepper small" role="group" aria-label={`Quantity of ${p.name}`}>
                    <button type="button" onClick={() => setQty(id, size, qty - 1)} aria-label={qty === 1 ? `Remove ${p.name}` : "One less"}>−</button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => setQty(id, size, Math.min(10, qty + 1))} aria-label="One more" disabled={qty >= 10}>+</button>
                  </div>
                  <button type="button" className="text-btn" onClick={() => remove(id, size)}>Remove</button>
                </div>
              </div>
              <b className="line-total">{naira(p.price_kobo * qty)}</b>
            </li>
          );
        })}
      </ul>

      <div className="totals">
        <div className="tot-row"><span>Subtotal</span><span>{naira(subtotal_kobo)}</span></div>
        <div className="tot-row"><span>Delivery in Lagos</span><span>Free</span></div>
        <div className="tot-row grand"><span>Total</span><b>{naira(subtotal_kobo)}</b></div>
        <div className="sticky-cta">
          <Link className="btn full" href="/checkout">Checkout, {naira(subtotal_kobo)}</Link>
        </div>
        <Link href="/#shop" className="text-link">Keep shopping</Link>
      </div>
    </div>
  );
}
