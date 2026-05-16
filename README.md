# 8thGuard

8thGuard is a premium global crypto safety system for wallet intelligence, transaction review, P2P agent risk checks, payment protection readiness, and future guarded transaction flows.

Core line: **Check before you send.**

## MVP in this repository
- Next.js app for Vercel deployment.
- Premium paid-first website and `/pay` service-payment page.
- Telegram webhook bot with inline menus, paid service catalog, Paystack readiness, crypto payment instructions, and guarded-flow placeholders.
- Real Wallet Check v0/v1 with chain detection, explorer links, optional public data lookups, and graceful API fallbacks.
- Payment catalog with USD reference pricing and fixed GHS references.
- Supabase-ready payment sessions, invoices, entitlements, ledger entries, audit logs, and risk check planning.

## Product boundaries
- Free education. Paid utility.
- Checks and reviews are paid services.
- Paystack is for 8thGuard digital service payments only.
- Crypto wallets are for 8thGuard digital service payments only.
- No private keys or seed phrases.
- No exchange, trading, custody, escrow, or user-to-user settlement in the MVP.
- Wallet and transaction outputs are early risk signals, not final fraud proof.

## Run locally
```bash
npm install
npm run dev
```

## Validate
```bash
npm run build
npm run lint
npx tsc --noEmit -p apps/web/tsconfig.json
```

## Bot commands
- `/start`, `/help`
- `/check_wallet <address>`
- `/check_tx <transaction_hash>`
- `/check_agent <name_or_username>`
- `/report_scam`
- `/pricing`, `/pay`, `/crypto_pay`
- `/payment_warning`, `/submit_payment`, `/tonight_offer`, `/contact`
- `/verify_paystack_payment <reference> [session_id]`
- `/verify_crypto_payment <rail> <tx_hash> [session_id]`
- `/guarded_send`, `/payment_session`, `/fee_quote`, `/protected_flow`

Button-first checkout:
```text
/payment_session
```

## Revenue loop
- Paystack checkout can message the Telegram user after a successful payment.
- `/submit` collects paid review details: session ID, service, wallet/transaction/agent/case context, payment reference, and contact.
- `/admin/reviews?token=ADMIN_REVIEW_TOKEN` shows the paid review queue when Supabase is configured.
- Supabase persistence is optional at runtime, but recommended for production payment sessions, payments, ledger entries, review requests, and audit logs.

## Vercel envs
Add checkout backup links as `NEXT_PUBLIC_PAYSTACK_LINK_*` and `NEXT_PUBLIC_POLAR_LINK_*` values. For server-side Stripe/Polar checkout, set `POLAR_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`, and the matching `POLAR_PRODUCT_ID_*` values. Add approved public wallet addresses as `NEXT_PUBLIC_CRYPTO_*` values only after they are ready for publication. Keep `POLAR_ACCESS_TOKEN`, `PAYSTACK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, blockchain API keys, admin tokens, and webhook secrets server-only.

Optional wallet data source envs:
- `ETHERSCAN_API_KEY`
- `TRONGRID_API_KEY`
- `TONCENTER_API_KEY`
- `TONAPI_KEY`
- `SOLANA_RPC_URL`
- `XRPL_RPC_URL`
- `BTC_MEMPOOL_API_BASE`

## Deploy
Follow `docs/deployment/TELEGRAM_BOT_DEPLOYMENT.md`.

Founder payment setup lives in `docs/payments/FOUNDER_PAYMENT_SETUP.md`.
