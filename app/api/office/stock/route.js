// Change stock for one size: a delivery (restock), damaged or lost pairs
// (write-off), or a recount. Every change is written to the history.
import { NextResponse } from "next/server";
import { tx } from "../../../../lib/office/db";
import { apiStaff, CAN, fail } from "../../../../lib/office/session";

export async function POST(req) {
  const { staff, fail: denied } = await apiStaff(CAN.changeStock);
  if (denied) return denied;

  const b = await req.json().catch(() => ({}));
  const size = Number(b.size), amount = Number(b.amount);
  const note = b.note ? String(b.note).trim().slice(0, 200) || null : null;
  if (typeof b.product_id !== "string" || !Number.isInteger(size)) return fail("Choose a product and size.");
  if (!["restock", "writeoff", "count"].includes(b.reason)) return fail("Choose what happened.");
  if (!Number.isInteger(amount) || amount < 0 || amount > 500) return fail("Enter a number of pairs between 0 and 500.");
  if (b.reason !== "count" && amount === 0) return fail("Enter how many pairs.");
  if (b.reason === "writeoff" && !note) return fail("Say why these pairs are written off, like 'damaged sole'.");

  try {
    const result = await tx(async (run) => {
      let change = b.reason === "restock" ? amount : -amount;
      if (b.reason === "count") {
        // Hold the row while counting, so a sale at the same moment waits
        // instead of being lost in the recount.
        const [cur] = await run("select qty from office_stock where product_id = $1 and size = $2 for update", [b.product_id, size]);
        change = amount - (cur?.qty ?? 0);
        if (change === 0) return { qty: amount, unchanged: true };
      }
      const [row] = await run("select office_move_stock($1, $2, $3, $4, $5, $6) as qty", [staff.id, b.product_id, size, change, b.reason, note]);
      return { qty: row.qty };
    });
    return NextResponse.json(result);
  } catch (e) {
    if (String(e.message).includes("NOT_ENOUGH")) return fail("There aren't that many pairs in stock to write off.", 409);
    if (e.code === "23503") return fail("That product doesn't exist.", 404);
    console.error("stock change failed", e);
    return fail("The change didn't save. Try again.", 500);
  }
}
