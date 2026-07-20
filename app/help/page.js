import Reveal from "../../components/Reveal";

export const metadata = { title: "Help & FAQ | STRIDE." };

const faqs = [
  { q: "How long does delivery take?", a: "Lagos orders arrive within 1 to 2 working days. Delivery is free anywhere in Lagos." },
  { q: "How do I pay?", a: "Securely online with card, bank transfer or USSD through Paystack. Your card details never touch our servers." },
  { q: "Can I return a pair?", a: "Yes. You have 7 days from delivery to return unworn sneakers in their original box for a full refund." },
  { q: "Are the sneakers original?", a: "Every pair is sourced directly and checked before dispatch. If it is on STRIDE, it is the real thing." },
  { q: "What sizes do you stock?", a: "Most styles run EU 39 to 46. Each product page shows exactly which sizes are available." }
];

export default function HelpPage() {
  return (
    <div className="wrap page">
      <Reveal><p className="eyebrow">Help centre</p></Reveal>
      <Reveal delay={80}><h1 className="page-title">Questions,<br />answered.</h1></Reveal>

      <div className="faq">
        {faqs.map((f, i) => (
          <Reveal key={i} delay={i * 60}>
            <details className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="help-cards">
          <div className="help-card">
            <h3>Delivery</h3>
            <p>Free across Lagos, 1 to 2 working days. We call before we arrive.</p>
          </div>
          <div className="help-card">
            <h3>Returns</h3>
            <p>7 days, unworn, original box. Refunds land within 3 working days.</p>
          </div>
          <div className="help-card">
            <h3>Talk to us</h3>
            <p>
              <a href="https://wa.me/2348105432993?text=Hi%20STRIDE%2C%20I%20have%20a%20question." target="_blank" rel="noopener">WhatsApp us</a>
              {" "}for anything else. We reply fast.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
