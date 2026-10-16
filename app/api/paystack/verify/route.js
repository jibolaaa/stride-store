// Confirms a payment. After Paystack sends the customer back, our server
// asks Paystack directly (server to server, with the secret key) whether
// this reference really succeeded.
import { NextResponse } from "next/server";
import { naira } from "../../../../lib/format";

export async function GET(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ status: "failed", detail: "Payments are switched off on this copy of the store." }, { status: 500 });
  }

  const reference = new URL(req.url).searchParams.get("reference");
  if (!reference || !/^[\w.=-]{1,100}$/.test(reference)) {
    return NextResponse.json({ status: "failed", detail: "That payment reference isn't valid." }, { status: 400 });
  }

  const psRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" }
  );
  const data = await psRes.json().catch(() => null);

  const tx = data?.data;
  if (psRes.ok && data?.status && tx?.status === "success") {
    return NextResponse.json({ status: "success", amount_display: naira(tx.amount), reference });
  }

  return NextResponse.json({
    status: "failed",
    detail: tx?.gateway_response || "Paystack didn't confirm the payment."
  });
}
