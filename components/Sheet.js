"use client";
// A panel that slides in from one side (menu, cart, filters, quick add).
// Closes on Escape or a tap on the dimmed background, keeps keyboard focus
// inside while open, and gives focus back to where it was when it closes.
import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

export default function Sheet({ open, onClose, side = "right", label, className = "", children }) {
  const panel = useRef(null);
  const returnTo = useRef(null);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement;
    const root = document.documentElement;
    root.classList.add("locked");
    const t = setTimeout(() => {
      const first = panel.current?.querySelector("[data-autofocus]") || panel.current?.querySelector(FOCUSABLE);
      first?.focus({ preventScroll: true });
    }, 60);

    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const els = [...panel.current.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      root.classList.remove("locked");
      if (returnTo.current?.isConnected) returnTo.current.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <div className={`sheet-root ${open ? "open" : ""}`}>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={panel} className={`sheet sheet-${side} ${className}`} role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </div>
    </div>
  );
}
