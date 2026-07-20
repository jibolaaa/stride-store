"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getProduct, products } from "../../../lib/products";
import { naira } from "../../../lib/format";
import { useCart } from "../../../components/CartProvider";
import ProductImage from "../../../components/ProductImage";
import ProductCard from "../../../components/ProductCard";
import Rating from "../../../components/Rating";
import Reveal from "../../../components/Reveal";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = getProduct(id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  if (!product) return <div className="wrap"><p className="empty">Product not found.</p></div>;

  const related = products.filter(p => p.id !== product.id).slice(0, 4);

  const requireSize = () => {
    if (!size) { setSizeError(true); return false; }
    return true;
  };

  const addToCart = () => {
    if (!requireSize()) return;
    add(product.id, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    if (!requireSize()) return;
    add(product.id, size, qty);
    router.push("/cart");
  };

  return (
    <>
      <div className="wrap product-page">
        <div className="product-img">
          <ProductImage src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <p className="crumb"><Link href="/">Shop</Link> / {product.name}</p>
          {product.tag && <span className="tag inline">{product.tag}</span>}
          <h1>{product.name}</h1>
          <Rating value={product.rating} reviews={product.reviews} />
          <p className="price big">{naira(product.price_kobo)}</p>
          <p className="desc">{product.description}</p>

          <div className="size-block">
            <span className="qty-label">Select size (EU)</span>
            <div className="sizes">
              {product.sizes.map(s => (
                <button
                  key={s}
                  className={`size ${size === s ? "on" : ""}`}
                  onClick={() => { setSize(s); setSizeError(false); }}
                >
                  {s}
                </button>
              ))}
            </div>
            {sizeError && <p className="error">Please select a size first.</p>}
          </div>

          <div className="qty-row">
            <span className="qty-label">Quantity</span>
            <div className="stepper">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} aria-label="Increase">+</button>
            </div>
          </div>

          <div className="actions">
            <button className="btn" onClick={addToCart}>{added ? "Added ✓" : "Add to cart"}</button>
            <button className="btn outline" onClick={buyNow}>Buy now</button>
          </div>

          <ul className="perks">
            <li>Free delivery across Lagos</li>
            <li>Secure Paystack checkout</li>
            <li>7-day easy returns</li>
          </ul>
        </div>
      </div>

      <section className="wrap related">
        <Reveal><h2>You may also like</h2></Reveal>
        <div className="grid related-grid">
          {related.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
