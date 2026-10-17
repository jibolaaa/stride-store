"use client";
// Full-width photos you can swipe (Embla Carousel). It moves on by itself
// every 6 seconds until you touch it. As you scroll down, the photo drifts
// slower than the page and the words lift away (Motion).
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const words = (text) => text.split(" ").map((w, i, all) => (
  <span key={i}>
    <span className="w" style={{ "--i": i }}><span>{w}</span></span>{i < all.length - 1 ? " " : ""}
  </span>
));

export default function HeroSlider({ slides }) {
  const section = useRef(null);
  const reduce = useReducedMotion();
  const autoplay = useRef(null);
  if (!autoplay.current) autoplay.current = Autoplay({ delay: 6000, stopOnInteraction: true });
  const [viewport, api] = useEmblaCarousel({ loop: true, duration: 34 }, reduce ? [] : [autoplay.current]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    const onTouch = () => setPaused(true);
    onSelect();
    api.on("select", onSelect).on("pointerDown", onTouch);
    return () => { api.off("select", onSelect).off("pointerDown", onTouch); };
  }, [api]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const copyFade = useTransform(scrollYProgress, [0, .6], [1, 0]);

  const goTo = (i) => {
    setPaused(true);
    autoplay.current?.stop();
    api?.scrollTo(i);
  };

  return (
    <section ref={section} className={`hero ${paused || reduce ? "paused" : ""}`} aria-roledescription="carousel" aria-label="Featured">
      <div className="hero-viewport" ref={viewport}>
        <div className="hero-track">
          {slides.map((s, i) => (
            <div className={`slide ${i === active ? "is-active" : ""}`} key={s.title} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
              <motion.div className="slide-media" style={reduce ? undefined : { y: mediaY }}>
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
                  draggable={false}
                />
              </motion.div>
              <motion.div className="slide-copy" style={reduce ? undefined : { y: copyY, opacity: copyFade }}>
                <h2 className="slide-title">{words(s.title)}</h2>
                <p className="slide-sub">{s.sub}</p>
                <Link href={s.href} className="btn light" tabIndex={i === active ? 0 : -1} draggable={false}>{s.cta}</Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="hero-progress">
          {slides.map((s, i) => (
            <button key={s.title} type="button" className={i === active ? "on" : ""} onClick={() => goTo(i)} aria-label={`Show slide ${i + 1}`} aria-current={i === active ? "true" : undefined}>
              <span key={i === active ? `on-${active}` : "off"} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
