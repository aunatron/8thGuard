# Payment Session Engine

Payment sessions connect product selection, official payment rail, proof/reference, entitlement, and audit log.

Telegram v0 now creates a session ID and shows product-specific Paystack and crypto rail buttons. The session is not persisted yet; it is a structured manual workflow that prepares the app for invoices, ledger entries, and entitlement unlock.

Fields to track:
- session ID
- Telegram user
- selected product
- chain/token/amount/receiver wallet when relevant
- Paystack reference or crypto transaction hash
- status
- invoice
- payment
- entitlement
- ledger entries
- audit logs

Payments are for 8thGuard digital services only. No trading, exchange, custody, escrow, or user-to-user settlement.
