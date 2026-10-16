import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const WHATSAPP = "https://wa.me/2348105432993?text=Hi%20STRIDE%2C%20I%20have%20a%20question.";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Link href="/" className="logo">STRIDE</Link>
          <p>Sneakers delivered across Lagos. Pay by card, bank transfer or USSD through Paystack.</p>
          <ThemeToggle withLabel className="foot-theme" />
        </div>
        <nav className="foot-col" aria-label="Shop">
          <b>Shop</b>
          <Link href="/collections/new-in">New in</Link>
          <Link href="/collections/men">Men</Link>
          <Link href="/collections/women">Women</Link>
          <Link href="/collections/kids">Kids</Link>
          <Link href="/collections/sale">Sale</Link>
          <Link href="/collections/all">All sneakers</Link>
        </nav>
        <nav className="foot-col" aria-label="Help">
          <b>Help</b>
          <Link href="/help#delivery">Delivery and returns</Link>
          <Link href="/help#sizes">Size guide</Link>
          <Link href="/help">Questions</Link>
          <a href={WHATSAPP} target="_blank" rel="noopener">WhatsApp us</a>
        </nav>
        <nav className="foot-col" aria-label="About">
          <b>About</b>
          <Link href="/about">Our story</Link>
          <a href="https://ibrahimraji.vercel.app" target="_blank" rel="noopener">Built by Ibrahim Raji</a>
        </nav>
      </div>
      <div className="wrap foot-base">
        <span>STRIDE is a demo store. No real products are sold and no real money is taken.</span>
        <span>Next.js and Paystack</span>
      </div>
    </footer>
  );
}
