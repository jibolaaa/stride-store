"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";

function SuccessInner() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const { clear } = useCart();
  const [state, setState] = useState({ status: "checking" });

  useEffect(() => {
    if (!reference) { setState({ status: "missing" }); return; }
    // Ask OUR server to confirm with Paystack. The browser is never
    // trusted to declare a payment successful on its own.
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") { clear(); setState({ status: "success", amount: d.amount_display }); }
        else setState({ status: "failed", detail: d.detail });
      })
      .catch(() => setState({ status: "failed" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (state.status === "checking") return <p className="empty">Confirming your payment…</p>;
  if (state.status === "missing") return <p className="empty">No payment reference found.</p>;

  if (state.status === "success") return (
    <div className="center-col">
      <div className="check">✓</div>
      <h1>Payment confirmed</h1>
      <p className="sub">Thank you for your order{state.amount ? ` of ${state.amount}` : ""}. A confirmation has been recorded.</p>
      <Link className="btn" href="/">Continue shopping</Link>
    </div>
  );

  return (
    <div className="center-col">
      <div className="check fail">✕</div>
      <h1>Payment not completed</h1>
      <p className="sub">{state.detail || "The payment was not successful. You have not been charged."}</p>
      <Link className="btn" href="/cart">Back to cart</Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="wrap">
      <Suspense fallback={<p className="empty">Loading…</p>}>
        <SuccessInner />
      </Suspense>
    </div>
  );
}
