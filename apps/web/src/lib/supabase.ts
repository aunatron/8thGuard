import { getEnv } from "./config";

export function hasSupabaseConfig(): boolean {
  const env = getEnv();
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export async function insertAuditEventToSupabase(_event: unknown): Promise<void> {
  // TODO: Implement Supabase insert when persistence layer is ready.
  // This function is intentionally a no-op to avoid runtime crashes
  // when Supabase variables are absent.
  if (!hasSupabaseConfig()) {
    return;
  }
}
