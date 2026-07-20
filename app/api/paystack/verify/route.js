// SERVER-SIDE payment verification. After Paystack redirects the
// customer back, we ask Paystack directly (server to server, with the
// secret key) whether this reference truly succeeded.
import { NextResponse } from "next/server";

export async function GET(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ status: "failed", detail: "Payments not configured." }, { status: 500 });
  }

  const reference = new URL(req.url).searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ status: "failed", detail: "Missing reference." }, { status: 400 });
  }

  const psRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } }
  );
  const data = await psRes.json();

  const tx = data?.data;
  if (psRes.ok && data?.status && tx?.status === "success") {
    const amount_display = "\u20A6" + (tx.amount / 100).toLocaleString("en-NG");
    return NextResponse.json({ status: "success", amount_display, reference });
  }

  return NextResponse.json({
    status: "failed",
    detail: tx?.gateway_response || data?.message || "Transaction not successful."
  });
}
