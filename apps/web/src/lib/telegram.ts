import { MAX_INPUT_LENGTH, getEnv } from "./config";
import { getPaymentContact, getPaystackPaymentLinks, getPublicCryptoWallets } from "./payments/config";
import {
  FREE_MVP_OFFER as FREE_BASIC_OFFER,
  PRODUCTS,
  PRODUCT_BY_ID,
  PRICING_NOTES,
  formatUsd,
  type ProductId
} from "./payments/products";
import { checkAgentRisk, checkTransactionRisk, checkWalletRisk } from "./risk";
import {
  mainMenuKeyboard,
  paymentKeyboard,
  scamReportKeyboard,
  walletCheckKeyboard,
  type InlineKeyboardMarkup
} from "./telegram-keyboards";

type TelegramUser = { id?: number; username?: string; first_name?: string };

export type TelegramBotReply = {
  command: string;
  message: string;
  reply_markup?: InlineKeyboardMarkup;
};

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
    `${appName} commands:`,
    "",
    "/start - Start 8thGuard",
    "/help - See available commands",
    "/check_wallet <address> - Check a crypto wallet address",
    "/check_tx <transaction_hash> - Review a transaction hash",
    "/check_agent <name_or_username> - Check a P2P agent or username",
    "/report_scam - Learn what evidence to prepare",
    "/pricing - See service pricing",
    "/pay - Pay with Paystack/local rails",
    "/crypto_pay - View official crypto payment rails",
    "/payment_warning - Read payment safety warnings",
    "/submit_payment - Learn how to submit payment proof",
    "/tonight_offer - See current offer stack",
    "/contact - Official contact options",
    "",
    "Results are early risk indicators, not final fraud proof. Check before you send."
  ].join("\n");
}

function buildStartMessage(): string {
  return [
    "Welcome to 8thGuard.",
    "",
    "Check before you send.",
    "",
    "I help you review crypto wallets, transaction hashes, and P2P agents for early risk signals before you move funds.",
    "",
    "Crypto scams move fast. 8thGuard helps you pause, check, and make a safer decision before money leaves your wallet.",
    "",
    "What you can do now:",
    "- /check_wallet <address> - Check a crypto wallet address",
    "- /check_tx <transaction_hash> - Review a transaction hash",
    "- /check_agent <name_or_username> - Check a P2P agent or username",
    "- /pricing - See service pricing",
    "- /pay - Pay with Paystack/local rails",
    "- /crypto_pay - View official crypto payment rails",
    "- /report_scam - Learn what evidence to prepare",
    "",
    "Results are early risk indicators, not final fraud proof.",
    "",
    "Use the buttons below, or type /help to see all commands."
  ].join("\n");
}

function productLine(productId: ProductId): string {
  const product = PRODUCT_BY_ID[productId];
  return `${product.name} - ${formatUsd(product.priceUsd)}`;
}

function buildPricingMessage(): string {
  return [
    "8thGuard Service Pricing",
    `${FREE_BASIC_OFFER.name}: Free`,
    ...PRODUCTS.map((product) => `${product.name} - ${formatUsd(product.priceUsd)}`),
    "",
    ...PRICING_NOTES.map((note) => note.replace("MVP", "service")),
    "Results are early risk indicators, not final fraud proof."
  ].join("\n");
}

function buildContactMessage(): string {
  const { contactHandle, officialTelegram } = getPaymentContact();
  if (contactHandle && officialTelegram) return `Official contact: ${contactHandle}\nOfficial Telegram: ${officialTelegram}`;
  if (contactHandle) return `Official contact: ${contactHandle}`;
  if (officialTelegram) return `Official Telegram: ${officialTelegram}`;
  return "Official contact will be published on the 8thGuard website.";
}

function buildPayMessage(): string {
  const links = getPaystackPaymentLinks();
  const configuredLinks = PRODUCTS.filter((product) => links[product.id]);

  const base = [
    "Paystack is used for paying 8thGuard service fees.",
    "Supported local rails may include MoMo, card, bank transfer, and other Paystack-supported methods.",
    "This is for digital services only.",
    "Not crypto trading, exchange, escrow, custody, or user-to-user settlement."
  ];

  if (configuredLinks.length === 0) {
    return [
      ...base,
      "",
      "Payment links are being activated. Users should use official 8thGuard contact only.",
      buildContactMessage()
    ].join("\n");
  }

  return [
    ...base,
    "",
    "Paystack service payment links:",
    ...configuredLinks.map((product) => `${product.name}: ${links[product.id]}`)
  ].join("\n");
}

