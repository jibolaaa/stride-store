"use client";
// A headline that rises out of a mask the first time it scrolls into view.
// Without JavaScript, or with reduced motion, the text simply shows.
import { useEffect, useRef } from "react";

export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className="reveal" style={delay ? { "--d": `${delay}ms` } : undefined}>
      <span>{children}</span>
    </span>
  );
}
