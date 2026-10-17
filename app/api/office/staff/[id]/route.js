// Owner only: change someone's role, switch their account on or off, or
// give them a new password. The owner can't lock themselves out, and the
// demo accounts stay as they are so the demo keeps working for everyone.
// Everything is checked first, then saved in one step, so a request never
// half-applies.
import { NextResponse } from "next/server";
import { q1 } from "../../../../../lib/office/db";
import { apiStaff, CAN, fail } from "../../../../../lib/office/session";
import { hashPassword, passwordProblem } from "../../../../../lib/office/password";

const ROLES = ["owner", "manager", "cashier"];

export async function PATCH(req, { params }) {
  const { staff: me, fail: denied } = await apiStaff(CAN.staff);
  if (denied) return denied;
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return fail("That account doesn't exist.", 404);
  const b = await req.json().catch(() => ({}));
  const target = await q1("select id, role, active, demo from office_staff where id = $1", [id]);
  if (!target) return fail("That account doesn't exist.", 404);
  if (target.demo) return fail("The demo accounts can't be changed, so the demo keeps working for everyone. Add someone new to try this.", 403);

  let role = null, active = null, hash = null;
  if (b.role !== undefined) {
    if (!ROLES.includes(b.role)) return fail("Choose a role.");
    if (id === me.id && b.role !== "owner") return fail("You can't remove your own owner role. Ask another owner.");
    role = b.role;
  }
  if (b.active !== undefined) {
    if (typeof b.active !== "boolean") return fail("Say whether the account is on or off.");
    if (id === me.id && !b.active) return fail("You can't switch off your own account.");
    active = b.active;
  }
  if (b.password !== undefined) {
    const pw = passwordProblem(b.password);
    if (pw) return fail(`New password: ${pw}`);
    hash = await hashPassword(b.password);
  }
  if (role === null && active === null && hash === null) return fail("Nothing to change.");

  await q1(
    `update office_staff set role = coalesce($2, role), active = coalesce($3, active), password_hash = coalesce($4, password_hash)
     where id = $1 returning id`,
    [id, role, active, hash]
  );
  return NextResponse.json({ ok: true });
}
