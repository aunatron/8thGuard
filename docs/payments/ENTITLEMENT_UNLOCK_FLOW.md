# Entitlement Unlock Flow

Entitlements grant access to paid 8thGuard utility after a payment is confirmed.

Paid-service flow:
1. User selects product.
2. App creates payment session and invoice.
3. User pays through Stripe/Polar, Paystack/Others, or official crypto wallet rail.
4. Payment is confirmed by checkout reference, payment desk review, or verified crypto transaction.
5. App creates ledger entry and audit log.
6. Entitlement unlocks the selected check, review, session, or protected-flow step.

Payment confirmation must create a clear audit trail before a paid check, review, session, or protected-flow step is released.
