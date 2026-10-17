# STRIDE

A demo sneaker store built with Next.js and Paystack, by Ibrahim Raji
([portfolio](https://ibrahimraji.vercel.app), [GitHub](https://github.com/jibolaaa)).

STRIDE is fictional. No real products are sold and payments run in Paystack's test mode.

## Look and feel
- Black and white with one colour, danfo yellow, kept for things that matter: sale tags, the bag count and delivery progress
- One font, Instrument Sans: bold, tightly spaced headlines and clean text; rounded buttons; everything left-aligned
- Light and dark mode, remembered on the device

## Motion
- Smooth scrolling on laptops and desktops (Lenis); phones keep their own native scrolling
- The top photo drifts as you scroll, headlines rise into view, category photos ease out of a zoom (Motion)
- On the home page a danfo drives across Lagos (Ikeja, Yaba, Lekki, your door) as you scroll past the delivery section
- Adding to the bag: the shoe photo flies into the bag, the bag bounces, the button turns to "Added" and a small "Added to bag" note slides up
- Drawers spring in and can be swiped away; bottom sheets drag down from their handle
- Everything respects the phone's "reduce motion" setting

## Open-source libraries
- [Motion](https://github.com/motiondivision/motion) for animations, gestures and scroll effects (MIT)
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling (MIT)
- [Embla Carousel](https://github.com/davidjerleke/embla-carousel) for the banner, product rows and photo gallery (MIT)

## What it does
- Home page with a swipeable banner, product rows you drag or swipe sideways, a delivery band, category tiles and a sale row
- Shop pages for New in, Men, Women, Kids, Running, Everyday, Basketball and Sale, with filters (category, style, size, price, colour), sorting and a one or two per row grid
- Search from any page, with live results
- 29 products, several colourways and photos, sale prices, star ratings and stock per size
- Quick add (the + on a product) to pick a size without leaving the page
- Product page with a photo gallery, colour switcher that keeps your size, size guide, low-stock notes and a buy bar that stays on screen on phones
- Bag drawer and bag page, with a danfo that drives towards free delivery as the bag fills
- Checkout with checks on every field (name, Nigerian phone number, email, Lagos address)
- Payment on Paystack's hosted page, then confirmed server to server before the order counts as paid

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
- `components/` header, drawers and sheets, product card and rows, product page, bag state, theme switch, the danfo
- `lib/` the product list and collections, filters and search, delivery rules, money formatting, form checks
- `app/fonts/` Instrument Sans, served from the site itself (SIL Open Font License). It has a ₦ sign added to it, since the font doesn't include one.

## Run it
1. `npm install`
2. Copy `.env.example` to `.env.local` and add your Paystack **test** secret key
3. `npm run dev`

## Test a payment (no real money)
Use Paystack's test card at checkout: 4084 0840 8408 4081, any future expiry, CVV 408, PIN 0000, OTP 123456.

Product photos are free photos from Unsplash.
