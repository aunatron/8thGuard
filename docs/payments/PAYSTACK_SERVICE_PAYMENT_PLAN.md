# Paystack Service Payment Plan

Paystack is used for 8thGuard service fees, not crypto trading or user-to-user settlement.

## Button-first flow
1. User selects a product from `/pricing` or the website.
2. Bot prepares a payment session and shows a `Pay Now` checkout button where server keys are configured.
3. Static Paystack links from `NEXT_PUBLIC_PAYSTACK_LINK_*` can appear as backup checkout links.
4. User pays through supported checkout rails.
5. 8thGuard confirms the reference and routes the requested review.

## Server-side checkout
Server-only variables:
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`
- `PAYSTACK_WEBHOOK_SECRET`

Do not expose `PAYSTACK_SECRET_KEY` to frontend code.
