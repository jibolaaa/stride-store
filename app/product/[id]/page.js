"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getProduct } from "../../../lib/products";
import { naira } from "../../../lib/format";
import { useCart } from "../../../components/CartProvider";
import ProductImage from "../../../components/ProductImage";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = getProduct(id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return <div className="wrap"><p className="empty">Product not found.</p></div>;

  const addToCart = () => {
    add(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="wrap product-page">
      <div className="product-img"><ProductImage src={product.image} alt={product.name} /></div>
      <div className="product-info">
        {product.tag && <span className="tag inline">{product.tag}</span>}
        <h1>{product.name}</h1>
        <p className="price big">{naira(product.price_kobo)}</p>
        <p className="desc">{product.description}</p>
        <div className="qty-row">
          <div className="stepper">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} aria-label="Increase">+</button>
          </div>
        </div>
        <div className="actions">
          <button className="btn" onClick={addToCart}>{added ? "Added ✓" : "Add to cart"}</button>
          <button className="btn outline" onClick={() => { add(product.id, qty); router.push("/cart"); }}>Buy now</button>
        </div>
      </div>
    </div>
  );
}
