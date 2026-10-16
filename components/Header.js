"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count } = useCart();
  const path = usePathname();
  return (
    <header className="header">
      <div className="header-in">
        <Link href="/" className="logo" aria-label="STRIDE home">STRIDE</Link>
        <nav className="header-nav" aria-label="Main">
          <Link href="/#shop" className={path === "/" ? "on" : ""}>Shop</Link>
          <Link href="/help" className={path === "/help" ? "on" : ""}>Help</Link>
          <Link href="/cart" className="cart-btn" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
            <span>Cart</span>
            {count > 0 && <span className="count">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
