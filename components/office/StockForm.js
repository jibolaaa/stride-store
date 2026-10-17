"use client";
// For managers and the owner: a delivery coming in, pairs written off
// (damaged, lost, stolen), or a recount of what is on the shelf.
import { useRouter } from "next/navigation";
import { useState } from "react";

const KINDS = {
  restock: { label: "Delivery", amount: "Pairs that came in", note: "Supplier or invoice number (optional)" },
  writeoff: { label: "Write off", amount: "Pairs to take out", note: "What happened, like \"damaged sole\"" },
  count: { label: "Recount", amount: "Pairs counted on the shelf", note: "Anything to add (optional)" }
};
const pairs = (n) => `${n} ${n === 1 ? "pair" : "pairs"}`;

export default function StockForm({ productId, sizes }) {
  const router = useRouter();
  const [kind, setKind] = useState("restock");
  const [size, setSize] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const current = sizes.find(s => String(s.size) === size)?.qty;
  const n = amount === "" ? null : Number(amount);
  const valid = n !== null && Number.isInteger(n) && n >= 0 && n <= 500;
  const after = !size || !valid ? null : kind === "restock" ? current + n : kind === "writeoff" ? current - n : n;

  async function save(e) {
    e.preventDefault();
    if (busy) return;
    if (!size) return setMsg({ ok: false, text: "Choose a size." });
    if (!valid || (kind !== "count" && n === 0)) return setMsg({ ok: false, text: "Enter a number of pairs, like 3." });
    if (kind === "writeoff" && n > current) return setMsg({ ok: false, text: `Size ${size} only has ${pairs(current)} to write off.` });
    if (kind === "writeoff" && !note.trim()) return setMsg({ ok: false, text: "Say why these pairs are written off, like \"damaged sole\"." });
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/office/stock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product_id: productId, size: Number(size), reason: kind, amount: n, note })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.replace("/office/login"); return; }
      if (!res.ok) { setMsg({ ok: false, text: data.error || "That didn't save. Try again." }); return; }
      setMsg({
        ok: true,
        text: data.unchanged ? `The count matches: size ${size} has ${pairs(data.qty)}. Nothing changed.` : `Saved. Size ${size} now has ${pairs(data.qty)}.`
      });
      setAmount("");
      setNote("");
      router.refresh();
    } catch {
      setMsg({ ok: false, text: "Couldn't reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  const k = KINDS[kind];
  return (
    <form className="ofc-form" onSubmit={save} noValidate>
      <div className="ofc-field">
        <span id="kind-label">What happened</span>
        <div className="seg" role="group" aria-labelledby="kind-label">
          {Object.entries(KINDS).map(([v, { label }]) => (
            <button key={v} type="button" aria-pressed={kind === v} onClick={() => { setKind(v); setMsg(null); }}>{label}</button>
          ))}
        </div>
      </div>
      <label className="ofc-field">
        <span>Size</span>
        <select className="ofc-select" value={size} onChange={e => { setSize(e.target.value); setMsg(null); }}>
          <option value="">Choose a size</option>
          {sizes.map(s => <option key={s.size} value={String(s.size)}>{s.size} ({pairs(s.qty)} now)</option>)}
        </select>
      </label>
      <label className="ofc-field">
        <span>{k.amount}</span>
        <input className="ofc-input" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={amount}
          onChange={e => { setAmount(e.target.value.replace(/[^0-9]/g, "").slice(0, 3)); setMsg(null); }} placeholder="0" />
      </label>
      {after !== null && after >= 0 && <p className="fine" aria-live="polite">Size {size} goes from {pairs(current)} to {pairs(after)}.</p>}
      <label className="ofc-field">
        <span>Note</span>
        <input className="ofc-input" value={note} onChange={e => setNote(e.target.value)} maxLength={200} placeholder={k.note} />
      </label>
      {msg && <p className={msg.ok ? "ofc-ok" : "ofc-error"} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
      <button type="submit" className="btn full" disabled={busy}>{busy ? "Saving…" : "Save change"}</button>
    </form>
  );
}
