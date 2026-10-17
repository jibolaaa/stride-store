// Words for the codes stored in the database. Safe to use on the server
// and in the browser.
export const ROLE_LABEL = { owner: "Owner", manager: "Manager", cashier: "Cashier" };
export const ROLE_NOTE = {
  owner: "Everything, including costs, profit, prices and staff",
  manager: "Sells, changes stock and sees every sale and the overview",
  cashier: "Sells, sees their own sales and checks stock"
};
export const PAYMENT_LABEL = { cash: "Cash", transfer: "Transfer", card: "Card" };
export const REASON_LABEL = { sale: "Sold", restock: "Delivery", writeoff: "Written off", count: "Recount", setup: "Opening count" };
export const pairsText = (n) => `${n} ${n === 1 ? "pair" : "pairs"}`;
