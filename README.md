# STRIDE. | Demo Sneaker Store

A custom e-commerce store built with Next.js and Paystack.
Built by Raji Ibrahim Ajibola (github.com/jibolaaa).

## Features
- Product catalog with detail pages
- Cart with quantities, persisted in localStorage
- Checkout with customer details
- Real Paystack payment flow (test mode): initialize on the server,
  redirect to Paystack's secure page, verify server-side on return
- Amounts recomputed on the server from the catalog (client is never
  trusted with prices)
- All money handled as integer kobo

## Run locally
1. npm install
2. Copy .env.example to .env.local and add your Paystack TEST secret key
3. npm run dev

## Deploy on Vercel
1. Import this repo at vercel.com/new
2. Add environment variable: PAYSTACK_SECRET_KEY = sk_test_... (from
   dashboard.paystack.com -> Settings -> API Keys, TEST mode)
3. Deploy. Done.

## Test a payment (no real money)
Use Paystack's test card at checkout:
- Card: 4084 0840 8408 4081
- Expiry: any future date
- CVV: 408
- PIN: 0000, OTP: 123456

## Note
STRIDE is a fictional demo store. No real products are sold.
