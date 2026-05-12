export function getEnv() {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME || "8thGuard",
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY
  };
}

export const MAX_INPUT_LENGTH = 220;
