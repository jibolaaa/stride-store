// Starts a payment. This runs on the server (Vercel), not in the browser,
// so the PAYSTACK_SECRET_KEY stays hidden.
import { NextResponse } from "next/server";
import { getProduct } from "../../../../lib/products";
import { checkCustomer } from "../../../../lib/validate";

export async function POST(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Payments are switched off on this copy of the store." }, { status: 500 });
  }

  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "The request was malformed. Refresh the page and try again." }, { status: 400 });
  }

  const { customer, items } = body || {};
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Check the form again here: the browser's checks can be skipped.
  const problems = checkCustomer(customer);
  if (Object.keys(problems).length) {
    return NextResponse.json({ error: Object.values(problems)[0], fields: problems }, { status: 400 });
  }

  // SECURITY: work out the amount from our own price list. The browser only
  // sends ids, sizes and quantities. If we trusted a total from the
  // browser, anyone could pay N1 for everything.
  let amount_kobo = 0;
  const lines = [];
  for (const { id, size, qty } of items) {
    const p = getProduct(id);
    if (!p) {
      return NextResponse.json({ error: "Something in your cart is no longer sold. Remove it and try again." }, { status: 400 });
    }
    if (!p.sizes.includes(Number(size))) {
      return NextResponse.json({ error: `${p.name} isn't available in size ${size}. Choose another size.` }, { status: 400 });
    }
    const q = Math.max(1, Math.min(10, parseInt(qty, 10) || 1));
    amount_kobo += p.price_kobo * q;
    lines.push(`${p.name} (EU ${size}) x${q}`);
  }

  const origin = new URL(req.url).origin;

  const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: customer.email.trim(),
      amount: amount_kobo,
      currency: "NGN",
      callback_url: `${origin}/success`,
      metadata: {
        customer_name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        order_lines: lines.join(", ")
      }
    })
  });

  const data = await psRes.json().catch(() => null);
  if (!psRes.ok || !data?.status) {
    return NextResponse.json({ error: "Paystack couldn't start the payment. Try again in a minute." }, { status: 502 });
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference
  });
}
