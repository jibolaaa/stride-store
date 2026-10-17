// Owner only: add a staff account with a starting password.
import { NextResponse } from "next/server";
import { q1 } from "../../../../lib/office/db";
import { apiStaff, CAN, fail } from "../../../../lib/office/session";
import { hashPassword, passwordProblem } from "../../../../lib/office/password";

const ROLES = ["owner", "manager", "cashier"];

export async function POST(req) {
  const { fail: denied } = await apiStaff(CAN.staff);
  if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim();
  const email = String(b.email || "").trim().toLowerCase();
  if (name.length < 2 || name.length > 80) return fail("Enter their full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail("Enter an email address, like tolu@example.com.");
  if (!ROLES.includes(b.role)) return fail("Choose a role.");
  const pw = passwordProblem(b.password);
  if (pw) return fail(`Starting password: ${pw}`);
  try {
    const row = await q1(
      "insert into office_staff (name, email, password_hash, role) values ($1, $2, $3, $4) returning id",
      [name, email, await hashPassword(b.password), b.role]
    );
    return NextResponse.json({ id: row.id });
  } catch (e) {
    if (e.code === "23505") return fail("Someone already uses that email.", 409);
    console.error("add staff failed", e);
    return fail("The account wasn't created. Try again.", 500);
  }
}
