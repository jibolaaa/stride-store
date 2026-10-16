"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../components/CartProvider";
import { getProduct } from "../../lib/products";
import { naira } from "../../lib/format";
import { checkCustomer } from "../../lib/validate";

const FIELDS = [
  { key: "name", label: "Full name", type: "text", autoComplete: "name", placeholder: "Ada Okafor" },
  { key: "phone", label: "Phone number", type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "0810 000 0000", hint: "The rider calls this number before delivery." },
  { key: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", placeholder: "you@example.com", hint: "Your receipt goes here." },
  { key: "address", label: "Delivery address", type: "text", autoComplete: "street-address", placeholder: "12 Herbert Macaulay Way, Yaba", hint: "Street, area and any landmark. Lagos only." }
];

export default function CheckoutPage() {
  const { items, count, subtotal_kobo, loaded } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = checkCustomer(form);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (!loaded) return <div className="wrap page-narrow" aria-busy="true" />;

  if (!items.length) {
    return (
      <div className="wrap page-narrow empty-state">
        <h1>Nothing to check out</h1>
        <p>Your cart is empty. Add a pair first.</p>
        <Link className="btn" href="/#shop">Shop sneakers</Link>
      </div>
    );
  }

  const pay = async (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, address: true });
    if (Object.keys(errors).length) {
      document.getElementById(`f-${Object.keys(errors)[0]}`)?.focus();
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      // Only ids, sizes and quantities go to the server. It works out the
      // amount from its own price list, so nobody can change the price.
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment could not start. Try again.");
      window.location.href = data.authorization_url;
    } catch (err) {
      setServerError(err.message === "Failed to fetch" ? "No connection. Check your internet and try again." : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="wrap checkout">
      <h1>Checkout</h1>
      <form onSubmit={pay} className="checkout-grid" noValidate>
        <fieldset className="fields" disabled={loading}>
          <legend>Delivery details</legend>
          {FIELDS.map(f => {
            const err = touched[f.key] && errors[f.key];
            return (
              <div className={`field ${err ? "has-error" : ""}`} key={f.key}>
                <label htmlFor={`f-${f.key}`}>{f.label}</label>
                <input
                  id={`f-${f.key}`}
                  type={f.type}
                  inputMode={f.inputMode}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={set(f.key)}
                  onBlur={() => setTouched(t => ({ ...t, [f.key]: true }))}
                  aria-invalid={!!err}
                  aria-describedby={`d-${f.key}`}
                />
                <p className="field-note" id={`d-${f.key}`}>{err || f.hint || ""}</p>
              </div>
            );
          })}
        </fieldset>

        <aside className="summary" aria-labelledby="sum-title">
          <h2 id="sum-title">Your order <span>{count} {count === 1 ? "item" : "items"}</span></h2>
          <ul className="sum-lines">
            {items.map(({ id, size, qty }) => {
              const p = getProduct(id);
              if (!p) return null;
              return (
                <li key={`${id}-${size}`}>
                  <span>{p.name}<small>Size {size}, quantity {qty}</small></span>
                  <span>{naira(p.price_kobo * qty)}</span>
                </li>
              );
            })}
          </ul>
          <div className="tot-row"><span>Delivery in Lagos</span><span>Free</span></div>
          <div className="tot-row grand"><span>Total</span><b>{naira(subtotal_kobo)}</b></div>
          <button className="btn full pay-btn" disabled={loading}>
            {loading ? "Opening Paystack…" : `Pay ${naira(subtotal_kobo)}`}
          </button>
          {serverError && <p className="form-error" role="alert">{serverError}</p>}
          <p className="note center">You will pay on Paystack's secure page. This is a demo, so use Paystack's test card and no real money moves.</p>
        </aside>
      </form>
    </div>
  );
}
