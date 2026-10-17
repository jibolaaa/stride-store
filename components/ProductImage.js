"use client";
// Product photo with a plain fallback if the image fails to load.
import { useEffect, useRef, useState } from "react";

export default function ProductImage({ src, alt, className = "", priority = false }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);

  // An image can fail before the page's JavaScript is ready, so onError
  // never fires. Check once on mount as well.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (failed) {
    return alt
      ? <div className={`img-fallback ${className}`} role="img" aria-label={alt} />
      : <div className={`img-fallback ${className}`} aria-hidden="true" />;
  }
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      width="800"
      height="800"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
