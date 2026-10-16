# STRIDE

A demo sneaker store built with Next.js and Paystack, by Ibrahim Raji
([portfolio](https://ibrahimraji.vercel.app), [GitHub](https://github.com/jibolaaa)).

STRIDE is fictional. No real products are sold and payments run in Paystack's test mode.

## What it does
- Shop with filters and search; each product shows the sizes in stock
- Product page with size choice, quantity, and a buy bar that stays on screen on phones
- Cart saved in the browser (localStorage), with lines per product and size
- Checkout with checks on every field (name, Nigerian phone number, email, Lagos address)
- Payment on Paystack's hosted page, then confirmed server to server before the order counts as paid

## How the money stays safe
- The browser only sends product ids, sizes and quantities. The server works out the total from its own price list, so nobody can change a price.
- Sizes are checked against what's in stock, and quantities are capped at 10.
- The form is checked again on the server, because browser checks can be skipped.
- All money is handled as whole kobo (₦1 = 100 kobo), so there are no rounding errors.
- The Paystack secret key only lives on the server.

## Project layout
- `app/` pages: home, product, cart, checkout, success, help, about
- `app/api/paystack/` the two server routes: start a payment, confirm a payment
- `components/` header, product card, product view, cart state
- `lib/` the product list, money formatting, form checks
- `app/fonts/` Instrument Sans and Archivo, served from the site itself (SIL Open Font License)

## Run it
1. `npm install`
2. Copy `.env.example` to `.env.local` and add your Paystack **test** secret key
3. `npm run dev`

## Test a payment (no real money)
Use Paystack's test card at checkout: 4084 0840 8408 4081, any future expiry, CVV 408, PIN 0000, OTP 123456.
