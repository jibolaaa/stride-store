"use client";
// Print the receipt, or open WhatsApp with it written out, ready to send
// to the customer. Nothing is sent until the person taps send in WhatsApp.
import { ChatIcon, PrintIcon } from "../Icons";

export default function ReceiptActions({ text }) {
  return (
    <div className="ofc-row receipt-actions no-print">
      <button type="button" className="btn small" onClick={() => window.print()}><PrintIcon aria-hidden="true" /> Print</button>
      <a className="btn small outline" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
        <ChatIcon aria-hidden="true" /> Send on WhatsApp
      </a>
    </div>
  );
}
