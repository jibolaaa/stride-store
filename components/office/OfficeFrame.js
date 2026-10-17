"use client";
// The back office frame: a bar on top with who is signed in, and the
// sections their role can open (tabs at the bottom on phones, a side menu
// on bigger screens).
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BagIcon, BoxIcon, ChartIcon, LogoutIcon, PeopleIcon, ReceiptIcon } from "../Icons";
import { ROLE_LABEL } from "../../lib/office/labels";

const SECTIONS = [
  { href: "/office/overview", label: "Overview", Icon: ChartIcon, roles: ["owner", "manager"] },
  { href: "/office/sell", label: "Sell", Icon: BagIcon, roles: ["owner", "manager", "cashier"] },
  { href: "/office/sales", label: "Sales", Icon: ReceiptIcon, roles: ["owner", "manager", "cashier"] },
  { href: "/office/stock", label: "Stock", Icon: BoxIcon, roles: ["owner", "manager", "cashier"], badge: true },
  { href: "/office/staff", label: "Staff", Icon: PeopleIcon, roles: ["owner"] }
];

export default function OfficeFrame({ staff, low, children }) {
  const path = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const sections = SECTIONS.filter(s => s.roles.includes(staff.role));

  const logOut = async () => {
    setLeaving(true);
    await fetch("/api/office/logout", { method: "POST" }).catch(() => {});
    router.replace("/office/login");
    router.refresh();
  };

  return (
    <div className="ofc">
      <header className="ofc-top">
        <Link href="/office" className="ofc-logo">STRIDE<span>Office</span></Link>
        <div className="ofc-who">
          <b>{staff.name}</b>
          <span>{ROLE_LABEL[staff.role]}</span>
        </div>
        <button className="icon-btn" onClick={logOut} disabled={leaving} aria-label="Sign out" title="Sign out">
          <LogoutIcon />
        </button>
      </header>
      <nav className="ofc-nav" aria-label="Back office">
        {sections.map(({ href, label, Icon, badge }) => {
          const here = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href} aria-current={here ? "page" : undefined}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {badge && low > 0 && <>
                <i className="nav-badge" aria-hidden="true">{low > 99 ? "99+" : low}</i>
                <span className="sr-only">, {low} sizes low or sold out</span>
              </>}
            </Link>
          );
        })}
      </nav>
      <main id="main" className="ofc-main">{children}</main>
    </div>
  );
}
