import { MAX_INPUT_LENGTH, getEnv } from "./config";
import { getPaymentContact, getPaystackPaymentLinks, getPublicCryptoWallets } from "./payments/config";
import { PRODUCTS, PRODUCT_BY_ID, formatUsd, type ProductId } from "./payments/products";
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
    `${appName} Safety Desk`,
    "",
    "/check_wallet <address> - Wallet risk intelligence",
    "/check_tx <transaction_hash> - Transaction review",
    "/check_agent <name_or_username> - P2P agent check",
    "/report_scam - Evidence checklist",
    "/pricing - Review services",
    "/pay - Pay with Paystack/local rails",
    "/crypto_pay - Official crypto payment rails",
    "/payment_warning - Payment safety guidance",
    "/submit_payment - Submit payment proof instructions",
    "/contact - Official contact options",
    "",
    "Use 8thGuard to pause, verify the details, and make a safer decision before funds leave your wallet."
  ].join("\n");
}

function buildStartMessage(): string {
  return [
    "8thGuard Safety Desk",
    "",
    "Check before you send.",
    "",
    "Review a wallet, transaction hash, or P2P agent before you move funds. 8thGuard helps you slow down high-pressure crypto decisions and look for early risk signals.",
    "",
    "Start with one of the checks below:",
    "",
    "- /check_wallet <address>",
    "- /check_tx <transaction_hash>",
    "- /check_agent <name_or_username>",
    "",
    "For paid review support, use /pricing. For scam-report guidance, use /report_scam.",
    "",
    "Results are risk indicators, not final fraud proof."
  ].join("\n");
}

function productLine(productId: ProductId): string {
  const product = PRODUCT_BY_ID[productId];
  return `${product.name} - ${formatUsd(product.priceUsd)}`;
}

