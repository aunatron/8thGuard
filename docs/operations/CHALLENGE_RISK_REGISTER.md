# Challenge Risk Register

- **Webhook spoofing risk**: Mitigated by optional `TELEGRAM_WEBHOOK_SECRET` validation.
- **False confidence from placeholder scores**: Mitigated by strong disclaimers.
- **Missing audit persistence**: Mitigated by structured console logs and Supabase TODO hook.
- **User submits sensitive data too early**: Mitigated by minimizing captured data and no file uploads yet.
- **Wrong-network crypto payment risk**: Mitigated by explicit network confirmation warnings and public-address-only configuration.
- **Payment impersonation risk**: Mitigated by official bot/website instructions and warnings against random admins.
- **External API outage risk**: Mitigated by graceful partial results, explorer links, and no-crash fallbacks.
