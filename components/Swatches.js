import Link from "next/link";
import { siblings } from "../lib/products";

// Round colour dots. Two-colour shoes show both colours split down the middle.
export function Swatch({ colours, on = false }) {
  const bg = colours.length > 1
    ? `linear-gradient(135deg, ${colours[0]} 0 50%, ${colours[1]} 50% 100%)`
    : colours[0];
  return <span className={`swatch ${on ? "on" : ""}`} style={{ background: bg }} />;
}

// On a product card: one dot per colourway. Plain spans, because the
// whole card is already a link.
export function CardSwatches({ product }) {
  const sibs = siblings(product);
  if (sibs.length < 2) return null;
  return (
    <span className="card-swatches" aria-label={`${sibs.length} colours`}>
      {sibs.map(s => <Swatch key={s.id} colours={s.swatch} on={s.id === product.id} />)}
    </span>
  );
}

// On a product page: each colourway links to its own page, carrying the
// chosen size along (?size=42) so it stays picked after the switch.
export function ColourPicker({ product, size }) {
  const sibs = siblings(product);
  return (
    <div className="colour-pick">
      <p className="opt-label">Colour <span>{product.colour}</span></p>
      {sibs.length > 1 && (
        <div className="colour-row">
          {sibs.map(s => (
            <Link key={s.id} href={`/product/${s.id}${size ? `?size=${size}` : ""}`} className={`colour-opt ${s.id === product.id ? "on" : ""}`} aria-label={s.colour} aria-current={s.id === product.id ? "true" : undefined} replace scroll={false}>
              <Swatch colours={s.swatch} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
