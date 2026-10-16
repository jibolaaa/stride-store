// Product catalog. Prices are in KOBO (N1 = 100 kobo) so all money
// math is integer-safe. N45,000 = 4500000 kobo.
export const products = [
  {
    id: "court-classic-01",
    code: "ST-101",
    name: "Court Classic 01",
    price_kobo: 4500000,
    tag: "Bestseller",
    rating: 4.8, reviews: 214,
    sizes: [40, 41, 42, 43, 44, 45],
    description: "A clean white court sneaker with a low profile. Leather upper, cushioned insole, everyday comfort.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "velocity-runner",
    code: "ST-214",
    name: "Velocity Runner",
    price_kobo: 6800000,
    tag: "New",
    rating: 4.6, reviews: 98,
    sizes: [40, 41, 42, 43, 44],
    description: "Lightweight knit runner built for pace. Breathable mesh, responsive foam midsole.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "lagos-lowtop",
    code: "ST-118",
    name: "Lagos Lowtop",
    price_kobo: 5200000,
    tag: null,
    rating: 4.7, reviews: 156,
    sizes: [39, 40, 41, 42, 43, 44, 45],
    description: "Minimal lowtop made for the city. Durable canvas, rubber outsole, goes with everything.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "aero-knit",
    code: "ST-305",
    name: "Aero Knit",
    price_kobo: 7500000,
    tag: "New",
    rating: 4.5, reviews: 64,
    sizes: [40, 41, 42, 43, 44, 45, 46],
    description: "Sock-fit knit upper with a sculpted sole. Feather-light, street-ready.",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "street-proof",
    code: "ST-402",
    name: "Street Proof",
    price_kobo: 8900000,
    tag: null,
    rating: 4.9, reviews: 187,
    sizes: [41, 42, 43, 44, 45],
    description: "Chunky silhouette, layered panels, maximum presence. Built to be seen.",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "midnight-motion",
    code: "ST-226",
    name: "Midnight Motion",
    price_kobo: 7200000,
    tag: null,
    rating: 4.6, reviews: 121,
    sizes: [40, 41, 42, 43, 44, 45],
    description: "All-black everything. Matte finish, reflective heel detail for night runs.",
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "daybreak-mesh",
    code: "ST-231",
    name: "Daybreak Mesh",
    price_kobo: 5900000,
    tag: null,
    rating: 4.4, reviews: 77,
    sizes: [39, 40, 41, 42, 43],
    description: "Soft pastel mesh trainer with a cloud-step midsole. Light as morning.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "vault-high",
    code: "ST-509",
    name: "Vault High",
    price_kobo: 9800000,
    tag: "Limited",
    rating: 4.9, reviews: 45,
    sizes: [41, 42, 43, 44],
    description: "High-top statement pair. Premium suede overlays, padded collar, limited run.",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=70"
  }
];

export const getProduct = (id) => products.find(p => p.id === id);

// Every size the store carries, smallest to largest. Used to print the
// size run on each product, with sizes that are out of stock greyed out.
export const ALL_SIZES = [...new Set(products.flatMap(p => p.sizes))].sort((a, b) => a - b);
