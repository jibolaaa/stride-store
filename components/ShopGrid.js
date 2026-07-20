"use client";
import { useState } from "react";
import { products } from "../lib/products";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

const FILTERS = ["All", "New", "Bestseller", "Limited"];

export default function ShopGrid() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  const shown = products.filter(p => {
    const matchesFilter = filter === "All" || p.tag === filter;
    const matchesQuery = !q || p.name.toLowerCase().includes(q.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const showFeatured = filter === "All" && !q;

  return (
    <>
      <div className="shop-tools">
        <div className="chips">
          {FILTERS.map(f => (
            <button key={f} className={`chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search sneakers…"
          value={q}
          onChange={e => setQ(e.target.value)}
          aria-label="Search sneakers"
        />
      </div>
      {shown.length === 0 ? (
        <p className="empty">Nothing matches "{q}". Try another search.</p>
      ) : (
        <div className="grid">
          {shown.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70} className={showFeatured && i === 0 ? "featured" : ""}>
              <ProductCard product={p} featured={showFeatured && i === 0} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
