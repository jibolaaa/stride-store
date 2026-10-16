// Delivery rules, shared by the cart, checkout and the payment server route
// so every place agrees on the total.
export const DELIVERY_FEE_KOBO = 350000;          // ₦3,500 anywhere in Lagos
export const FREE_DELIVERY_FROM_KOBO = 15000000;  // free on orders of ₦150,000 and above

export const deliveryFor = (subtotal_kobo) =>
  subtotal_kobo === 0 || subtotal_kobo >= FREE_DELIVERY_FROM_KOBO ? 0 : DELIVERY_FEE_KOBO;

export const toFreeDelivery = (subtotal_kobo) => Math.max(0, FREE_DELIVERY_FROM_KOBO - subtotal_kobo);
