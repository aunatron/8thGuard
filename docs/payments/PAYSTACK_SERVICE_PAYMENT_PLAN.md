# Paystack Service Payment Plan

Paystack is used for 8thGuard service fees, not crypto trading or user-to-user settlement.

## MVP flow
1. User selects a product from `/pricing` or the website.
2. Bot shows configured Paystack payment links from `NEXT_PUBLIC_PAYSTACK_LINK_*`.
3. User pays through Paystack-supported rails.
4. User submits the Paystack reference through official contact or a future form.
5. 8thGuard manually matches the reference to the requested review.

## Future API readiness
Server-only variables are reserved for API and webhook work:
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`
- `PAYSTACK_WEBHOOK_SECRET`

Do not expose `PAYSTACK_SECRET_KEY` to frontend code.
