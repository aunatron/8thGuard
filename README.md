# 8thGuard

8thGuard is a global crypto fraud intelligence and transaction safety platform for reviewing wallets, transaction hashes, and P2P agents before sending funds.

## MVP in this repository
- Next.js app for Vercel deployment.
- Telegram webhook bot endpoint.
- Real Wallet Check v0 with address detection, explorer links, and limited live public lookups.
- Paystack service-payment readiness and official crypto wallet payment instructions.
- Structured audit logging to console (Supabase-ready extension point).

## Run locally
```bash
npm install
npm run dev
```

## Validate build
```bash
npm run build
npm run lint
```

## Bot commands
- `/start`, `/help`
- `/check_wallet <address>`
- `/check_tx <transaction_hash>`
- `/check_agent <name_or_username>`
- `/report_scam`
- `/pricing`, `/pay`, `/crypto_pay`
- `/payment_warning`, `/submit_payment`, `/tonight_offer`, `/contact`

## Payment envs for Vercel
Add Paystack links as `NEXT_PUBLIC_PAYSTACK_LINK_*` values when payment pages are ready. Add official public wallet addresses as `NEXT_PUBLIC_CRYPTO_*` values only after they are approved for publication. Keep `PAYSTACK_SECRET_KEY`, API keys, and webhook secrets server-only.

## Wallet data source envs for Vercel
Optional live sources:
- `ETHERSCAN_API_KEY`
- `TRONGRID_API_KEY`
- `TONCENTER_API_KEY` or `TONAPI_KEY`
- `SOLANA_RPC_URL`
- `XRPL_RPC_URL`
- `BTC_MEMPOOL_API_BASE`

## Local webhook testing
Use a tunnel (for example ngrok) to expose your local server and call Telegram setWebhook with your tunnel URL.

## Deploy to Vercel
Follow `docs/deployment/TELEGRAM_BOT_DEPLOYMENT.md`.

## Next actions
1. Wire Supabase audit persistence and risk check storage.
2. Add payment submission intake and manual review workflow.
3. Add verified-agent registry workflow.
4. Expand wallet and transaction data providers without claiming final fraud proof.
