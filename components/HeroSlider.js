"use client";
// Full-width banners you can swipe. Moves on by itself every 6 seconds
// unless you touch it, focus it, or have reduced motion switched on.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "./Icons";

export default function HeroSlider({ slides, nextId }) {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); });
    }, { root: el, threshold: .6 });
    el.querySelectorAll(".slide").forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => goTo((active + 1) % slides.length), 6000);
    return () => clearTimeout(t);
  }, [active, paused, slides.length]);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured" onPointerDown={() => setPaused(true)} onFocus={() => setPaused(true)}>
      <div className="hero-track" ref={track}>
        {slides.map((s, i) => (
          <div className={`slide ${s.tone || "dark"}`} key={s.title} data-i={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
            <img
              src={s.image}
              srcSet={s.srcSet}
              sizes="100vw"
              alt=""
              className="slide-img"
              style={{ objectPosition: s.focus || "center" }}
              loading={i === 0 ? "eager" : "lazy"}
              fetchpriority={i === 0 ? "high" : undefined}
              decoding="async"
            />
            <div className="slide-copy">
              <h2 className="slide-title">{s.title}</h2>
              <p className="slide-sub">{s.sub}</p>
              <Link href={s.href} className="btn slide-btn" tabIndex={i === active ? 0 : -1}>Shop now</Link>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="hero-dots">
          {slides.map((s, i) => (
            <button key={s.title} type="button" className={i === active ? "on" : ""} onClick={() => { setPaused(true); goTo(i); }} aria-label={`Show slide ${i + 1}`} aria-current={i === active ? "true" : undefined} />
          ))}
        </div>
      )}
      {nextId && (
        <a href={`#${nextId}`} className="hero-down" aria-label="Scroll to products"><ChevronDown /></a>
      )}
    </section>
  );
}
