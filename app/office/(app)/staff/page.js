import StaffManager from "../../../../components/office/StaffManager";
import { staffList } from "../../../../lib/office/data";
import { CAN, pageStaff } from "../../../../lib/office/session";

export const metadata = { title: "Staff" };

export default async function StaffPage() {
  const me = await pageStaff(CAN.staff);
  const staff = (await staffList()).map(({ created_at, ...s }) => s);
  return (
    <>
      <div className="ofc-head">
        <div>
          <h1 className="ofc-title">Staff</h1>
          <p className="ofc-sub">Who can sign in, and what each person can do.</p>
        </div>
      </div>
      <StaffManager staff={staff} meId={me.id} />
    </>
  );
}
