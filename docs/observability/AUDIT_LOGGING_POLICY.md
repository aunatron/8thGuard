# Audit Logging Policy

Every important bot interaction should log:
- event_type
- actor_type
- telegram_user_id
- command
- timestamp
- metadata

Current storage is console JSON. Future storage target is Supabase table with retention policy.
