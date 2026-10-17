// First-time setup: creates the tables and fills them with the demo shop.
// Only works while there are no staff accounts, so it can't wipe a shop in use.
import { NextResponse } from "next/server";
import { hasDatabase, tx } from "../../../../lib/office/db";
import { isSetUp } from "../../../../lib/office/data";
import { createSchema, seedDemo } from "../../../../lib/office/seed";

export const maxDuration = 60;

export async function POST() {
  if (!hasDatabase()) return NextResponse.json({ error: "The database isn't connected yet." }, { status: 503 });
  try {
    if (await isSetUp()) return NextResponse.json({ error: "The back office is already set up. Sign in instead." }, { status: 409 });
    const result = await tx(async (run) => {
      await createSchema(run, { fresh: true });
      return seedDemo(run);
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("office setup failed", e);
    return NextResponse.json({ error: "Setup didn't finish. Try again in a minute." }, { status: 500 });
  }
}
