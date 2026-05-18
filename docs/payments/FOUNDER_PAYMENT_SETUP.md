# Founder Payment Setup

This is the current real-payment setup for 8thGuard.

Telegram creates the guided payment session. Stripe/Polar, Paystack/Others, or the user's own crypto wallet completes the actual payment. 8thGuard then uses the checkout reference or public-chain crypto transaction hash as payment evidence.

## Button-First Checkout

The premium Telegram flow should be button-first. Static product links are optional backup rails.

User flow:
1. User opens `/payment_session`.
2. User taps a paid service button.
3. Bot creates a session ID and shows the USD guide price.
4. Bot returns Stripe/Polar first, then Paystack/Others where configured, plus official crypto rail buttons.
5. User pays through checkout or from their own crypto wallet.
6. Successful Paystack payment can trigger a Telegram confirmation message.
7. User taps `Submit Review Details` or opens `/submit` to send wallet, transaction, agent, or case context.
8. If support confirmation is needed, the user sends the payment reference or public-chain transaction hash with the session ID.
9. The review desk tracks the request as `paid`, `reviewing`, `needs_more_info`, or `completed` from `/admin/reviews?token=ADMIN_REVIEW_TOKEN`.

Static Paystack pages are still useful as backup links in `/pay`. Polar Checkout Links are the Stripe/Polar checkout fallback when API checkout is not configured.

## What To Create In Stripe/Polar

Create one Polar product or checkout link for each service that should be available through Stripe/Polar. For processor-facing wording, keep the product close to software analysis:

- Smart contract risk checker
- Bad-code highlighter
- Solidity/EVM code-risk report
- Approval-risk review
- Automated risk preview

Avoid product-page language that sounds like exchange, custody, escrow, trading, investment, money movement, or guaranteed recovery.

Add Polar product IDs and webhook settings to Vercel using the matching `POLAR_PRODUCT_ID_*`, `POLAR_ACCESS_TOKEN`, and `POLAR_WEBHOOK_SECRET` env vars documented in `docs/payments/POLAR_USD_CHECKOUT.md`. Public Polar Checkout Links can still be added as fallback with `NEXT_PUBLIC_POLAR_LINK_*`.

## What To Create In Paystack

Create one Paystack Payment Page or Product Payment Link for each paid service.

Use fixed GHS pricing:

| Product | USD reference | GHS amount | Paystack subunit | Vercel env var |
| --- | ---: | ---: | ---: | --- |
| Quick Public Address Risk Check | $4.99 | GHS 65 | 6500 | `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_WALLET_CHECK` |
| Quick Public Activity Risk Check | $4.99 | GHS 65 | 6500 | `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_TRANSACTION_CHECK` |
| Quick Agent Check | $4.99 | GHS 65 | 6500 | `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_AGENT_CHECK` |
| Detailed Public Address Review | $9.99 | GHS 125 | 12500 | `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_WALLET_REVIEW` |
| Detailed Public Transaction Review | $9.99 | GHS 125 | 12500 | `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_TRANSACTION_REVIEW` |
| Detailed Agent Review | $9.99 | GHS 125 | 12500 | `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_AGENT_REVIEW` |
| Weekly Premium Access | $14.99 | GHS 190 | 19000 | `NEXT_PUBLIC_PAYSTACK_LINK_WEEKLY_PREMIUM` |
| Priority Scam Report Review | $24.99 | GHS 315 | 31500 | `NEXT_PUBLIC_PAYSTACK_LINK_PRIORITY_SCAM_REPORT` |
| Agent Verification Review | $49.99 | GHS 625 | 62500 | `NEXT_PUBLIC_PAYSTACK_LINK_AGENT_VERIFICATION` |
| Group/Community Safety Review | $99.99 | GHS 1,250 | 125000 | `NEXT_PUBLIC_PAYSTACK_LINK_GROUP_SAFETY_REVIEW` |
| Founding Partner Package | $199.99 | GHS 2,500 | 250000 | `NEXT_PUBLIC_PAYSTACK_LINK_FOUNDING_PARTNER` |

Recommended Paystack page settings:
- Page type: One-time Payment Page or single Product Payment Link.
- Fixed amount: enabled.
- Currency: GHS.
- Collect phone number: enabled if useful.
- Description: "8thGuard digital service payment. Checks and reviews are paid services. Early risk signals, not final fraud proof."
- Success message: "Payment received. Return to 8thGuard and submit your review details with your session ID."

Do not create pages that describe trading, exchange, custody, escrow, recovery guarantees, investment, deposits, or user-to-user settlement.

## How To Create Paystack Pages

Dashboard path:
1. Open Paystack Dashboard.
2. Go to Payment Pages.
3. Click New Page.
4. Choose One-time Payment or Product Payment.
5. Enter the product name, description, and fixed GHS amount.
6. Publish the page.
7. Copy the public `https://paystack.com/pay/...` link.
8. Paste that link into the matching Vercel env var.

Paystack's hosted Payment Pages are designed for quick payment collection by shareable link. Paystack also exposes a Payment Pages API where `amount` is set in the supported currency subunit and pages can be accessed at `https://paystack.com/pay/[slug]`.

## What To Add In Vercel

Add these in Vercel Project Settings -> Environment Variables for Production, Preview, and Development as needed.

Public Paystack links:
- `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_WALLET_CHECK`
- `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_TRANSACTION_CHECK`
- `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_AGENT_CHECK`
- `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_WALLET_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_TRANSACTION_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_AGENT_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_WEEKLY_PREMIUM`
- `NEXT_PUBLIC_PAYSTACK_LINK_PRIORITY_SCAM_REPORT`
- `NEXT_PUBLIC_PAYSTACK_LINK_AGENT_VERIFICATION`
- `NEXT_PUBLIC_PAYSTACK_LINK_GROUP_SAFETY_REVIEW`
- `NEXT_PUBLIC_PAYSTACK_LINK_FOUNDING_PARTNER`

