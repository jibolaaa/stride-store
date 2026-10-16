"use client";
// A section with a small line on top, a big title, a row of products you
// swipe sideways (arrows on bigger screens) and a button under it.
import Link from "next/link";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "./Icons";

export default function ProductRow({ id, tagline, title, products, cta, href, band = true }) {
  const track = useRef(null);
  const step = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector(".row-item");
    el.scrollBy({ left: dir * (card ? card.offsetWidth + 16 : el.clientWidth * .8), behavior: "smooth" });
  };

  return (
    <section className={`row-section ${band ? "band" : ""}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="section-head">
        {tagline && <p className="kicker">{tagline}</p>}
        <h2 id={`${id}-title`} className="section-title">{title}</h2>
      </div>
      <div className="row-wrap">
        <button type="button" className="row-arrow prev" onClick={() => step(-1)} aria-label={`Scroll ${title} back`}><ChevronLeft /></button>
        <div className="row-track" ref={track}>
          {products.map((p, i) => (
            <div className="row-item" key={p.id}><ProductCard product={p} priority={i < 2} /></div>
          ))}
        </div>
        <button type="button" className="row-arrow next" onClick={() => step(1)} aria-label={`Scroll ${title} forward`}><ChevronRight /></button>
      </div>
      {cta && <div className="section-cta"><Link href={href} className="btn">{cta}</Link></div>}
    </section>
  );
}
