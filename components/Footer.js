import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { DELIVERY_FEE_KOBO, FREE_DELIVERY_FROM_KOBO } from "../lib/pricing";
import { nairaWhole } from "../lib/format";

const WHATSAPP = "https://wa.me/2348105432993?text=Hi%20STRIDE%2C%20I%20have%20a%20question.";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <ul className="foot-facts">
          <li><b>Delivery in Lagos</b><span>1 to 2 working days. {nairaWhole(DELIVERY_FEE_KOBO)}, free from {nairaWhole(FREE_DELIVERY_FROM_KOBO)}.</span></li>
          <li><b>Returns</b><span>Send unworn pairs back within 7 days.</span></li>
          <li><b>Payment</b><span>Card, bank transfer or USSD through Paystack.</span></li>
        </ul>
        <div className="foot-grid">
          <nav className="foot-col" aria-label="Shop">
            <b>Shop</b>
            <Link href="/collections/new-in">New in</Link>
            <Link href="/collections/men">Men</Link>
            <Link href="/collections/women">Women</Link>
            <Link href="/collections/kids">Kids</Link>
            <Link href="/collections/sale">Sale</Link>
          </nav>
          <nav className="foot-col" aria-label="Help">
            <b>Help</b>
            <Link href="/help#delivery">Delivery and returns</Link>
            <Link href="/help#sizes">Size guide</Link>
            <a href={WHATSAPP} target="_blank" rel="noopener">WhatsApp us</a>
            <Link href="/about">About STRIDE</Link>
            <a href="/office">Staff sign-in</a>
          </nav>
        </div>
        <div className="foot-base">
          <span>STRIDE is a demo store by <a href="https://ibrahimraji.vercel.app" target="_blank" rel="noopener">Ibrahim Raji</a>. No real products are sold and no real money is taken.</span>
          <ThemeToggle withLabel className="foot-theme" />
        </div>
      </div>
    </footer>
  );
}
