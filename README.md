# 8thGuard

8thGuard is a Ghana-first crypto P2P fraud detection and wallet risk intelligence platform.

## MVP in this repository
- Next.js app for Vercel deployment.
- Telegram webhook bot endpoint.
- Placeholder risk engine for wallet, transaction, and agent checks.
- Structured audit logging to console (Supabase-ready extension point).

## Run locally
```bash
npm install
npm run dev
```

## Validate build
```bash
npm run build
npm run lint
```

## Local webhook testing
Use a tunnel (for example ngrok) to expose your local server and call Telegram setWebhook with your tunnel URL.

## Deploy to Vercel
Follow `docs/deployment/TELEGRAM_BOT_DEPLOYMENT.md`.

## Next actions
1. Wire Supabase audit persistence.
2. Add live blockchain intelligence providers.
3. Add verified-agent registry workflow.
