"use client";
// For managers and the owner: a delivery coming in, pairs written off
// (damaged, lost, stolen), or a recount of what is on the shelf. Nothing is
// saved until the person confirms what will change.
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmBox from "./ConfirmBox";

const KINDS = {
  restock: { label: "Delivery", help: "New pairs came in from the supplier", amount: "How many pairs came in?", note: "Supplier or invoice number (optional)" },
  writeoff: { label: "Write off", help: "Pairs damaged, lost or stolen, so they can't be sold", amount: "How many pairs to take out?", note: "What happened, like \"damaged sole\"" },
  count: { label: "Recount", help: "You counted the shelf and the number is different", amount: "How many pairs are on the shelf?", note: "Anything to add (optional)" }
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
  const [confirming, setConfirming] = useState(false);
  const [saveError, setSaveError] = useState("");

  const current = sizes.find(s => String(s.size) === size)?.qty;
  const n = amount === "" ? null : Number(amount);
  const valid = n !== null && Number.isInteger(n) && n >= 0 && n <= 500;
  const after = !size || !valid ? null : kind === "restock" ? current + n : kind === "writeoff" ? current - n : n;
  const reset = () => { setMsg(null); setConfirming(false); setSaveError(""); };

  // Step 1: check the form, then show what will change.
  function review(e) {
    e.preventDefault();
    if (!size) return setMsg({ ok: false, text: "Choose a size." });
    if (!valid || (kind !== "count" && n === 0)) return setMsg({ ok: false, text: "Enter a number of pairs, like 3." });
    if (kind === "writeoff" && n > current) return setMsg({ ok: false, text: `Size ${size} only has ${pairs(current)} to write off.` });
    if (kind === "writeoff" && !note.trim()) return setMsg({ ok: false, text: "Say why these pairs are written off, like \"damaged sole\"." });
    if (kind === "count" && n === current) return setMsg({ ok: true, text: `That matches: size ${size} already has ${pairs(current)}. Nothing to change.` });
    setMsg(null);
    setConfirming(true);
  }

  // Step 2: save it.
  async function save() {
    if (busy) return;
    setBusy(true);
    setSaveError("");
    try {
      const res = await fetch("/api/office/stock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product_id: productId, size: Number(size), reason: kind, amount: n, note })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.replace("/office/login"); return; }
      if (!res.ok) { setSaveError(data.error || "That didn't save. Try again."); return; }
      setConfirming(false);
      setMsg({ ok: true, text: data.unchanged ? `The count matches: size ${size} has ${pairs(data.qty)}. Nothing changed.` : `Saved. Size ${size} now has ${pairs(data.qty)}.` });
      setAmount("");
      setNote("");
      router.refresh();
    } catch {
      setSaveError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const k = KINDS[kind];
  const question = kind === "restock" ? `Add ${pairs(n ?? 0)} to size ${size}?`
    : kind === "writeoff" ? `Take ${pairs(n ?? 0)} of size ${size} out of stock?`
    : `Set size ${size} to ${pairs(n ?? 0)}?`;

  return (
    <form className="ofc-form" onSubmit={review} noValidate>
      <fieldset className="choices" disabled={confirming}>
        <legend>What happened?</legend>
        {Object.entries(KINDS).map(([v, { label, help }]) => (
          <label key={v} className="choice">
            <input type="radio" name="stock-kind" value={v} checked={kind === v} onChange={() => { setKind(v); reset(); }} />
            <span><b>{label}</b><span>{help}</span></span>
          </label>
        ))}
      </fieldset>
      <fieldset className="plain" disabled={confirming}>
        <div className="ofc-form">
          <label className="ofc-field">
            <span>Size</span>
            <select className="ofc-select" value={size} onChange={e => { setSize(e.target.value); reset(); }}>
              <option value="">Choose a size</option>
              {sizes.map(s => <option key={s.size} value={String(s.size)}>{s.size} ({pairs(s.qty)} now)</option>)}
            </select>
          </label>
          <label className="ofc-field">
            <span>{k.amount}</span>
            <input className="ofc-input" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={amount}
              onChange={e => { setAmount(e.target.value.replace(/[^0-9]/g, "").slice(0, 3)); reset(); }} placeholder="0" />
          </label>
          <label className="ofc-field">
            <span>Note</span>
            <input className="ofc-input" value={note} onChange={e => { setNote(e.target.value); reset(); }} maxLength={200} placeholder={k.note} />
          </label>
        </div>
      </fieldset>
      {msg && <p className={msg.ok ? "ofc-ok" : "ofc-error"} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
      {confirming ? (
        <ConfirmBox question={question} yes="Yes, save it" onYes={save} onNo={() => { setConfirming(false); setSaveError(""); }} busy={busy} error={saveError}>
          <p>Size {size} goes from {pairs(current)} to {pairs(after)}.{kind === "count" ? ` The difference (${after - current > 0 ? "+" : ""}${after - current}) is saved as a recount.` : ""}</p>
          {note.trim() && <p>Note: {note.trim()}</p>}
          <p className="fine">Saved under your name with today's date and time.</p>
        </ConfirmBox>
      ) : (
        <button type="submit" className="btn full">Review the change</button>
      )}
    </form>
  );
}
