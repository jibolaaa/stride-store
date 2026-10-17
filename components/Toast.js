"use client";
// The small note that slides up after something lands in the bag.
// Goes away by itself after a few seconds, or when you swipe it down.
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useUI } from "./UIProvider";
import { getProduct } from "../lib/products";
import ProductImage from "./ProductImage";
import { CheckIcon, CloseIcon } from "./Icons";

export default function Toast() {
  const { toast, dismissToast, show } = useUI();
  const [hold, setHold] = useState(false);
  const product = toast ? getProduct(toast.id) : null;

  useEffect(() => {
    if (!toast || hold) return;
    const t = setTimeout(dismissToast, 4200);
    return () => clearTimeout(t);
  }, [toast, hold, dismissToast]);

  return (
    <div className="toast-zone" aria-live="polite">
      <AnimatePresence>
        {toast && product && (
          <motion.div
            key={toast.key}
            className="toast"
            role="status"
            initial={{ y: 40, opacity: 0, scale: .96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, transition: { duration: .2 } }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: .8 }}
            onDragEnd={(_, i) => { if (i.offset.y > 40) dismissToast(); }}
            onPointerEnter={() => setHold(true)}
            onPointerLeave={() => setHold(false)}
            onFocus={() => setHold(true)}
            onBlur={() => setHold(false)}
          >
            <span className="toast-thumb"><ProductImage src={product.images[0]} alt="" /><i><CheckIcon /></i></span>
            <span className="toast-text">
              <b>Added to bag</b>
              <span>{product.name}, size {toast.size}{toast.qty > 1 ? `, ${toast.qty} pairs` : ""}</span>
            </span>
            <button type="button" className="btn small" onClick={() => show("cart")}>View bag</button>
            <button type="button" className="icon-btn toast-close" onClick={dismissToast} aria-label="Dismiss"><CloseIcon /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
