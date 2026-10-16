"use client";
import Link from "next/link";
import Sheet from "./Sheet";
import ThemeToggle from "./ThemeToggle";
import { useUI } from "./UIProvider";
import { ChevronRight, CloseIcon } from "./Icons";

const LINKS = [
  { href: "/collections/new-in", label: "New in" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/women", label: "Women" },
  { href: "/collections/kids", label: "Kids" },
  { href: "/collections/running", label: "Running" },
  { href: "/collections/basketball", label: "Basketball" },
  { href: "/collections/sale", label: "Sale" }
];

export default function MenuDrawer() {
  const { open, close } = useUI();
  return (
    <Sheet open={open === "menu"} onClose={close} side="left" label="Menu" className="menu">
      <div className="sheet-head">
        <button type="button" className="icon-btn" onClick={close} aria-label="Close menu" data-autofocus><CloseIcon /></button>
      </div>
      <nav className="menu-links" aria-label="Shop">
        {LINKS.map(l => (
          <Link key={l.href} href={l.href} onClick={close} className={l.label === "Sale" ? "sale" : ""}>
            {l.label}<ChevronRight />
          </Link>
        ))}
      </nav>
      <div className="menu-foot">
        <Link href="/collections/all" onClick={close}>All sneakers</Link>
        <Link href="/help" onClick={close}>Help and delivery</Link>
        <Link href="/about" onClick={close}>About STRIDE</Link>
        <ThemeToggle withLabel className="menu-theme" />
      </div>
    </Sheet>
  );
}
