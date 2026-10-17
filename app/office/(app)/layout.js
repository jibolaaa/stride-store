import OfficeFrame from "../../../components/office/OfficeFrame";
import { lowStockCount } from "../../../lib/office/data";
import { pageStaff } from "../../../lib/office/session";

export const dynamic = "force-dynamic";

export default async function OfficeAppLayout({ children }) {
  const staff = await pageStaff();
  const low = await lowStockCount().catch(() => 0);
  return (
    <OfficeFrame staff={{ name: staff.name, role: staff.role }} low={low}>
      {children}
    </OfficeFrame>
  );
}