function buildCryptoPayMessage(): string {
  const wallets = getPublicCryptoWallets();
  return [
    "Crypto payments are accepted only for 8thGuard digital services.",
    "Supported official wallet rails:",
    ...wallets.map((wallet) => {
      const address = wallet.address || "Not published yet.";
      const tag = wallet.destinationTag ? ` Destination tag: ${wallet.destinationTag}` : "";
      return `${wallet.label}: ${address}${tag}`;
    }),
    "",
    "Confirm the exact network before sending.",
    "Wrong-network payments may be unrecoverable.",
    "Never send seed phrases or private keys.",
    "No escrow, no custody, no exchange."
  ].join("\n");
}

function buildPaymentWarningMessage(): string {
  return [
    "Payment Safety Warning",
    "Never pay random admins.",
    "Never trust screenshots alone.",
    "Only pay through official 8thGuard bot/website instructions.",
    "8thGuard will never ask for seed phrases/private keys.",
    "Crypto payments are for 8thGuard digital services only.",
    "No escrow, no custody, no exchange."
  ].join("\n");
}

function buildSubmitPaymentMessage(): string {
  return [
    "Automated payment verification is not fully live yet.",
    "After payment, prepare:",
    "- product selected",
    "- Paystack reference or crypto transaction hash",
    "- wallet/transaction/agent being reviewed",
    "- Telegram contact",
    "- short context",
    "",
    "Do not collect or send sensitive documents in Telegram yet.",
    "Use official contact or future form."
  ].join("\n");
}

function buildTonightOfferMessage(): string {
  return [
    "Current Service Offer Stack",
    productLine("detailed_wallet_review").replace("Detailed Wallet Review", "Detailed Review"),
    productLine("priority_scam_report_review").replace("Priority Scam Report Review", "Priority Scam Review"),
    productLine("weekly_early_access_supporter"),
    productLine("agent_verification_review"),
    productLine("group_community_safety_review"),
    productLine("founding_supporter_package"),
    "",
    "$200 sprint math:",
    "2 Founding Supporters ~= $200",
    "4 Group Safety Reviews ~= $200",
    "7 Agent Reviews ~= $210",
    "14 Weekly Supporters ~= $210",
    "",
    "This is current service access, not a fake discount. Results are early risk signals, not final fraud proof."
  ].join("\n");
}

function formatExplorerLinks(links: { label: string; url: string }[]): string {
  if (links.length === 0) return "Explorer: Not available for this format yet.";
  return links.map((link) => `${link.label}: ${link.url}`).join("\n");
}

function removeMvpPrefix(text: string): string {
  return text.replace("MVP result only. ", "");
}