function buildPricingMessage(): string {
  return [
    "8thGuard Review Services",
    "Basic checks: Free",
    ...PRODUCTS.map((product) => `${product.name} - ${formatUsd(product.priceUsd)}`),
    "",
    "For urgent cases, choose Priority Scam Case Triage, Business/Community Safety Review, Founder Protection Package, or Same-Day Response Desk.",
    "USD is the reference price.",
    "Local rails may convert at checkout.",
    "Crypto payments use USDT/USDC equivalent or quoted crypto amount.",
    "Results are risk indicators, not final fraud proof."
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
    "Paystack is used for 8thGuard review service payments.",
    "Supported local rails may include MoMo, card, bank transfer, and other Paystack-supported methods.",
    "Payments are for 8thGuard digital services only.",
    "Not crypto trading, exchange, escrow, custody, or user-to-user settlement."
  ];

  if (configuredLinks.length === 0) {
    return [
      ...base,
      "",
      "Use official 8thGuard contact for payment instructions.",
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

function buildPaystackPaymentKeyboard(): InlineKeyboardMarkup {
  const links = getPaystackPaymentLinks();
  const priorityOrder: ProductId[] = [
    "same_day_response_desk",
    "founder_protection_package",
    "business_community_safety_review",
    "agent_group_safety_review",
    "priority_scam_case_triage",
    "rapid_wallet_risk_review",
    "founding_supporter_package",
    "group_community_safety_review",
    "agent_verification_review",
    "priority_scam_report_review",
    "detailed_wallet_review",
    "detailed_transaction_review",
    "agent_risk_review",
    "weekly_early_access_supporter"
  ];
  const rows = priorityOrder
    .filter((productId) => links[productId])
    .map((productId) => [{ text: `Pay: ${PRODUCT_BY_ID[productId].name}`, url: links[productId] }]);

  if (rows.length === 0) return paymentKeyboard;

  return {
    inline_keyboard: [
      ...rows,
      [
        { text: "Crypto Pay", callback_data: "crypto_pay" },
        { text: "Submit Payment", callback_data: "submit_payment" }
      ],
      [{ text: "Payment Warning", callback_data: "payment_warning" }]
    ]
  };
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
    "8thGuard does not provide escrow, custody, exchange, or trading services."
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
    "8thGuard does not provide escrow, custody, exchange, or trading services."
  ].join("\n");
}

function buildSubmitPaymentMessage(): string {
  return [
    "Payment Proof Checklist",
    "",
    "After payment, prepare:",
    "- product selected",
    "- Paystack reference or crypto transaction hash",
    "- wallet/transaction/agent being reviewed",
    "- Telegram contact",
    "- short context",
    "",
    "Do not collect or send sensitive documents in Telegram yet.",
    "Use official contact for submission instructions."
  ].join("\n");
}

function buildTonightOfferMessage(): string {
  return [
    "Priority Review Paths",
    productLine("rapid_wallet_risk_review"),
    productLine("priority_scam_case_triage"),
    productLine("agent_group_safety_review"),
    productLine("business_community_safety_review"),
    productLine("founder_protection_package"),
    productLine("same_day_response_desk"),
    "",
    "Choose the level of review that matches the risk and urgency of the situation.",
    "Results are risk indicators, not final fraud proof."
  ].join("\n");
}

function formatExplorerLinks(links: { label: string; url: string }[]): string {
  if (links.length === 0) return "Explorer: Not available for this format yet.";
  return links.map((link) => `${link.label}: ${link.url}`).join("\n");
}

function levelLabel(score: number): string {
  if (score >= 70) return `${score}/100 - High caution`;
  if (score >= 50) return `${score}/100 - Medium caution`;
  if (score >= 35) return `${score}/100 - Low-to-medium caution`;
  return `${score}/100 - Lower immediate risk`;
}

function liveDataLabel(liveDataUsed: boolean): string {
  return liveDataUsed ? "Network data included" : "Format and explorer review";
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
    if (!arg) return { command, message: "Send a wallet address with the command.\n\nExample: /check_wallet 0x1234...", reply_markup: undefined };
    const risk = await checkWalletRisk(arg);
    return {
      command,
      message: [
        "8thGuard Wallet Review",
        "",
        `Network: ${risk.detectedChain}${risk.possibleNetworks.length > 1 ? ` (${risk.possibleNetworks.join(", ")})` : ""}`,
        `Assessment: ${levelLabel(risk.score)}`,
        `Review depth: ${liveDataLabel(risk.liveDataUsed)}`,
        "",
        "What we observed:",
        ...risk.reasons.map((reason) => `- ${reason}`),
        "",
        "Explorer links:",
        formatExplorerLinks(risk.explorerLinks),
        "",
        risk.disclaimer,
        "Next step: match the wallet, network, amount, and counterparty before sending. For a manual review, use /pricing."
      ].join("\n"),
      reply_markup: walletCheckKeyboard
    };
  }

  if (command === "/check_tx") {
    if (!arg) return { command, message: "Send a transaction hash with the command.\n\nExample: /check_tx <transaction_hash>", reply_markup: undefined };
    const risk = checkTransactionRisk(arg);
    return {
      command,
      message: [
        "8thGuard Transaction Review",
        "",
        `Likely networks: ${risk.likelyNetworks.join(", ")}`,
        `Assessment: ${levelLabel(risk.score)}`,
        `Review depth: ${liveDataLabel(risk.liveDataUsed)}`,
        "",
        "What we observed:",
        ...risk.reasons.map((reason) => `- ${reason}`),
        "",
        "Explorer links:",
        formatExplorerLinks(risk.explorerLinks),
        "",
        risk.disclaimer,
        "Next step: verify recipient, token, amount, and timestamp before trusting a screenshot. For a manual review, use /pricing."
      ].join("\n")
    };
  }

  if (command === "/check_agent") {
    if (!arg) return { command, message: "Send an agent name or username with the command.\n\nExample: /check_agent @username", reply_markup: undefined };
    const risk = checkAgentRisk(arg);
    return {
      command,
      message: [
        "8thGuard Agent Review",
        "",
        `Assessment: ${levelLabel(risk.score)}`,
        "What we observed:",
        ...risk.reasons.map((reason) => `- ${reason}`),
        "",
        risk.disclaimer,
        "Next step: confirm identity through independent channels before sending funds."
      ].join("\n")
    };
  }

  if (command === "/report_scam") {
    return {
      command,
      message:
        "Scam Report Evidence Checklist\n\nPrepare: wallet address, Telegram username, transaction hash, amount, screenshots, and a short timeline of what happened.\n\nDo not send sensitive documents in Telegram. Keep original screenshots and transaction links available for review.",
      reply_markup: scamReportKeyboard
    };
  }

  if (command === "/pricing") return { command, message: buildPricingMessage(), reply_markup: paymentKeyboard };
  if (command === "/pay") return { command, message: buildPayMessage(), reply_markup: buildPaystackPaymentKeyboard() };
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
    return { command: "check_wallet", message: "Send a wallet address with the command.\n\nExample: /check_wallet 0x1234..." };
  }

  if (callbackData === "check_tx") {
    return { command: "check_tx", message: "Send a transaction hash with the command.\n\nExample: /check_tx <transaction_hash>" };
  }

  if (callbackData === "check_agent") {
    return { command: "check_agent", message: "Send an agent name or username with the command.\n\nExample: /check_agent @username" };
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
