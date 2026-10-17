"use client";
// Owner only: the till price, what the shop pays for a pair, and when a
// size should count as running low.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { naira } from "../../lib/format";

const toKobo = (v) => {
  const n = Number(String(v).replace(/[₦,\s]/g, ""));
  return v !== "" && Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
};

export default function PriceForm({ productId, price, cost, lowAt }) {
  const router = useRouter();
  const [p, setP] = useState(String(price / 100));
  const [c, setC] = useState(String(cost / 100));
  const [low, setLow] = useState(String(lowAt));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const pk = toKobo(p), ck = toKobo(c);
  const margin = pk && ck !== null ? pk - ck : null;

  async function save(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/office/products/${encodeURIComponent(productId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ price: p, cost: c, low_stock_at: Number(low) })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.replace("/office/login"); return; }
      if (!res.ok) { setMsg({ ok: false, text: data.error || "That didn't save. Try again." }); return; }
      setMsg({ ok: true, text: "Saved. New sales use this price." });
      router.refresh();
    } catch {
      setMsg({ ok: false, text: "Couldn't reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  const money = (set) => (e) => { set(e.target.value.replace(/[^0-9.,]/g, "")); setMsg(null); };
  return (
    <form className="ofc-form" onSubmit={save} noValidate>
      <div className="two">
        <label className="ofc-field">
          <span>Selling price (₦)</span>
          <input className="ofc-input" inputMode="decimal" autoComplete="off" value={p} onChange={money(setP)} />
        </label>
        <label className="ofc-field">
          <span>Shop pays (₦)</span>
          <input className="ofc-input" inputMode="decimal" autoComplete="off" value={c} onChange={money(setC)} />
        </label>
      </div>
      {margin !== null && (
        <p className="fine" aria-live="polite">
          Profit per pair: <b>{naira(margin)}</b>{pk > 0 ? ` (${Math.round((margin / pk) * 100)}% of the price)` : ""}{margin < 0 ? ". That's a loss on every pair." : ""}
        </p>
      )}
      <label className="ofc-field">
        <span>Running low at (pairs per size)</span>
        <input className="ofc-input" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={low}
          onChange={e => { setLow(e.target.value.replace(/[^0-9]/g, "").slice(0, 2)); setMsg(null); }} />
      </label>
      {msg && <p className={msg.ok ? "ofc-ok" : "ofc-error"} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
      <button type="submit" className="btn full" disabled={busy}>{busy ? "Saving…" : "Save price and cost"}</button>
      <p className="fine">This sets the price at the till. Old sales keep the price they were sold at.</p>
    </form>
  );
}
