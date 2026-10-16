"use client";
// The black strip at the very top. Messages rotate every few seconds;
// the arrows step through them by hand.
import { useEffect, useState } from "react";
import Link from "next/link";
import { FREE_DELIVERY_FROM_KOBO } from "../lib/pricing";
import { nairaWhole } from "../lib/format";
import { ChevronLeft, ChevronRight } from "./Icons";

const MESSAGES = [
  { text: `Free Lagos delivery from ${nairaWhole(FREE_DELIVERY_FROM_KOBO)}` },
  { text: "Not sure of your size? See the guide", href: "/help#sizes" },
  { text: "7-day returns on unworn pairs" },
  { text: "Pay by card, transfer or USSD" }
];

export default function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI(n => (n + 1) % MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (d) => { setPaused(true); setI(n => (n + d + MESSAGES.length) % MESSAGES.length); };
  const m = MESSAGES[i];

  return (
    <div className="announce" role="region" aria-label="Store news">
      <button type="button" className="announce-arrow" onClick={() => go(-1)} aria-label="Previous message"><ChevronLeft /></button>
      <p className="announce-text" aria-live={paused ? "polite" : "off"} key={i}>
        {m.href ? <Link href={m.href}>{m.text}</Link> : m.text}
      </p>
      <button type="button" className="announce-arrow" onClick={() => go(1)} aria-label="Next message"><ChevronRight /></button>
    </div>
  );
}
