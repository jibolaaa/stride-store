"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Nav() {
  const { count } = useCart();
  return (
    <nav className="nav">
      <div className="nav-in">
        <Link href="/" className="logo">STRIDE<span>.</span></Link>
        <div className="nav-links">
          <Link href="/">Shop</Link>
          <Link href="/cart" className="cart-link">
            Cart{count > 0 && <span className="badge">{count}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
