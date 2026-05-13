# Audit Logging Policy

Every major feature must emit or plan an audit log.

Audit events should cover:
- Telegram command received
- Telegram callback received
- payment session created
- invoice created
- payment proof submitted
- payment confirmed or rejected
- entitlement unlocked
- risk check requested
- guarded flow step created
- dispute opened or resolved

MVP logs can be structured console events. Supabase persistence should use the planned `audit_logs` table when configured.

Never log secrets, API keys, private keys, seed phrases, or full sensitive documents.
