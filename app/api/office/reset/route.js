// Owner only: wipe the demo and start again with fresh demo data.
// Everyone is signed out, because the accounts are recreated.
import { NextResponse } from "next/server";
import { tx } from "../../../../lib/office/db";
import { createSchema, seedDemo } from "../../../../lib/office/seed";
import { apiStaff } from "../../../../lib/office/session";
import { COOKIE } from "../../../../lib/office/token";

export const maxDuration = 60;

export async function POST() {
  const { fail } = await apiStaff(["owner"]);
  if (fail) return fail;
  try {
    const result = await tx(async (run) => {
      await createSchema(run, { fresh: true });
      return seedDemo(run);
    });
    const res = NextResponse.json({ ok: true, ...result });
    res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  } catch (e) {
    console.error("office reset failed", e);
    return NextResponse.json({ error: "Reset didn't finish. Nothing was changed." }, { status: 500 });
  }
}
