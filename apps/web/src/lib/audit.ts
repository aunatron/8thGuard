import { insertAuditEventToSupabase } from "./supabase";

export type AuditEvent = {
  event_type: string;
  actor_type: "telegram_user" | "admin" | "system";
  actor_id?: string;
  telegram_user_id?: number;
  command: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  console.log(JSON.stringify({ audit: event }));
  try {
    await insertAuditEventToSupabase(event as Record<string, unknown>);
  } catch (error) {
    console.error("audit persistence failed", { error: error instanceof Error ? error.message : "unknown" });
  }
}
