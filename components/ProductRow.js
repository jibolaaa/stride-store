"use client";
// A section title, then a row of products you drag or swipe sideways
// (Embla Carousel). A thin line shows how far along the row you are;
// bigger screens also get arrow buttons.
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { ArrowLeft, ArrowRight } from "./Icons";

export default function ProductRow({ id, title, products, href, linkLabel = "See all" }) {
  const [viewport, api] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(products.length > 1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => { setCanPrev(api.canScrollPrev()); setCanNext(api.canScrollNext()); };
    const onScroll = () => setProgress(Math.max(0, Math.min(1, api.scrollProgress())));
    onSelect();
    onScroll();
    api.on("select", onSelect).on("reInit", onSelect).on("scroll", onScroll).on("reInit", onScroll);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect).off("scroll", onScroll).off("reInit", onScroll);
    };
  }, [api]);

  return (
    <section className="row" id={id} aria-labelledby={`${id}-title`}>
      <div className="sec-head wrap">
        <h2 id={`${id}-title`} className="sec-title"><Reveal>{title}</Reveal></h2>
        {href && <Link href={href} className="sec-link">{linkLabel}</Link>}
      </div>
      <div className="row-viewport" ref={viewport}>
        <div className="row-track">
          {products.map((p, i) => (
            <div className="row-item" key={p.id}><ProductCard product={p} priority={i < 2} /></div>
          ))}
        </div>
      </div>
      <div className="row-foot wrap">
        <div className="row-progress" aria-hidden="true"><span style={{ transform: `scaleX(${0.18 + 0.82 * progress})` }} /></div>
        <div className="row-arrows">
          <button type="button" className="round-btn" onClick={() => api?.scrollPrev()} disabled={!canPrev} aria-label={`Back through ${title}`}><ArrowLeft /></button>
          <button type="button" className="round-btn" onClick={() => api?.scrollNext()} disabled={!canNext} aria-label={`More ${title}`}><ArrowRight /></button>
        </div>
      </div>
    </section>
  );
}
