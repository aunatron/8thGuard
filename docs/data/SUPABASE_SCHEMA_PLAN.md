# Supabase Schema Plan

This is a planning document only. No migrations are implemented in this sprint.

## Tables
- `audit_logs`: structured bot and system events.
- `bot_updates`: raw Telegram update metadata with sensitive data minimized.
- `risk_checks`: wallet, transaction, and agent check outputs by model version.
- `reported_wallets`: internal wallet reports and reviewed evidence status.
- `scam_reports`: structured scam report cases.
- `agents`: P2P agent records and review status.
- `payments`: Paystack or crypto payment records.
- `invoices`: requested services and expected payment amounts.
- `ledger_entries`: internal accounting entries for service payments only.
- `payment_submissions`: user-submitted Paystack references or crypto hashes.
- `wallet_addresses`: official 8thGuard receiving wallets and reviewed external wallets.
- `data_sources`: enabled providers, status, and reliability notes.
- `risk_model_versions`: scoring version, rules, and release notes.

All tables need audit timestamps and careful private-data minimization.
