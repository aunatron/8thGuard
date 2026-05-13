# Manual Verification Checklist

Use this checklist before pushing 8thGuard to Vercel.

## Health endpoint
- Run `npm run dev`.
- Open `http://localhost:3000/api/health`.
- Confirm JSON includes `status: "ok"`, `service: "8thGuard"`, and a timestamp.

## Telegram bot commands
- `/start`
- `/help`
- `/check_wallet 0x0000000000000000000000000000000000000000`
- `/check_tx 0x0000000000000000000000000000000000000000000000000000000000000000`
- `/check_agent sample_agent`
- `/report_scam`
- `/pricing`
- `/pay`
- `/crypto_pay`
- `/payment_warning`
- `/submit_payment`
- `/tonight_offer`
- `/contact`

Confirm `/help` lists every supported command.
Confirm inline keyboard buttons do not loop the full menu when the user taps `Check Wallet`, `Check Transaction`, or `Check Agent`; those buttons should prompt the user to send the matching command with an input value.
Confirm user-facing bot messages do not expose implementation status, provider setup, placeholders, or internal operational gaps.

## Wallet check examples
- EVM: `0x0000000000000000000000000000000000000000`
- BTC sample format: `bc1qexampleplaceholder000000000000000000000000000`
- TRON sample format: `TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- TON sample format: `EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c`
- Solana sample format: `11111111111111111111111111111111`
- XRP sample format: `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`

External API failures should return partial results and explorer links where possible. They must not crash the Telegram webhook.

## Payment command checks
- `/pricing` shows USD reference pricing.
- `/pay` says Paystack is for 8thGuard service fees only.
- `/crypto_pay` says crypto payments are for 8thGuard digital services only.
- Payment language must not suggest escrow, custody, exchange, trading, or user-to-user settlement.

## Vercel env var checklist
- `NEXT_PUBLIC_APP_NAME`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `NEXT_PUBLIC_CONTACT_HANDLE`
- `NEXT_PUBLIC_OFFICIAL_TELEGRAM`
- `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_WALLET_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_TRANSACTION_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_AGENT_RISK_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_PRIORITY_SCAM_REPORT`
- `NEXT_PUBLIC_PAYSTACK_LINK_WEEKLY_SUPPORTER`
- `NEXT_PUBLIC_PAYSTACK_LINK_AGENT_VERIFICATION`
- `NEXT_PUBLIC_PAYSTACK_LINK_GROUP_SAFETY_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_FOUNDING_SUPPORTER`
- `NEXT_PUBLIC_CRYPTO_BTC_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_ETH_EVM_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_USDT_TRC20_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_USDT_BEP20_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_TON_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_XRP_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_XRP_DESTINATION_TAG`
- `NEXT_PUBLIC_CRYPTO_SOLANA_ADDRESS`
- `ETHERSCAN_API_KEY`
- `TRONGRID_API_KEY`
- `TONCENTER_API_KEY`
- `TONAPI_KEY`
- `SOLANA_RPC_URL`
- `XRPL_RPC_URL`
- `BTC_MEMPOOL_API_BASE`

## Secrets checklist
- Do not stage or commit `env.txt`.
- Do not stage or commit `.env`, `.env.local`, `.env.production`, `*.pem`, or `*.key`.
- Never expose `PAYSTACK_SECRET_KEY`, Telegram bot tokens, private keys, seed phrases, Supabase service role keys, or blockchain API keys in frontend code or docs.
