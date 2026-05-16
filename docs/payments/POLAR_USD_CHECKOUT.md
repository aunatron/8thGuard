# Stripe/Polar Checkout

Stripe/Polar is a first-class checkout rail for 8thGuard buyers. Keep Polar-facing product wording focused on software security tooling: smart contract checks, bad-code highlighting, source-code risk reports, and approval-risk review.

## Positioning

Use:

- smart contract risk checker
- bad-code highlighter
- Solidity/EVM code-risk report
- automated risk preview
- developer security tooling
- not a full audit

Avoid leading with:

- crypto asset trading
- money movement
- exchange, custody, escrow, brokerage, investment, or recovery
- guaranteed scam detection

8thGuard may still present the full 50/50 brand across owned surfaces: smart contract risk plus transaction risk preview. Polar product pages should stay closer to the smart-contract and software-analysis lane.

## Current Integration

The app supports two Stripe/Polar paths:

- server-side API checkout through `/api/polar/checkout`
- public Polar Checkout Links as fallback through `NEXT_PUBLIC_POLAR_LINK_*`

When `POLAR_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`, and a matching `POLAR_PRODUCT_ID_*` are configured, 8thGuard creates a Stripe/Polar checkout through the official Next.js adapter. If those server settings are missing, it falls back to the public Checkout Link for that product.

- on `/pay`
- in Telegram `/pay`
- in Telegram payment-session buttons

Telegram session buttons attach metadata containing `session_id`, `product_id`, and `source`. The signed Polar `order.paid` webhook records the order in `payments`, `ledger_entries`, and `audit_logs`.

Do not fulfill a paid report from a redirect alone. Fulfillment should come from the verified webhook event.

When a product does not yet have a Polar product ID or public checkout link configured, Telegram still shows a Stripe/Polar button before Paystack/Others. That button opens a short official-checkout note instead of hiding the USD rail.

## Payment Labels

Use these labels across website, Telegram, and future apps:

- `Stripe/Polar` for Polar-powered checkout.
- `Paystack/Others` for Paystack and supported local/other checkout rails.

## Vercel Environment Variables

Server-only Stripe/Polar variables:

- `POLAR_ACCESS_TOKEN`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_SERVER` (`production` or `sandbox`)
- `POLAR_SUCCESS_URL`
- `POLAR_RETURN_URL`

Stripe/Polar product ID variables:

- `POLAR_PRODUCT_ID_QUICK_WALLET_CHECK`
- `POLAR_PRODUCT_ID_QUICK_TRANSACTION_CHECK`
- `POLAR_PRODUCT_ID_QUICK_AGENT_CHECK`
- `POLAR_PRODUCT_ID_QUICK_CONTRACT_SCAN`
- `POLAR_PRODUCT_ID_TOKEN_CONTRACT_RISK_SCAN`
- `POLAR_PRODUCT_ID_APPROVAL_RISK_CHECK`
- `POLAR_PRODUCT_ID_DETAILED_WALLET_REVIEW`
- `POLAR_PRODUCT_ID_DETAILED_TRANSACTION_REVIEW`
- `POLAR_PRODUCT_ID_DETAILED_AGENT_REVIEW`
- `POLAR_PRODUCT_ID_DEEP_CONTRACT_REVIEW`
- `POLAR_PRODUCT_ID_WEEKLY_PREMIUM_ACCESS`
- `POLAR_PRODUCT_ID_PRIORITY_SCAM_REPORT_REVIEW`
- `POLAR_PRODUCT_ID_AGENT_VERIFICATION_REVIEW`
- `POLAR_PRODUCT_ID_GROUP_COMMUNITY_SAFETY_REVIEW`
- `POLAR_PRODUCT_ID_DEVELOPER_PRELAUNCH_SCAN`
- `POLAR_PRODUCT_ID_FOUNDING_PARTNER_PACKAGE`

Accepted aliases:

- `POLAR_PRODUCT_ID__QUICK_WALLET_CHECK`
- `POLAR_PRODUCT_ID__QUICK_TRANSACTION_CHECK`
- `POLAR_PRODUCT_ID__QUICK_AGENT_CHECK`
- `POLAR_PRODUCT_ID_WEEKLY_PREMIUM`
- `POLAR_PRODUCT_ID_PRIORITY_SCAM_REPORT`
- `POLAR_PRODUCT_ID_AGENT_VERIFICATION`
- `POLAR_PRODUCT_ID_GROUP_SAFETY_REVIEW`
- `POLAR_PRODUCT_ID_FOUNDING_PARTNER`

Prefer the canonical names for new setup. The aliases are supported so existing Vercel env entries continue to work.

Optional public fallback checkout links:

- `NEXT_PUBLIC_POLAR_LINK_QUICK_WALLET_CHECK`
- `NEXT_PUBLIC_POLAR_LINK_QUICK_TRANSACTION_CHECK`
- `NEXT_PUBLIC_POLAR_LINK_QUICK_AGENT_CHECK`
- `NEXT_PUBLIC_POLAR_LINK_QUICK_CONTRACT_SCAN`
- `NEXT_PUBLIC_POLAR_LINK_TOKEN_CONTRACT_RISK_SCAN`
- `NEXT_PUBLIC_POLAR_LINK_APPROVAL_RISK_CHECK`
- `NEXT_PUBLIC_POLAR_LINK_DETAILED_WALLET_REVIEW`
- `NEXT_PUBLIC_POLAR_LINK_DETAILED_TRANSACTION_REVIEW`
- `NEXT_PUBLIC_POLAR_LINK_DETAILED_AGENT_REVIEW`
- `NEXT_PUBLIC_POLAR_LINK_DEEP_CONTRACT_REVIEW`
- `NEXT_PUBLIC_POLAR_LINK_WEEKLY_PREMIUM`
- `NEXT_PUBLIC_POLAR_LINK_PRIORITY_SCAM_REPORT`
- `NEXT_PUBLIC_POLAR_LINK_AGENT_VERIFICATION`
- `NEXT_PUBLIC_POLAR_LINK_GROUP_SAFETY_REVIEW`
- `NEXT_PUBLIC_POLAR_LINK_DEVELOPER_PRELAUNCH_SCAN`
- `NEXT_PUBLIC_POLAR_LINK_FOUNDING_PARTNER`

Never put Polar access tokens or webhook secrets in `NEXT_PUBLIC_` variables.

## Dashboard Setup

1. Create a Polar product for each service that should be available through Stripe/Polar.
2. Use fixed USD pricing matching the public price.
3. Use processor-safe product descriptions focused on smart contract analysis and code-risk reports.
4. Copy each Polar product ID into the matching `POLAR_PRODUCT_ID_*` Vercel env var.
5. Create a Polar access token and set `POLAR_ACCESS_TOKEN`.
6. Configure the Polar webhook URL: `https://YOUR_DOMAIN/api/polar/webhook`.
7. Copy the webhook secret into `POLAR_WEBHOOK_SECRET`.
8. Add optional public Checkout Links to `NEXT_PUBLIC_POLAR_LINK_*` as fallback.
9. Redeploy the web app.
10. Test `/pay` and `/payment_session quick_contract_scan`.

## Webhook Route

The live route is `apps/web/src/app/api/polar/webhook/route.ts`.

It handles `order.paid` events through the official Polar Next.js webhook adapter, verifies the webhook signature with `POLAR_WEBHOOK_SECRET`, maps the order metadata back to an 8thGuard `ProductId`, and records the paid order.
