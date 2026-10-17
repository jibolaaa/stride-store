"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Sheet from "./Sheet";
import Danfo from "./Danfo";
import { useUI } from "./UIProvider";
import { maxQtyFor, useCart } from "./CartProvider";
import { getProduct } from "../lib/products";
import { FREE_DELIVERY_FROM_KOBO, toFreeDelivery } from "../lib/pricing";
import { naira } from "../lib/format";
import ProductImage from "./ProductImage";
import { CloseIcon, MinusIcon, PlusIcon } from "./Icons";

// A danfo drives along the road towards the free-delivery stop as the
// cart fills up. It starts at the beginning and drives to where you are.
export function FreeDeliveryBar({ subtotal }) {
  const left = toFreeDelivery(subtotal);
  const target = Math.min(100, (subtotal / FREE_DELIVERY_FROM_KOBO) * 100);
  const [pct, setPct] = useState(0);
  const [driving, setDriving] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    // Wait one frame on first show so the bus visibly pulls away from the start.
    const go = () => { setPct(target); setDriving(true); };
    const raf = first.current ? requestAnimationFrame(() => requestAnimationFrame(go)) : (go(), 0);
    first.current = false;
    const t = setTimeout(() => setDriving(false), 1100);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [target]);

  const arrived = target >= 100;
  return (
    <div className={`free-bar ${arrived ? "arrived" : ""}`}>
      <p>{left > 0 ? <>Add <b>{naira(left)}</b> more for free delivery in Lagos</> : <>Your order gets <b>free delivery</b> in Lagos</>}</p>
      <div className="free-road" aria-hidden="true">
        <span className="free-trail" style={{ width: `calc((100% - 48px) * ${pct / 100} + 48px)` }} />
        <span className="free-bus" style={{ left: `${pct}%`, transform: `translateX(-${pct}%)` }}><Danfo driving={driving} /></span>
        <span className="free-stop"><span>Free</span></span>
      </div>
    </div>
  );
}

export function CartLines({ onNavigate }) {
  const { items, setQty, remove } = useCart();
  return (
    <ul className="lines">
      {items.map(({ id, size, qty }) => {
        const p = getProduct(id);
        if (!p) return null;
        const max = maxQtyFor(id, size);
        return (
          <li className="line" key={`${id}-${size}`}>
            <Link href={`/product/${id}`} className="line-thumb" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
              <ProductImage src={p.images[0]} alt="" />
            </Link>
            <div className="line-mid">
              <Link href={`/product/${id}`} className="line-name" onClick={onNavigate}>{p.name}</Link>
              <p className="line-meta">{p.colour}, size {size}{qty > 1 ? `, ${naira(p.price_kobo)} each` : ""}</p>
              <div className="line-controls">
                <div className="qty" role="group" aria-label={`Quantity of ${p.name}, size ${size}`}>
                  <button type="button" onClick={() => setQty(id, size, qty - 1)} aria-label={qty === 1 ? `Remove ${p.name}` : "One less"}><MinusIcon /></button>
                  <span aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty(id, size, qty + 1)} aria-label="One more" disabled={qty >= max}><PlusIcon /></button>
                </div>
                <button type="button" className="text-btn" onClick={() => remove(id, size)}>Remove</button>
              </div>
              {qty >= max && max < 10 && <p className="low-stock">That's all we have in size {size}.</p>}
            </div>
            <span className="line-total">{naira(p.price_kobo * qty)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function CartDrawer() {
  const { open, close } = useUI();
  const { items, count, subtotal_kobo, delivery_kobo } = useCart();

  return (
    <Sheet open={open === "cart"} onClose={close} side="right" label="Your bag" className="cart-sheet">
      <div className="sheet-head">
        <p className="sheet-title">Your bag{count > 0 ? <span> {count} {count === 1 ? "item" : "items"}</span> : null}</p>
        <button type="button" className="icon-btn" onClick={close} aria-label="Close bag" data-autofocus><CloseIcon /></button>
      </div>
      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your bag is empty. Find a pair you like and tap the + to add it.</p>
          <Link href="/collections/new-in" className="btn" onClick={close}>Shop new in</Link>
        </div>
      ) : (
        <>
          <FreeDeliveryBar subtotal={subtotal_kobo} />
          <div className="cart-scroll"><CartLines onNavigate={close} /></div>
          <div className="cart-foot">
            <div className="tot-row"><span>Subtotal</span><b>{naira(subtotal_kobo)}</b></div>
            <div className="tot-row"><span>Delivery in Lagos</span><span>{delivery_kobo ? naira(delivery_kobo) : "Free"}</span></div>
            <Link href="/checkout" className="btn full" onClick={close}>Checkout</Link>
            <Link href="/cart" className="text-link" onClick={close}>Open full bag page</Link>
          </div>
        </>
      )}
    </Sheet>
  );
}
