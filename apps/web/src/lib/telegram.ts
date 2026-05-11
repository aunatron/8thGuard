import { MAX_INPUT_LENGTH, getEnv } from "./config";
import { checkAgentRisk, checkTransactionRisk, checkWalletRisk } from "./risk";

type TelegramUser = { id?: number; username?: string; first_name?: string };

function sanitizeInput(input: string | undefined): string {
  if (!input) return "";
  return input.trim().replace(/\s+/g, " ").slice(0, MAX_INPUT_LENGTH);
}

export function parseCommand(text: string): { command: string; arg: string } {
  const clean = sanitizeInput(text);
  const [rawCommand, ...rest] = clean.split(" ");
  return { command: rawCommand.toLowerCase(), arg: rest.join(" ").trim() };
}

export function buildCommandHelp(appName: string): string {
  return [
    `Welcome to ${appName} command center.`,
    "Available commands:",
    "/start",
    "/help",
    "/check_wallet <address>",
    "/check_tx <transaction_hash>",
    "/check_agent <name_or_username>",
    "/report_scam"
  ].join("\n");
}

export function buildBotReply(text: string, appName: string): { command: string; message: string } {
  const { command, arg } = parseCommand(text);
  if (command === "/start") {
    return {
      command,
      message:
        "Welcome to 8thGuard. I help you check crypto wallets, transactions, and P2P agents before you send money."
    };
  }

  if (command === "/help") {
    return { command, message: buildCommandHelp(appName) };
  }

  if (command === "/check_wallet") {
    if (!arg) return { command, message: "Usage: /check_wallet <address>" };
    const risk = checkWalletRisk(arg);
    return {
      command,
      message: `Wallet Risk Check: ${risk.score}/100 — ${risk.level} Risk. ${risk.disclaimer} Reasons: ${risk.reasons.join("; ")}.`
    };
  }

  if (command === "/check_tx") {
    if (!arg) return { command, message: "Usage: /check_tx <transaction_hash>" };
    const risk = checkTransactionRisk(arg);
    return {
      command,
      message: `Transaction Risk Check: ${risk.score}/100 — ${risk.level} Risk. ${risk.disclaimer} Reasons: ${risk.reasons.join("; ")}.`
    };
  }

  if (command === "/check_agent") {
    if (!arg) return { command, message: "Usage: /check_agent <name_or_username>" };
    const risk = checkAgentRisk(arg);
    return {
      command,
      message: `Agent Risk Check: ${risk.score}/100 — ${risk.level} Risk. ${risk.disclaimer} Reasons: ${risk.reasons.join("; ")}.`
    };
  }

  if (command === "/report_scam") {
    return {
      command,
      message:
        "Prepare this evidence: wallet address, Telegram username, transaction hash, amount, screenshots, and a short story of what happened. File upload support is coming soon."
    };
  }

  return {
    command: "unknown",
    message: `I did not understand that.\n\n${buildCommandHelp(appName)}`
  };
}

export async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
  const { telegramBotToken } = getEnv();
  if (!telegramBotToken) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN");
  }

  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  if (!response.ok) {
    throw new Error(`Telegram sendMessage failed with status ${response.status}`);
  }
}

export function getActorMeta(user?: TelegramUser): Record<string, unknown> {
  return {
    username: user?.username,
    first_name: user?.first_name
  };
}
