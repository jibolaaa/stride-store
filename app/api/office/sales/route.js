// Record a sale at the till. The database takes the pairs out of stock in
// the same step; if any line can't be filled, nothing is recorded. Each sale
// carries a code from the till, so sending it again can't record it twice.
import { NextResponse } from "next/server";
import { q1 } from "../../../../lib/office/db";
import { apiStaff, CAN, fail } from "../../../../lib/office/session";

const PAYMENTS = ["cash", "transfer", "card"];

export async function POST(req) {
  const { staff, fail: denied } = await apiStaff(CAN.sell);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length || items.length > 30) return fail("Add at least one pair to the sale.");
  if (!PAYMENTS.includes(body.payment)) return fail("Choose how the customer paid.");
  // One line per shoe and size, in a fixed order, so two tills selling the
  // same shoes at once queue up instead of blocking each other.
  const merged = new Map();
  for (const it of items) {
    const qty = Number(it?.qty), size = Number(it?.size);
    if (typeof it?.product_id !== "string" || !Number.isInteger(size) || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return fail("One of the lines isn't valid. Remove it and add it again.");
    }
    const key = `${it.product_id}:${size}`;
    const line = merged.get(key) || { product_id: it.product_id, size, qty: 0 };
    line.qty += qty;
    if (line.qty > 20) return fail("A sale can have up to 20 pairs of one shoe in one size.");
    merged.set(key, line);
  }
  const lines = [...merged.values()].sort((a, b) => a.product_id.localeCompare(b.product_id) || a.size - b.size);
  const note = body.note ? String(body.note).trim().slice(0, 200) : null;
  const ref = typeof body.ref === "string" && /^[A-Za-z0-9-]{8,64}$/.test(body.ref) ? body.ref : null;

  // The till sends back what was actually saved, so its screen always matches the receipt.
  const saved = (s, again) => NextResponse.json({ id: s.id, total: s.total_kobo, pairs: s.items_count, again });
  const byRef = () => q1("select id, total_kobo, items_count from office_sales where ref = $1", [ref]);

  try {
    // Sent before, and the answer got lost on the way back: it's already recorded.
    if (ref) {
      const before = await byRef();
      if (before) return saved(before, true);
    }
    const row = await q1("select office_record_sale($1, $2::jsonb, $3, $4, now(), $5) as id", [staff.id, JSON.stringify(lines), body.payment, note || null, ref]);
    const sale = await q1("select id, total_kobo, items_count from office_sales where id = $1", [row.id]);
    return saved(sale, false);
  } catch (e) {
    // The same sale arrived twice at the same moment: return the one that was saved.
    if (e.code === "23505" && ref) {
      const before = await byRef().catch(() => null);
      if (before) return saved(before, true);
    }
    const msg = String(e.message || "");
    if (msg.startsWith("NO_STOCK:")) {
      const [, id, size] = msg.split(":");
      const p = await q1(
        `select p.name, p.colour, coalesce(s.qty, 0) as qty from office_products p
         left join office_stock s on s.product_id = p.id and s.size = $2 where p.id = $1`, [id, Number(size)]
      ).catch(() => null);
      const shoe = p ? `${p.name} (${p.colour})` : "One of the shoes";
      if (!p || p.qty === 0) return fail(`${shoe} in size ${size} has just sold out. Remove it from the sale.`, 409);
      return fail(`Only ${p.qty} ${p.qty === 1 ? "pair" : "pairs"} of ${shoe} in size ${size} left. Lower the number.`, 409);
    }
    if (msg.startsWith("NO_PRODUCT")) return fail("One of these products isn't sold any more.", 409);
    console.error("sale failed", e);
    return fail("The sale didn't go through. Nothing was recorded; try again.", 500);
  }
}
