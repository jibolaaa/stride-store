// Product catalog. Prices are in KOBO (N1 = 100 kobo) so all money
// math is integer-safe. N45,000 = 4500000 kobo.
export const products = [
  {
    id: "court-classic-01",
    name: "Court Classic 01",
    price_kobo: 4500000,
    tag: "Bestseller",
    description: "A clean white court sneaker with a low profile. Leather upper, cushioned insole, everyday comfort.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "velocity-runner",
    name: "Velocity Runner",
    price_kobo: 6800000,
    tag: "New",
    description: "Lightweight knit runner built for pace. Breathable mesh, responsive foam midsole.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "lagos-lowtop",
    name: "Lagos Lowtop",
    price_kobo: 5200000,
    tag: null,
    description: "Minimal lowtop made for the city. Durable canvas, rubber outsole, goes with everything.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "aero-knit",
    name: "Aero Knit",
    price_kobo: 7500000,
    tag: "New",
    description: "Sock-fit knit upper with a sculpted sole. Feather-light, street-ready.",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "street-proof",
    name: "Street Proof",
    price_kobo: 8900000,
    tag: null,
    description: "Chunky silhouette, layered panels, maximum presence. Built to be seen.",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "midnight-motion",
    name: "Midnight Motion",
    price_kobo: 7200000,
    tag: null,
    description: "All-black everything. Matte finish, reflective heel detail for night runs.",
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "daybreak-mesh",
    name: "Daybreak Mesh",
    price_kobo: 5900000,
    tag: null,
    description: "Soft pastel mesh trainer with a cloud-step midsole. Light as morning.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "vault-high",
    name: "Vault High",
    price_kobo: 9800000,
    tag: "Limited",
    description: "High-top statement pair. Premium suede overlays, padded collar, limited run.",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=70"
  }
];

export const getProduct = (id) => products.find(p => p.id === id);
