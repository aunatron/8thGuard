# Payment Session Engine

Payment sessions connect product selection, official payment rail, proof/reference, entitlement, and audit log.

Telegram creates a session ID and shows product-specific checkout and crypto rail buttons. The user can tap through from Telegram without typing a product ID or email.

The session workflow prepares the app for invoices, ledger entries, review requests, and entitlement unlock. Checkout metadata links the paid session back to the Telegram review flow. After payment, `/submit` collects the wallet, transaction, agent, or case context for the paid review queue.

Paid Review Desk v1:
- Payment confirmation records the payment, ledger entry, entitlement, and audit log when session metadata is available.
- `/submit` creates a paid review request with the service, payment reference, subject, contact, and short context.
- `/admin/reviews?token=ADMIN_REVIEW_TOKEN` lets an approved operator move the request through `paid`, `reviewing`, `needs_more_info`, and `completed`.
- The admin desk exposes a copy-ready delivery draft for each request so results use a consistent MVP-result structure.
- If the paid session contains a Telegram chat ID, the admin desk can send the edited review result back to the customer through Telegram.
- `ADMIN_TELEGRAM_CHAT_ID` can send an internal paid-intake alert without blocking the customer submission.
- Each status change emits an audit event. The admin route must stay token-protected and server-rendered.

Fields to track:
- session ID
- Telegram user
- selected product
- chain/token/amount/receiver wallet when relevant
- Stripe/Polar order reference, Paystack reference, or crypto transaction hash
- status
- invoice
- payment
- entitlement
- ledger entries
- audit logs

Payments are for 8thGuard digital services only. No trading, exchange, custody, escrow, or user-to-user settlement.
