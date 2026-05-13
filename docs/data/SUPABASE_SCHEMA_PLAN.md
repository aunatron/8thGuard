# Supabase Schema Plan

Planned tables:
- `users`
- `telegram_users`
- `payment_sessions`
- `invoices`
- `payments`
- `ledger_entries`
- `entitlements`
- `audit_logs`
- `risk_checks`
- `reported_wallets`
- `scam_reports`
- `agents`
- `guarded_transactions`
- `disputes`
- `data_sources`
- `risk_model_versions`

MVP rule: the app must not require Supabase to be configured in order to run. Supabase persistence should extend the existing no-crash audit and payment-session patterns.

Sensitive-data rule: do not store seed phrases, private keys, wallet passwords, or raw documents that are not required for the paid service.
