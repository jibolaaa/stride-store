// Starts a payment. This runs on the server (Vercel), not in the browser,
// so the PAYSTACK_SECRET_KEY stays hidden.
import { NextResponse } from "next/server";
import { getProduct, inStock } from "../../../../lib/products";
import { deliveryFor } from "../../../../lib/pricing";
import { checkCustomer } from "../../../../lib/validate";

const fail = (error, status = 400, extra = {}) => NextResponse.json({ error, ...extra }, { status });

export async function POST(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return fail("Payments are switched off on this copy of the store.", 500);

  let body;
  try { body = await req.json(); } catch {
    return fail("The request was malformed. Refresh the page and try again.");
  }

  const { customer, items } = body || {};
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    return fail("Your cart is empty.");
  }

  // Check the form again here: the browser's checks can be skipped.
  const problems = checkCustomer(customer);
  if (Object.keys(problems).length) {
    return fail(Object.values(problems)[0], 400, { fields: problems });
  }

  // SECURITY: work out the amount from our own price list. The browser only
  // sends ids, sizes and quantities. If we trusted a total from the browser,
  // anyone could pay ₦1 for everything.
  let subtotal_kobo = 0;
  const lines = [];
  const seen = new Set();
  for (const item of items) {
    const p = getProduct(String(item?.id));
    if (!p) return fail("Something in your cart is no longer sold. Remove it and try again.");

    const size = Number(item.size);
    if (!inStock(p, size)) return fail(`${p.name} (${p.colour}) is sold out in size ${size}. Choose another size.`);

    const key = `${p.id}:${size}`;
    if (seen.has(key)) return fail("Your cart has the same pair twice. Refresh the page and try again.");
    seen.add(key);

    const qty = parseInt(item.qty, 10);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) return fail("Each pair can be bought 1 to 10 at a time.");
    if (qty > p.sizes[size]) return fail(`Only ${p.sizes[size]} left of ${p.name} in size ${size}. Lower the quantity and try again.`);

    subtotal_kobo += p.price_kobo * qty;
    lines.push(`${p.name}, ${p.colour} (EU ${size}) x${qty}`);
  }

  const delivery_kobo = deliveryFor(subtotal_kobo);
  const amount_kobo = subtotal_kobo + delivery_kobo;
  const origin = new URL(req.url).origin;

  let data = null;
  let ok = false;
  try {
    const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(customer.email).trim(),
        amount: amount_kobo,
        currency: "NGN",
        callback_url: `${origin}/success`,
        metadata: {
          customer_name: String(customer.name).trim(),
          phone: String(customer.phone).trim(),
          address: String(customer.address).trim(),
          order_lines: lines.join(", "),
          subtotal_kobo,
          delivery_kobo
        }
      })
    });
    data = await psRes.json().catch(() => null);
    ok = psRes.ok && !!data?.status;
  } catch {
    ok = false;
  }

  if (!ok) return fail("Paystack couldn't start the payment. Try again in a minute.", 502);

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference
  });
}
