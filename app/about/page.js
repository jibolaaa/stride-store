import Link from "next/link";

export const metadata = { title: "Our story" };

export default function AboutPage() {
  return (
    <div className="wrap prose">
      <h1>Made for the walk.</h1>
      <p>STRIDE started with a simple frustration: good sneakers in Lagos were either overpriced, fake, or a hassle to buy. So the store does three things. Clean designs, honest prices, and a checkout that takes a minute.</p>
      <p>Every pair is picked for comfort first. Delivery is free across Lagos, payment goes through Paystack, and if a pair doesn't feel right you have seven days to send it back.</p>
      <p className="fine">STRIDE is a demo store built by <a href="https://ibrahimraji.vercel.app" target="_blank" rel="noopener">Ibrahim Raji</a> to show a complete online shop: catalogue, cart, checkout and real payment processing in Paystack's test mode.</p>
      <Link href="/#shop" className="btn">Shop sneakers</Link>
    </div>
  );
}
