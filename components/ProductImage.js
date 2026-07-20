"use client";
// Image with a graceful fallback: if the photo fails to load,
// show a soft gradient instead of a broken icon.
import { useState } from "react";

export default function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`img-fallback ${className || ""}`} aria-label={alt} />;
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
