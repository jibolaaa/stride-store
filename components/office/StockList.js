"use client";
// Every shoe with its pairs per size. Yellow sizes are running low, black
// ones are sold out. Filter to just the ones that need a restock.
import Link from "next/link";
import { useState } from "react";
import ProductImage from "../ProductImage";
import { SearchIcon } from "../Icons";

const status = (p) => ({
  out: p.sizes.filter(s => s.qty === 0).length,
  low: p.sizes.filter(s => s.qty > 0 && s.qty <= p.low_stock_at).length
});
const FILTERS = [["all", "All"], ["restock", "Needs restock"], ["out", "Sold out sizes"]];

export default function StockList({ products, initialShow = "all" }) {
  const [show, setShow] = useState(initialShow);
  const [query, setQuery] = useState("");
  const withStatus = products.map(p => ({ ...p, ...status(p) }));
  const q = query.trim().toLowerCase();
  const shown = withStatus.filter(p =>
    (show === "all" || (show === "restock" ? p.low + p.out > 0 : p.out > 0)) && (!q || `${p.name} ${p.colour}`.toLowerCase().includes(q))
  );

  return (
    <>
      <div className="sell-tools">
        <label className="ofc-search">
          <SearchIcon aria-hidden="true" />
          <span className="sr-only">Search stock</span>
          <input className="ofc-input" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or colour" enterKeyHint="search" />
        </label>
        <div className="chips" role="group" aria-label="Show">
          {FILTERS.map(([v, label]) => (
            <button key={v} type="button" className={`chip ${show === v ? "on" : ""}`} aria-pressed={show === v} onClick={() => setShow(v)}>{label}</button>
          ))}
        </div>
      </div>
      <p className="stock-key muted">
        Each box is a size and its pairs left. <i aria-hidden="true" />Running low <i className="out" aria-hidden="true" />Sold out
      </p>
      {shown.length === 0 ? (
        <p className="ofc-ok">{q ? `No shoes match "${query}".` : "Nothing here. Every size is well stocked."}</p>
      ) : (
        <ul className="list">
          {shown.map(p => {
            const label = `${p.name}, ${p.colour}: ${p.total} pairs${p.out ? `, ${p.out} ${p.out === 1 ? "size" : "sizes"} sold out` : ""}${p.low ? `, ${p.low} running low` : ""}`;
            return (
              <li key={p.id}>
                <Link className="item no-img-end stock-item" href={`/office/stock/${p.id}`} aria-label={label}>
                  <span className="item-img"><ProductImage src={p.image} alt="" /></span>
                  <span className="item-text">
                    <b>{p.name}</b>
                    <span>{p.colour} · {p.total} {p.total === 1 ? "pair" : "pairs"}</span>
                    <span className="size-chips" aria-hidden="true">
                      {p.sizes.map(s => (
                        <span key={s.size} className={`size-chip ${s.qty === 0 ? "out" : s.qty <= p.low_stock_at ? "low" : ""}`}>
                          <small>{s.size}</small><b>{s.qty}</b>
                        </span>
                      ))}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
