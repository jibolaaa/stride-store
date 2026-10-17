import { redirect } from "next/navigation";
import { pageStaff } from "../../../lib/office/session";

// The owner starts on the overview; everyone else starts at the till.
export default async function OfficeHome() {
  const staff = await pageStaff();
  redirect(staff.role === "owner" ? "/office/overview" : "/office/sell");
}
