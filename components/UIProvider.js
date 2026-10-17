"use client";
// Which overlay is open (menu, search, cart, quick add), plus the small
// "Added to bag" note. Only one overlay is open at a time.
import { createContext, useCallback, useContext, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [open, setOpen] = useState(null);          // "menu" | "search" | "cart" | "quick" | null
  const [quickId, setQuickId] = useState(null);
  const [toast, setToast] = useState(null);         // { id, size, qty, key }

  const show = useCallback((name) => { setOpen(name); setToast(null); }, []);
  const close = useCallback(() => setOpen(null), []);
  const quickAdd = useCallback((id) => { setQuickId(id); setOpen("quick"); }, []);
  const notifyAdded = useCallback((item) => setToast({ ...item, key: Date.now() }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  return (
    <UIContext.Provider value={{ open, show, close, quickId, quickAdd, toast, notifyAdded, dismissToast }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
