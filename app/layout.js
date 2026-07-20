import "./globals.css";
import { Inter } from "next/font/google";
import { CartProvider } from "../components/CartProvider";
import Nav from "../components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "STRIDE. | Sneakers, delivered.",
  description: "STRIDE is a demo sneaker store: cart, checkout and Paystack payments. Custom-built by Raji Ibrahim Ajibola."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <footer className="footer">
            <span>STRIDE is a fictional demo store. No real products are sold.</span>
            <span>
              Custom-built by{" "}
              <a href="https://wa.me/2348105432993?text=Hi%20Ibrahim%2C%20I%20saw%20the%20STRIDE%20store%20demo." target="_blank" rel="noopener">
                Ibrahim Raji
              </a>{" "}
              · Next.js + Paystack
            </span>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
