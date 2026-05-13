# Entitlement Unlock Flow

Entitlements grant access to paid 8thGuard utility after a payment is confirmed.

Planned flow:
1. User selects product.
2. App creates payment session and invoice.
3. User pays through Paystack or official crypto wallet rail.
4. Payment is confirmed by webhook, admin review, or verified crypto transaction.
5. App creates ledger entry and audit log.
6. Entitlement unlocks the selected check, review, session, or protected-flow step.

Current MVP status: manual payment proof submission is active; full auto-unlock is planned.
