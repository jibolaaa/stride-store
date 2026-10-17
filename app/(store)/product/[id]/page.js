import { notFound } from "next/navigation";
import { getProduct, products } from "../../../../lib/products";
import { naira } from "../../../../lib/format";
import ProductView from "../../../../components/ProductView";

export function generateStaticParams() {
  return products.map(p => ({ id: p.id }));
}
export const dynamicParams = false;

export function generateMetadata({ params }) {
  const p = getProduct(params.id);
  if (!p) return {};
  return {
    title: `${p.name}, ${p.colour}`,
    description: `${p.name} in ${p.colour.toLowerCase()}, ${naira(p.price_kobo)}. ${p.description}`,
    openGraph: { images: [p.images[0]] }
  };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.id);
  if (!product) notFound();
  return <ProductView id={product.id} />;
}
