"use client";
// The till. Tap a shoe, pick the size, add more pairs if the customer
// wants them, choose how they paid, then complete the sale. The server takes
// the pairs out of stock in the same step, so the counts here are always real.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import Sheet from "../Sheet";
import ProductImage from "../ProductImage";
import { CheckIcon, CloseIcon, MinusIcon, PlusIcon, SearchIcon } from "../Icons";
import { naira } from "../../lib/format";
import { PAYMENT_LABEL, pairsText } from "../../lib/office/labels";

const GROUPS = [["all", "All"], ["men", "Men"], ["women", "Women"], ["unisex", "Unisex"], ["kids", "Kids"]];

// A code for each sale, so a retry on a bad connection can't record it twice.
const newRef = () => {
  try { return crypto.randomUUID(); } catch { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`; }
};

export default function SellScreen({ products }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [pickId, setPickId] = useState(null);
  const [lines, setLines] = useState([]); // { id, size, qty }
  const [payment, setPayment] = useState(null);
  const [note, setNote] = useState("");
  const [ref, setRef] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const byId = useMemo(() => Object.fromEntries(products.map(p => [p.id, p])), [products]);
  const stockOf = (id, size) => byId[id]?.sizes.find(s => s.size === size)?.qty ?? 0;
  const inSale = (id, size) => lines.reduce((n, l) => n + (l.id === id && (size === undefined || l.size === size) ? l.qty : 0), 0);
  const leftOf = (p) => p.total - inSale(p.id);

  // Lines for products that are no longer sold drop out when the list refreshes.
  useEffect(() => { setLines(ls => ls.filter(l => byId[l.id])); }, [byId]);

  const q = query.trim().toLowerCase();
  const shown = products.filter(p =>
    (group === "all" || p.gender === group) && (!q || `${p.name} ${p.colour}`.toLowerCase().includes(q))
  );
  const total = lines.reduce((n, l) => n + (byId[l.id]?.price_kobo ?? 0) * l.qty, 0);
  const pairs = lines.reduce((n, l) => n + l.qty, 0);

  const addLine = (id, size, qty) => {
    setDone(null);
    setError("");
    if (!ref) setRef(newRef());
    setLines(ls => {
      const i = ls.findIndex(l => l.id === id && l.size === size);
      if (i === -1) return [...ls, { id, size, qty }];
      return ls.map((l, j) => j === i ? { ...l, qty: l.qty + qty } : l);
    });
  };
  const setQty = (k, qty) => setLines(ls => qty < 1 ? ls.filter((_, j) => j !== k) : ls.map((l, j) => j === k ? { ...l, qty } : l));
  const clear = () => { setLines([]); setPayment(null); setNote(""); setError(""); setRef(null); };

  async function complete() {
    if (!lines.length || sending) return;
    if (!payment) { setError("Choose how the customer paid."); return; }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/office/sales", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: lines.map(l => ({ product_id: l.id, size: l.size, qty: l.qty })), payment, note, ref })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.replace("/office/login"); return; }
      if (!res.ok) {
        setError(data.error || "The sale didn't go through. Try again.");
        router.refresh();
        return;
      }
      setDone({ id: data.id, total: data.total, pairs: data.pairs, payment, again: data.again });
      setLines([]); setPayment(null); setNote(""); setRef(null);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Tap Complete sale again when you're back online; it won't be recorded twice.");
    } finally {
      setSending(false);
    }
  }

  const panelProps = {
    lines, byId, stockOf, setQty, total, pairs, payment, note, setNote, error, sending, complete, clear, done,
    setPayment: (p) => { setPayment(p); setError(""); },
    newSale: () => { setDone(null); setReviewOpen(false); }
  };

  const picking = pickId ? byId[pickId] : null;

  return (
    <div className="sell">
      <section aria-labelledby="sell-title">
        <div className="ofc-head">
          <div>
            <h1 className="ofc-title" id="sell-title">Sell</h1>
            <p className="ofc-sub">Tap a shoe, pick the size, then complete the sale.</p>
          </div>
        </div>
        <div className="sell-tools">
          <label className="ofc-search">
            <SearchIcon aria-hidden="true" />
            <span className="sr-only">Search shoes</span>
            <input className="ofc-input" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or colour" enterKeyHint="search" />
          </label>
          <div className="chips" role="group" aria-label="Show">
            {GROUPS.map(([g, label]) => (
              <button key={g} type="button" className={`chip ${group === g ? "on" : ""}`} aria-pressed={group === g} onClick={() => setGroup(g)}>{label}</button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? (
          <p className="ofc-ok">No shoes match "{query}". Try another name or colour.</p>
        ) : (
          <ul className="sell-grid" role="list">
            {shown.map(p => {
              const left = leftOf(p);
              return (
                <li key={p.id}>
                  <button type="button" className="tile" disabled={left <= 0} onClick={() => setPickId(p.id)}
                    aria-label={`${p.name}, ${p.colour}, ${naira(p.price_kobo)}, ${left > 0 ? `${left} left` : "sold out"}`}>
                    <span className="tile-img">
                      <ProductImage src={p.image} alt="" />
                      {left <= 0 ? <span className="pill dark">Sold out</span> : left <= 3 ? <span className="pill yellow">{left} left</span> : null}
                    </span>
                    <span className="tile-text">
                      <b>{p.name}</b>
                      <span>{p.colour}</span>
                      <em>{naira(p.price_kobo)}</em>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <aside className="sale-side" aria-label="This sale"><SalePanel {...panelProps} /></aside>

      {(lines.length > 0 || done) && (
        <div className="sale-bar">
          {done && !lines.length ? (
            <>
              <div><span>Sale #{done.id} saved</span><b>{naira(done.total)}</b></div>
              <button type="button" className="btn small" onClick={() => setReviewOpen(true)}>View</button>
            </>
          ) : (
            <>
              <div><span>{pairsText(pairs)} in this sale</span><b>{naira(total)}</b></div>
              <button type="button" className="btn small" onClick={() => setReviewOpen(true)}>Review and pay</button>
            </>
          )}
        </div>
      )}

      <Sheet open={reviewOpen} onClose={() => setReviewOpen(false)} side="bottom" label="This sale">
        <div className="sheet-head">
          <p className="sheet-title">This sale</p>
          <button type="button" className="icon-btn" onClick={() => setReviewOpen(false)} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="sheet-pad"><SalePanel {...panelProps} inSheet /></div>
      </Sheet>

      <PickSheet
        product={picking}
        onClose={() => setPickId(null)}
        leftIn={(size) => stockOf(pickId, size) - inSale(pickId, size)}
        onAdd={(size, qty) => { addLine(pickId, size, qty); setPickId(null); }}
      />
    </div>
  );
}

// Choose a size and how many, for one shoe.
function PickSheet({ product, onClose, leftIn, onAdd }) {
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  useEffect(() => { setSize(null); setQty(1); setError(false); }, [product?.id]);
  const max = size ? leftIn(size) : 1;

  return (
    <Sheet open={!!product} onClose={onClose} side="bottom" label={product ? `Add ${product.name} to the sale` : "Add to sale"} className="quick">
      {product && (
        <>
          <div className="quick-head">
            <div className="quick-thumb"><ProductImage src={product.image} alt="" /></div>
            <div className="quick-info">
              <p className="quick-name">{product.name}</p>
              <p className="quick-colour">{product.colour}</p>
              <p>{naira(product.price_kobo)}</p>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          </div>
          <fieldset className="size-pick">
            <legend className="opt-label">Size <span>EU, with pairs left</span></legend>
            <div className="size-grid">
              {product.sizes.map(({ size: s }) => {
                const left = leftIn(s);
                return (
                  <button key={s} type="button" className={`size ${size === s ? "on" : ""}`} disabled={left <= 0}
                    aria-pressed={size === s} aria-label={left > 0 ? `Size ${s}, ${left} left` : `Size ${s}, none left`}
                    onClick={() => { setSize(s); setQty(1); setError(false); }}>
                    {s}<span className="size-left" aria-hidden="true">{left > 0 ? `${left} left` : "none"}</span>
                  </button>
                );
              })}
            </div>
            {error && <p className="field-error" role="alert">Choose a size first.</p>}
          </fieldset>
          <div className="qty-row">
            <span className="opt-label">How many</span>
            <div className="qty">
              <button type="button" onClick={() => setQty(n => Math.max(1, n - 1))} disabled={qty <= 1} aria-label="One fewer"><MinusIcon /></button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty(n => Math.min(max, n + 1))} disabled={!size || qty >= max} aria-label="One more"><PlusIcon /></button>
            </div>
          </div>
          <button type="button" className="btn full" onClick={() => size ? onAdd(size, qty) : setError(true)}>
            Add to sale{size ? `, ${naira(product.price_kobo * qty)}` : ""}
          </button>
        </>
      )}
    </Sheet>
  );
}

// The sale so far: lines, payment, note and the button that records it.
function SalePanel({ lines, byId, stockOf, setQty, total, pairs, payment, setPayment, note, setNote, error, sending, complete, clear, done, newSale, inSheet = false }) {
  const noteId = useId();

  if (done && !lines.length) {
    return (
      <div className="done" role="status">
        <span className="tick"><CheckIcon aria-hidden="true" /></span>
        <h2 className="panel-title">Sale #{done.id} saved</h2>
        <p className="muted">
          {done.again
            ? "This sale had already gone through before the connection dropped, so it was only recorded once. Check the receipt."
            : `${pairsText(done.pairs)}, ${naira(done.total)}, paid by ${done.payment}. Stock is updated.`}
        </p>
        <div className="ofc-row">
          <Link className="btn small" href={`/office/sales/${done.id}`}>View receipt</Link>
          <button type="button" className="btn small outline" onClick={newSale}>New sale</button>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="sale-panel">
        <h2 className="panel-title">This sale</h2>
        <p className="muted">Nothing yet. Tap a shoe to add it.</p>
      </div>
    );
  }

  return (
    <div className="sale-panel">
      <div className="panel-head">
        {inSheet ? <span className="muted">{pairsText(pairs)}</span> : <h2 className="panel-title">This sale</h2>}
        <button type="button" className="text-btn" onClick={clear}>Clear sale</button>
      </div>
      <ul className="sale-lines">
        {lines.map((l, k) => {
          const p = byId[l.id];
          if (!p) return null;
          const stock = stockOf(l.id, l.size);
          return (
            <li key={`${l.id}:${l.size}`}>
              <div className="item-text">
                <b>{p.name}</b>
                <span>{p.colour}, size {l.size}</span>
                {l.qty > stock && <span className="line-warn">Only {stock} left now</span>}
              </div>
              <div className="item-end">{naira(p.price_kobo * l.qty)}</div>
              <div className="qty">
                <button type="button" onClick={() => setQty(k, l.qty - 1)} aria-label={l.qty === 1 ? `Remove ${p.name} size ${l.size}` : "One fewer"}>
                  {l.qty === 1 ? <CloseIcon /> : <MinusIcon />}
                </button>
                <span>{l.qty}</span>
                <button type="button" onClick={() => setQty(k, l.qty + 1)} disabled={l.qty >= stock || l.qty >= 20} aria-label="One more"><PlusIcon /></button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="sale-total"><span>Total, {pairsText(pairs)}</span><span>{naira(total)}</span></div>
      <div className="ofc-field">
        <span>Paid by</span>
        <div className="seg" role="group" aria-label="Paid by">
          {Object.entries(PAYMENT_LABEL).map(([v, label]) => (
            <button key={v} type="button" aria-pressed={payment === v} onClick={() => setPayment(v)}>{label}</button>
          ))}
        </div>
      </div>
      <label className="ofc-field" htmlFor={noteId}>
        <span>Note <span className="muted">(optional)</span></span>
        <input id={noteId} className="ofc-input" value={note} onChange={e => setNote(e.target.value)} maxLength={200} placeholder="Customer's name or phone" />
      </label>
      {error && <p className="ofc-error" role="alert">{error}</p>}
      <button type="button" className="btn full" onClick={complete} disabled={sending}>
        {sending ? "Saving the sale…" : `Complete sale, ${naira(total)}`}
      </button>
    </div>
  );
}
