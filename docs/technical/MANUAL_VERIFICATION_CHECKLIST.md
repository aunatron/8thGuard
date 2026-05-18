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
- `/scan_contract ethereum 0x0000000000000000000000000000000000000000`
- `/scan_token base 0x0000000000000000000000000000000000000000`
- `/approval_check bsc 0x0000000000000000000000000000000000000000`
- `/contract_pricing`
- `/report_scam`
- `/pricing`
- `/pay`
- `/crypto_pay`
- `/payment_warning`
- `/submit_payment`
- `/tonight_offer`
- `/contact`
- `/chat_id`

Confirm `/help` lists every supported command.
Confirm contract preview commands return early contract risk signals only and say they are not a full audit.
Confirm `/scan_contract` group output stays short and directs users to DM the bot for the full paid report.
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
- `/pricing` shows USD-only reference pricing.
- `/pay` labels payment options as `Stripe/Polar` and `Paystack/Others`.
- `/pay` shows Stripe/Polar before Paystack/Others. If `POLAR_PRODUCT_ID_*` or `NEXT_PUBLIC_POLAR_LINK_*` is missing for a product, the Stripe/Polar button opens an official checkout note.
- `/payment_session quick_contract_scan` shows Stripe/Polar when `POLAR_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`, and `POLAR_PRODUCT_ID_QUICK_CONTRACT_SCAN` are configured.
- `/crypto_pay` says crypto payments are for 8thGuard digital services only.
- Payment language must not suggest escrow, custody, exchange, trading, or user-to-user settlement.

## Paid review desk checks
- Open `/submit` and submit a test review with a session ID, product, subject, payment reference, and contact.
- Open `/submit?product_id=detailed_transaction_review` and confirm the review type defaults to `transaction`.
- Open `/submit?product_id=detailed_agent_review` and confirm the review type defaults to `agent`.
- Confirm the request appears in `/admin/reviews?token=ADMIN_REVIEW_TOKEN` when Supabase is configured.
- Confirm the Operations Readiness panel appears only after the admin token is accepted and shows configured/missing states without secret values.
- If `ADMIN_TELEGRAM_CHAT_ID` is configured, confirm the internal operator chat receives a paid-intake alert.
- If helper bots cannot be added to the ops group, send `/chat_id` to the 8thGuard bot inside that group and use the returned chat ID.
- Open the request's `Delivery Draft` and confirm it includes request ID, session ID, service, subject, payment evidence, MVP result placeholders, and qualified limits.
- Edit the delivery draft and send it from the admin desk when the request has a Telegram customer chat ID.
- Move the request from `paid` to `reviewing`, `needs_more_info`, and `completed`.
- Confirm each status update stays inside the admin route, keeps the token-protected queue locked without the token, and emits an audit log.
- Confirm no form asks for seed phrases, private keys, wallet passwords, or unnecessary identity documents.

## Vercel env var checklist
- `NEXT_PUBLIC_APP_NAME`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `NEXT_PUBLIC_CONTACT_HANDLE`
- `NEXT_PUBLIC_OFFICIAL_TELEGRAM`
- `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_WALLET_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_TRANSACTION_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_AGENT_RISK_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_CONTRACT_SCAN`
- `NEXT_PUBLIC_PAYSTACK_LINK_TOKEN_CONTRACT_RISK_SCAN`
- `NEXT_PUBLIC_PAYSTACK_LINK_APPROVAL_RISK_CHECK`
- `NEXT_PUBLIC_PAYSTACK_LINK_DEEP_CONTRACT_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_PRIORITY_SCAM_REPORT`
- `NEXT_PUBLIC_PAYSTACK_LINK_WEEKLY_SUPPORTER`
- `NEXT_PUBLIC_PAYSTACK_LINK_AGENT_VERIFICATION`
- `NEXT_PUBLIC_PAYSTACK_LINK_GROUP_SAFETY_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_DEVELOPER_PRELAUNCH_SCAN`
- `NEXT_PUBLIC_PAYSTACK_LINK_FOUNDING_SUPPORTER`
- `NEXT_PUBLIC_POLAR_LINK_QUICK_CONTRACT_SCAN`
- `NEXT_PUBLIC_POLAR_LINK_TOKEN_CONTRACT_RISK_SCAN`
- `NEXT_PUBLIC_POLAR_LINK_APPROVAL_RISK_CHECK`
- `NEXT_PUBLIC_POLAR_LINK_DEEP_CONTRACT_REVIEW`
- `NEXT_PUBLIC_POLAR_LINK_DEVELOPER_PRELAUNCH_SCAN`
- `POLAR_ACCESS_TOKEN`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_SERVER`
- `POLAR_SUCCESS_URL`
- `POLAR_RETURN_URL`
- `POLAR_PRODUCT_ID_QUICK_CONTRACT_SCAN`
- `POLAR_PRODUCT_ID_TOKEN_CONTRACT_RISK_SCAN`
- `POLAR_PRODUCT_ID_APPROVAL_RISK_CHECK`
- `POLAR_PRODUCT_ID_DEEP_CONTRACT_REVIEW`
- `POLAR_PRODUCT_ID_DEVELOPER_PRELAUNCH_SCAN`
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
- `ADMIN_REVIEW_TOKEN`
- `ADMIN_TELEGRAM_CHAT_ID`

## Secrets checklist
- Do not stage or commit `env.txt`.
- Do not stage or commit `.env`, `.env.local`, `.env.production`, `*.pem`, or `*.key`.
- Never expose `PAYSTACK_SECRET_KEY`, `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, Telegram bot tokens, private keys, seed phrases, Supabase service role keys, or blockchain API keys in frontend code or docs.

## Legal and trust pages
- Confirm `/official` opens.
- Confirm `/official` lists only public channel URLs/statuses and does not expose admin tokens or secret values.
- Confirm `/legal` opens.
- Confirm `/legal/terms` opens.
- Confirm `/legal/privacy` opens.
- Confirm `/legal/risk-disclaimer` opens.
- Confirm `/legal/payment-policy` opens.
- Confirm `/legal/refund-policy` opens.
- Confirm legal pages do not describe 8thGuard as escrow, custody, exchange, trading, brokerage, or guaranteed recovery.
