import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "../../../components/office/LoginForm";
import { hasDatabase } from "../../../lib/office/db";
import { demoLogins, isSetUp } from "../../../lib/office/data";
import { DEMO_PASSWORD } from "../../../lib/office/seed";
import { currentStaff } from "../../../lib/office/session";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  let state = "ready";
  let demo = [];
  let signedIn = false;
  if (!hasDatabase()) {
    state = "no-database";
  } else {
    try {
      if (!(await isSetUp())) state = "not-set-up";
      else {
        signedIn = !!(await currentStaff());
        demo = await demoLogins();
      }
    } catch (e) {
      console.error("office login page", e);
      state = "unreachable";
    }
  }
  if (signedIn) redirect("/office");

  return (
    <main id="main" className="ofc-gate">
      <div className="gate-box">
        <p className="gate-logo">STRIDE<span>Office</span></p>
        {state === "ready" && (
          <>
            <div>
              <h1 className="ofc-title">Sign in</h1>
              <p className="ofc-sub">For the STRIDE shop team: sell at the till, check stock and see the day's numbers.</p>
            </div>
            {searchParams?.reset && <p className="ofc-ok" role="status">The demo is reset. Sign in again to carry on.</p>}
            <LoginForm demo={demo} demoPassword={DEMO_PASSWORD} />
          </>
        )}
        {state === "no-database" && (
          <div className="ofc-form">
            <h1 className="ofc-title">Almost ready</h1>
            <p className="ofc-sub">The back office needs its database before anyone can sign in.</p>
            <a className="btn full" href="/office/setup">See how to connect it</a>
          </div>
        )}
        {state === "not-set-up" && (
          <div className="ofc-form">
            <h1 className="ofc-title">Set up first</h1>
            <p className="ofc-sub">The database is connected but empty. Setup creates the demo shop in a few seconds.</p>
            <a className="btn full" href="/office/setup">Set up the back office</a>
          </div>
        )}
        {state === "unreachable" && (
          <div className="ofc-form">
            <h1 className="ofc-title">Can't reach the database</h1>
            <p className="ofc-sub">It may be waking up. Wait a few seconds, then reload this page.</p>
          </div>
        )}
        <Link href="/" className="text-btn gate-back">Back to the shop</Link>
      </div>
    </main>
  );
}
