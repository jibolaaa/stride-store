import Link from "next/link";
import SetupButton from "../../../components/office/SetupButton";
import { hasDatabase } from "../../../lib/office/db";
import { isSetUp } from "../../../lib/office/data";

export const metadata = { title: "Setup" };
export const dynamic = "force-dynamic";

export default async function SetupPage() {
  let state;
  if (!hasDatabase()) state = "no-database";
  else {
    try { state = (await isSetUp()) ? "done" : "ready"; }
    catch (e) { console.error("office setup page", e); state = "unreachable"; }
  }

  return (
    <main id="main" className="ofc-gate">
      <div className="gate-box">
        <p className="gate-logo">STRIDE<span>Office</span></p>

        {state === "no-database" && (
          <div className="ofc-form">
            <h1 className="ofc-title">Connect a database</h1>
            <p className="ofc-sub">The back office keeps sales, stock and staff in a Postgres database. A free Neon database through Vercel is enough.</p>
            <ol className="steps">
              <li>Open this project on vercel.com and go to <b>Storage</b>.</li>
              <li>Tap <b>Create Database</b>, choose <b>Neon</b> and the free plan.</li>
              <li>Connect it to this project, with Production and Preview ticked.</li>
              <li>Redeploy, then open this page again.</li>
            </ol>
            <p className="fine">Running it on a laptop instead? Set DATABASE_URL to any Postgres database.</p>
          </div>
        )}

        {state === "ready" && (
          <div className="ofc-form">
            <h1 className="ofc-title">Set up the back office</h1>
            <p className="ofc-sub">This creates the tables and a demo shop: every STRIDE sneaker with stock for each size, four staff accounts and a week of sales.</p>
            <SetupButton />
          </div>
        )}

        {state === "done" && (
          <div className="ofc-form">
            <h1 className="ofc-title">All set</h1>
            <p className="ofc-sub">The back office is set up.</p>
            <a className="btn full" href="/office/login">Sign in</a>
          </div>
        )}

        {state === "unreachable" && (
          <div className="ofc-form">
            <h1 className="ofc-title">Can't reach the database</h1>
            <p className="ofc-sub">DATABASE_URL is set, but the database didn't answer. It may be waking up: wait a few seconds and reload. If it keeps happening, check the address in the project's settings.</p>
          </div>
        )}

        <Link href="/" className="text-btn gate-back">Back to the shop</Link>
      </div>
    </main>
  );
}
