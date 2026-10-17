"use client";
// Add to bag with a little moment: the shoe photo flies into the bag icon,
// the bag bounces, then a small "Added to bag" note slides up.
import { useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { useUI } from "./UIProvider";
import { flyToBag, popBag } from "../lib/fly";

export function useAddToBag() {
  const { add } = useCart();
  const { close, notifyAdded } = useUI();
  const busy = useRef(false);
  const [state, setState] = useState("idle"); // idle | adding | added

  const addToBag = async ({ product, size, qty = 1, from, closeFirst = false }) => {
    if (busy.current) return;
    busy.current = true;
    setState("adding");
    const flight = flyToBag(from, product.images[0]);
    if (closeFirst) close();
    const flew = await flight;
    add(product.id, size, qty);
    popBag();
    notifyAdded({ id: product.id, size, qty });
    setState("added");
    setTimeout(() => { busy.current = false; setState("idle"); }, flew ? 1600 : 1200);
  };

  return { addToBag, state };
}
