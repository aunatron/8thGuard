import { MAX_INPUT_LENGTH, getEnv } from "./config";
import { getPaymentContact, getPaystackPaymentLinks, getPublicCryptoWallets } from "./payments/config";
import { FREE_MVP_OFFER, PRODUCTS, PRODUCT_BY_ID, PRICING_NOTES, formatUsd, type ProductId } from "./payments/products";
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
    "/report_scam",
    "/pricing",
    "/pay",
    "/crypto_pay",
    "/payment_warning",
    "/submit_payment",
    "/tonight_offer",
    "/contact"
  ].join("\n");
}

function productLine(productId: ProductId): string {
  const product = PRODUCT_BY_ID[productId];
  return `${product.name} - ${formatUsd(product.priceUsd)}`;
}

function buildPricingMessage(): string {
  return [
    "8thGuard MVP Pricing",
    `${FREE_MVP_OFFER.name}: Free during MVP`,
    ...PRODUCTS.map((product) => `${product.name} - ${formatUsd(product.priceUsd)}`),
    "",
    ...PRICING_NOTES,
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
    "No escrow, no custody, no exchange in MVP."
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
    "No escrow, no custody, no exchange in MVP."
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
    "MVP Early-Access Offer Stack",
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
    "This is MVP early access, not a fake discount. Results are early risk signals, not final fraud proof."
  ].join("\n");
}

function formatExplorerLinks(links: { label: string; url: string }[]): string {
  if (links.length === 0) return "Explorer: Not available for this format yet.";
  return links.map((link) => `${link.label}: ${link.url}`).join("\n");
}

export async function buildBotReply(text: string, appName: string): Promise<{ command: string; message: string }> {
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
    const risk = await checkWalletRisk(arg);
    return {
      command,
      message: [
        "Wallet Intelligence Preview",
        `Network: ${risk.detectedChain}${risk.possibleNetworks.length > 1 ? ` (${risk.possibleNetworks.join(", ")})` : ""}`,
        `Risk: ${risk.score}/100 - ${risk.level}`,
        `Live data: ${risk.liveDataUsed ? "Yes" : "No"}`,
        "Signals:",
        ...risk.reasons.map((reason) => `- ${reason}`),
        "Explorer links:",
        formatExplorerLinks(risk.explorerLinks),
        risk.disclaimer,
        "For deeper manual review, use /pricing."
      ].join("\n")
    };
  }

  if (command === "/check_tx") {
    if (!arg) return { command, message: "Usage: /check_tx <transaction_hash>" };
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
        risk.disclaimer,
        "For deeper manual review, use /pricing."
      ].join("\n")
    };
  }

  if (command === "/check_agent") {
    if (!arg) return { command, message: "Usage: /check_agent <name_or_username>" };
    const risk = checkAgentRisk(arg);
    return {
      command,
      message: `Agent Risk Check: ${risk.score}/100 - ${risk.level} Risk. ${risk.disclaimer} Reasons: ${risk.reasons.join("; ")}.`
    };
  }

  if (command === "/report_scam") {
    return {
      command,
      message:
        "Prepare this evidence: wallet address, Telegram username, transaction hash, amount, screenshots, and a short story of what happened. Do not send sensitive documents in Telegram yet. File upload support is coming soon."
    };
  }

  if (command === "/pricing") return { command, message: buildPricingMessage() };
  if (command === "/pay") return { command, message: buildPayMessage() };
  if (command === "/crypto_pay") return { command, message: buildCryptoPayMessage() };
  if (command === "/payment_warning") return { command, message: buildPaymentWarningMessage() };
  if (command === "/submit_payment") return { command, message: buildSubmitPaymentMessage() };
  if (command === "/tonight_offer") return { command, message: buildTonightOfferMessage() };
  if (command === "/contact") return { command, message: buildContactMessage() };

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
