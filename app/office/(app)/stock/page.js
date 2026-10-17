import StockList from "../../../../components/office/StockList";
import { catalogue } from "../../../../lib/office/data";
import { CAN, pageStaff } from "../../../../lib/office/session";

export const metadata = { title: "Stock" };

export default async function StockPage({ searchParams }) {
  await pageStaff(CAN.seeStock);
  const products = (await catalogue())
    .filter(p => p.active)
    .map(({ id, name, colour, image, low_stock_at, sizes, total }) => ({ id, name, colour, image, low_stock_at, sizes, total }));
  const pairs = products.reduce((n, p) => n + p.total, 0);

  return (
    <>
      <div className="ofc-head">
        <div>
          <h1 className="ofc-title">Stock</h1>
          <p className="ofc-sub">{pairs} pairs in the shop across {products.length} shoes. Tap a shoe to see every change.</p>
        </div>
      </div>
      <StockList products={products} initialShow={["restock", "out"].includes(searchParams?.show) ? searchParams.show : "all"} />
    </>
  );
}
