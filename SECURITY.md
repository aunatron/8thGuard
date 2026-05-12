# Security Baseline

- Secrets are environment variables only.
- Telegram webhook secret header validation is supported.
- Inputs are trimmed and length-limited.
- Raw internal errors are not returned to end users.
- No private key handling.
- No custody implementation.
- No escrow, exchange, trading, or user-to-user settlement implementation.
- Payment links and public wallet addresses are configuration-driven.
- Server-only secrets such as Paystack secret keys and blockchain API keys must never be exposed to the frontend or logged.
- Wallet and transaction outputs are early risk signals, not final fraud proof.
