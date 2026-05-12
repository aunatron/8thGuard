# System Map

- `apps/web/src/app/api/telegram/webhook/route.ts`: Telegram webhook entrypoint.
- `apps/web/src/lib/telegram.ts`: command parser and Telegram API sender.
- `apps/web/src/lib/risk.ts`: risk scoring facade for wallet, transaction, and agent checks.
- `apps/web/src/lib/wallet/*`: wallet detection, explorer links, public data source lookups, and Real Wallet Check v0 orchestration.
- `apps/web/src/lib/payments/*`: USD product catalog, Paystack link config, public crypto wallet config, and data-source env config.
- `apps/web/src/lib/audit.ts`: structured audit event logging.
- `apps/web/src/lib/supabase.ts`: optional persistence hook.
- `docs/payments/*`: payment rail strategy and safety policies.
- `docs/data/*`: Supabase-ready data model and wallet intelligence plans.
