"use client";
// Which overlay is open: the menu, search, the cart drawer, or the
// quick-add sheet for one product. Only one is open at a time.
import { createContext, useCallback, useContext, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [open, setOpen] = useState(null);          // "menu" | "search" | "cart" | "quick" | null
  const [quickId, setQuickId] = useState(null);

  const show = useCallback((name) => setOpen(name), []);
  const close = useCallback(() => setOpen(null), []);
  const quickAdd = useCallback((id) => { setQuickId(id); setOpen("quick"); }, []);

  return (
    <UIContext.Provider value={{ open, show, close, quickId, quickAdd }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
