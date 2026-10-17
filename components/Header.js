"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { useUI } from "./UIProvider";
import ThemeToggle from "./ThemeToggle";
import { BagIcon, MenuIcon, SearchIcon } from "./Icons";

// Shown in the header on bigger screens. Phones use the menu.
const NAV = [
  ["New in", "/collections/new-in"],
  ["Men", "/collections/men"],
  ["Women", "/collections/women"],
  ["Kids", "/collections/kids"],
  ["Running", "/collections/running"],
  ["Sale", "/collections/sale"]
];

export default function Header() {
  const { count, loaded } = useCart();
  const { show } = useUI();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pop, setPop] = useState(0); // goes up each time a shoe lands in the bag

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const onPop = () => setPop(n => n + 1);
    window.addEventListener("stride-bag-pop", onPop);
    return () => window.removeEventListener("stride-bag-pop", onPop);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-in">
        <Link href="/" className="logo" aria-label="STRIDE home">STRIDE</Link>
        <nav className="header-nav" aria-label="Main">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="header-tools">
          <button type="button" className="icon-btn" onClick={() => show("search")} aria-label="Search"><SearchIcon /></button>
          <ThemeToggle />
          <button type="button" className="icon-btn bag" onClick={() => show("cart")} aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}>
            {/* the key restarts the bounce each time */}
            <span className={`bag-art ${pop ? "pop" : ""}`} key={pop}>
              <BagIcon />
              {loaded && count > 0 && <span className="bag-count" aria-hidden="true">{count}</span>}
            </span>
          </button>
          <button type="button" className="icon-btn menu-btn" onClick={() => show("menu")} aria-label="Open menu"><MenuIcon /></button>
        </div>
      </div>
    </header>
  );
}
