import "./globals.css";
import localFont from "next/font/local";
import MotionRoot from "../components/MotionRoot";
import { UIProvider } from "../components/UIProvider";
import { CartProvider } from "../components/CartProvider";
import SmoothScroll from "../components/SmoothScroll";
import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuDrawer from "../components/MenuDrawer";
import SearchOverlay from "../components/SearchOverlay";
import CartDrawer from "../components/CartDrawer";
import QuickAddSheet from "../components/QuickAddSheet";
import Toast from "../components/Toast";

// Fonts are served from this site, so nothing waits on Google Fonts.
// Jost (with a ₦ sign added) for reading; Archivo italic, narrow and heavy, for headlines.
const jost = localFont({
  src: "./fonts/jost.woff2",
  variable: "--font-jost",
  weight: "100 900",
  display: "swap"
});
const archivo = localFont({
  src: [
    { path: "./fonts/archivo.woff2", style: "normal" },
    { path: "./fonts/archivo-italic.woff2", style: "italic" }
  ],
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

// Runs before the page paints: applies a saved dark theme (no white flash)
// and marks that JavaScript is on, so scroll reveals only hide text when they can show it again.
const boot = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("stride_theme");d.dataset.theme=t==="dark"?"dark":"light"}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={`${jost.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <MotionRoot>
          <UIProvider>
            <CartProvider>
              <SmoothScroll />
              <AnnouncementBar />
              <Header />
              <main id="main">{children}</main>
              <Footer />
              <MenuDrawer />
              <SearchOverlay />
              <CartDrawer />
              <QuickAddSheet />
              <Toast />
            </CartProvider>
          </UIProvider>
        </MotionRoot>
      </body>
    </html>
  );
}
