# Telegram Bot Deployment on Vercel

## 1) Create bot with BotFather
- Open Telegram and chat with `@BotFather`.
- Run `/newbot` and save the token.

## 2) Get TELEGRAM_BOT_TOKEN
- Keep token secret.

## 3) Add env vars in Vercel
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_NAME=8thGuard`
- `NEXT_PUBLIC_OFFICIAL_TELEGRAM=https://t.me/8thGuardBot`
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=8thGuardBot`
- Optional backup bot link: `NEXT_PUBLIC_BACKUP_TELEGRAM`
- Optional: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- Optional Paystack links: `NEXT_PUBLIC_PAYSTACK_LINK_*`
- Priority Paystack links: `NEXT_PUBLIC_PAYSTACK_LINK_RAPID_WALLET_REVIEW`, `NEXT_PUBLIC_PAYSTACK_LINK_PRIORITY_CASE_TRIAGE`, `NEXT_PUBLIC_PAYSTACK_LINK_AGENT_GROUP_SAFETY`, `NEXT_PUBLIC_PAYSTACK_LINK_BUSINESS_COMMUNITY_SAFETY`, `NEXT_PUBLIC_PAYSTACK_LINK_FOUNDER_PROTECTION`, `NEXT_PUBLIC_PAYSTACK_LINK_SAME_DAY_RESPONSE`
- Optional public crypto wallets: `NEXT_PUBLIC_CRYPTO_*`
- Optional public site URL for bot links: `NEXT_PUBLIC_SITE_URL`
- Optional data sources: `ETHERSCAN_API_KEY`, `TRONGRID_API_KEY`, `TONCENTER_API_KEY`, `TONAPI_KEY`, `SOLANA_RPC_URL`, `XRPL_RPC_URL`, `BTC_MEMPOOL_API_BASE`

## 4) Deploy to Vercel
```bash
npm install
npm run build
vercel --prod
```

## 5) Set Telegram webhook
```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://YOUR_DOMAIN/api/telegram/webhook&secret_token=YOUR_SECRET"
```

## 6) Test `/start`
- Open your bot in Telegram and send `/start`.
- Test `/pricing`, `/pay`, `/crypto_pay`, `/official`, and `/check_wallet <address>`.

## 7) Troubleshooting checklist
- Confirm deployment is live at `https://YOUR_DOMAIN/api/health`.
- Confirm `TELEGRAM_BOT_TOKEN` is set in Vercel.
- Confirm webhook secret matches Vercel env var.
- Run `getWebhookInfo` to inspect Telegram webhook status.
- Check Vercel function logs for runtime errors.
- If wallet checks return partial data, confirm the relevant API key is configured or use the explorer link fallback.

## 8) Bot replacement drill
Use this if the public bot is restricted, falsely reported, or needs to move.

1. Create the replacement bot with `@BotFather` and save the new token.
2. Update Vercel `TELEGRAM_BOT_TOKEN`.
3. Update `NEXT_PUBLIC_OFFICIAL_TELEGRAM` to the new `https://t.me/...` link.
4. Update `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` to the new username without `@`.
5. Keep `NEXT_PUBLIC_BACKUP_TELEGRAM` populated if a standby bot exists.
6. Redeploy.
7. Set the webhook for the new token.
8. Send `/start`, `/official`, `/payment_session`, and `/chat_id` to the new bot.
9. Confirm `/official` on the website shows the active bot before making any public migration post.

Do not publish payment instructions from personal accounts or random admins. The public website and `/official` command are the source of truth.
