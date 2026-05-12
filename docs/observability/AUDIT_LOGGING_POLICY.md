# Audit Logging Policy

Every important bot interaction should log:
- event_type
- actor_type
- telegram_user_id
- command
- timestamp
- metadata

Current storage is console JSON. Future storage target is Supabase table with retention policy.

Payment commands, wallet checks, transaction checks, agent checks, and scam-report preparation commands are important bot interactions and must continue creating audit events. Metadata should avoid sensitive evidence and should not include secret values.
