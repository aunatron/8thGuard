import { NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { getEnv } from "@/lib/config";
import {
  answerTelegramCallbackQuery,
  buildBotReply,
  buildCallbackReply,
  buildGroupAutoReply,
  extractWalletFromText,
  getActorMeta,
  sendTelegramMessage
} from "@/lib/telegram";

export async function POST(req: Request) {
  const env = getEnv();

  if (env.telegramWebhookSecret) {
    const provided = req.headers.get("x-telegram-bot-api-secret-token");
    if (!provided || provided !== env.telegramWebhookSecret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const callbackQuery = body?.callback_query;
    const callbackQueryId: string | undefined = callbackQuery?.id;
    const callbackData: string | undefined = callbackQuery?.data;
    const callbackChatId = callbackQuery?.message?.chat?.id;
    const callbackUser = callbackQuery?.from;

    if (callbackQueryId) {
      await answerTelegramCallbackQuery(callbackQueryId);

      if (!callbackChatId) {
        return NextResponse.json({ ok: true, skipped: true });
      }

      const reply = await buildCallbackReply(callbackData, env.appName, {
        chatId: callbackChatId,
        user: callbackUser,
        chatType: callbackQuery?.message?.chat?.type
      });

      await logAuditEvent({
        event_type: "telegram_callback_received",
        actor_type: "telegram_user",
        telegram_user_id: callbackUser?.id,
        command: reply.command,
        timestamp: new Date().toISOString(),
        metadata: {
          chat_id: callbackChatId,
          callback_data: callbackData,
          ...getActorMeta(callbackUser)
        }
      });

      await sendTelegramMessage(callbackChatId, reply.message, reply.reply_markup);
      return NextResponse.json({ ok: true });
    }

    const message = body?.message;
    const chatId = message?.chat?.id;
    const text: string | undefined = message?.text;
    const user = message?.from;

    if (!chatId || !text) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const chatType: string | undefined = message?.chat?.type;
    const isGroup = chatType === "group" || chatType === "supergroup";

    // Passive group auto-detection: scan non-command messages for wallet addresses
    if (isGroup && !text.startsWith("/")) {
      const detectedAddress = extractWalletFromText(text);
      if (detectedAddress) {
        const autoReply = await buildGroupAutoReply(detectedAddress);

        await logAuditEvent({
          event_type: "telegram_group_auto_detect",
          actor_type: "system",
          telegram_user_id: user?.id,
          command: autoReply.command,
          timestamp: new Date().toISOString(),
          metadata: {
            chat_id: chatId,
            chat_type: chatType,
            detected_address: detectedAddress,
            ...getActorMeta(user)
          }
        });

        await sendTelegramMessage(chatId, autoReply.message, autoReply.reply_markup);
        return NextResponse.json({ ok: true });
      }
      // No wallet detected in group non-command message — skip silently
      return NextResponse.json({ ok: true, skipped: true });
    }

    const reply = await buildBotReply(text, env.appName, {
      chatId,
      user,
      chatType
    });

    await logAuditEvent({
      event_type: "telegram_command_received",
      actor_type: "telegram_user",
      telegram_user_id: user?.id,
      command: reply.command,
      timestamp: new Date().toISOString(),
      metadata: {
        chat_id: chatId,
        has_argument: Boolean(text.trim().split(/\s+/).slice(1).join(" ")),
        ...getActorMeta(user)
      }
    });

    await sendTelegramMessage(chatId, reply.message, reply.reply_markup);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("telegram webhook error", {
      message: error instanceof Error ? error.message : "unknown_error"
    });
    return NextResponse.json({
      ok: true,
      message: "Handled with fallback"
    });
  }
}
