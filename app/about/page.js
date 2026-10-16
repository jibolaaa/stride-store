import Link from "next/link";

export const metadata = { title: "Our story", description: "Why STRIDE exists and how it works." };

export default function AboutPage() {
  return (
    <div className="wrap page">
      <div className="page-head">
        <p className="kicker">Our story</p>
        <h1 className="page-title">Made for the walk</h1>
      </div>
      <div className="prose">
        <p>STRIDE started with a simple frustration: good sneakers in Lagos were either overpriced, fake, or a hassle to buy. So the store does three things. Clean designs, honest prices, and a checkout that takes a minute.</p>
        <p>Every pair is picked for comfort first. Delivery across Lagos takes 1 to 2 working days, payment goes through Paystack, and if a pair doesn't feel right you have seven days to send it back.</p>
        <p className="fine">STRIDE is a demo store built by <a href="https://ibrahimraji.vercel.app" target="_blank" rel="noopener">Ibrahim Raji</a> to show a complete online shop: catalogue, filters, cart, checkout and real payment processing in Paystack's test mode.</p>
        <Link href="/collections/all" className="btn">Shop sneakers</Link>
      </div>
    </div>
  );
}
