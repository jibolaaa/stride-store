// Sign in with email and password. Sets a signed, httpOnly cookie for a week.
import { NextResponse } from "next/server";
import { q1, hasDatabase } from "../../../../lib/office/db";
import { checkPassword, hashPassword } from "../../../../lib/office/password";
import { COOKIE, MAX_AGE, signSession } from "../../../../lib/office/token";

let dummy;
const dummyHash = async () => (dummy ??= await hashPassword(crypto.randomUUID()));

export async function POST(req) {
  if (!hasDatabase()) return NextResponse.json({ error: "The database isn't connected yet. Open /office/setup first." }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

  let staff = null;
  try {
    staff = await q1("select id, name, role, active, password_hash from office_staff where lower(email) = $1", [email]);
  } catch {
    return NextResponse.json({ error: "The back office isn't set up yet. Open /office/setup first." }, { status: 503 });
  }
  // Same message, and about the same wait, whether the email or the password
  // is wrong, so nobody can fish for accounts.
  const matches = await checkPassword(password, staff?.password_hash || await dummyHash());
  const ok = staff && staff.active && matches;
  if (!ok) return NextResponse.json({ error: "That email and password don't match an active account." }, { status: 401 });

  const res = NextResponse.json({ role: staff.role, name: staff.name });
  res.cookies.set(COOKIE, await signSession(staff), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE
  });
  return res;
}
