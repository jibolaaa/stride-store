import { Suspense } from "react";
import { notFound } from "next/navigation";
import { collections, getCollection } from "../../../../lib/products";
import CollectionView, { CollectionFromUrl } from "../../../../components/CollectionView";

export function generateStaticParams() {
  return Object.keys(collections).map(slug => ({ slug }));
}
export const dynamicParams = false;

export function generateMetadata({ params }) {
  const c = getCollection(params.slug);
  if (!c) return {};
  return { title: c.title, description: `${c.title} at STRIDE. ${c.tagline}. Delivered across Lagos.` };
}

export default function CollectionPage({ params }) {
  const c = getCollection(params.slug);
  if (!c) notFound();
  // The ready-made page shows the whole collection; a search (?q=) is applied in the browser.
  return (
    <Suspense key={c.slug} fallback={<CollectionView slug={c.slug} />}>
      <CollectionFromUrl slug={c.slug} />
    </Suspense>
  );
}
