# Payment Rail Strategy

8thGuard accepts payments only for its own digital services during the MVP. Payment rails must not create escrow, custody, exchange, trading, or user-to-user settlement behavior.

## Rails
- Paystack for service payment links and local rails such as MoMo, card, and bank transfer where supported.
- Official crypto wallets for direct service-fee payments.
- USD reference pricing for global consistency.

## Rules
- No private keys or seed phrases are handled.
- Public wallet addresses may be shown after founder approval.
- Paystack secret keys and webhook secrets stay server-only.
- Manual review results are early risk signals and not final fraud proof.
