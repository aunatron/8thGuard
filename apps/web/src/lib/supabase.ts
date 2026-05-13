import { getEnv } from "./config";

export function hasSupabaseConfig(): boolean {
  const env = getEnv();
  return Boolean(env.supabaseUrl && (env.supabaseServiceRoleKey || env.supabaseAnonKey));
}

function supabaseCredentials(): { url: string; key: string } | undefined {
  const env = getEnv();
  const key = env.supabaseServiceRoleKey || env.supabaseAnonKey;
  if (!env.supabaseUrl || !key) return undefined;
  return {
    url: env.supabaseUrl.replace(/\/+$/, ""),
    key
  };
}

export async function insertSupabaseRow<T extends Record<string, unknown>>(table: string, row: T): Promise<T | undefined> {
  const credentials = supabaseCredentials();
  if (!credentials) return undefined;

  try {
    const response = await fetch(`${credentials.url}/rest/v1/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: {
        apikey: credentials.key,
        Authorization: `Bearer ${credentials.key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(row)
    });

    if (!response.ok) throw new Error(`supabase_insert_${response.status}`);
    const json = (await response.json()) as T[];
    return json[0];
  } catch (error) {
    console.error("supabase insert failed", { table, error: error instanceof Error ? error.message : "unknown" });
    return undefined;
  }
}

export async function selectSupabaseRows<T>(table: string, query = "select=*&order=created_at.desc&limit=50"): Promise<T[]> {
  const credentials = supabaseCredentials();
  if (!credentials) return [];

  try {
    const response = await fetch(`${credentials.url}/rest/v1/${encodeURIComponent(table)}?${query}`, {
      headers: {
        apikey: credentials.key,
        Authorization: `Bearer ${credentials.key}`,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`supabase_select_${response.status}`);
    return (await response.json()) as T[];
  } catch (error) {
    console.error("supabase select failed", { table, error: error instanceof Error ? error.message : "unknown" });
    return [];
  }
}

export async function insertAuditEventToSupabase(event: Record<string, unknown>): Promise<void> {
  if (!hasSupabaseConfig()) {
    return;
  }

  await insertSupabaseRow("audit_logs", {
    event_type: event.event_type,
    actor_type: event.actor_type,
    actor_id: event.telegram_user_id ? String(event.telegram_user_id) : undefined,
    command: event.command,
    metadata: event.metadata || {},
    created_at: event.timestamp || new Date().toISOString()
  });
}
