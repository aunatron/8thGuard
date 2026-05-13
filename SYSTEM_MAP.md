# System Map

- `apps/web/src/app/page.tsx`: premium global homepage with paid pricing, payment rails, safety boundaries, and mini-app readiness.
- `apps/web/src/app/pay/page.tsx`: paid service catalog with Paystack link readiness and official crypto wallet callouts.
- `apps/web/src/app/api/telegram/webhook/route.ts`: Telegram webhook entrypoint, callback handling, webhook secret validation, and audit logging.
- `apps/web/src/lib/telegram.ts`: command parser, premium bot responses, inline callback routing, payment UX, and guarded-flow placeholders.
- `apps/web/src/lib/telegram-keyboards.ts`: main, payment, risk-result, scam-report, and guarded-flow inline keyboards.
- `apps/web/src/lib/risk.ts`: risk facade for wallet, transaction, and agent checks.
- `apps/web/src/lib/wallet/*`: chain detection, explorer links, public data source lookups, and Real Wallet Check v0/v1 orchestration.
- `apps/web/src/lib/payments/products.ts`: paid-first product catalog with USD/GHS pricing and Paystack subunit values.
- `apps/web/src/lib/payments/config.ts`: Paystack link env mapping, public crypto wallet env mapping, contact envs, and server-only payment/data-source config.
- `apps/web/src/lib/payments/types.ts`: Supabase-ready payment session, invoice, payment, entitlement, ledger, and audit types.
- `apps/web/src/lib/payments/session.ts`: Telegram-guided payment session IDs, product callbacks, and crypto rail messages.
- `apps/web/src/lib/payments/paystackVerification.ts`: server-side Paystack reference verification with `PAYSTACK_SECRET_KEY`.
- `apps/web/src/lib/payments/cryptoVerification.ts`: public-chain crypto payment evidence checks for supported rails.
- `apps/web/src/lib/audit.ts`: structured audit event logging.
- `apps/web/src/lib/supabase.ts`: optional persistence hook.
- `docs/product/*`: guarded transaction, mini-app, and protection-layer product plans.
- `docs/payments/*`: Paystack, crypto rails, entitlement unlock, and payment session policies.
- `docs/technical/*`: chain adapter, payment session, fee engine, protection engine, and multichain readiness architecture.
