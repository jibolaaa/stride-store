import { notFound } from "next/navigation";
import { getProduct, products } from "../../../lib/products";
import { naira } from "../../../lib/format";
import ProductView from "../../../components/ProductView";

export function generateStaticParams() {
  return products.map(p => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const p = getProduct(params.id);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name}, ${naira(p.price_kobo)}. ${p.description}`,
    openGraph: { images: [p.image] }
  };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.id);
  if (!product) notFound();
  return <ProductView id={product.id} />;
}
