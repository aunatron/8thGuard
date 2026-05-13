# Founder Payment Setup

This is the current real-payment setup for 8thGuard.

Telegram creates the guided payment session. Paystack or the user's own crypto wallet completes the actual payment. 8thGuard then uses the Paystack webhook, Paystack reference, or public-chain crypto transaction hash as payment evidence.

## Automatic Paystack Checkout

The premium Telegram flow does not need static Paystack product pages when `PAYSTACK_SECRET_KEY` is configured.

User flow:
1. User types `/payment_session quick_wallet_check customer@email.com`.
2. Bot creates a session ID.
3. Backend calls Paystack Initialize Transaction API.
4. Bot returns a `Pay Now with Paystack` button.
5. User pays through Paystack.
6. Paystack redirects to `/pay/callback`.
7. Paystack sends `charge.success` to `/api/paystack/webhook`.
8. Backend verifies the reference and messages the Telegram chat if the payment is successful.

Static Paystack pages are still useful as fallback links in `/pay`.

## What To Create In Paystack

Create one Paystack Payment Page or Product Payment Link for each paid service.

Use fixed GHS pricing:

| Product | USD reference | GHS amount | Paystack subunit | Vercel env var |
| --- | ---: | ---: | ---: | --- |
| Quick Wallet Check | $4.99 | GHS 65 | 6500 | `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_WALLET_CHECK` |
| Quick Transaction Check | $4.99 | GHS 65 | 6500 | `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_TRANSACTION_CHECK` |
| Quick Agent Check | $4.99 | GHS 65 | 6500 | `NEXT_PUBLIC_PAYSTACK_LINK_QUICK_AGENT_CHECK` |
| Detailed Wallet Review | $9.99 | GHS 125 | 12500 | `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_WALLET_REVIEW` |
| Detailed Transaction Review | $9.99 | GHS 125 | 12500 | `NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_TRANSACTION_REVIEW` |
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
- Success message: "Payment received. Return to Telegram and send your 8thGuard session ID plus Paystack reference with /submit_payment."

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

Paystack server keys for future API/webhook automation:
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`
- `PAYSTACK_WEBHOOK_SECRET`

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
3. Bot asks them to type `/payment_session <product_id> <email>` for automatic Paystack checkout.
4. Bot creates a session ID like `8G-260513-X7K2`.
5. Bot shows product price, automatic Paystack checkout button, and crypto rail buttons.
6. User pays through Paystack or from their own crypto wallet.
7. User submits fallback proof if needed:
   - Paystack: `/submit_payment 8G-260513-X7K2 <paystack_reference>`
   - Paystack verification: `/verify_paystack_payment <paystack_reference> 8G-260513-X7K2`
   - Crypto: `/verify_crypto_payment xrp <tx_hash> 8G-260513-X7K2`
8. Bot checks Paystack/public-chain evidence where supported.
9. Manual review/fulfillment happens until full entitlement auto-unlock is built.

Test commands:
- `/payment_session`
- `/payment_session quick_wallet_check customer@email.com`
- `/verify_paystack_payment <reference> <session_id>`
- `/verify_crypto_payment xrp <tx_hash> <session_id>`

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
- `solana`: checks whether official address appears in transaction accounts and flags manual amount review.
- `usdt_bep20` and `ton`: currently manual/partial evidence until dedicated provider matching is added.

## Important Boundary

Telegram is not holding or sending user funds. The user pays through Paystack or their own wallet. 8thGuard reads public payment evidence and handles service fulfillment. This keeps the MVP away from exchange, custody, escrow, trading, and user-to-user settlement behavior.
