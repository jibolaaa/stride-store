// Owner only: price, what the shop paid, and when to warn about low stock.
import { NextResponse } from "next/server";
import { q1 } from "../../../../../lib/office/db";
import { apiStaff, CAN, fail } from "../../../../../lib/office/session";

const naira = (v) => {
  const n = Number(String(v ?? "").replace(/[₦,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 && n <= 10_000_000 ? Math.round(n * 100) : null;
};

export async function PATCH(req, { params }) {
  const { fail: denied } = await apiStaff(CAN.money);
  if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  const price = naira(b.price), cost = naira(b.cost), low = Number(b.low_stock_at);
  if (price === null || price === 0) return fail("Enter a selling price in naira.");
  if (cost === null) return fail("Enter what the shop paid, in naira (0 if you don't know).");
  if (!Number.isInteger(low) || low < 0 || low > 50) return fail("Warn at a number between 0 and 50.");
  const row = await q1(
    "update office_products set price_kobo = $2, cost_kobo = $3, low_stock_at = $4 where id = $1 returning id",
    [params.id, price, cost, low]
  );
  if (!row) return fail("That product doesn't exist.", 404);
  return NextResponse.json({ ok: true });
}
