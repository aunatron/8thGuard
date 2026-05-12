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
- Optional: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- Optional Paystack links: `NEXT_PUBLIC_PAYSTACK_LINK_*`
- Optional public crypto wallets: `NEXT_PUBLIC_CRYPTO_*`
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
- Test `/pricing`, `/pay`, `/crypto_pay`, and `/check_wallet <address>`.

## 7) Troubleshooting checklist
- Confirm deployment is live at `https://YOUR_DOMAIN/api/health`.
- Confirm `TELEGRAM_BOT_TOKEN` is set in Vercel.
- Confirm webhook secret matches Vercel env var.
- Run `getWebhookInfo` to inspect Telegram webhook status.
- Check Vercel function logs for runtime errors.
- If wallet checks return partial data, confirm the relevant API key is configured or use the explorer link fallback.
