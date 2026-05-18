# Channel Resilience Playbook

8thGuard should assume bad actors may impersonate, report, or pressure public channels.

## Source Of Truth

`/official` is the public source of truth for:
- official website
- active Telegram bot
- backup Telegram bot
- official WhatsApp channel
- support contact
- payment safety warnings

If a bot, number, group, or payment instruction is not listed on `/official`, users should treat it as unverified.

## Telegram Bot Replacement

If the active Telegram bot is restricted or taken down:
1. Create a replacement bot in BotFather.
2. Set the new `TELEGRAM_BOT_TOKEN` in Vercel.
3. Set the Telegram webhook to `/api/telegram/webhook`.
4. Update `NEXT_PUBLIC_OFFICIAL_TELEGRAM`.
5. Update `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`.
6. If a backup bot is available, set `NEXT_PUBLIC_BACKUP_TELEGRAM`.
7. Redeploy and confirm `/start`, `/official`, `/payment_session`, `/chat_id`, and admin delivery.
8. Update `/official` through env values before posting any public migration notice.

The bot also supports `/official`, which sends users to the website source of truth and lists the active/backup Telegram links. Referral links and group CTAs read the configured bot username, so a replacement bot should not require code changes.

Do not tell users to trust payment instructions from random admins.

## WhatsApp Readiness

When Meta Business and the WhatsApp Business number are ready:
1. Set `NEXT_PUBLIC_OFFICIAL_WHATSAPP` to the official `https://wa.me/...` link or approved WhatsApp entry URL.
2. Keep the first WhatsApp flow narrow: intake, payment guidance, and status handoff into the same review desk.
3. Use approved templates only for outbound business-initiated messages.
4. Keep sensitive-data warnings visible: no seed phrases, private keys, wallet passwords, or unnecessary identity documents.

WhatsApp must route into the same paid review desk. It should not create a separate product, payment, custody, exchange, escrow, or settlement flow.
