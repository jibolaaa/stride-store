"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCollection } from "../lib/products";
import { activeCount, applyFilters, filterGroups, matchesQuery, sortProducts, SORTS } from "../lib/filters";
import ProductCard from "./ProductCard";
import Sheet from "./Sheet";
import { useMediaQuery } from "./useMediaQuery";
import { ChevronDown, CloseIcon, FilterIcon, GridOneIcon, GridTwoIcon } from "./Icons";

const EMPTY = { gender: [], type: [], size: [], price: [], colour: [], saleOnly: false, inStockOnly: false };

// Reads ?q= from the address bar. Kept separate so the page itself can be
// built ahead of time and only this small part waits for the browser.
export function CollectionFromUrl({ slug }) {
  const q = (useSearchParams().get("q") || "").trim();
  return <CollectionView slug={slug} q={q} />;
}

export default function CollectionView({ slug, q = "" }) {
  const collection = getCollection(slug);
  const [filters, setFilters] = useState(EMPTY);
  const [draft, setDraft] = useState(EMPTY);
  const [sort, setSort] = useState("featured");
  const [cols, setCols] = useState(2);
  const [filterOpen, setFilterOpen] = useState(false);
  const wide = useMediaQuery("(min-width: 700px)");

  useEffect(() => { try { const c = Number(localStorage.getItem("stride_cols")); if (c === 1 || c === 2) setCols(c); } catch {} }, []);
  useEffect(() => { setFilters(EMPTY); }, [q]); // a new search starts with no filters
  const pickCols = (c) => { setCols(c); try { localStorage.setItem("stride_cols", String(c)); } catch {} };

  const base = useMemo(() => q ? collection.products.filter(p => matchesQuery(p, q)) : collection.products, [collection, q]);
  const groups = useMemo(() => filterGroups(base), [base]);
  const shown = useMemo(() => sortProducts(applyFilters(base, filters), sort), [base, filters, sort]);
  const draftCount = useMemo(() => applyFilters(base, draft).length, [base, draft]);
  const nActive = activeCount(filters);
  // The quick "On sale" chip only helps when some, not all, of these pairs are on sale.
  const saleCount = base.filter(p => p.compare_kobo > p.price_kobo).length;
  const hasSale = saleCount > 0 && saleCount < base.length;

  const openFilters = () => { setDraft(filters); setFilterOpen(true); };
  const toggle = (key, value) => setDraft(d => ({ ...d, [key]: d[key].includes(value) ? d[key].filter(v => v !== value) : [...d[key], value] }));
  const apply = () => { setFilters(draft); setFilterOpen(false); };

  return (
    <div className="collection">
      <div className="collection-head wrap">
        <h1 className="page-title">{collection.title}</h1>
        <p className="collection-sub">{q ? `Results for “${q}”` : collection.tagline}</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-in wrap">
          <div className="chips">
            <button type="button" className={`chip ${nActive > 0 ? "on" : ""}`} onClick={openFilters} aria-haspopup="dialog" aria-label={nActive > 0 ? `Filter, ${nActive} on` : "Filter"}>
              <FilterIcon />Filter{nActive > 0 && <span className="chip-count" aria-hidden="true">{nActive}</span>}
            </button>
            <label className="chip select">
              <span className="chip-label" aria-hidden="true">{SORTS.find(s => s.id === sort)?.short}</span>
              <ChevronDown />
              <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort by">
                {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            {hasSale && (
              <button type="button" className={`chip quick-sale ${filters.saleOnly ? "on" : ""}`} aria-pressed={filters.saleOnly} onClick={() => setFilters(f => ({ ...f, saleOnly: !f.saleOnly }))}>On sale</button>
            )}
          </div>
          <div className="grid-pick" role="group" aria-label="Products per row">
            <button type="button" className={cols === 1 ? "on" : ""} onClick={() => pickCols(1)} aria-label="One per row" aria-pressed={cols === 1}><GridOneIcon /></button>
            <button type="button" className={cols === 2 ? "on" : ""} onClick={() => pickCols(2)} aria-label="Two per row" aria-pressed={cols === 2}><GridTwoIcon /></button>
          </div>
        </div>
      </div>

      <p className="result-count wrap" aria-live="polite">{shown.length} {shown.length === 1 ? "pair" : "pairs"}</p>

      {shown.length === 0 ? (
        <div className="empty-block wrap">
          <p>{q && base.length === 0 ? `Nothing matches “${q}”. Try a colour, like white, or a style, like running.` : "No pairs match these filters."}</p>
          {nActive > 0 && <button type="button" className="btn outline" onClick={() => setFilters(EMPTY)}>Clear filters</button>}
        </div>
      ) : (
        <div className={`grid cols-${cols}`}>
          {shown.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
        </div>
      )}

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} side={wide ? "right" : "bottom"} label="Filter" className="filter-sheet">
        <div className="sheet-head">
          <p className="sheet-title">Filter</p>
          <button type="button" className="icon-btn" onClick={() => setFilterOpen(false)} aria-label="Close filters" data-autofocus><CloseIcon /></button>
        </div>
        <div className="filter-body">
          {groups.map(g => (
            <details key={g.key} className="filter-group" open={g.key === "size" || g.key === "gender" ? true : undefined}>
              <summary>{g.title}{draft[g.key].length > 0 && <span className="chip-count">{draft[g.key].length}</span>}<ChevronDown /></summary>
              <div className={g.grid ? "size-grid" : "filter-options"}>
                {g.options.map(o => g.grid ? (
                  <button key={o.value} type="button" className={`size ${draft[g.key].includes(o.value) ? "on" : ""}`} aria-pressed={draft[g.key].includes(o.value)} aria-label={`Size ${o.label}`} onClick={() => toggle(g.key, o.value)}>{o.label}</button>
                ) : (
                  <label key={o.value} className="check">
                    <input type="checkbox" checked={draft[g.key].includes(o.value)} onChange={() => toggle(g.key, o.value)} />
                    <span>{o.label}</span><span className="n">{o.n}</span>
                  </label>
                ))}
              </div>
            </details>
          ))}
          <div className="filter-group plain">
            <label className="check"><input type="checkbox" checked={draft.saleOnly} onChange={e => setDraft(d => ({ ...d, saleOnly: e.target.checked }))} /><span>On sale only</span></label>
            <label className="check"><input type="checkbox" checked={draft.inStockOnly} onChange={e => setDraft(d => ({ ...d, inStockOnly: e.target.checked }))} /><span>Hide sold out</span></label>
          </div>
        </div>
        <div className="filter-foot">
          <button type="button" className="btn outline" onClick={() => setDraft(EMPTY)}>Clear</button>
          <button type="button" className="btn" onClick={apply}>Show {draftCount} {draftCount === 1 ? "pair" : "pairs"}</button>
        </div>
      </Sheet>
    </div>
  );
}
