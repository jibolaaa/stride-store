"use client";
// A panel that slides in from one side (menu, cart, filters, quick add).
// Springs in and out, and can be swiped away: side panels sideways, bottom
// sheets by dragging the handle down. Closes on Escape or a tap outside,
// keeps keyboard focus inside while open, and gives focus back after.
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

const OFFSCREEN = {
  left: { x: "-100%" },
  right: { x: "100%" },
  bottom: { y: "100%" },
  top: { y: "-100%" }
};
const SPRING = { type: "spring", stiffness: 420, damping: 40, mass: .9 };

export default function Sheet({ open, onClose, side = "right", label, className = "", children }) {
  return (
    <AnimatePresence>
      {open && (
        <Panel key="sheet" onClose={onClose} side={side} label={label} className={className}>
          {children}
        </Panel>
      )}
    </AnimatePresence>
  );
}

function Panel({ onClose, side, label, className, children }) {
  const panel = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const lenis = useLenis();
  const dragControls = useDragControls();

  useEffect(() => {
    const returnTo = document.activeElement;
    const root = document.documentElement;
    root.classList.add("locked");
    lenis?.stop();
    const t = setTimeout(() => {
      const first = panel.current?.querySelector("[data-autofocus]") || panel.current?.querySelector(FOCUSABLE);
      first?.focus({ preventScroll: true });
    }, 80);

    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeRef.current(); return; }
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
      lenis?.start();
      if (returnTo?.isConnected) returnTo.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swipe to close. Bottom sheets only drag from their handle, so the
  // list inside can still scroll; side panels drag sideways from anywhere.
  const axis = side === "bottom" || side === "top" ? "y" : "x";
  const canDrag = side !== "top";
  const onDragEnd = (_, info) => {
    const sign = side === "left" ? -1 : 1;
    const dist = (axis === "y" ? info.offset.y : info.offset.x) * sign;
    const speed = (axis === "y" ? info.velocity.y : info.velocity.x) * sign;
    if (dist > 90 || speed > 600) closeRef.current();
  };
  const elastic = side === "bottom" ? { top: 0, bottom: .7 } : side === "right" ? { left: 0, right: .7 } : { left: .7, right: 0 };

  return (
    <div className="sheet-root">
      <motion.div
        className="sheet-backdrop"
        onClick={onClose}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .25 }}
      />
      <motion.div
        ref={panel}
        className={`sheet sheet-${side} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        data-lenis-prevent
        initial={OFFSCREEN[side]}
        animate={{ x: 0, y: 0 }}
        exit={OFFSCREEN[side]}
        transition={SPRING}
        drag={canDrag ? axis : false}
        dragListener={side !== "bottom"}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={elastic}
        dragMomentum={false}
        onDragEnd={onDragEnd}
      >
        {side === "bottom" && (
          <div className="sheet-grip" onPointerDown={(e) => dragControls.start(e)} aria-hidden="true"><span /></div>
        )}
        {children}
      </motion.div>
    </div>
  );
}
