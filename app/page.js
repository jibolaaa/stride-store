import Link from "next/link";
import { Suspense } from "react";
import { products } from "../lib/products";
import { naira } from "../lib/format";
import ProductImage from "../components/ProductImage";
import ShopGrid from "../components/ShopGrid";
import { SizeRun } from "../components/ProductCard";

export default function Home() {
  const hero = products.find(p => p.id === "velocity-runner") || products[0];
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <h1>Walk in something new.</h1>
          <p className="sub">Sneakers at fair prices, paid for online and delivered to your door anywhere in Lagos.</p>
          <div className="hero-actions">
            <Link href="#shop" className="btn">Shop sneakers</Link>
            <Link href="/help" className="btn ghost">How delivery works</Link>
          </div>
        </div>
        <Link href={`/product/${hero.id}`} className="hero-cover" aria-label={`${hero.name}, ${naira(hero.price_kobo)}`}>
          <div className="hero-img">
            <ProductImage src={hero.image} alt="" priority />
            <div className="hero-pills" aria-hidden="true">
              <span className="pill">{hero.name}</span>
              <span className="pill">{naira(hero.price_kobo)}</span>
            </div>
          </div>
          <div className="label hero-label" aria-hidden="true">
            <div className="label-row"><span className="name">{hero.name}</span><span className="code">{hero.code}</span></div>
            <div className="label-row"><span className="price">{naira(hero.price_kobo)}</span><span className="new">New in</span></div>
            <SizeRun sizes={hero.sizes} />
          </div>
        </Link>
      </section>

      <ul className="promises wrap" aria-label="Why buy from STRIDE">
        <li><b>Free delivery in Lagos</b><span>1 to 2 working days</span></li>
        <li><b>Pay with Paystack</b><span>Card, transfer or USSD</span></li>
        <li><b>7-day returns</b><span>Unworn, in the box</span></li>
      </ul>

      <section id="shop" className="wrap shop" aria-labelledby="shop-title">
        <h2 id="shop-title">All sneakers</h2>
        <Suspense fallback={null}>
          <ShopGrid />
        </Suspense>
      </section>
    </>
  );
}
