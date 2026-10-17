"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import { genderLabel, getProduct, inStock, isSoldOut, onSale, products, sizeList } from "../lib/products";
import { DELIVERY_FEE_KOBO, FREE_DELIVERY_FROM_KOBO } from "../lib/pricing";
import { naira, nairaWhole } from "../lib/format";
import { useCart } from "./CartProvider";
import { useAddToBag } from "./useAddToBag";
import ProductImage from "./ProductImage";
import ProductRow from "./ProductRow";
import { Price, badgeFor } from "./ProductCard";
import Stars from "./Stars";
import { ColourPicker } from "./Swatches";
import SizeGuide from "./SizeGuide";
import { CheckIcon, ChevronDown, DanfoIcon, MinusIcon, PlusIcon, ReturnIcon, RulerIcon } from "./Icons";

const TYPE = { running: "running", lifestyle: "everyday", basketball: "basketball" };
const WHOSE = { men: "Men's", women: "Women's", kids: "Kids'", unisex: "Unisex" };

// Photos you swipe or drag (Embla Carousel); bigger screens also get thumbnails.
const Gallery = forwardRef(function Gallery({ product }, mediaRef) {
  const [viewport, api] = useEmblaCarousel({ loop: false });
  const [active, setActive] = useState(0);
  const imgs = product.images;
  const badge = badgeFor(product);

  useEffect(() => {
    if (!api) return;
    const on = () => setActive(api.selectedScrollSnap());
    api.scrollTo(0, true);
    on();
    api.on("select", on).on("reInit", on);
    return () => { api.off("select", on).off("reInit", on); };
  }, [api, product.id]);

  return (
    <div className="gallery" ref={mediaRef}>
      <div className="gallery-viewport" ref={viewport} aria-label={`${product.name} photos`}>
        <div className="gallery-track">
          {imgs.map((src, i) => (
            <div className="gallery-slide" key={src}>
              <ProductImage src={src} alt={i === 0 ? `${product.name} in ${product.colour.toLowerCase()}` : `${product.name}, photo ${i + 1}`} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>
      {badge && <span className={`badge ${badge.kind}`}>{badge.text}</span>}
      {imgs.length > 1 && (
        <>
          <span className="gallery-count" aria-hidden="true">{active + 1}/{imgs.length}</span>
          <div className="gallery-thumbs">
            {imgs.map((src, i) => (
              <button key={src} type="button" className={i === active ? "on" : ""} onClick={() => api?.scrollTo(i)} aria-label={`Show photo ${i + 1} of ${imgs.length}`} aria-current={i === active ? "true" : undefined}>
                <ProductImage src={src} alt="" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

// The main button: says "Added" with a tick for a moment after it works.
function AddButton({ state, soldOut, onClick, className = "", children }) {
  const label = soldOut ? "Sold out" : state === "added" ? "Added" : children;
  return (
    <button type="button" className={`btn add-btn ${state === "added" ? "is-added" : ""} ${className}`} onClick={onClick} disabled={soldOut || state === "adding"}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          className="add-label"
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: .18 }}
        >
          {state === "added" && <CheckIcon />}{label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function ProductView({ id }) {
  const product = getProduct(id);
  const router = useRouter();
  const { add } = useCart();
  const { addToBag, state } = useAddToBag();
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const sizesRef = useRef(null);
  const buyRef = useRef(null);
  const mediaRef = useRef(null);

  // Switching colour brings the size along in the address (?size=42).
  // Keep it if this colour has that size in stock.
  useEffect(() => {
    const s = Number(new URLSearchParams(window.location.search).get("size"));
    setSize(s && inStock(getProduct(id), s) ? s : null);
    setQty(1);
    setSizeError(false);
  }, [id]);

  // The bottom bar appears once the main button has scrolled off the top.
  // The huge bottom margin counts "below the screen" as in view, so even a
  // fast fling past the button is caught.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting), { rootMargin: "0px 0px 100000px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  const soldOut = isSoldOut(product);
  const left = size ? product.sizes[size] : null;
  const maxQty = Math.min(left ?? 10, 10);
  const related = products
    .filter(p => p.id !== product.id && (!product.family || p.family !== product.family))
    .filter(p => (p.type === product.type || p.gender === product.gender) && !isSoldOut(p))
    .slice(0, 8);

  const pickSize = (s) => { setSize(s); setSizeError(false); setQty(q => Math.min(q, product.sizes[s])); };
  const needSize = () => {
    if (size) return false;
    setSizeError(true);
    sizesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    return true;
  };
  const addIt = () => {
    if (needSize()) return;
    const from = mediaRef.current?.querySelector(".gallery-slide img") || mediaRef.current;
    addToBag({ product, size, qty, from });
  };
  const buyNow = () => { if (needSize()) return; add(product.id, size, qty); router.push("/checkout"); };

  return (
    <>
      <nav className="crumbs wrap" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href={`/collections/${product.gender === "unisex" ? "all" : product.gender}`}>{product.gender === "unisex" ? "All sneakers" : genderLabel[product.gender]}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="pdp wrap">
        <Gallery product={product} ref={mediaRef} />

        <div className="pdp-info">
          <div className="pdp-head">
            <p className="pdp-kind">{WHOSE[product.gender]} {TYPE[product.type]}</p>
            <h1 className="pdp-title">{product.name}</h1>
            <div className="pdp-price-row">
              <Price product={product} className="pdp-price" />
              {product.rating != null && <Stars value={product.rating} reviews={product.reviews} full />}
            </div>
            {onSale(product) && <p className="save">You save {naira(product.compare_kobo - product.price_kobo)}</p>}
          </div>

          <ColourPicker product={product} size={size} />

          <div className="size-pick" role="group" aria-labelledby="size-label" ref={sizesRef}>
            <div className="size-head">
              <p className="opt-label" id="size-label">Size (EU){size ? <span>{size}</span> : null}</p>
              <button type="button" className="text-btn" onClick={() => setGuideOpen(true)}><RulerIcon />Size guide</button>
            </div>
            <div className="size-grid">
              {sizeList(product).map(s => (
                <button key={s} type="button" className={`size ${size === s ? "on" : ""}`} disabled={!inStock(product, s)}
                  aria-pressed={size === s} aria-label={inStock(product, s) ? `Size ${s}` : `Size ${s}, sold out`}
                  onClick={() => pickSize(s)}>{s}</button>
              ))}
            </div>
            {sizeError && <p className="field-error" role="alert">Choose a size to continue.</p>}
            {!sizeError && left != null && left <= 2 && <p className="low-stock">Only {left} left in size {size}</p>}
          </div>

          {!soldOut && (
            <div className="qty-row">
              <span className="opt-label" id="qty-label">Quantity</span>
              <div className="qty" role="group" aria-labelledby="qty-label">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="One less" disabled={qty <= 1}><MinusIcon /></button>
                <span aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty(q => Math.min(maxQty, q + 1))} aria-label="One more" disabled={qty >= maxQty}><PlusIcon /></button>
              </div>
            </div>
          )}

          <div className="buy-actions" ref={buyRef}>
            <AddButton state={state} soldOut={soldOut} onClick={addIt} className="full">Add to bag</AddButton>
            {!soldOut && <button type="button" className="btn outline full" onClick={buyNow}>Buy now</button>}
          </div>

          <ul className="pdp-perks">
            <li><DanfoIcon /><span>Delivered in Lagos in 1 to 2 working days. {nairaWhole(DELIVERY_FEE_KOBO)}, or free on orders from {nairaWhole(FREE_DELIVERY_FROM_KOBO)}.</span></li>
            <li><ReturnIcon /><span>Free returns within 7 days on unworn pairs.</span></li>
          </ul>

          <div className="accordion">
            <details open>
              <summary>Description<ChevronDown /></summary>
              <div className="acc-body">
                <p>{product.description}</p>
                <ul>{product.details.map(d => <li key={d}>{d}</li>)}</ul>
              </div>
            </details>
            <details>
              <summary>Size and fit<ChevronDown /></summary>
              <div className="acc-body">
                <p>{product.gender === "kids" ? "Kids sizes run from EU 28 to 35. Leave about a thumb's width at the toe for growing feet." : "True to size. If you're between sizes, go up one."}</p>
                <button type="button" className="text-btn" onClick={() => setGuideOpen(true)}>Open the size guide</button>
              </div>
            </details>
            <details>
              <summary>Delivery and returns<ChevronDown /></summary>
              <div className="acc-body">
                <p>Delivery anywhere in Lagos costs {nairaWhole(DELIVERY_FEE_KOBO)} and is free on orders from {nairaWhole(FREE_DELIVERY_FROM_KOBO)}. The rider calls before arriving. Return unworn pairs in the box within 7 days for a full refund.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && <ProductRow id="related" title="You may also like" products={related} />}

      <div className={`sticky-buy ${barVisible && !soldOut ? "show" : ""}`} aria-hidden={!(barVisible && !soldOut)}>
        <div className="sticky-info">
          <span className="sticky-name">{product.name}{size ? `, size ${size}` : ""}</span>
          <Price product={product} />
        </div>
        <AddButton state={state} soldOut={soldOut} onClick={addIt}>{size ? "Add to bag" : "Choose size"}</AddButton>
      </div>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} kids={product.gender === "kids"} />
    </>
  );
}
