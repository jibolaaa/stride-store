import { SizeTable, MEASURE_TIP } from "../../components/SizeTable";
import { ChevronDown } from "../../components/Icons";
import { DELIVERY_FEE_KOBO, FREE_DELIVERY_FROM_KOBO } from "../../lib/pricing";
import { nairaWhole } from "../../lib/format";

export const metadata = { title: "Help", description: "Delivery, returns, payment and sizes at STRIDE." };

const WHATSAPP = "https://wa.me/2348105432993?text=Hi%20STRIDE%2C%20I%20have%20a%20question.";

const faqs = [
  { id: "delivery", q: "How long does delivery take?", a: `Orders in Lagos arrive in 1 to 2 working days, and the rider calls before arriving. Delivery costs ${nairaWhole(DELIVERY_FEE_KOBO)}, and it's free on orders from ${nairaWhole(FREE_DELIVERY_FROM_KOBO)}.` },
  { id: "payment", q: "How do I pay?", a: "Online through Paystack, by card, bank transfer or USSD. Your card details go to Paystack, never to STRIDE." },
  { id: "returns", q: "Can I return a pair?", a: "Yes. Send back unworn sneakers in the original box within 7 days of delivery for a full refund. Refunds land within 3 working days." },
  { id: "original", q: "Are the sneakers original?", a: "Every pair is checked before it's dispatched." },
  { id: "stock", q: "Which sizes do you stock?", a: "Men's sizes EU 40 to 46, women's EU 36 to 41 and kids' EU 28 to 35. Each product page shows which sizes are in stock; sold-out sizes are crossed out." }
];

export default function HelpPage() {
  return (
    <div className="wrap page">
      <div className="page-head">
        <p className="kicker">Delivery, returns and sizes</p>
        <h1 className="page-title">Help</h1>
      </div>
      <div className="prose">
        <div className="accordion">
          {faqs.map((f, i) => (
            <details key={f.id} id={f.id} open={i === 0 ? true : undefined}>
              <summary>{f.q}<ChevronDown /></summary>
              <div className="acc-body"><p>{f.a}</p></div>
            </details>
          ))}
        </div>

        <section id="sizes" aria-labelledby="sizes-title">
          <h2 id="sizes-title" className="block-title">Size guide</h2>
          <p>{MEASURE_TIP} If you're between sizes, go up one.</p>
          <h3 className="sub-title">Men and women</h3>
          <SizeTable />
          <h3 className="sub-title">Kids</h3>
          <SizeTable kids />
        </section>

        <div className="contact">
          <h2>Still stuck?</h2>
          <p>Send a WhatsApp message and we'll reply the same day.</p>
          <a className="btn" href={WHATSAPP} target="_blank" rel="noopener">Message on WhatsApp</a>
        </div>
        <p className="fine" style={{ marginTop: 24, textAlign: "center" }}>STRIDE is a demo store. No real products are sold.</p>
      </div>
    </div>
  );
}
