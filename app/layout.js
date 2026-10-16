import "./globals.css";
import localFont from "next/font/local";
import { UIProvider } from "../components/UIProvider";
import { CartProvider } from "../components/CartProvider";
import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuDrawer from "../components/MenuDrawer";
import SearchOverlay from "../components/SearchOverlay";
import CartDrawer from "../components/CartDrawer";
import QuickAddSheet from "../components/QuickAddSheet";

// Both fonts are served from this site, so nothing waits on Google Fonts.
// Jost has a ₦ sign added to it (see README).
const jost = localFont({
  src: "./fonts/jost.woff2",
  variable: "--font-jost",
  weight: "100 900",
  display: "swap"
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

export const viewport = { themeColor: "#ffffff" };

// Runs before the page paints, so a saved dark theme never flashes white.
const themeInit = `(function(){try{var t=localStorage.getItem("stride_theme");if(t!=="dark")t="light";document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={`${jost.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <UIProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <MenuDrawer />
            <SearchOverlay />
            <CartDrawer />
            <QuickAddSheet />
          </CartProvider>
        </UIProvider>
      </body>
    </html>
  );
}
