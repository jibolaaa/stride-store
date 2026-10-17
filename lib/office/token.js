// Signed session tokens (JWT) for the back office. Works on the server and
// in middleware. The signing key is JWT_SECRET if set; otherwise it is
// derived from the database address, which is itself a secret.
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "stride_office";
export const MAX_AGE = 60 * 60 * 24 * 7; // a week

async function key() {
  const base = process.env.JWT_SECRET || `stride-office:${process.env.DATABASE_URL || process.env.POSTGRES_URL || "local"}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(base));
  return new Uint8Array(digest);
}

export async function signSession(staff) {
  return new SignJWT({ name: staff.name, role: staff.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(staff.id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(await key());
}

export async function readSession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, await key(), { algorithms: ["HS256"] });
    return { id: Number(payload.sub), name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}
