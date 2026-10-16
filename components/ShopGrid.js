"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "../lib/products";
import ProductCard from "./ProductCard";

const FILTERS = ["All", "New", "Bestseller", "Limited"];

export default function ShopGrid() {
  const params = useSearchParams();
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  // Footer links like /?filter=New open the shop already filtered.
  useEffect(() => {
    const f = params.get("filter");
    if (f && FILTERS.includes(f)) setFilter(f);
  }, [params]);

  const query = q.trim().toLowerCase();
  const shown = products.filter(p =>
    (filter === "All" || p.tag === filter) && (!query || p.name.toLowerCase().includes(query))
  );

  return (
    <>
      <div className="shop-tools">
        <div className="chips" role="group" aria-label="Filter sneakers">
          {FILTERS.map(f => (
            <button key={f} className={`chip ${filter === f ? "on" : ""}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "All" ? "All" : f === "New" ? "New in" : f}
            </button>
          ))}
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search by name"
          value={q}
          onChange={e => setQ(e.target.value)}
          aria-label="Search sneakers by name"
        />
      </div>
      <p className="result-count" aria-live="polite">{shown.length} {shown.length === 1 ? "style" : "styles"}</p>
      {shown.length === 0 ? (
        <div className="empty">
          <p>No sneakers match “{q.trim()}”{filter !== "All" ? ` in ${filter}` : ""}.</p>
          <button className="btn ghost" onClick={() => { setQ(""); setFilter("All"); }}>Show all sneakers</button>
        </div>
      ) : (
        <div className="grid">
          {shown.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)}
        </div>
      )}
    </>
  );
}
