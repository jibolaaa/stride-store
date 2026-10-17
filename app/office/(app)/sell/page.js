import SellScreen from "../../../../components/office/SellScreen";
import { catalogue } from "../../../../lib/office/data";
import { CAN, pageStaff } from "../../../../lib/office/session";

export const metadata = { title: "Sell" };

export default async function SellPage() {
  await pageStaff(CAN.sell);
  // What the shop paid stays on the server: the till only needs prices and stock.
  const products = (await catalogue())
    .filter(p => p.active)
    .map(({ id, name, colour, gender, price_kobo, image, sizes, total }) => ({ id, name, colour, gender, price_kobo, image, sizes, total }));
  return <SellScreen products={products} />;
}
