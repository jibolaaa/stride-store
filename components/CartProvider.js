"use client";
// Global cart state, shared by every page via React Context.
// Persisted to localStorage so the cart survives page refreshes.
import { createContext, useContext, useEffect, useState } from "react";
import { getProduct } from "../lib/products";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, qty }]
  const [loaded, setLoaded] = useState(false);

  // Load once on mount (localStorage only exists in the browser)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("stride_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Save on every change (after initial load)
  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem("stride_cart", JSON.stringify(items)); } catch {}
    }
  }, [items, loaded]);

  const add = (id, qty = 1) =>
    setItems(prev => {
      const found = prev.find(i => i.id === id);
      if (found) return prev.map(i => i.id === id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { id, qty }];
    });

  const setQty = (id, qty) =>
    setItems(prev => qty <= 0
      ? prev.filter(i => i.id !== id)
      : prev.map(i => i.id === id ? { ...i, qty } : i));

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));
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
