// Passwords are stored as bcrypt hashes, never as the password itself.
import bcrypt from "bcryptjs";

export const hashPassword = (plain) => bcrypt.hash(String(plain), 10);
export const checkPassword = (plain, hash) => bcrypt.compare(String(plain), hash);

export function passwordProblem(p) {
  const s = String(p || "");
  if (s.length < 8) return "Use at least 8 characters.";
  if (s.length > 72) return "Use 72 characters or fewer.";
  return null;
}
