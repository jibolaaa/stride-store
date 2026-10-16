"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { useUI } from "./UIProvider";
import ThemeToggle from "./ThemeToggle";
import { BagIcon, MenuIcon, SearchIcon } from "./Icons";

// Shown under the logo on bigger screens. Phones use the menu drawer.
const NAV = [
  ["New in", "/collections/new-in"],
  ["Men", "/collections/men"],
  ["Women", "/collections/women"],
  ["Kids", "/collections/kids"],
  ["Running", "/collections/running"],
  ["Basketball", "/collections/basketball"],
  ["Sale", "/collections/sale"]
];

export default function Header() {
  const { count, loaded } = useCart();
  const { show } = useUI();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-in">
        <div className="header-side">
          <button type="button" className="icon-btn" onClick={() => show("menu")} aria-label="Open menu"><MenuIcon /></button>
          <ThemeToggle />
        </div>
        <Link href="/" className="logo" aria-label="STRIDE home">STRIDE</Link>
        <div className="header-side end">
          <button type="button" className="icon-btn" onClick={() => show("search")} aria-label="Search"><SearchIcon /></button>
          <button type="button" className="icon-btn bag" onClick={() => show("cart")} aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
            <BagIcon />
            {loaded && count > 0 && <span className="bag-count" aria-hidden="true">{count}</span>}
          </button>
        </div>
      </div>
      <nav className="header-nav" aria-label="Main">
        {NAV.map(([label, href]) => (
          <Link key={href} href={href} className={label === "Sale" ? "sale" : undefined} aria-current={path === href ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
    </header>
  );
}
