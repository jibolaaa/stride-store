"use client";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import { CartLines, FreeDeliveryBar } from "../../components/CartDrawer";
import { naira } from "../../lib/format";

export default function CartPage() {
  const { items, count, subtotal_kobo, delivery_kobo, total_kobo, loaded } = useCart();

  if (!loaded) return <div className="wrap page" aria-busy="true" />;

  if (!items.length) {
    return (
      <div className="wrap page empty-state">
        <h1 className="page-title">Your bag is empty</h1>
        <p>Pick a pair and it will show up here.</p>
        <div className="empty-actions">
          <Link className="btn" href="/collections/new-in">Shop new in</Link>
          <Link className="btn outline" href="/collections/all">All sneakers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1 className="page-title">Your bag</h1>
        <p className="page-sub">{count} {count === 1 ? "item" : "items"}</p>
      </div>
      <div className="cart-layout">
        <div className="cart-main">
          <FreeDeliveryBar subtotal={subtotal_kobo} />
          <CartLines />
        </div>
        <aside className="summary" aria-labelledby="sum-title">
          <h2 id="sum-title" className="summary-title">Order summary</h2>
          <div className="tot-row"><span>Subtotal</span><span>{naira(subtotal_kobo)}</span></div>
          <div className="tot-row"><span>Delivery in Lagos</span><span>{delivery_kobo ? naira(delivery_kobo) : "Free"}</span></div>
          <div className="tot-row grand"><span>Total</span><b>{naira(total_kobo)}</b></div>
          <Link className="btn full" href="/checkout">Checkout</Link>
          <p className="note">Pay by card, bank transfer or USSD on Paystack's secure page.</p>
          <Link href="/collections/all" className="text-link">Keep shopping</Link>
        </aside>
      </div>
    </div>
  );
}
