"use client";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import { getProduct } from "../../lib/products";
import { naira } from "../../lib/format";
import ProductImage from "../../components/ProductImage";

export default function CartPage() {
  const { items, setQty, remove, subtotal_kobo } = useCart();

  if (!items.length) {
    return (
      <div className="wrap">
        <p className="empty">Your cart is empty.</p>
        <div className="center"><Link className="btn" href="/">Browse sneakers</Link></div>
      </div>
    );
  }

  return (
    <div className="wrap cart-page">
      <h1>Your cart</h1>
      <div className="cart-list">
        {items.map(({ id, qty }) => {
          const p = getProduct(id);
          if (!p) return null;
          return (
            <div className="cart-row" key={id}>
              <div className="cart-thumb"><ProductImage src={p.image} alt={p.name} /></div>
              <div className="cart-mid">
                <h3>{p.name}</h3>
                <p className="price">{naira(p.price_kobo)}</p>
                <button className="link-btn" onClick={() => remove(id)}>Remove</button>
              </div>
              <div className="stepper small">
                <button onClick={() => setQty(id, qty - 1)} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(id, qty + 1)} aria-label="Increase">+</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="totals">
        <div className="tot-row"><span>Subtotal</span><b>{naira(subtotal_kobo)}</b></div>
        <div className="tot-row muted"><span>Delivery</span><span>Free (Lagos)</span></div>
        <Link className="btn full" href="/checkout">Proceed to checkout</Link>
      </div>
    </div>
  );
}