Public Stripe/Polar checkout links:
- `NEXT_PUBLIC_POLAR_LINK_QUICK_CONTRACT_SCAN`
- `NEXT_PUBLIC_POLAR_LINK_TOKEN_CONTRACT_RISK_SCAN`
- `NEXT_PUBLIC_POLAR_LINK_APPROVAL_RISK_CHECK`
- `NEXT_PUBLIC_POLAR_LINK_DEEP_CONTRACT_REVIEW`
- `NEXT_PUBLIC_POLAR_LINK_DEVELOPER_PRELAUNCH_SCAN`
- Optional additional `NEXT_PUBLIC_POLAR_LINK_*` variables for wallet, transaction, agent, weekly, and partner products when those products are approved for Stripe/Polar checkout wording.

Stripe/Polar server checkout and webhook:
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

Polar webhook URL in dashboard: `https://YOUR_DOMAIN/api/polar/webhook`

Paystack server keys:
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`
- `PAYSTACK_WEBHOOK_SECRET`

Revenue operations:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_REVIEW_TOKEN`
- `ADMIN_TELEGRAM_CHAT_ID`

Recommended values:
- `PAYSTACK_CALLBACK_URL=https://YOUR_DOMAIN/pay/callback`
- Paystack webhook URL in dashboard: `https://YOUR_DOMAIN/api/paystack/webhook`

The webhook route validates Paystack's `x-paystack-signature` with `PAYSTACK_SECRET_KEY`.

Official public crypto payment addresses:
- `NEXT_PUBLIC_CRYPTO_BTC_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_XRP_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_XRP_DESTINATION_TAG`
- `NEXT_PUBLIC_CRYPTO_ETH_EVM_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_USDT_BEP20_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_USDT_TRC20_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_TON_ADDRESS`
- `NEXT_PUBLIC_CRYPTO_SOLANA_ADDRESS`

Blockchain lookup env vars for crypto payment verification:
- `ETHERSCAN_API_KEY`
- `TRONGRID_API_KEY`
- `SOLANA_RPC_URL`
- `XRPL_RPC_URL`
- `BTC_MEMPOOL_API_BASE`
- `TONCENTER_API_KEY`
- `TONAPI_KEY`

Contact env vars:
- `NEXT_PUBLIC_CONTACT_HANDLE`
- `NEXT_PUBLIC_OFFICIAL_TELEGRAM`
- `NEXT_PUBLIC_SITE_URL`

Never put secrets in `NEXT_PUBLIC_` env vars. Only public links, public addresses, and public contact handles belong there.

## Telegram Experience Now

User flow:
1. User opens `/payment_session`.
2. User taps a product button.
3. Bot creates a session ID like `8G-260513-X7K2`.
4. Bot shows the USD guide price, Stripe/Polar first, Paystack/Others where configured, and crypto rail buttons.
5. User pays through checkout or from their own crypto wallet.
6. User returns to Telegram and continues the review session.
7. User opens `/submit` to provide the review context.
8. User submits payment confirmation only when needed:
   - Paystack: `/submit_payment 8G-260513-X7K2 <paystack_reference>`
   - Paystack verification: `/verify_paystack_payment <paystack_reference> 8G-260513-X7K2`
   - Crypto: `/verify_crypto_payment xrp <tx_hash> 8G-260513-X7K2`
9. Bot checks payment/public-chain evidence where supported and routes the paid service.

Test commands:
- `/payment_session`
- `/payment_session quick_wallet_check`
- `/verify_paystack_payment <reference> <session_id>`
- `/verify_crypto_payment xrp <tx_hash> <session_id>`

Web routes:
- `/submit`
- `/admin/reviews?token=ADMIN_REVIEW_TOKEN`

Admin review desk:
- Keep the token private.
- Use the Operations Readiness panel in `/admin/reviews?token=ADMIN_REVIEW_TOKEN` to confirm required env groups are configured without exposing secret values.
- Add `ADMIN_TELEGRAM_CHAT_ID` only for the internal operator chat that should receive paid-intake alerts.
- If helper bots cannot be added, add the 8thGuard bot to the private ops group and send `/chat_id`; use the returned chat ID as `ADMIN_TELEGRAM_CHAT_ID`.
- Use `reviewing` when manual analysis starts.
- Use `needs_more_info` when the customer must provide clearer public wallet, transaction, agent, or case context.
- Open `Delivery Draft` on the request to start from the standard result format.
- Edit and send the delivery draft from the desk when the request has a Telegram customer chat ID.
- Use `completed` only after the paid review result has been delivered.
- Status changes are audit logged.

Paystack verifier:
- Uses `PAYSTACK_SECRET_KEY` server-side.
- Calls Paystack transaction verification by reference.
- Reports status, amount, currency, channel, paid time, and notes.
- Do not fulfill if the status is not `success`.

Supported verifier rails:
- `btc`: checks mempool.space transaction outputs against official BTC address.
- `xrp`: checks XRPL destination against official XRP address.
- `evm`: checks native Ethereum recipient if `ETHERSCAN_API_KEY` is configured.
- `usdt_trc20`: checks TRON transfer evidence if `TRONGRID_API_KEY` is configured.
- `solana`: checks whether official address appears in transaction accounts and flags amount review.
- `usdt_bep20` and `ton`: use payment desk confirmation with the submitted transaction hash.

## Important Boundary

Telegram is not holding or sending user funds. The user pays through official checkout or their own wallet. 8thGuard reads public payment evidence and handles service fulfillment. This keeps 8thGuard away from exchange, custody, escrow, trading, and user-to-user settlement behavior.
