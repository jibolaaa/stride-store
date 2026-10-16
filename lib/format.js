// ₦68,000.00 from 6800000 kobo
export const naira = (kobo) =>
  "₦" + (kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ₦150,000 from 15000000 kobo, for short copy like "free delivery from ₦150,000"
export const nairaWhole = (kobo) => "₦" + Math.round(kobo / 100).toLocaleString("en-NG");
