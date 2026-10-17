import Link from "next/link";
import { naira } from "../../../../lib/format";
import { sales } from "../../../../lib/office/data";
import { PAYMENT_LABEL, pairsText } from "../../../../lib/office/labels";
import { CAN, pageStaff } from "../../../../lib/office/session";
import { dayKey, dayLabel, timeOf } from "../../../../lib/office/time";

export const metadata = { title: "Sales" };

const salesText = (n) => `${n} ${n === 1 ? "sale" : "sales"}`;

export default async function SalesPage() {
  const me = await pageStaff(CAN.sell);
  const everyone = CAN.seeAllSales.includes(me.role);
  const rows = await sales({ staffId: everyone ? null : me.id, days: 7 });

  // Group by day, newest first.
  const now = new Date();
  const days = [];
  for (const s of rows) {
    const key = dayKey(s.created_at);
    let day = days[days.length - 1];
    if (!day || day.key !== key) {
      day = { key, label: dayLabel(s.created_at, now), sales: [], total: 0 };
      days.push(day);
    }
    day.sales.push(s);
    day.total += s.total_kobo;
  }

  return (
    <>
      <div className="ofc-head">
        <div>
          <h1 className="ofc-title">Sales</h1>
          <p className="ofc-sub">{everyone ? "Every sale in the shop, last 7 days." : "Your sales, last 7 days."} Tap one for its receipt.</p>
        </div>
        <Link className="btn small" href="/office/sell">New sale</Link>
      </div>
      {days.length === 0 && <p className="ofc-ok">No sales in the last 7 days yet. They'll show here as soon as one is made.</p>}
      {days.map(day => (
        <section key={day.key} aria-label={day.label}>
          <h2 className="day-head"><span>{day.label}</span><span>{salesText(day.sales.length)}, {naira(day.total)}</span></h2>
          <ul className="list">
            {day.sales.map(s => (
              <li key={s.id}>
                <Link className="item no-img" href={`/office/sales/${s.id}`}>
                  <span className="item-text">
                    <b>{s.summary}</b>
                    <span>{timeOf(s.created_at)} · #{s.id} · {PAYMENT_LABEL[s.payment]}{everyone && s.staff_name ? ` · ${s.staff_name}` : ""}</span>
                  </span>
                  <span className="item-end">{naira(s.total_kobo)}<span className="muted">{pairsText(s.items_count)}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
