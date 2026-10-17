"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sheet from "./Sheet";
import { useUI } from "./UIProvider";
import { products, genderLabel } from "../lib/products";
import { matchesQuery } from "../lib/filters";
import { naira } from "../lib/format";
import ProductImage from "./ProductImage";
import { CloseIcon, SearchIcon } from "./Icons";


const POPULAR = ["White", "Running", "Kids", "Red", "High"];

export default function SearchOverlay() {
  const { open, close } = useUI();
  const router = useRouter();
  const [q, setQ] = useState("");
  const isOpen = open === "search";
  useEffect(() => { if (!isOpen) setQ(""); }, [isOpen]);

  const query = q.trim();
  const results = query ? products.filter(p => matchesQuery(p, query)) : [];

  const submit = (e) => {
    e.preventDefault();
    if (!query) return;
    close();
    router.push(`/collections/all?q=${encodeURIComponent(query)}`);
  };

  return (
    <Sheet open={isOpen} onClose={close} side="top" label="Search" className="search-sheet">
      <form className="search-bar" onSubmit={submit} role="search">
        <SearchIcon />
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search sneakers"
          aria-label="Search sneakers"
          data-autofocus
          enterKeyHint="search"
        />
        <button type="button" className="icon-btn" onClick={close} aria-label="Close search"><CloseIcon /></button>
      </form>

      <div className="search-body">
        {!query && (
          <div className="search-popular">
            <p className="search-label">Popular searches</p>
            <div className="chips">
              {POPULAR.map(t => <button key={t} type="button" className="chip" onClick={() => setQ(t)}>{t}</button>)}
            </div>
          </div>
        )}
        {query && results.length === 0 && (
          <p className="search-empty">No sneakers match “{query}”. Try a colour, like white, or a type, like running.</p>
        )}
        {results.length > 0 && (
          <>
            <ul className="search-results">
              {results.slice(0, 6).map(p => (
                <li key={p.id}>
                  <Link href={`/product/${p.id}`} onClick={close}>
                    <span className="sr-thumb"><ProductImage src={p.images[0]} alt="" /></span>
                    <span className="sr-text">
                      <span className="sr-name">{p.name}</span>
                      <span className="sr-meta">{p.colour}, {genderLabel[p.gender]}</span>
                    </span>
                    <span className="sr-price">{naira(p.price_kobo)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button type="button" className="btn outline full" onClick={submit}>
              See all {results.length} {results.length === 1 ? "result" : "results"}
            </button>
          </>
        )}
      </div>
    </Sheet>
  );
}
