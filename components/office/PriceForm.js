"use client";
// Owner only: the till price, what the shop pays the supplier for a pair,
// and when a size should count as running low. Shows what will change and
// asks before saving.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { naira } from "../../lib/format";
import ConfirmBox from "./ConfirmBox";

const toKobo = (v) => {
  const n = Number(String(v).replace(/[₦,\s]/g, ""));
  return v !== "" && Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
};
const pairs = (n) => `${n} ${n === 1 ? "pair" : "pairs"}`;

export default function PriceForm({ productId, price, cost, lowAt }) {
  const router = useRouter();
  const [p, setP] = useState(String(price / 100));
  const [c, setC] = useState(String(cost / 100));
  const [low, setLow] = useState(String(lowAt));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [changes, setChanges] = useState(null);
  const [saveError, setSaveError] = useState("");

  const pk = toKobo(p), ck = toKobo(c), lowN = low === "" ? null : Number(low);
  const margin = pk && ck !== null ? pk - ck : null;
  const edit = (set) => (e) => { set(e.target.value); setMsg(null); setChanges(null); };

  function review(e) {
    e.preventDefault();
    if (!pk) return setMsg({ ok: false, text: "Enter a selling price in naira, like 68000." });
    if (ck === null) return setMsg({ ok: false, text: "Enter what the shop pays, in naira (0 if you don't know)." });
    if (lowN === null || lowN > 50) return setMsg({ ok: false, text: "Running low at: enter a number from 0 to 50." });
    const list = [];
    if (pk !== price) list.push(`Selling price from ${naira(price)} to ${naira(pk)}`);
    if (ck !== cost) list.push(`Shop pays from ${naira(cost)} to ${naira(ck)}`);
    if (lowN !== lowAt) list.push(`Running low at from ${pairs(lowAt)} to ${pairs(lowN)}`);
    if (!list.length) return setMsg({ ok: true, text: "Nothing has changed." });
    setMsg(null);
    setChanges(list);
  }

  async function save() {
    if (busy) return;
    setBusy(true);
    setSaveError("");
    try {
      const res = await fetch(`/api/office/products/${encodeURIComponent(productId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ price: p, cost: c, low_stock_at: lowN })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.replace("/office/login"); return; }
      if (!res.ok) { setSaveError(data.error || "That didn't save. Try again."); return; }
      setChanges(null);
      setMsg({ ok: true, text: "Saved. New sales use this price." });
      router.refresh();
    } catch {
      setSaveError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="ofc-form" onSubmit={review} noValidate>
      <fieldset className="plain" disabled={!!changes}>
        <div className="ofc-form">
          <label className="ofc-field">
            <span>Selling price (₦)</span>
            <small className="field-help">What the customer pays</small>
            <input className="ofc-input" inputMode="decimal" autoComplete="off" value={p} onChange={edit(v => setP(v.replace(/[^0-9.,]/g, "")))} />
          </label>
          <label className="ofc-field">
            <span>Shop pays (₦)</span>
            <small className="field-help">What STRIDE paid the supplier for one pair</small>
            <input className="ofc-input" inputMode="decimal" autoComplete="off" value={c} onChange={edit(v => setC(v.replace(/[^0-9.,]/g, "")))} />
          </label>
          {margin !== null && (
            <p className="fine" aria-live="polite">
              Profit per pair: <b>{naira(margin)}</b>{pk > 0 ? ` (${Math.round((margin / pk) * 100)}% of the price)` : ""}{margin < 0 ? ". That's a loss on every pair." : ""}
            </p>
          )}
          <label className="ofc-field">
            <span>Running low at</span>
            <small className="field-help">A size turns yellow when it has this many pairs or fewer</small>
            <input className="ofc-input" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={low}
              onChange={edit(v => setLow(v.replace(/[^0-9]/g, "").slice(0, 2)))} />
          </label>
        </div>
      </fieldset>
      {msg && <p className={msg.ok ? "ofc-ok" : "ofc-error"} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
      {changes ? (
        <ConfirmBox question="Save these changes?" yes="Yes, save them" onYes={save} onNo={() => { setChanges(null); setSaveError(""); }} busy={busy} error={saveError}>
          <ul>{changes.map(t => <li key={t}>{t}</li>)}</ul>
          <p className="fine">Sales already made keep the price they were sold at.</p>
        </ConfirmBox>
      ) : (
        <button type="submit" className="btn full">Review the change</button>
      )}
    </form>
  );
}
