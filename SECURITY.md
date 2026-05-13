# Security Baseline

- Secrets are environment variables only.
- Telegram webhook secret header validation is supported.
- Inputs are trimmed and length-limited.
- Raw internal errors are not returned to users.
- No private key handling.
- No seed phrase handling.
- No production custody implementation.
- No production escrow implementation.
- No exchange, trading, or user-to-user settlement implementation.
- Paystack links and public wallet addresses are configuration-driven.
- Paystack is for 8thGuard digital service payments only.
- Crypto wallets are for 8thGuard digital service payments only.
- Server-only secrets such as Paystack secret keys and blockchain API keys must never be exposed to the frontend or logged.
- Wallet and transaction outputs are early risk signals, not final fraud proof.
- Every major feature must include audit logging or a documented audit hook.
