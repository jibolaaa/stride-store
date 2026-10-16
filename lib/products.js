// STRIDE catalogue. STRIDE is a fictional store; photos are free Unsplash photos.
// Prices are in KOBO (₦1 = 100 kobo) so all money maths stays in whole numbers.

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

// Sizes are EU. Each size maps to how many pairs are left (0 = sold out).
const MEN = [40, 41, 42, 43, 44, 45, 46];
const WOMEN = [36, 37, 38, 39, 40, 41];
const UNISEX = [38, 39, 40, 41, 42, 43, 44, 45];
const KIDS = [28, 29, 30, 31, 32, 33, 34, 35];
const stock = (sizes, counts) => Object.fromEntries(sizes.map((s, i) => [s, counts[i % counts.length]]));

export const products = [
  {
    id: "velocity-runner", name: "Velocity Runner", gender: "unisex", type: "running", tags: ["new"],
    colour: "Red", swatch: ["#c8102e"], price_kobo: 6800000,
    sizes: stock(UNISEX, [4, 6, 2, 5, 0, 3, 1, 2]), rating: 4.6, reviews: 98,
    images: [img("1542291026-7eec264c27ff")],
    description: "A light knit runner made for pace. Breathable mesh up top, springy foam underneath.",
    details: ["Knit upper that breathes on hot days", "Responsive foam midsole", "Rubber outsole with grip pods"]
  },
  {
    id: "pastel-court", name: "Pastel Court", gender: "women", type: "lifestyle", tags: ["bestseller"],
    colour: "Pastel pink", swatch: ["#e9b8c4", "#f6f1e7"], price_kobo: 5200000,
    sizes: stock(WOMEN, [3, 5, 6, 4, 2, 1]), rating: 4.8, reviews: 214,
    images: [img("1595950653106-6c9ebd614d3a")],
    description: "Soft pastel panels on a low court shape. Easy with jeans, easier with a sundress.",
    details: ["Suede and leather upper", "Padded collar", "Cupsole for all-day comfort"]
  },
  {
    id: "lagos-lite", name: "Lagos Lite", gender: "men", type: "running", tags: [],
    colour: "Grey", swatch: ["#9aa0a6"], price_kobo: 4900000, compare_kobo: 6100000,
    sizes: stock(MEN, [2, 0, 3, 4, 1, 0, 2]), rating: 4.7, reviews: 156,
    images: [img("1491553895911-0055eca6402d")],
    description: "An everyday runner that doesn't mind traffic, puddles or a long day on your feet.",
    details: ["Engineered mesh upper", "Cushioned heel", "Grippy rubber outsole"]
  },
  {
    id: "aero-knit", name: "Aero Knit", gender: "men", type: "running", tags: ["new"],
    colour: "Green and black", swatch: ["#2e7d4f", "#1a1a1a"], price_kobo: 7500000,
    sizes: stock(MEN, [3, 4, 5, 2, 3, 1, 0]), rating: 4.5, reviews: 64,
    images: [img("1606107557195-0e29a4b5b4aa")],
    description: "A sock-fit knit upper on a sculpted sole. Light, quick and loud in the best way.",
    details: ["Sock-fit knit upper", "Sculpted foam sole", "Pull tab at the heel"]
  },
  {
    id: "street-proof-red", family: "street-proof", name: "Street Proof", gender: "men", type: "lifestyle", tags: ["bestseller"],
    colour: "White and red", swatch: ["#ffffff", "#c8102e"], price_kobo: 8900000,
    sizes: stock(MEN, [4, 5, 3, 6, 2, 2, 1]), rating: 4.9, reviews: 187,
    images: [img("1600185365483-26d7a4cc7519")],
    description: "Layered panels and a chunky sole. Built to be seen and worn every day.",
    details: ["Leather and mesh upper", "Chunky foam sole", "Padded tongue and collar"]
  },
  {
    id: "street-proof-orange", family: "street-proof", name: "Street Proof", gender: "men", type: "lifestyle", tags: ["new"],
    colour: "White and orange", swatch: ["#ffffff", "#f06a1d"], price_kobo: 8900000,
    sizes: stock(MEN, [2, 3, 4, 3, 1, 0, 0]), rating: 4.8, reviews: 41,
    images: [img("1600185365926-3a2ce3cdb9eb")],
    description: "The Street Proof with orange hits. Same chunky sole, same all-day comfort.",
    details: ["Leather and mesh upper", "Chunky foam sole", "Padded tongue and collar"]
  },
  {
    id: "street-proof-black", family: "street-proof", name: "Street Proof", gender: "men", type: "lifestyle", tags: [],
    colour: "White, red and black", swatch: ["#1a1a1a", "#c8102e"], price_kobo: 9200000,
    sizes: stock(MEN, [1, 2, 2, 3, 2, 1, 1]), rating: 4.9, reviews: 73,
    images: [img("1600185365778-7875a359b924")],
    description: "The Street Proof in its boldest colours, with a black base that hides the dust.",
    details: ["Leather and mesh upper", "Chunky foam sole", "Padded tongue and collar"]
  },
  {
    id: "daybreak-mesh", name: "Daybreak Mesh", gender: "women", type: "running", tags: [],
    colour: "White and orange", swatch: ["#ffffff", "#f39a4a"], price_kobo: 5900000,
    sizes: stock(WOMEN, [2, 4, 5, 3, 2, 0]), rating: 4.4, reviews: 77,
    images: [img("1560769629-975ec94e6a86")],
    description: "A soft mesh trainer with a cloud-step midsole. Light enough to forget you're wearing it.",
    details: ["Breathable mesh upper", "Soft foam midsole", "Reflective heel tab"]
  },
  {
    id: "vault-plimsoll", name: "Vault Plimsoll", gender: "unisex", type: "lifestyle", tags: [],
    colour: "Maroon", swatch: ["#6d1f2b"], price_kobo: 3800000, compare_kobo: 4800000,
    sizes: stock(UNISEX, [3, 2, 4, 0, 5, 3, 1, 0]), rating: 4.3, reviews: 52,
    images: [img("1525966222134-fcfa99b8ae77")],
    description: "A simple canvas plimsoll in deep maroon. Slip on, lace up, go.",
    details: ["Cotton canvas upper", "Vulcanised rubber sole", "Cushioned insole"]
  },
  {
    id: "studio-white", name: "Studio White", gender: "men", type: "lifestyle", tags: ["bestseller"],
    colour: "White", swatch: ["#ffffff"], price_kobo: 8500000,
    sizes: stock(MEN, [5, 6, 4, 6, 3, 2, 1]), rating: 4.9, reviews: 302,
    images: [img("1608229751021-ed4bd8677753"), img("1608230164697-c791326d284c"), img("1608231387042-66d1773070a5")],
    description: "The all-white pair that goes with everything. Clean leather, perforated sides, no fuss.",
    details: ["Full-grain leather upper", "Perforated side panels for air", "Stitched rubber cupsole"]
  },
  {
    id: "hoop-pro-red", family: "hoop-pro", name: "Hoop Pro", gender: "men", type: "basketball", tags: ["limited"],
    colour: "Black and red", swatch: ["#1a1a1a", "#c8102e"], price_kobo: 12000000,
    sizes: stock(MEN, [1, 2, 1, 0, 2, 1, 0]), rating: 4.8, reviews: 36,
    images: [img("1710553455489-710f59318f84"), img("1710553455491-482fa1751dc4")],
    description: "A court shoe with real ankle support. Built for the half-court and the street after.",
    details: ["High collar for ankle support", "Herringbone traction outsole", "Limited run"]
  },
  {
    id: "hoop-pro-orange", family: "hoop-pro", name: "Hoop Pro", gender: "men", type: "basketball", tags: ["limited"],
    colour: "Black and orange", swatch: ["#1a1a1a", "#f06a1d"], price_kobo: 12000000,
    sizes: stock(MEN, [0, 1, 2, 1, 1, 0, 1]), rating: 4.7, reviews: 22,
    images: [img("1710553455716-a0d7ad18452b")],
    description: "The Hoop Pro in black and orange. Same support, louder colours.",
    details: ["High collar for ankle support", "Herringbone traction outsole", "Limited run"]
  },
  {
    id: "pace-trainer", name: "Pace Trainer", gender: "women", type: "running", tags: ["new"],
    colour: "White", swatch: ["#ffffff"], price_kobo: 7200000,
    sizes: stock(WOMEN, [3, 4, 4, 2, 2, 1]), rating: 4.7, reviews: 58,
    images: [img("1637437757614-6491c8e915b5"), img("1637437411360-b4607d62ddd3"), img("1637437735621-22472eee4875"), img("1637437411826-bab0dc76a310")],
    description: "A daily trainer with a smooth heel-to-toe ride. For the gym, the track or the long walk home.",
    details: ["Lightweight mesh upper", "Rocker-shaped foam sole", "Padded heel"]
  },
  {
    id: "court-high", name: "Court High", gender: "men", type: "lifestyle", tags: [],
    colour: "White", swatch: ["#ffffff"], price_kobo: 9500000,
    sizes: stock(MEN, [2, 3, 3, 2, 1, 1, 0]), rating: 4.6, reviews: 88,
    images: [img("1512374382149-233c42b6a83b")],
    description: "A clean white high-top with a padded collar. Lace it loose or all the way up.",
    details: ["Leather upper", "Padded high collar", "Rubber cupsole"]
  },
  {
    id: "classic-low-white", family: "classic-low", name: "Classic Low", gender: "unisex", type: "lifestyle", tags: ["bestseller"],
    colour: "Triple white", swatch: ["#ffffff"], price_kobo: 7800000,
    sizes: stock(UNISEX, [6, 5, 4, 6, 5, 3, 2, 1]), rating: 5.0, reviews: 412,
    images: [img("1597350584914-55bb62285896")],
    description: "The low-top everyone owns for a reason. White on white, goes with anything.",
    details: ["Leather upper", "Air-cushioned sole", "Perforated toe box"]
  },
  {
    id: "classic-low-panda", family: "classic-low", name: "Classic Low", gender: "unisex", type: "lifestyle", tags: [],
    colour: "White and black", swatch: ["#ffffff", "#1a1a1a"], price_kobo: 7800000,
    sizes: stock(UNISEX, [2, 3, 0, 4, 3, 2, 0, 1]), rating: 4.9, reviews: 167,
    images: [img("1587563871167-1ee9c731aefb")],
    description: "The Classic Low with black overlays. Two colours, zero effort.",
    details: ["Leather upper", "Air-cushioned sole", "Perforated toe box"]
  },
  {
    id: "retro-high", name: "Retro High", gender: "men", type: "lifestyle", tags: ["limited"],
    colour: "Grey and white", swatch: ["#8e9196", "#ffffff"], price_kobo: 15000000,
    sizes: stock(MEN, [1, 0, 2, 1, 1, 0, 0]), rating: 4.9, reviews: 58,
    images: [img("1542219550-37153d387c27")],
    description: "A retro high-top in cool grey. Limited pairs, and they don't come back.",
    details: ["Leather upper with suede overlays", "Padded high collar", "Limited run"]
  },
  {
    id: "cloud-runner", name: "Cloud Runner", gender: "unisex", type: "running", tags: [],
    colour: "Blue and white", swatch: ["#2f6fd1", "#ffffff"], price_kobo: 6600000,
    sizes: stock(UNISEX, [3, 4, 2, 5, 3, 2, 2, 1]), rating: 4.6, reviews: 104,
    images: [img("1571008887538-b36bb32f4571")],
    description: "Plenty of cushion for long runs and longer days. Blue that stays bright.",
    details: ["Knit upper", "Thick foam midsole", "Heel counter for a locked-in fit"]
  },
  {
    id: "stone-runner", name: "Stone Runner", gender: "men", type: "running", tags: [],
    colour: "Grey", swatch: ["#7d8187"], price_kobo: 5800000, compare_kobo: 7000000,
    sizes: stock(MEN, [2, 2, 3, 1, 0, 1, 1]), rating: 4.5, reviews: 61,
    images: [img("1562183241-b937e95585b6")],
    description: "A steady grey runner for daily miles. Hides dirt, takes a beating.",
    details: ["Mesh upper", "Dual-density foam", "Durable rubber outsole"]
  },
  {
    id: "mono-knit", name: "Mono Knit", gender: "women", type: "running", tags: [],
    colour: "Grey and white", swatch: ["#b9bcc0", "#ffffff"], price_kobo: 6900000,
    sizes: stock(WOMEN, [2, 3, 3, 2, 1, 0]), rating: 4.6, reviews: 49,
    images: [img("1518656306295-aa28b28b2504")],
    description: "A one-piece knit upper that moves with your foot. Light and quietly good-looking.",
    details: ["One-piece knit upper", "Flexible foam sole", "Pull loop at the heel"]
  },
  {
    id: "night-runner", name: "Night Runner", gender: "men", type: "running", tags: ["new"],
    colour: "Black", swatch: ["#1a1a1a"], price_kobo: 6400000,
    sizes: stock(MEN, [3, 4, 5, 4, 2, 2, 1]), rating: 4.7, reviews: 33,
    images: [img("1786379582231-f4a593cacf2d")],
    description: "Black upper, white sole, no distractions. For early runs and late ones.",
    details: ["Mesh upper", "White foam sole", "Reflective details"]
  },
  {
    id: "everyday-low-grey", family: "everyday-low", name: "Everyday Low", gender: "women", type: "lifestyle", tags: [],
    colour: "Grey", swatch: ["#a7a9ac"], price_kobo: 4500000, compare_kobo: 5200000,
    sizes: stock(WOMEN, [3, 2, 4, 3, 1, 1]), rating: 4.4, reviews: 70,
    images: [img("1544441892-83af2e53ea48")],
    description: "A simple low-top for every day of the week. Soft, light and easy to clean.",
    details: ["Canvas upper", "Cushioned insole", "Rubber sole"]
  },
  {
    id: "everyday-low-white", family: "everyday-low", name: "Everyday Low", gender: "women", type: "lifestyle", tags: ["bestseller"],
    colour: "White", swatch: ["#ffffff"], price_kobo: 4500000,
    sizes: stock(WOMEN, [4, 5, 5, 3, 2, 2]), rating: 4.6, reviews: 128,
    images: [img("1544441892-794166f1e3be")],
    description: "The Everyday Low in white. Pairs with everything in your wardrobe.",
    details: ["Canvas upper", "Cushioned insole", "Rubber sole"]
  },
  {
    id: "rose-canvas", name: "Rose Canvas", gender: "women", type: "lifestyle", tags: [],
    colour: "Pink", swatch: ["#f2a7b8"], price_kobo: 3200000,
    sizes: stock(WOMEN, [2, 3, 4, 2, 0, 1]), rating: 4.5, reviews: 66,
    images: [img("1645740369993-c266df18eec1")],
    description: "A pink canvas sneaker with white laces. Simple, bright and light on the wallet.",
    details: ["Cotton canvas upper", "Vulcanised rubber sole", "Metal eyelets"]
  },
  {
    id: "ember", name: "Ember", gender: "women", type: "lifestyle", tags: ["new"],
    colour: "Red", swatch: ["#d2232a"], price_kobo: 5500000,
    sizes: stock(WOMEN, [2, 2, 3, 3, 1, 1]), rating: 4.7, reviews: 19,
    images: [img("1645959227827-905456533e13")],
    description: "Red from heel to toe, with crisp white laces. A pair that starts conversations.",
    details: ["Suede upper", "Cushioned insole", "Rubber sole"]
  },
  {
    id: "desert-low", name: "Desert Low", gender: "men", type: "lifestyle", tags: [],
    colour: "Brown", swatch: ["#8a5a35"], price_kobo: 6200000,
    sizes: stock(MEN, [2, 3, 2, 3, 2, 1, 0]), rating: 4.5, reviews: 44,
    images: [img("1549298916-b41d501d3772")],
    description: "Warm brown tones on a classic low shape. Dresses up as easily as it dresses down.",
    details: ["Suede and leather upper", "Padded collar", "Gum-style rubber sole"]
  },
  {
    id: "mini-runner", name: "Mini Runner", gender: "kids", type: "running", tags: ["new"],
    colour: "White and red", swatch: ["#ffffff", "#c8102e"], price_kobo: 2800000,
    sizes: stock(KIDS, [3, 4, 4, 3, 2, 2, 1, 0]), rating: 4.8, reviews: 27,
    images: [img("1584564515943-b54cbb61836b")],
    description: "A light little runner for school, the playground and everything in between.",
    details: ["Easy hook-and-loop strap", "Soft mesh upper", "Grippy rubber sole"]
  },
  {
    id: "mini-court", name: "Mini Court", gender: "kids", type: "lifestyle", tags: [],
    colour: "Black and white", swatch: ["#1a1a1a", "#ffffff"], price_kobo: 3000000,
    sizes: stock(KIDS, [2, 3, 3, 2, 2, 1, 1, 1]), rating: 4.6, reviews: 18,
    images: [img("1605382165091-443eff32caf5")],
    description: "A classic court shoe sized down. Black and white, so it stays looking clean.",
    details: ["Synthetic leather upper", "Cushioned insole", "Rubber cupsole"]
  },
  {
    id: "mini-blue", name: "Mini Blue", gender: "kids", type: "lifestyle", tags: [],
    colour: "Blue", swatch: ["#3d6fb6"], price_kobo: 2600000, compare_kobo: 3200000,
    sizes: stock(KIDS, [2, 2, 3, 1, 2, 0, 1, 1]), rating: 4.5, reviews: 12,
    images: [img("1678192568478-9488ee55def6"), img("1678192569393-c7aff066e5bd"), img("1678192568444-78b428b7cd1a")],
    description: "Bright blue sneakers kids actually want to put on. Easy on, easy off.",
    details: ["Soft upper", "Flexible sole for growing feet", "Padded collar"]
  }
];

