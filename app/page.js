import Link from "next/link";
import { products, isSoldOut, onSale, salePercent } from "../lib/products";
import { FREE_DELIVERY_FROM_KOBO } from "../lib/pricing";
import { nairaWhole } from "../lib/format";
import HeroSlider from "../components/HeroSlider";
import ProductRow from "../components/ProductRow";
import NewsletterForm from "../components/NewsletterForm";
import { ChatIcon, LockIcon, ReturnIcon, TruckIcon } from "../components/Icons";

// Free Unsplash photos, sized for phones and big screens.
const photo = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const responsive = (id) => ({ image: photo(id, 1400), srcSet: [800, 1400, 2000].map(w => `${photo(id, w)} ${w}w`).join(", ") });

const tagged = (tag) => products.filter(p => p.tags.includes(tag) && !isSoldOut(p));
const onSaleNow = products.filter(p => onSale(p) && !isSoldOut(p));
const biggestSaving = Math.max(...onSaleNow.map(salePercent));

const slides = [
  { title: "New season pairs", sub: "Fresh pairs, delivered across Lagos in 1 to 2 working days.", href: "/collections/new-in", ...responsive("1783945345850-82f0b7fd38d3") },
  { title: "Best sellers", sub: "The pairs people keep coming back for.", href: "/collections/bestsellers", ...responsive("1590333748338-d629e4564ad9") },
  { title: `Up to ${biggestSaving}% off`, sub: "Good pairs at smaller prices, while sizes last.", href: "/collections/sale", ...responsive("1625697501168-8db2e03c1046") }
];

const categories = [
  { label: "Men", href: "/collections/men", image: photo("1622760806364-5ccac8096b59", 900) },
  { label: "Women", href: "/collections/women", image: photo("1588117305388-c2631a279f82", 900) },
  { label: "Kids", href: "/collections/kids", image: photo("1636130748629-655be0c60041", 900) }
];

export default function Home() {
  return (
    <>
      <h1 className="sr-only">STRIDE, sneakers delivered across Lagos</h1>
      <HeroSlider slides={slides} nextId="new-in" />

      <ProductRow id="new-in" tagline="Just landed" title="New in" products={tagged("new")} cta="Shop new in" href="/collections/new-in" />

      <section className="cats" aria-labelledby="cats-title">
        <div className="section-head">
          <p className="kicker">Find your fit</p>
          <h2 id="cats-title" className="section-title">Shop by category</h2>
        </div>
        <div className="cat-row">
          {categories.map(c => (
            <Link key={c.href} href={c.href} className="cat">
              <img src={c.image} alt="" loading="lazy" decoding="async" />
              <span className="cat-label"><b>{c.label}</b><span>Shop now</span></span>
            </Link>
          ))}
        </div>
      </section>

      <ProductRow id="best" tagline="Loved in Lagos" title="Best sellers" products={tagged("bestseller")} cta="Shop best sellers" href="/collections/bestsellers" />

      <section className="feature" aria-labelledby="feature-title">
        <div className="feature-img">
          <img src={photo("1542291026-7eec264c27ff", 1200)} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="feature-copy">
          <p className="kicker">Running</p>
          <h2 id="feature-title" className="feature-title">Made for Lagos miles</h2>
          <p>Light knits, soft foam and grippy soles for early runs and long commutes.</p>
          <Link href="/collections/running" className="btn light">Shop running</Link>
        </div>
      </section>

      <ProductRow id="sale" tagline="Smaller prices" title="On sale" products={onSaleNow} cta="Shop the sale" href="/collections/sale" band={false} />

      <ul className="trust" aria-label="Why shop with STRIDE">
        <li><TruckIcon /><b>Free Lagos delivery</b><span>On orders from {nairaWhole(FREE_DELIVERY_FROM_KOBO)}</span></li>
        <li><ReturnIcon /><b>7-day returns</b><span>Unworn pairs, in the box</span></li>
        <li><LockIcon /><b>Secure payment</b><span>Card, transfer or USSD through Paystack</span></li>
        <li><ChatIcon /><b>Help on WhatsApp</b><span>Questions answered the same day</span></li>
      </ul>

      <section className="newsletter" aria-labelledby="news-title">
        <p className="kicker">Stay in the loop</p>
        <h2 id="news-title" className="section-title">Join the list</h2>
        <p className="news-sub">New drops and restocks, once a week at most.</p>
        <NewsletterForm />
      </section>
    </>
  );
}
