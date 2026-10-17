import Link from "next/link";
import { notFound } from "next/navigation";
import PriceForm from "../../../../../components/office/PriceForm";
import StockForm from "../../../../../components/office/StockForm";
import ProductImage from "../../../../../components/ProductImage";
import { ArrowLeft } from "../../../../../components/Icons";
import { naira } from "../../../../../lib/format";
import { movements, product } from "../../../../../lib/office/data";
import { REASON_LABEL } from "../../../../../lib/office/labels";
import { CAN, pageStaff } from "../../../../../lib/office/session";
import { when } from "../../../../../lib/office/time";

export async function generateMetadata({ params }) {
  const p = await product(params.id).catch(() => null);
  return { title: p ? `${p.name} stock` : "Stock" };
}

export default async function StockItemPage({ params }) {
  const me = await pageStaff(CAN.seeStock);
  const p = await product(params.id);
  if (!p) notFound();
  const history = await movements(p.id);
  const owner = CAN.money.includes(me.role);
  const canChange = CAN.changeStock.includes(me.role);
  const allSales = CAN.seeAllSales.includes(me.role);
  const total = p.sizes.reduce((n, s) => n + s.qty, 0);
  const now = new Date();

  return (
    <>
      <Link href="/office/stock" className="text-btn back-link"><ArrowLeft aria-hidden="true" /> Stock</Link>
      <div className="prod-head">
        <span className="item-img"><ProductImage src={p.image} alt="" /></span>
        <div>
          <h1 className="ofc-title">{p.name}</h1>
          <p className="ofc-sub">{p.colour} · {naira(p.price_kobo)}{owner ? ` · the shop pays ${naira(p.cost_kobo)}` : ""}</p>
        </div>
      </div>

      <div className="cols">
        <section className="panel" aria-labelledby="sizes-title">
          <div className="panel-head">
            <h2 id="sizes-title">Pairs in the shop</h2>
            <span className="muted">{total} {total === 1 ? "pair" : "pairs"}</span>
          </div>
          <table className="stock-table">
            <thead><tr><th scope="col">Size (EU)</th><th scope="col">Pairs</th><th scope="col"><span className="sr-only">Status</span></th></tr></thead>
            <tbody>
              {p.sizes.map(s => (
                <tr key={s.size}>
                  <td>{s.size}</td>
                  <td><b>{s.qty}</b></td>
                  <td>{s.qty === 0 ? <span className="pill dark">Sold out</span> : s.qty <= p.low_stock_at ? <span className="pill yellow">Running low</span> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fine table-note">A size counts as running low at {p.low_stock_at} {p.low_stock_at === 1 ? "pair" : "pairs"} or fewer.</p>
        </section>

        <div>
          {canChange ? (
            <section className="panel form-panel" aria-labelledby="change-title">
              <h2 id="change-title" className="panel-title">Change stock</h2>
              <StockForm productId={p.id} sizes={p.sizes} />
            </section>
          ) : (
            <p className="ofc-ok">Only a manager or the owner can change stock. Tell them if a count looks wrong.</p>
          )}
          {owner && (
            <section className="panel form-panel" aria-labelledby="price-title">
              <h2 id="price-title" className="panel-title">Price and cost</h2>
              <PriceForm productId={p.id} price={p.price_kobo} cost={p.cost_kobo} lowAt={p.low_stock_at} />
            </section>
          )}
        </div>
      </div>

      <section className="panel" aria-labelledby="history-title">
        <div className="panel-head">
          <h2 id="history-title">History</h2>
          <span className="muted">Latest {history.length}</span>
        </div>
        <ul className="list">
          {history.map(m => {
            const canOpen = m.sale_id && (allSales || m.staff_id === me.id);
            const what = m.reason === "sale" && m.sale_id ? `Sold, sale #${m.sale_id}` : REASON_LABEL[m.reason];
            return (
              <li key={m.id} className="item no-img move">
                <span className="item-text">
                  <b>{canOpen ? <Link href={`/office/sales/${m.sale_id}`}>{what}</Link> : what}, size {m.size}</b>
                  <span>{when(m.created_at, now)}{m.staff_name ? ` · ${m.staff_name}` : ""}{m.note ? ` · ${m.note}` : ""}</span>
                </span>
                <span className="item-end">
                  <span className={m.change > 0 ? "up" : "down"}>{m.change > 0 ? `+${m.change}` : `−${-m.change}`}</span>
                  <span className="muted">{m.qty_after} left</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