export const getProduct = (id) => products.find(p => p.id === id);

// ---------- helpers ----------
export const totalStock = (p) => Object.values(p.sizes).reduce((a, b) => a + b, 0);
export const isSoldOut = (p) => totalStock(p) === 0;
export const sizeList = (p) => Object.keys(p.sizes).map(Number).sort((a, b) => a - b);
export const inStock = (p, size) => (p.sizes[size] ?? 0) > 0;
export const onSale = (p) => !!p.compare_kobo && p.compare_kobo > p.price_kobo;
export const salePercent = (p) => onSale(p) ? Math.round((1 - p.price_kobo / p.compare_kobo) * 100) : 0;
export const siblings = (p) => p.family ? products.filter(x => x.family === p.family) : [p];
export const genderLabel = { men: "Men", women: "Women", kids: "Kids", unisex: "Unisex" };

// ---------- collections ----------
const fitsGender = (g) => (p) => p.gender === g || (g !== "kids" && p.gender === "unisex");

export const collections = {
  all: { title: "All sneakers", tagline: "Everything in store", match: () => true },
  "new-in": { title: "New in", tagline: "Fresh off the shelf", match: p => p.tags.includes("new") },
  bestsellers: { title: "Best sellers", tagline: "The pairs people keep coming back for", match: p => p.tags.includes("bestseller") },
  men: { title: "Men", tagline: "Men's and unisex pairs", match: fitsGender("men") },
  women: { title: "Women", tagline: "Women's and unisex pairs", match: fitsGender("women") },
  kids: { title: "Kids", tagline: "Sizes EU 28 to 35", match: p => p.gender === "kids" },
  running: { title: "Running", tagline: "Made for Lagos miles", match: p => p.type === "running" },
  lifestyle: { title: "Everyday", tagline: "For the walk, the office and the weekend", match: p => p.type === "lifestyle" },
  basketball: { title: "Basketball", tagline: "Support where you need it", match: p => p.type === "basketball" },
  sale: { title: "Sale", tagline: "Good pairs, smaller prices", match: onSale }
};

export const getCollection = (slug) => collections[slug] ? { slug, ...collections[slug], products: products.filter(collections[slug].match) } : null;
