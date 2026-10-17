// Keeps the back office behind a sign-in. Pages check the role again
// against the database; this only turns away people with no valid session.
import { NextResponse } from "next/server";
import { COOKIE, readSession } from "./lib/office/token";

const OPEN = ["/office/login", "/office/setup"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (OPEN.some(p => pathname === p || pathname.startsWith(p + "/"))) return NextResponse.next();
  const session = await readSession(req.cookies.get(COOKIE)?.value);
  if (session) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/office/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/office", "/office/:path*"] };
