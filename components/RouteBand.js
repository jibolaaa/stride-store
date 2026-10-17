"use client";
// "Delivered across Lagos": as you scroll past this band, a danfo drives
// along the road and each stop lights up as it passes, ending at your door.
// Your scrolling drives it, so it moves back if you scroll back up.
// With reduced motion it's simply parked at the end.
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Danfo from "./Danfo";

const STOPS = [
  { name: "Ikeja", at: .1 },
  { name: "Yaba", at: .38 },
  { name: "Lekki", at: .66 },
  { name: "Your door", at: .96 }
];

export default function RouteBand({ title, note }) {
  const band = useRef(null);
  const road = useRef(null);
  const bus = useRef(null);
  const trail = useRef(null);
  const progress = useRef(0);
  const idle = useRef(0);
  const reduce = useReducedMotion();
  const [driving, setDriving] = useState(false);
  const [lit, setLit] = useState(0);

  const { scrollYProgress } = useScroll({ target: band, offset: ["start 85%", "end 45%"] });

  // Put the bus at a point along the road (0 = just off the left, 1 = parked at the end).
  const place = (p) => {
    const r = road.current, b = bus.current;
    if (!r || !b) return;
    progress.current = p;
    const W = r.clientWidth, bw = b.offsetWidth;
    const x = -bw + p * W;
    b.style.transform = `translateX(${x}px)`;
    const front = x + bw * .92;
    if (trail.current) trail.current.style.width = `${Math.max(0, Math.min(W, front))}px`;
    setLit(STOPS.filter(s => front >= s.at * W).length);
  };

  useEffect(() => {
    place(reduce ? 1 : scrollYProgress.get());
    const onResize = () => place(progress.current);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(idle.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    place(p);
    setDriving(true);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => setDriving(false), 180);
  });

  return (
    <section className={`route ${lit === STOPS.length ? "arrived" : ""}`} ref={band} aria-labelledby="route-title">
      <div className="route-head wrap">
        <h2 id="route-title" className="sec-title">{title}</h2>
        <p className="route-note">{note}</p>
      </div>
      <div className="route-road" ref={road} aria-hidden="true">
        <span className="route-trail" ref={trail} />
        <span className="route-bus" ref={bus}><Danfo driving={driving} /></span>
        {STOPS.map((s, i) => (
          <span key={s.name} className={`stop ${i < lit ? "lit" : ""} ${i === STOPS.length - 1 ? "last" : ""} ${i === 0 ? "first" : ""}`} style={{ left: `${s.at * 100}%` }}>
            <i />
            <b>{s.name}</b>
          </span>
        ))}
      </div>
      <p className="sr-only">We deliver anywhere in Lagos, including Ikeja, Yaba and Lekki, to your door.</p>
    </section>
  );
}
