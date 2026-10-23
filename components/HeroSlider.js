"use client";
// Full-width photos you can swipe (Embla Carousel). It moves on by itself
// every 6 seconds until you touch it. As you scroll down, the photo drifts
// slower than the page and the words lift away (Motion).
//
// PREVIEW ONLY: four ways for the photos to move, with a switcher at the
// bottom of the page so Ibrahim can pick one. The other three and the
// switcher come out before this goes live.
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const MODES = [
  { key: "slide", label: "Slide" },
  { key: "fade", label: "Fade" },
  { key: "zoom", label: "Zoom" },
  { key: "still", label: "Still" }
];

const words = (text) => text.split(" ").map((w, i, all) => (
  <span key={i}>
    <span className="w" style={{ "--i": i }}><span>{w}</span></span>{i < all.length - 1 ? " " : ""}
  </span>
));

export default function HeroSlider({ slides }) {
  const section = useRef(null);
  const reduce = useReducedMotion();
  const [mode, setMode] = useState("slide");
  useEffect(() => {
    let m = new URLSearchParams(window.location.search).get("motion");
    try { m = m || localStorage.getItem("stride_motion"); } catch {}
    if (MODES.some(x => x.key === m)) setMode(m);
  }, []);
  const plugins = useMemo(() => {
    if (reduce) return [];
    const list = [];
    if (mode !== "still") list.push(Autoplay({ delay: 6000, stopOnInteraction: true }));
    if (mode === "fade" || mode === "zoom") list.push(Fade());
    return list;
  }, [mode, reduce]);
  const [viewport, api] = useEmblaCarousel({ loop: true, duration: mode === "slide" ? 34 : 32 }, plugins);
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
    api?.plugins()?.autoplay?.stop();
    api?.scrollTo(i);
  };

  function pick(m) {
    setMode(m);
    setPaused(false);
    try { localStorage.setItem("stride_motion", m); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set("motion", m);
    window.history.replaceState(null, "", url);
  }

  return (
    <>
    <section ref={section} className={`hero m-${mode} ${paused || reduce || mode === "still" ? "paused" : ""}`} aria-roledescription="carousel" aria-label="Featured">
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
    <div className="motion-lab" role="group" aria-label="Preview only: how the photos move">
      <span>Photos</span>
      {MODES.map(m => (
        <button key={m.key} type="button" aria-pressed={mode === m.key} onClick={() => pick(m.key)}>{m.label}</button>
      ))}
    </div>
    </>
  );
}
