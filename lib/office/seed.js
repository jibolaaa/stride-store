// Demo data for the back office: the STRIDE catalogue with shop stock,
// four staff accounts and a week of sales, so every screen has something
// to show. The same input always gives the same data.
import { products } from "../products";
import { CREATE, DROP } from "./schema";
import { hashPassword } from "./password";

export const DEMO_PASSWORD = "stride123";
export const DEMO_STAFF = [
  { name: "Ada Okafor", email: "owner@stride.test", role: "owner" },
  { name: "Tunde Bello", email: "manager@stride.test", role: "manager" },
  { name: "Chioma Eze", email: "cashier@stride.test", role: "cashier" },
  { name: "Musa Abdullahi", email: "musa@stride.test", role: "cashier" }
];

// Small seeded random number generator (mulberry32).
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, list) => list[Math.floor(r() * list.length)];
const weighted = (r, pairs) => {
  const total = pairs.reduce((n, [, w]) => n + w, 0);
  let x = r() * total;
  for (const [v, w] of pairs) { if ((x -= w) < 0) return v; }
  return pairs[pairs.length - 1][0];
};

// Lagos is UTC+1 all year. Midnight in Lagos, `daysAgo` days back, as a UTC time.
function lagosMidnight(daysAgo, now = new Date()) {
  const lagos = new Date(now.getTime() + 3600_000);
  return Date.UTC(lagos.getUTCFullYear(), lagos.getUTCMonth(), lagos.getUTCDate() - daysAgo) - 3600_000;
}

export async function createSchema(run, { fresh = false } = {}) {
  if (fresh) for (const s of DROP) await run(s);
  for (const s of CREATE) await run(s);
}

export async function seedDemo(run, now = new Date()) {
  const r = rng(2026);

  // Staff
  const hash = await hashPassword(DEMO_PASSWORD);
  const staffIds = {};
  for (const s of DEMO_STAFF) {
    const row = await run("insert into office_staff (name, email, password_hash, role, demo) values ($1, $2, $3, $4, true) returning id", [s.name, s.email, hash, s.role]);
    staffIds[s.email] = row[0].id;
  }

  // Products: the shop pays about 58% of the selling price.
  const P = products;
  await run(
    `insert into office_products (id, name, colour, gender, type, price_kobo, cost_kobo, image, low_stock_at)
     select * from unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::int[], $7::int[], $8::text[], $9::int[])`,
    [P.map(p => p.id), P.map(p => p.name), P.map(p => p.colour), P.map(p => p.gender), P.map(p => p.type),
     P.map(p => p.price_kobo), P.map(p => Math.round(p.price_kobo * 0.58 / 10000) * 10000), P.map(p => p.images[0]), P.map(() => 1)]
  );

  // Shop stock per size, and the starting count in the history a week ago.
  // Sizes that are sold out on the website are thin in the shop too.
  const rs = rng(7);
  const stock = new Map();
  const rows = { pid: [], size: [], qty: [] };
  for (const p of P) {
    for (const [size, w] of Object.entries(p.sizes)) {
      const qty = w === 0 ? [0, 1, 2, 2, 3, 3, 4, 4][Math.floor(rs() * 8)] : w + 3;
      stock.set(`${p.id}:${size}`, qty);
      rows.pid.push(p.id); rows.size.push(Number(size)); rows.qty.push(qty);
    }
  }
  await run("insert into office_stock (product_id, size, qty) select * from unnest($1::text[], $2::int[], $3::int[])", [rows.pid, rows.size, rows.qty]);
  const start = new Date(lagosMidnight(7, now) + 8 * 3600_000).toISOString();
  await run(
    `insert into office_movements (product_id, size, change, qty_after, reason, note, staff_id, created_at)
     select pid, sz, q, q, 'setup', null, $4, $5 from unnest($1::text[], $2::int[], $3::int[]) as t(pid, sz, q) where q > 0`,
    [rows.pid, rows.size, rows.qty, staffIds["owner@stride.test"], start]
  );

  // A week of sales, busier on Saturdays, between 10am and 8pm Lagos time.
  const sellers = [[staffIds["cashier@stride.test"], 45], [staffIds["musa@stride.test"], 35], [staffIds["manager@stride.test"], 20]];
  const payments = [["transfer", 45], ["cash", 30], ["card", 25]];
  const productWeights = P.map(p => [p, p.tags.includes("bestseller") ? 3 : p.tags.includes("new") ? 2 : 1]);
  let made = 0;
  for (let day = 6; day >= 0; day--) {
    const midnight = lagosMidnight(day, now);
    const weekday = new Date(midnight + 3600_000).getUTCDay();
    let count = 5 + Math.floor(r() * 5) + (weekday === 6 ? 3 : 0);
    const times = [];
    for (let i = 0; i < count; i++) times.push(midnight + (10 * 60 + Math.floor(r() * 600)) * 60_000);
    times.sort((a, b) => a - b);
    for (const t of times) {
      if (t > now.getTime()) continue; // nothing in the future
      const lines = [];
      const nLines = weighted(r, [[1, 70], [2, 25], [3, 5]]);
      for (let k = 0; k < nLines; k++) {
        const p = weighted(r, productWeights);
        const sizes = Object.keys(p.sizes).filter(s => (stock.get(`${p.id}:${s}`) || 0) > 1);
        if (!sizes.length) continue;
        const size = Number(pick(r, sizes));
        if (lines.some(l => l.product_id === p.id && l.size === size)) continue;
        const qty = r() < .9 ? 1 : 2;
        const key = `${p.id}:${size}`;
        if ((stock.get(key) || 0) < qty) continue;
        stock.set(key, stock.get(key) - qty);
        lines.push({ product_id: p.id, size, qty });
      }
      if (!lines.length) continue;
      await run("select office_record_sale($1, $2::jsonb, $3, $4, $5)", [weighted(r, sellers), JSON.stringify(lines), weighted(r, payments), null, new Date(t).toISOString()]);
      made++;
    }
    // A supplier delivery three days ago.
    if (day === 3) {
      const at = new Date(midnight + 9 * 3600_000).toISOString();
      for (const id of ["studio-white", "classic-low-white", "street-proof-red"]) {
        const p = P.find(x => x.id === id);
        for (const size of Object.keys(p.sizes).slice(1, 4)) {
          await run("select office_move_stock($1, $2, $3, $4, 'restock', 'Delivery from supplier', $5)", [staffIds["manager@stride.test"], id, Number(size), 3, at]);
          stock.set(`${id}:${size}`, (stock.get(`${id}:${size}`) || 0) + 3);
        }
      }
    }
  }
  return { staff: DEMO_STAFF.length, products: P.length, sales: made };
}
