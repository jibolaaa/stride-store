// Filter, sort and search helpers for the shop pages.
import { genderLabel, onSale, isSoldOut, sizeList } from "./products";

const COLOUR_WORDS = { white: "White", black: "Black", grey: "Grey", gray: "Grey", red: "Red", maroon: "Red", blue: "Blue", green: "Green", pink: "Pink", orange: "Orange", brown: "Brown" };

export const colourFamilies = (p) =>
  [...new Set(p.colour.toLowerCase().split(/[^a-z]+/).map(w => COLOUR_WORDS[w]).filter(Boolean))];

export const PRICE_BANDS = [
  { id: "u50", label: "Under ₦50,000", test: k => k < 5000000 },
  { id: "50-80", label: "₦50,000 to ₦80,000", test: k => k >= 5000000 && k <= 8000000 },
  { id: "80-120", label: "₦80,000 to ₦120,000", test: k => k > 8000000 && k <= 12000000 },
  { id: "o120", label: "Over ₦120,000", test: k => k > 12000000 }
];

const TYPE_LABEL = { running: "Running", lifestyle: "Everyday", basketball: "Basketball" };
const GENDER_ORDER = ["men", "women", "unisex", "kids"];
const TYPE_ORDER = ["running", "lifestyle", "basketball"];
const inOrder = (order) => (a, b) => order.indexOf(a) - order.indexOf(b);

// `short` is what the toolbar shows; `label` is the full option text.
export const SORTS = [
  { id: "featured", label: "Featured", short: "Sort by" },
  { id: "new", label: "Newest", short: "Newest" },
  { id: "price-asc", label: "Price, low to high", short: "Price: low" },
  { id: "price-desc", label: "Price, high to low", short: "Price: high" },
  { id: "rating", label: "Top rated", short: "Top rated" }
];

// Every filter group, with the options that exist in this list of products
// and how many products each option would show.
export function filterGroups(list) {
  const count = (fn) => list.filter(fn).length;
  const uniq = (arr) => [...new Set(arr)];
  return [
    { key: "gender", title: "Category", options: uniq(list.map(p => p.gender)).sort(inOrder(GENDER_ORDER)).map(g => ({ value: g, label: genderLabel[g], n: count(p => p.gender === g) })) },
    { key: "type", title: "Style", options: uniq(list.map(p => p.type)).sort(inOrder(TYPE_ORDER)).map(t => ({ value: t, label: TYPE_LABEL[t], n: count(p => p.type === t) })) },
    { key: "size", title: "Size (EU)", grid: true, options: uniq(list.flatMap(sizeList)).sort((a, b) => a - b).map(s => ({ value: String(s), label: String(s), n: count(p => (p.sizes[s] ?? 0) > 0) })) },
    { key: "price", title: "Price", options: PRICE_BANDS.map(b => ({ value: b.id, label: b.label, n: count(p => b.test(p.price_kobo)) })).filter(o => o.n > 0) },
    { key: "colour", title: "Colour", options: uniq(list.flatMap(colourFamilies)).sort().map(c => ({ value: c, label: c, n: count(p => colourFamilies(p).includes(c)) })) }
  ].filter(g => g.options.length > 1);
}

export function applyFilters(list, f) {
  return list.filter(p =>
    (!f.gender?.length || f.gender.includes(p.gender)) &&
    (!f.type?.length || f.type.includes(p.type)) &&
    (!f.size?.length || f.size.some(s => (p.sizes[s] ?? 0) > 0)) &&
    (!f.price?.length || f.price.some(id => PRICE_BANDS.find(b => b.id === id)?.test(p.price_kobo))) &&
    (!f.colour?.length || f.colour.some(c => colourFamilies(p).includes(c))) &&
    (!f.saleOnly || onSale(p)) &&
    (!f.inStockOnly || !isSoldOut(p))
  );
}

export function sortProducts(list, sort) {
  const l = [...list];
  if (sort === "price-asc") return l.sort((a, b) => a.price_kobo - b.price_kobo);
  if (sort === "price-desc") return l.sort((a, b) => b.price_kobo - a.price_kobo);
  if (sort === "rating") return l.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  if (sort === "new") return l.sort((a, b) => Number(b.tags.includes("new")) - Number(a.tags.includes("new")));
  // featured: in-stock first, keep catalogue order otherwise
  return l.sort((a, b) => Number(isSoldOut(a)) - Number(isSoldOut(b)));
}

export const activeCount = (f) =>
  ["gender", "type", "size", "price", "colour"].reduce((n, k) => n + (f[k]?.length || 0), 0) + (f.saleOnly ? 1 : 0) + (f.inStockOnly ? 1 : 0);

// Search: every word typed must appear in the name, colour, category or style.
export const matchesQuery = (p, q) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = `${p.name} ${p.colour} ${genderLabel[p.gender]} ${p.type} ${TYPE_LABEL[p.type]}`.toLowerCase();
  return words.every(w => hay.includes(w));
};
