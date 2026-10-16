"use client";
// The cart. Each line is one product in one size, so the same sneaker in
// size 42 and 44 are separate lines. Saved in the browser (localStorage).
// Quantities never go above 10 or above the pairs left in that size.
import { createContext, useContext, useEffect, useState } from "react";
import { getProduct } from "../lib/products";
import { deliveryFor } from "../lib/pricing";

const CartContext = createContext(null);
const same = (a, b) => a.id === b.id && a.size === b.size;

export const maxQtyFor = (id, size) => Math.min(10, getProduct(id)?.sizes?.[size] ?? 0);
const clampQty = (id, size, n) => Math.max(1, Math.min(maxQtyFor(id, size), n | 0));

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, size, qty }]
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("stride_cart") || "[]");
      // Keep only lines that still exist, in a size that's still in stock.
      setItems(saved
        .map(i => ({ id: String(i.id), size: Number(i.size), qty: Number(i.qty) || 1 }))
        .filter(i => maxQtyFor(i.id, i.size) > 0)
        .map(i => ({ ...i, qty: clampQty(i.id, i.size, i.qty) })));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) try { localStorage.setItem("stride_cart", JSON.stringify(items)); } catch {}
  }, [items, loaded]);

  const add = (id, size, qty = 1) => {
    if (maxQtyFor(id, size) === 0) return;
    setItems(prev => prev.some(i => same(i, { id, size }))
      ? prev.map(i => same(i, { id, size }) ? { ...i, qty: clampQty(id, size, i.qty + qty) } : i)
      : [...prev, { id, size, qty: clampQty(id, size, qty) }]);
  };
  const setQty = (id, size, qty) => setItems(prev => qty <= 0
    ? prev.filter(i => !same(i, { id, size }))
    : prev.map(i => same(i, { id, size }) ? { ...i, qty: clampQty(id, size, qty) } : i));
  const remove = (id, size) => setItems(prev => prev.filter(i => !same(i, { id, size })));
  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal_kobo = items.reduce((sum, i) => sum + (getProduct(i.id)?.price_kobo ?? 0) * i.qty, 0);
  const delivery_kobo = deliveryFor(subtotal_kobo);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, subtotal_kobo, delivery_kobo, total_kobo: subtotal_kobo + delivery_kobo, loaded }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
