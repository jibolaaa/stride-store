// ₦68,000 from 6800000 kobo. Kobo only shows when there is some (₦68,000.50).
export const naira = (kobo) => {
  const whole = kobo % 100 === 0;
  return "₦" + (kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 });
};

// Same as naira; kept so short copy like "free from ₦150,000" reads clearly in the code.
export const nairaWhole = (kobo) => "₦" + Math.round(kobo / 100).toLocaleString("en-NG");
