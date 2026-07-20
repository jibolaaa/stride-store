import Link from "next/link";
import Reveal from "../../components/Reveal";

export const metadata = { title: "About | STRIDE." };

export default function AboutPage() {
  return (
    <div className="wrap page">
      <Reveal><p className="eyebrow">Our story</p></Reveal>
      <Reveal delay={80}><h1 className="page-title">Made for<br />the walk.</h1></Reveal>
      <div className="page-body">
        <Reveal delay={140}>
          <p>STRIDE started with a simple frustration: good sneakers in Lagos were either overpriced, fake, or a hassle to buy. We set out to fix all three. Clean designs, honest prices, and a checkout that takes a minute.</p>
        </Reveal>
        <Reveal delay={200}>
          <p>Every pair in our lineup is picked for comfort first. We deliver free across Lagos, payment is secured by Paystack, and if a pair does not feel right you have seven days to send it back. No stress, no stories.</p>
        </Reveal>
        <Reveal delay={260}>
          <p className="fine">STRIDE is a fictional demo store, built to showcase a complete e-commerce experience: catalog, cart, checkout and live payment processing.</p>
        </Reveal>
        <Reveal delay={320}><Link href="/#shop" className="btn">Shop the lineup</Link></Reveal>
      </div>
    </div>
  );
}
