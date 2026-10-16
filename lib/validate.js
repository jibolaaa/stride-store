// Checks the checkout form. Used in the browser (to show messages next to
// each field) and again on the server (so bad data never reaches Paystack).
export function checkCustomer(c = {}) {
  const errors = {};
  const name = String(c.name || "").trim();
  const phone = String(c.phone || "").replace(/[\s()-]/g, "");
  const email = String(c.email || "").trim();
  const address = String(c.address || "").trim();

  if (name.length < 2) errors.name = "Enter your full name.";
  else if (name.length > 80) errors.name = "Use a shorter name (80 characters or fewer).";

  // Nigerian numbers: 0810 000 0000 or +234 810 000 0000
  if (!/^(\+?234|0)[789][01]\d{8}$/.test(phone)) errors.phone = "Enter a Nigerian phone number, like 0810 000 0000.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Enter an email address, like you@example.com.";

  if (address.length < 8) errors.address = "Enter your street and area so the rider can find you.";
  else if (address.length > 200) errors.address = "Use a shorter address (200 characters or fewer).";

  return errors;
}
