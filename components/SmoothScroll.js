"use client";
// Smooth scrolling with Lenis (mouse and trackpad). Phones keep their own
// native scrolling, which is already smooth. Off for reduced motion.
import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function SmoothScroll() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setOn(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  if (!on) return null;
  return <ReactLenis root options={{ lerp: 0.11, anchors: { offset: -80 } }} />;
}
