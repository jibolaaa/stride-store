// SERVER-SIDE payment start. This runs on Vercel, not the browser,
// so the PAYSTACK_SECRET_KEY stays hidden.
import { NextResponse } from "next/server";
import { getProduct } from "../../../../lib/products";

export async function POST(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Payments are not configured yet (missing PAYSTACK_SECRET_KEY)." },
      { status: 500 }
    );
  }

  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { customer, items } = body || {};
  if (!customer?.email || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Missing customer email or cart items." }, { status: 400 });
  }

  // SECURITY: recompute the amount on the server from our own catalog.
  // The browser only sends IDs and quantities. If we trusted a total
  // from the client, anyone could pay N1 for everything.
  let amount_kobo = 0;
  const lines = [];
  for (const { id, qty } of items) {
    const p = getProduct(id);
    const q = Math.max(1, Math.min(20, parseInt(qty, 10) || 1));
    if (!p) return NextResponse.json({ error: `Unknown product: ${id}` }, { status: 400 });
    amount_kobo += p.price_kobo * q;
    lines.push(`${p.name} x${q}`);
  }

  // Build the callback URL from the request itself, so it works on any
  // deployment (preview or production) without extra configuration.
  const origin = new URL(req.url).origin;

  const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: customer.email,
      amount: amount_kobo,               // Paystack expects kobo. Integer. Exactly why we store kobo.
      currency: "NGN",
      callback_url: `${origin}/success`,
      metadata: {
        customer_name: customer.name,
        phone: customer.phone,
        address: customer.address,
        order_lines: lines.join(", ")
      }
    })
  });

  const data = await psRes.json();
  if (!psRes.ok || !data?.status) {
    return NextResponse.json(
      { error: data?.message || "Paystack rejected the request." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference
  });
}
