"use client";
// Men, Women, Kids. Each photo eases from slightly zoomed in to normal
// as it scrolls through the screen.
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Reveal from "./Reveal";

function Tile({ label, href, image, count }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, .6], [1.18, 1]);
  return (
    <Link href={href} className="cat" ref={ref}>
      <motion.img src={image} alt="" loading="lazy" decoding="async" draggable={false} style={reduce ? undefined : { scale }} />
      <span className="cat-label">
        <b>{label}</b>
        <span>{count} pairs</span>
      </span>
    </Link>
  );
}

export default function CategoryTiles({ title, tiles }) {
  return (
    <section className="cats" aria-labelledby="cats-title">
      <div className="sec-head wrap">
        <h2 id="cats-title" className="sec-title"><Reveal>{title}</Reveal></h2>
      </div>
      <div className="cat-row">
        {tiles.map(t => <Tile key={t.href} {...t} />)}
      </div>
    </section>
  );
}
