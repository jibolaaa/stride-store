"use client";
import { useState } from "react";
import { useCart } from "../../components/CartProvider";
import { naira } from "../../lib/format";

export default function CheckoutPage() {
  const { items, subtotal_kobo } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const pay = async (e) => {
    e.preventDefault();
    if (!items.length) { setError("Your cart is empty."); return; }
    setLoading(true); setError("");
    try {
      // We send only item IDs + quantities. The SERVER recalculates the
      // amount from its own catalog: never trust prices from the browser.
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment could not be started.");
      // Paystack gives us a secure hosted payment page. Send the customer there.
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="wrap checkout-page">
      <h1>Checkout</h1>
      <form onSubmit={pay} className="checkout-grid">
        <div className="fields">
          <label>Full name<input required value={form.name} onChange={set("name")} placeholder="Your name" /></label>
          <label>Email<input required type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" /></label>
          <label>Phone<input required type="tel" value={form.phone} onChange={set("phone")} placeholder="0810 000 0000" /></label>
          <label>Delivery address<input required value={form.address} onChange={set("address")} placeholder="Street, area, Lagos" /></label>
        </div>
        <div className="summary">
          <h2>Order summary</h2>
          <div className="tot-row"><span>Items</span><span>{items.reduce((n, i) => n + i.qty, 0)}</span></div>
          <div className="tot-row"><span>Subtotal</span><b>{naira(subtotal_kobo)}</b></div>
          <div className="tot-row muted"><span>Delivery</span><span>Free (Lagos)</span></div>
          <div className="tot-row grand"><span>Total</span><b>{naira(subtotal_kobo)}</b></div>
          <button className="btn full" disabled={loading}>
            {loading ? "Starting secure payment…" : "Pay with Paystack"}
          </button>
          {error && <p className="error">{error}</p>}
          <p className="hint">Test mode: no real money moves. Secure payment by Paystack.</p>
        </div>
      </form>
    </div>
  );
}
