# Challenge Risk Register

- **Webhook spoofing risk**: mitigated by optional `TELEGRAM_WEBHOOK_SECRET` validation.
- **False confidence from risk scores**: mitigated by "early risk signals," "MVP result," and "not final fraud proof" language.
- **Paid-first drift**: mitigated by removing free-check positioning and keeping "Free education. Paid utility."
- **Missing audit persistence**: mitigated by structured console logs and Supabase-ready audit schema.
- **User submits sensitive data too early**: mitigated by no file-upload intake, no seed phrase/private-key collection, and minimal context requests.
- **Wrong-network crypto payment risk**: mitigated by explicit network confirmation warnings and public-address-only configuration.
- **Payment impersonation risk**: mitigated by official bot/website instructions and warnings against random admins.
- **External API outage risk**: mitigated by graceful partial results, explorer links, and no-crash fallbacks.
- **Escrow/custody drift risk**: mitigated by gated architecture docs and no production escrow, custody, exchange, trading, or user-to-user settlement implementation.
