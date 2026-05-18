# Challenge Risk Register

- **Webhook spoofing risk**: mitigated by optional `TELEGRAM_WEBHOOK_SECRET` validation.
- **False confidence from risk scores**: mitigated by "early risk signals," "MVP result," and "not final fraud proof" language.
- **Paid-first drift**: mitigated by removing free-check positioning and keeping "Free education. Paid utility."
- **Missing audit persistence**: mitigated by structured console logs and Supabase-ready audit schema.
- **User submits sensitive data too early**: mitigated by no file-upload intake, no seed phrase/private-key collection, and minimal context requests.
- **Wrong-network crypto payment risk**: mitigated by explicit network confirmation warnings and public-address-only configuration.
- **Payment impersonation risk**: mitigated by official bot/website instructions and warnings against random admins.
- **Channel impersonation and bot-reporting risk**: mitigated by `/official`, backup-channel configuration, and payment warnings that tell users to trust only channels listed on the official website.
- **Admin review desk exposure risk**: mitigated by `ADMIN_REVIEW_TOKEN`, server-side Supabase keys, and no public client-side review queue.
- **Admin alert leakage risk**: mitigated by sending paid-intake alerts only to `ADMIN_TELEGRAM_CHAT_ID`, omitting the admin token from alerts, and keeping alerts short.
- **Review delivery leakage risk**: mitigated by token-protected admin delivery, Telegram chat IDs from payment sessions, editable operator review, and audit logging without storing delivered message bodies in audit metadata.
- **Review intake sensitive-data risk**: mitigated by no upload field, explicit no seed phrase/private-key/wallet-password warnings, and short context limits.
- **External API outage risk**: mitigated by graceful partial results, explorer links, and no-crash fallbacks.
- **Contract preview false-confidence risk**: mitigated by "early contract risk signals," "automated risk preview," and "not a full audit" language plus paid deep-review CTA.
- **Heavy scanner runtime risk**: mitigated by keeping Slither, Mythril, Echidna, and transaction simulation out of the Vercel request path until queue/worker infrastructure exists.
- **Escrow/custody drift risk**: mitigated by gated architecture docs and no production escrow, custody, exchange, trading, or user-to-user settlement implementation.
