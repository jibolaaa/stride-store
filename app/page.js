import { products } from "../lib/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <div className="wrap">
      <section className="hero">
        <p className="eyebrow">Free delivery across Lagos</p>
        <h1>Walk in<br />something new.</h1>
        <p className="sub">Clean, comfortable sneakers at fair prices. Pay securely online, delivered to your door.</p>
      </section>
      <section className="grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </section>
    </div>
  );
}
