import "./globals.css";
import Link from "next/link";
import localFont from "next/font/local";
import { CartProvider } from "../components/CartProvider";
import Header from "../components/Header";
import LookSwitch from "../components/LookSwitch";

// Both fonts are served from this site, so nothing waits on Google Fonts.
const instrument = localFont({
  src: "./fonts/instrument-sans.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }]
});
const archivo = localFont({
  src: "./fonts/archivo.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }]
});

export const metadata = {
  title: { default: "STRIDE | Sneakers delivered in Lagos", template: "%s | STRIDE" },
  description: "STRIDE is a demo sneaker store with a cart, checkout and Paystack payments. Built by Ibrahim Raji."
};

export const viewport = { themeColor: "#090909" };

// Preview only: lets Ibrahim compare the two looks with ?look=a or ?look=b.
const pickLook = `(function(){try{var q=new URLSearchParams(location.search).get("look");var l=q||localStorage.getItem("stride_look")||"a";if(q)localStorage.setItem("stride_look",q);document.documentElement.dataset.look=l}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-look="a" className={`${instrument.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickLook }} />
      </head>
      <body>
        <CartProvider>
          <LookSwitch />
          <Header />
          <main>{children}</main>
          <footer className="footer">
            <div className="wrap foot-grid">
              <div className="foot-brand-col">
                <Link href="/" className="logo">STRIDE</Link>
                <p>Sneakers delivered across Lagos. Pay by card, transfer or USSD through Paystack.</p>
              </div>
              <nav className="foot-col" aria-label="Shop">
                <b>Shop</b>
                <Link href="/#shop">All sneakers</Link>
                <Link href="/?filter=New#shop">New in</Link>
                <Link href="/?filter=Limited#shop">Limited</Link>
              </nav>
              <nav className="foot-col" aria-label="Help">
                <b>Help</b>
                <Link href="/help">Delivery and returns</Link>
                <Link href="/help">Questions</Link>
                <a href="https://wa.me/2348105432993?text=Hi%20STRIDE%2C%20I%20have%20a%20question." target="_blank" rel="noopener">WhatsApp us</a>
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
        </CartProvider>
      </body>
    </html>
  );
}
