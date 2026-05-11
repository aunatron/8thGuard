# Security Architecture

- Token security: `TELEGRAM_BOT_TOKEN` used only server-side.
- Webhook authenticity: verify `x-telegram-bot-api-secret-token` when configured.
- Input safety: trim, normalize spaces, and enforce length caps.
- Error safety: return fallback messages without raw stack traces.
- MVP boundaries: no escrow, no custody, no key storage.
