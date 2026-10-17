import { getCollection, isSoldOut, onSale, products, salePercent } from "../../lib/products";
import { DELIVERY_FEE_KOBO, FREE_DELIVERY_FROM_KOBO } from "../../lib/pricing";
import { nairaWhole } from "../../lib/format";
import HeroSlider from "../../components/HeroSlider";
import ProductRow from "../../components/ProductRow";
import RouteBand from "../../components/RouteBand";
import CategoryTiles from "../../components/CategoryTiles";

// Free Unsplash photos, sized for phones and big screens.
const photo = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const responsive = (id) => ({ image: photo(id, 1400), srcSet: [800, 1400, 2000].map(w => `${photo(id, w)} ${w}w`).join(", ") });

const tagged = (tag) => products.filter(p => p.tags.includes(tag) && !isSoldOut(p));
const onSaleNow = products.filter(p => onSale(p) && !isSoldOut(p));
const biggestSaving = Math.max(...onSaleNow.map(salePercent));
const newIn = tagged("new");
const best = tagged("bestseller");

const slides = [
  { title: "New season pairs", sub: "Fresh pairs, delivered across Lagos in 1 to 2 working days.", href: "/collections/new-in", cta: "Shop new in", ...responsive("1783945345850-82f0b7fd38d3") },
  { title: "Best sellers", sub: "The pairs people keep coming back for.", href: "/collections/bestsellers", cta: "Shop best sellers", ...responsive("1590333748338-d629e4564ad9") },
  { title: `Up to ${biggestSaving}% off`, sub: "Good pairs at smaller prices, while sizes last.", href: "/collections/sale", cta: "Shop the sale", ...responsive("1625697501168-8db2e03c1046") }
];

const tiles = [
  { label: "Men", href: "/collections/men", image: photo("1622760806364-5ccac8096b59", 900), count: getCollection("men").products.length },
  { label: "Women", href: "/collections/women", image: photo("1588117305388-c2631a279f82", 900), count: getCollection("women").products.length },
  { label: "Kids", href: "/collections/kids", image: photo("1636130748629-655be0c60041", 900), count: getCollection("kids").products.length }
];

export default function Home() {
  return (
    <>
      <h1 className="sr-only">STRIDE, sneakers delivered across Lagos</h1>
      <HeroSlider slides={slides} />
      <ProductRow id="new-in" title="New in" products={newIn} href="/collections/new-in" linkLabel={`See all ${newIn.length}`} />
      <RouteBand
        title="Delivered across Lagos"
        note={`1 to 2 working days. ${nairaWhole(DELIVERY_FEE_KOBO)}, or free from ${nairaWhole(FREE_DELIVERY_FROM_KOBO)}.`}
      />
      <CategoryTiles title="Shop by fit" tiles={tiles} />
      <ProductRow id="best" title="Best sellers" products={best} href="/collections/bestsellers" linkLabel={`See all ${best.length}`} />
      <ProductRow id="sale" title="On sale" products={onSaleNow} href="/collections/sale" linkLabel={`See all ${onSaleNow.length}`} />
    </>
  );
}
