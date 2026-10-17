"use client";
import { useEffect, useState } from "react";

// True when the media query matches. False on the server and first render.
export function useMediaQuery(query) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return match;
}
