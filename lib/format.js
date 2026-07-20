// Convert kobo to a display string like N68,000
export const naira = (kobo) =>
  "\u20A6" + (kobo / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 });
