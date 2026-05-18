export function getEnv() {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME || "8thGuard",
    telegramBotUsername: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    adminReviewToken: process.env.ADMIN_REVIEW_TOKEN,
    adminTelegramChatId: process.env.ADMIN_TELEGRAM_CHAT_ID
  };
}

export const MAX_INPUT_LENGTH = 220;
