import Link from "next/link";
import { notFound } from "next/navigation";
import ReceiptActions from "../../../../../components/office/ReceiptActions";
import { ArrowLeft } from "../../../../../components/Icons";
import { naira } from "../../../../../lib/format";
import { sale } from "../../../../../lib/office/data";
import { PAYMENT_LABEL, pairsText } from "../../../../../lib/office/labels";
import { CAN, pageStaff } from "../../../../../lib/office/session";
import { dateOf, timeOf } from "../../../../../lib/office/time";

export const metadata = { title: "Receipt" };

export default async function ReceiptPage({ params }) {
  const me = await pageStaff(CAN.sell);
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const s = await sale(id);
  // Cashiers can open their own receipts only.
  if (!s || (!CAN.seeAllSales.includes(me.role) && s.staff_id !== me.id)) notFound();

  const owner = CAN.money.includes(me.role);
  const profit = s.items.reduce((n, i) => n + (i.price_kobo - i.cost_kobo) * i.qty, 0);
  const lineText = (i) => `${i.name} (${i.colour}), size ${i.size}${i.qty > 1 ? `, ${i.qty} × ${naira(i.price_kobo)}` : ""}: ${naira(i.price_kobo * i.qty)}`;
  const shareText = [
    `STRIDE receipt #${s.id}`,
    `${dateOf(s.created_at)}, ${timeOf(s.created_at)}`,
    "",
    ...s.items.map(lineText),
    "",
    `Total: ${naira(s.total_kobo)} (${PAYMENT_LABEL[s.payment]})`,
    "Thank you for shopping with STRIDE."
  ].join("\n");

  return (
    <>
      <div className="ofc-head no-print">
        <div>
          <Link href="/office/sales" className="text-btn back-link"><ArrowLeft aria-hidden="true" /> Sales</Link>
          <h1 className="ofc-title">Sale #{s.id}</h1>
          <p className="ofc-sub">{dateOf(s.created_at)}, {timeOf(s.created_at)} · {pairsText(s.items_count)} · served by {s.staff_name || "a former staff member"}</p>
        </div>
      </div>

      <article className="receipt" aria-label={`Receipt for sale ${s.id}`}>
        <h2>STRIDE</h2>
        <div className="r-row"><span>Receipt</span><span>#{s.id}</span></div>
        <div className="r-row"><span>Date</span><span>{dateOf(s.created_at)}, {timeOf(s.created_at)}</span></div>
        <div className="r-row"><span>Served by</span><span>{s.staff_name || "Staff"}</span></div>
        <ul className="r-lines">
          {s.items.map(i => (
            <li key={`${i.product_id}:${i.size}`}>
              <div>
                <b>{i.name}</b>
                <span>{i.colour}, size {i.size}{i.qty > 1 ? `, ${i.qty} × ${naira(i.price_kobo)}` : ""}</span>
              </div>
              <span>{naira(i.price_kobo * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="r-row r-total"><span>Total</span><span>{naira(s.total_kobo)}</span></div>
        <div className="r-row"><span>Paid by</span><span>{PAYMENT_LABEL[s.payment]}</span></div>
        {s.note && <div className="r-row"><span>Note</span><span>{s.note}</span></div>}
        <p className="r-thanks">Thank you for shopping with STRIDE.</p>
      </article>

      <ReceiptActions text={shareText} />

      {owner && (
        <p className="ofc-ok no-print profit-note">
          Profit on this sale: <b>{naira(profit)}</b>, after what the shop paid for the pairs. Only you can see this.
        </p>
      )}
    </>
  );
}
