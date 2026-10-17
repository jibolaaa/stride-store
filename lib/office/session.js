// Who is signed in, and what they may do. The token says who you are; the
// database is checked on every request, so a role change or a switched-off
// account takes effect straight away.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { q1 } from "./db";
import { COOKIE, readSession } from "./token";

import { ROLE_LABEL } from "./labels";
export { ROLE_LABEL };

// What each role can open.
export const CAN = {
  sell: ["owner", "manager", "cashier"],
  seeStock: ["owner", "manager", "cashier"],
  changeStock: ["owner", "manager"],
  seeAllSales: ["owner", "manager"],
  overview: ["owner", "manager"],
  money: ["owner"],          // costs, profit, prices
  staff: ["owner"]
};

export async function currentStaff() {
  const s = await readSession(cookies().get(COOKIE)?.value);
  if (!s) return null;
  const row = await q1("select id, name, email, role, active from office_staff where id = $1", [s.id]).catch(() => null);
  return row && row.active ? row : null;
}

// For pages: sends you to the login page, or home if your role can't open it.
export async function pageStaff(allowed) {
  const staff = await currentStaff();
  if (!staff) redirect("/office/login");
  if (allowed && !allowed.includes(staff.role)) redirect("/office");
  return staff;
}

// For API routes: returns { staff } or { fail } with the right error.
export async function apiStaff(allowed) {
  let staff = null;
  try { staff = await currentStaff(); } catch { staff = null; }
  if (!staff) return { fail: NextResponse.json({ error: "Sign in again to continue." }, { status: 401 }) };
  if (allowed && !allowed.includes(staff.role)) {
    return { fail: NextResponse.json({ error: `Your role (${ROLE_LABEL[staff.role]}) can't do that.` }, { status: 403 }) };
  }
  return { staff };
}

export const fail = (error, status = 400) => NextResponse.json({ error }, { status });
