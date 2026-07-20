import Link from "next/link";
import { products } from "../lib/products";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import ProductImage from "../components/ProductImage";

export default function Home() {
  const hero = products.find(p => p.id === "velocity-runner") || products[0];
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow rise d1">New season drop</p>
            <h1 className="rise d2">Walk in<br />something<br />new.</h1>
            <p className="sub rise d3">Clean, comfortable sneakers at fair prices. Paid securely online, delivered to your door in Lagos.</p>
            <div className="rise d4">
              <Link href="#shop" className="btn">Shop the drop</Link>
            </div>
          </div>
          <div className="hero-visual rise d3">
            <div className="hero-blob" />
            <ProductImage src={hero.image} alt={hero.name} className="hero-shoe" />
            <div className="hero-chip">{hero.name}</div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="track">
          <span>Free Lagos delivery</span><span>·</span><span>Secure Paystack checkout</span><span>·</span>
          <span>New drops weekly</span><span>·</span><span>Easy returns</span><span>·</span>
          <span>Free Lagos delivery</span><span>·</span><span>Secure Paystack checkout</span><span>·</span>
          <span>New drops weekly</span><span>·</span><span>Easy returns</span><span>·</span>
        </div>
      </div>

      <section id="shop" className="wrap shop">
        <div className="shop-head">
          <Reveal><h2>The lineup</h2></Reveal>
          <Reveal delay={80}><p className="count">{products.length} styles</p></Reveal>
        </div>
        <div className="grid">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70} className={i === 0 ? "featured" : ""}>
              <ProductCard product={p} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
