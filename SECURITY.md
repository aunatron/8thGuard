# Security Baseline

- Secrets are environment variables only.
- Telegram webhook secret header validation is supported.
- Inputs are trimmed and length-limited.
- Raw internal errors are not returned to end users.
- No private key handling.
- No custody implementation.
