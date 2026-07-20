import "./globals.css";
import Link from "next/link";
import { Archivo, Inter } from "next/font/google";
import { CartProvider } from "../components/CartProvider";
import Nav from "../components/Nav";

const display = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "STRIDE. | Sneakers, delivered.",
  description: "STRIDE is a demo sneaker store: cart, checkout and Paystack payments. Custom-built by Raji Ibrahim Ajibola."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <footer className="footer">
            <div className="wrap foot-grid">
              <div className="foot-col brand-col">
                <div className="foot-brand">STRIDE<span>.</span></div>
                <p>Clean, comfortable sneakers, delivered across Lagos. Secure checkout by Paystack.</p>
              </div>
              <div className="foot-col">
                <b>Shop</b>
                <Link href="/#shop">All sneakers</Link>
                <Link href="/#shop">New drops</Link>
                <Link href="/#shop">Limited</Link>
              </div>
              <div className="foot-col">
                <b>Help</b>
                <Link href="/help">FAQ</Link>
                <Link href="/help">Delivery &amp; returns</Link>
                <a href="https://wa.me/2348105432993?text=Hi%20STRIDE%2C%20I%20have%20a%20question." target="_blank" rel="noopener">Contact us</a>
              </div>
              <div className="foot-col">
                <b>Company</b>
                <Link href="/about">About STRIDE</Link>
                <a href="https://wa.me/2348105432993?text=Hi%20Ibrahim%2C%20I%20saw%20the%20STRIDE%20store%20demo." target="_blank" rel="noopener">Built by Ibrahim Raji</a>
              </div>
            </div>
            <div className="wrap foot-base">
              <span>STRIDE is a fictional demo store. No real products are sold.</span>
              <span>© 2026 STRIDE. · Next.js + Paystack</span>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
