# STRIDE

A demo sneaker store built with Next.js and Paystack, by Ibrahim Raji
([portfolio](https://ibrahimraji.vercel.app), [GitHub](https://github.com/jibolaaa)).

STRIDE is fictional. No real products are sold and payments run in Paystack's test mode.

## What it does
- Home page with a swipeable banner, product rows you swipe sideways, category tiles and a sale row
- Shop pages for New in, Men, Women, Kids, Running, Everyday, Basketball and Sale, with filters (category, style, size, price, colour), sorting and a one or two per row grid
- Search from any page, with live results
- 29 products, several colourways and photos, sale prices, star ratings and stock per size
- Quick add (the + on a product) to pick a size without leaving the page
- Product page with a photo gallery, colour switcher that keeps your size, size guide, low-stock notes and a buy bar that stays on screen on phones
- Cart drawer and cart page, with a progress bar towards free delivery
- Checkout with checks on every field (name, Nigerian phone number, email, Lagos address)
- Payment on Paystack's hosted page, then confirmed server to server before the order counts as paid
- Light and dark mode, remembered on the device

## How the money stays safe
- The browser only sends product ids, sizes and quantities. The server works out the total from its own price list, so nobody can change a price.
- The server checks every size is in stock and every quantity is between 1 and what's left (10 at most).
- Delivery is added on the server too: ₦3,500 anywhere in Lagos, free from ₦150,000. The same rule (`lib/pricing.js`) drives the cart, checkout and server, so the totals always agree.
- The form is checked again on the server, because browser checks can be skipped.
- All money is handled as whole kobo (₦1 = 100 kobo), so there are no rounding errors.
- The Paystack secret key only lives on the server.

## Project layout
- `app/` pages: home, collections, product, cart, checkout, success, help, about
- `app/api/paystack/` the two server routes: start a payment, confirm a payment
- `components/` header, drawers, product card and rows, product page, cart state, theme switch
- `lib/` the product list and collections, filters and search, delivery rules, money formatting, form checks
- `app/fonts/` Jost and Archivo, served from the site itself (SIL Open Font License). Jost has a ₦ sign added to it, since the copy used here didn't have one.

## Run it
1. `npm install`
2. Copy `.env.example` to `.env.local` and add your Paystack **test** secret key
3. `npm run dev`

## Test a payment (no real money)
Use Paystack's test card at checkout: 4084 0840 8408 4081, any future expiry, CVV 408, PIN 0000, OTP 123456.

Product photos are free photos from Unsplash.
