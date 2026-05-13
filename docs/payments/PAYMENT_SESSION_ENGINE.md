# Payment Session Engine

Payment sessions connect product selection, official payment rail, proof/reference, entitlement, and audit log.

Telegram creates a session ID and shows product-specific checkout and crypto rail buttons. The user can tap through from Telegram without typing a product ID or email.

The session workflow prepares the app for invoices, ledger entries, review requests, and entitlement unlock. Checkout metadata links the paid session back to the Telegram review flow. After payment, `/submit` collects the wallet, transaction, agent, or case context for the paid review queue.

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