export async function buildBotReply(text: string, appName: string): Promise<TelegramBotReply> {
  const { command, arg } = parseCommand(text);
  if (command === "/start") {
    return { command, message: buildStartMessage(), reply_markup: mainMenuKeyboard };
  }

  if (command === "/help") {
    return { command, message: buildCommandHelp(appName), reply_markup: mainMenuKeyboard };
  }

  if (command === "/check_wallet") {
    if (!arg) return { command, message: "Send /check_wallet <address>\n\nExample: /check_wallet 0x1234...", reply_markup: undefined };
    const risk = await checkWalletRisk(arg);
    return {
      command,
      message: [
        "Wallet Intelligence Preview",
        `Network: ${risk.detectedChain}${risk.possibleNetworks.length > 1 ? ` (${risk.possibleNetworks.join(", ")})` : ""}`,
        `Risk: ${risk.score}/100 - ${risk.level}`,
        `Live data: ${risk.liveDataUsed ? "Yes" : "No"}`,
        "Signals:",
        ...risk.reasons.map((reason) => `- ${removeMvpPrefix(reason)}`),
        "Explorer links:",
        formatExplorerLinks(risk.explorerLinks),
        removeMvpPrefix(risk.disclaimer),
        "For deeper manual review, use /pricing."
      ].join("\n"),
      reply_markup: walletCheckKeyboard
    };
  }

  if (command === "/check_tx") {
    if (!arg) return { command, message: "Send /check_tx <transaction_hash>", reply_markup: undefined };
    const risk = checkTransactionRisk(arg);
    return {
      command,
      message: [
        "Transaction Intelligence Preview",
        `Likely networks: ${risk.likelyNetworks.join(", ")}`,
        `Risk: ${risk.score}/100 - ${risk.level}`,
        `Live data: ${risk.liveDataUsed ? "Yes" : "No"}`,
        "Signals:",
        ...risk.reasons.map((reason) => `- ${reason}`),
        "Explorer links:",
        formatExplorerLinks(risk.explorerLinks),
        removeMvpPrefix(risk.disclaimer),
        "For deeper manual review, use /pricing."
      ].join("\n")
    };
  }

  if (command === "/check_agent") {
    if (!arg) return { command, message: "Send /check_agent <name_or_username>", reply_markup: undefined };
    const risk = checkAgentRisk(arg);
    return {
      command,
      message: `Agent Risk Check: ${risk.score}/100 - ${risk.level} Risk. ${removeMvpPrefix(risk.disclaimer)} Reasons: ${risk.reasons.join("; ")}.`
    };
  }

  if (command === "/report_scam") {
    return {
      command,
      message:
        "Prepare this evidence: wallet address, Telegram username, transaction hash, amount, screenshots, and a short story of what happened. Do not send sensitive documents in Telegram yet. File upload support is coming soon.",
      reply_markup: scamReportKeyboard
    };
  }

  if (command === "/pricing") return { command, message: buildPricingMessage(), reply_markup: paymentKeyboard };
  if (command === "/pay") return { command, message: buildPayMessage(), reply_markup: paymentKeyboard };
  if (command === "/crypto_pay") return { command, message: buildCryptoPayMessage(), reply_markup: paymentKeyboard };
  if (command === "/payment_warning") return { command, message: buildPaymentWarningMessage() };
  if (command === "/submit_payment") return { command, message: buildSubmitPaymentMessage() };
  if (command === "/tonight_offer") return { command, message: buildTonightOfferMessage() };
  if (command === "/contact") return { command, message: buildContactMessage() };

  return {
    command: "unknown",
    message: "I didn't recognize that command. Use /help to see what I can do.",
    reply_markup: mainMenuKeyboard
  };
}

export async function buildCallbackReply(callbackData: string | undefined, appName: string): Promise<TelegramBotReply> {
  if (callbackData === "check_wallet") {
    return { command: "check_wallet", message: "Send /check_wallet <address>\n\nExample: /check_wallet 0x1234..." };
  }

  if (callbackData === "check_tx") {
    return { command: "check_tx", message: "Send /check_tx <transaction_hash>" };
  }

  if (callbackData === "check_agent") {
    return { command: "check_agent", message: "Send /check_agent <name_or_username>" };
  }

  const commandByCallback: Record<string, string> = {
    report_scam: "/report_scam",
    pricing: "/pricing",
    pay: "/pay",
    crypto_pay: "/crypto_pay",
    contact: "/contact",
    payment_warning: "/payment_warning",
    submit_payment: "/submit_payment"
  };

  const command = callbackData ? commandByCallback[callbackData] : undefined;
  if (command) return buildBotReply(command, appName);

  return {
    command: "unknown_callback",
    message: "I didn't recognize that action. Use /help to see what I can do.",
    reply_markup: mainMenuKeyboard
  };
}

export async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: InlineKeyboardMarkup): Promise<void> {
  const { telegramBotToken } = getEnv();
  if (!telegramBotToken) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN");
  }

  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, ...(replyMarkup ? { reply_markup: replyMarkup } : {}) })
  });

  if (!response.ok) {
    throw new Error(`Telegram sendMessage failed with status ${response.status}`);
  }
}

export async function answerTelegramCallbackQuery(callbackQueryId: string): Promise<void> {
  const { telegramBotToken } = getEnv();
  if (!telegramBotToken) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN");
  }

  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId })
  });

  if (!response.ok) {
    throw new Error(`Telegram answerCallbackQuery failed with status ${response.status}`);
  }
}

export function getActorMeta(user?: TelegramUser): Record<string, unknown> {
  return {
    username: user?.username,
    first_name: user?.first_name
  };
}
