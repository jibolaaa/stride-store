import Link from "next/link";
import ResetDemo from "../../../../components/office/ResetDemo";
import ProductImage from "../../../../components/ProductImage";
import { naira } from "../../../../lib/format";
import { overview } from "../../../../lib/office/data";
import { PAYMENT_LABEL, ROLE_LABEL, pairsText } from "../../../../lib/office/labels";
import { CAN, pageStaff } from "../../../../lib/office/session";
import { dateOf, dayKey, weekdayOf } from "../../../../lib/office/time";

export const metadata = { title: "Overview" };

// ₦412k, ₦1.2m: short enough to sit on top of a bar.
const short = (kobo) => {
  const n = kobo / 100;
  if (n >= 1e6) return `₦${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "")}m`;
  if (n >= 1e3) return `₦${Math.round(n / 1e3)}k`;
  return `₦${Math.round(n)}`;
};
const salesText = (n) => `${n} ${n === 1 ? "sale" : "sales"}`;

export default async function OverviewPage() {
  const me = await pageStaff(CAN.overview);
  const owner = CAN.money.includes(me.role);
  const o = await overview();
  const now = new Date();
  const today = dayKey(now);
  const max = Math.max(1, ...o.week.map(d => d.revenue));
  const weekTotal = o.week.reduce((n, d) => n + d.revenue, 0);
  const weekSales = o.week.reduce((n, d) => n + d.sales, 0);
  const payTotal = o.payments.reduce((n, p) => n + p.revenue, 0) || 1;
  const average = o.today.sales ? Math.round(o.today.revenue / o.today.sales / 100) * 100 : 0;

  return (
    <>
      <div className="ofc-head">
        <div>
          <h1 className="ofc-title">Overview</h1>
          <p className="ofc-sub">{dateOf(now)}. Every sale at the till shows up here straight away.</p>
        </div>
        <Link className="btn small" href="/office/sell">New sale</Link>
      </div>

      <div className="stats">
        <div className="stat hot"><span>Takings today</span><b>{naira(o.today.revenue)}</b><small>{salesText(o.today.sales)}</small></div>
        <div className="stat"><span>Pairs sold today</span><b>{o.today.pairs}</b><small>{o.today.sales ? `${naira(average)} per sale` : "No sales yet"}</small></div>
        {owner ? (
          <div className="stat"><span>Profit today</span><b>{naira(o.today.profit)}</b><small>After what the shop paid</small></div>
        ) : (
          <div className="stat"><span>This week</span><b>{short(weekTotal)}</b><small>{salesText(weekSales)}</small></div>
        )}
        <Link className="stat" href="/office/stock?show=restock"><span>Sizes to restock</span><b>{o.low.length}</b><small>Running low or sold out</small></Link>
      </div>

      <div className="cols">
        <section className="panel" aria-labelledby="week-title">
          <div className="panel-head">
            <h2 id="week-title">Last 7 days</h2>
            <span className="muted">{naira(weekTotal)}, {salesText(weekSales)}</span>
          </div>
          <div className="bars" role="img" aria-label={`Takings for the last 7 days: ${o.week.map(d => `${weekdayOf(d.day)} ${naira(d.revenue)}`).join(", ")}`}>
            {o.week.map(d => (
              <div key={d.day} className={`bar ${d.day === today ? "today" : ""}`}>
                <b>{d.revenue ? short(d.revenue) : ""}</b>
                <i style={{ height: `${Math.max(2, (d.revenue / max) * 100)}%` }} />
                <span>{d.day === today ? "Today" : weekdayOf(d.day)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="best-title">
          <div className="panel-head"><h2 id="best-title">Best sellers this week</h2></div>
          {o.best.length === 0 ? <p className="muted">No sales this week yet.</p> : (
            <ol className="list">
              {o.best.map(b => (
                <li key={b.id}>
                  <Link className="item" href={`/office/stock/${b.id}`}>
                    <span className="item-img"><ProductImage src={b.image} alt="" /></span>
                    <span className="item-text"><b>{b.name}</b><span>{b.colour}</span></span>
                    <span className="item-end">{pairsText(b.pairs)}<span className="muted">{naira(b.revenue)}</span></span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="panel" aria-labelledby="staff-title">
          <div className="panel-head"><h2 id="staff-title">Staff this week</h2></div>
          <ul className="list">
            {o.staff.map(s => (
              <li key={s.id} className="item no-img">
                <span className="item-text"><b>{s.name}</b><span>{ROLE_LABEL[s.role]}</span></span>
                <span className="item-end">{naira(s.revenue)}<span className="muted">{salesText(s.sales)}</span></span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="pay-title">
          <div className="panel-head"><h2 id="pay-title">How customers paid this week</h2></div>
          {o.payments.length === 0 ? <p className="muted">No sales this week yet.</p> : (
            <ul className="pay-list">
              {o.payments.map(p => {
                const share = Math.round((p.revenue / payTotal) * 100);
                return (
                  <li key={p.payment}>
                    <div className="pay-row"><b>{PAYMENT_LABEL[p.payment]}</b><span>{naira(p.revenue)} · {share}%</span></div>
                    <div className="meter" aria-hidden="true"><i style={{ width: `${share}%` }} /></div>
                    <span className="fine">{salesText(p.n)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="panel" aria-labelledby="low-title">
          <div className="panel-head">
            <h2 id="low-title">Needs restock</h2>
            <Link href="/office/stock?show=restock">See all</Link>
          </div>
          {o.low.length === 0 ? <p className="muted">Every size is well stocked.</p> : (
            <ul className="list">
              {o.low.slice(0, 6).map(l => (
                <li key={`${l.id}:${l.size}`}>
                  <Link className="item" href={`/office/stock/${l.id}`}>
                    <span className="item-img"><ProductImage src={l.image} alt="" /></span>
                    <span className="item-text"><b>{l.name}</b><span>{l.colour}, size {l.size}</span></span>
                    <span className="item-end">{l.qty === 0 ? <span className="pill dark">Sold out</span> : <span className="pill yellow">{l.qty} left</span>}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {o.low.length > 6 && <p className="fine more-note">And {o.low.length - 6} more on the stock page.</p>}
        </section>

        {owner && (
          <div>
            <section className="panel" aria-labelledby="value-title">
              <div className="panel-head"><h2 id="value-title">Stock value</h2></div>
              <div className="stats two-up">
                <div className="stat"><span>At what the shop paid</span><b>{short(o.value.cost)}</b><small>{pairsText(o.value.pairs)}</small></div>
                <div className="stat"><span>At selling price</span><b>{short(o.value.retail)}</b><small>{short(o.value.retail - o.value.cost)} profit if it all sells</small></div>
              </div>
            </section>
            <section className="panel demo-panel" aria-labelledby="demo-title">
              <div className="panel-head"><h2 id="demo-title">Demo data</h2></div>
              <p className="muted">This is a demo shop. Resetting puts back the starting stock and a fresh week of sales, and signs everyone out.</p>
              <ResetDemo />
            </section>
          </div>
        )}
      </div>
    </>
  );
}
