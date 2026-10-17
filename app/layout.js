import "./globals.css";
import localFont from "next/font/local";

// One font for everything: Instrument Sans, served from this site so
// nothing waits on Google Fonts. It has a ₦ sign added (see README).
const instrument = localFont({
  src: "./fonts/instrument-sans.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }]
});

export const metadata = {
  title: { default: "STRIDE | Sneakers delivered in Lagos", template: "%s | STRIDE" },
  description: "STRIDE is a demo sneaker store with a cart, checkout and Paystack payments. Built by Ibrahim Raji."
};

export const viewport = { themeColor: "#ffffff" };

// Runs before the page paints: applies a saved dark theme (no white flash)
// and marks that JavaScript is on, so scroll reveals only hide text when they can show it again.
const boot = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("stride_theme");d.dataset.theme=t==="dark"?"dark":"light"}catch(e){}})()`;

// The shop (app/(store)) and the back office (app/office) each add their own frame.
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={instrument.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
