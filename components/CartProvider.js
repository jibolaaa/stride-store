"use client";
// Global cart state. Items are keyed by product id + size, so the same
// sneaker in size 42 and 44 are separate lines (how real stores work).
import { createContext, useContext, useEffect, useState } from "react";
import { getProduct } from "../lib/products";

const CartContext = createContext(null);
const sameLine = (a, b) => a.id === b.id && a.size === b.size;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, size, qty }]
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("stride_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        // normalize old entries that had no size
        setItems(parsed.map(i => ({ id: i.id, size: i.size ?? null, qty: i.qty })));
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem("stride_cart", JSON.stringify(items)); } catch {}
    }
  }, [items, loaded]);

  const add = (id, size, qty = 1) =>
    setItems(prev => {
      const line = { id, size, qty };
      const found = prev.find(i => sameLine(i, line));
      if (found) return prev.map(i => sameLine(i, line) ? { ...i, qty: i.qty + qty } : i);
      return [...prev, line];
    });

  const setQty = (id, size, qty) =>
    setItems(prev => qty <= 0
      ? prev.filter(i => !sameLine(i, { id, size }))
      : prev.map(i => sameLine(i, { id, size }) ? { ...i, qty } : i));

  const remove = (id, size) => setItems(prev => prev.filter(i => !sameLine(i, { id, size })));
  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal_kobo = items.reduce((sum, i) => {
    const p = getProduct(i.id);
    return sum + (p ? p.price_kobo * i.qty : 0);
  }, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, subtotal_kobo }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
