import { insertAuditEventToSupabase } from "./supabase";

export type AuditEvent = {
  event_type: string;
  actor_type: "telegram_user";
  telegram_user_id?: number;
  command: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  console.log(JSON.stringify({ audit: event }));
  await insertAuditEventToSupabase(event);
}
