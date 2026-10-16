export const metadata = { title: "Help" };

const faqs = [
  { q: "How long does delivery take?", a: "Orders in Lagos arrive in 1 to 2 working days. Delivery is free anywhere in Lagos, and the rider calls before arriving." },
  { q: "How do I pay?", a: "Online through Paystack, by card, bank transfer or USSD. Your card details go to Paystack, never to STRIDE." },
  { q: "Can I return a pair?", a: "Yes. Send back unworn sneakers in the original box within 7 days of delivery for a full refund. Refunds land within 3 working days." },
  { q: "Are the sneakers original?", a: "Every pair is checked before it's dispatched." },
  { q: "Which sizes do you stock?", a: "EU 39 to 46. Each product page shows which sizes are in stock; sold-out sizes are greyed out." }
];

export default function HelpPage() {
  return (
    <div className="wrap prose">
      <h1>Help</h1>
      <div className="faq">
        {faqs.map(f => (
          <details className="faq-item" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <div className="contact">
        <h2>Still stuck?</h2>
        <p>Send a WhatsApp message and we'll reply the same day.</p>
        <a className="btn" href="https://wa.me/2348105432993?text=Hi%20STRIDE%2C%20I%20have%20a%20question." target="_blank" rel="noopener">Message on WhatsApp</a>
      </div>
      <p className="fine">STRIDE is a demo store. No real products are sold.</p>
    </div>
  );
}
