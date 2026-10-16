"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";

function Result() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const { clear } = useCart();
  const [state, setState] = useState({ status: "checking" });

  useEffect(() => {
    if (!reference) { setState({ status: "missing" }); return; }
    // Our server asks Paystack directly whether this payment went through.
    // The browser alone can't mark an order as paid.
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") { clear(); setState({ status: "success", amount: d.amount_display }); }
        else setState({ status: "failed", detail: d.detail });
      })
      .catch(() => setState({ status: "failed", detail: "We couldn't reach the payment check. Your cart is saved; try again in a moment." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (state.status === "checking") {
    return (
      <div className="result" aria-busy="true">
        <div className="spinner" aria-hidden="true" />
        <h1>Checking your payment</h1>
        <p>This takes a few seconds. Don't close the page.</p>
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <div className="result">
        <h1>No payment to check</h1>
        <p>This page opens after you pay on Paystack. If you were charged, WhatsApp us with your receipt.</p>
        <Link className="btn" href="/cart">Go to cart</Link>
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <div className="result ok">
        <div className="mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1>Payment received</h1>
        <p>Thanks for your order{state.amount ? ` of ${state.amount}` : ""}. We'll call you to arrange delivery within 1 to 2 working days.</p>
        <p className="ref">Order reference <b>{reference}</b></p>
        <Link className="btn" href="/#shop">Keep shopping</Link>
      </div>
    );
  }

  return (
    <div className="result fail">
      <div className="mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
      </div>
      <h1>Payment didn't go through</h1>
      <p>{state.detail || "Paystack didn't confirm the payment."} You have not been charged, and your cart is still saved.</p>
      <Link className="btn" href="/checkout">Try paying again</Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="wrap page-narrow">
      <Suspense fallback={null}>
        <Result />
      </Suspense>
    </div>
  );
}
