import { MAX_INPUT_LENGTH, getEnv } from "./config";
import { getPaymentContact, getPaystackPaymentLinks, getPublicCryptoWallets } from "./payments/config";
import { formatCryptoPaymentVerification, verifyCryptoPayment } from "./payments/cryptoVerification";
import { formatPaystackVerification, verifyPaystackReference } from "./payments/paystackVerification";
import {
  PRODUCTS,
  PRODUCT_BY_ID,
  PRICING_NOTES,
  formatGhs,
  formatProductLine,
  formatUsd,
  type ProductId
} from "./payments/products";
import {
  buildCryptoRailMessage,
  buildPaymentSessionMessage as buildProductPaymentSessionMessage,
  buildProductSessionKeyboard,
  buildSessionPaymentKeyboard,
  parseCryptoRailId,
  productIdFromCallback,
  type CryptoRailId
} from "./payments/session";
import { checkAgentRisk, checkTransactionRisk, checkWalletRisk } from "./risk";
import {
  cryptoRailKeyboard,
  guardedFlowKeyboard,
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
    "Core:",
    "/start - Open the premium 8thGuard menu",
    "/help - List all commands",
    "/check_wallet <address> - Wallet Intelligence Preview",
    "/check_tx <transaction_hash> - Transaction risk preview",
    "/check_agent <name_or_username> - P2P agent risk preview",
    "/report_scam - Scam report evidence checklist",
    "",
    "Payments:",
    "/pricing - Paid service catalog",
    "/pay - Paystack/local service payment links",
    "/crypto_pay - Official crypto wallet service-payment rails",
    "/payment_warning - Payment safety guidance",
    "/submit_payment - Structured payment proof instructions",
    "/verify_paystack_payment <reference> [session_id] - Verify Paystack payment status",
    "/verify_crypto_payment <rail> <tx_hash> [session_id] - Check public-chain payment evidence",
    "/tonight_offer - Priority premium review paths",
    "/contact - Official contact options",
    "",
    "Future guarded flow:",
    "/guarded_send - Guarded Send readiness",
    "/payment_session - Payment Session v0 readiness",
    "/fee_quote - Service and protection fee guidance",
    "/protected_flow - Future protected transaction flow",
    "",
    "Free education. Paid utility. Early risk signals, not final fraud proof."
  ].join("\n");
}

function buildStartMessage(): string {
  return [
    "Welcome to 8thGuard.",
    "",
    "Check before you send.",
    "",
    "8thGuard helps you review crypto wallets, transaction hashes, P2P agents, and future guarded transactions for early risk signals before funds move.",
    "",
    "This is a paid crypto safety and fraud-intelligence service. Public scam education may be free, but checks, reviews, payment sessions, and protected flows are paid products.",
    "",
    "Crypto has speed. Now it needs a guard.",
    "",
    "Use /pricing to view services or choose an option below."
  ].join("\n");
}

function productLine(productId: ProductId): string {
  return formatProductLine(PRODUCT_BY_ID[productId]);
}

function buildPricingMessage(): string {
  return [
    "8thGuard Paid Service Catalog",
    "",
    "Free education. Paid utility. Checks and reviews are paid services.",
    "",
    ...PRODUCTS.map((product) => formatProductLine(product)),
    "",
    ...PRICING_NOTES,
    "Paystack is for 8thGuard digital service payments only.",
    "Crypto wallets are for 8thGuard digital service payments only.",
    "Early risk signals, not final fraud proof."
  ].join("\n");
}

function buildProductSelectionMessage(): string {
  return [
    "Create a Payment Session",
    "",
    "Choose the paid 8thGuard service below. The bot will generate a session ID, show the price, and give Paystack/crypto payment options.",
    "",
    "You can also type:",
    "/payment_session quick_wallet_check",
    "/payment_session detailed_wallet_review",
    "",
    "Keep the session ID with the Paystack reference or crypto transaction hash."
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
    "Paystack Service Payments",
    "",
    "Paystack is used for 8thGuard digital service payments only.",
    "Supported rails may include MoMo, card, bank transfer, and other Paystack-supported methods.",
    "No trading, exchange, custody, escrow, or user-to-user settlement.",
    "For a guided product-specific payment, use /payment_session."
  ];

  if (configuredLinks.length === 0) {
    return [
      ...base,
      "",
      "Paystack product links are being activated.",
      "Use /pricing to choose a service, then use official contact for current payment instructions.",
      "",
      buildContactMessage()
    ].join("\n");
  }

  return [
    ...base,
    "",
    "Paystack service payment links:",
    ...configuredLinks.map((product) => `${product.name} (${formatUsd(product.priceUsd)} / ${formatGhs(product.priceGhs)}): ${links[product.id]}`)
  ].join("\n");
}

function buildPaystackPaymentKeyboard(): InlineKeyboardMarkup {
  const links = getPaystackPaymentLinks();
  const priorityOrder: ProductId[] = [
    "quick_wallet_check",
    "quick_transaction_check",
    "quick_agent_check",
    "detailed_wallet_review",
    "detailed_transaction_review",
    "detailed_agent_review",
    "weekly_premium_access",
    "priority_scam_report_review",
    "agent_verification_review",
    "group_community_safety_review",
    "founding_partner_package"
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

function formatCryptoWalletLine(wallet: ReturnType<typeof getPublicCryptoWallets>[number]): string {
  const address = wallet.address || "Not published yet";
  if (wallet.label === "XRP") {
    const tag = wallet.destinationTag || "No destination tag published. Confirm before sending.";
    return `${wallet.label}: ${address}\nXRP destination tag status: ${tag}`;
  }
  return `${wallet.label}: ${address}`;
}

function buildCryptoPayMessage(): string {
  const wallets = getPublicCryptoWallets();
  return [
    "Official Crypto Payment Rails",
    "",
    "Crypto payments are accepted only for 8thGuard digital services.",
    "Prioritized rails: XRP, BTC, USDT TRC20, USDT BEP20/EVM, TON, SOL.",
    "",
    ...wallets.map(formatCryptoWalletLine),
    "",
    "Confirm the exact network before sending.",
    "Wrong-network payments may be unrecoverable.",
    "8thGuard never asks for seed phrases or private keys.",
    "No trading, exchange, custody, escrow, or user-to-user settlement.",
    "",
    "For the real Telegram payment flow:",
    "1. Use /payment_session and choose a product.",
    "2. Tap the crypto rail button.",
    "3. Pay from your wallet.",
    "4. Submit the tx hash with /verify_crypto_payment."
  ].join("\n");
}

function buildPaymentWarningMessage(): string {
  return [
    "Payment Safety Warning",
    "",
    "Never pay random admins.",
    "Never trust screenshots alone.",
    "Only pay through official 8thGuard bot/website instructions.",
    "8thGuard will never ask for seed phrases or private keys.",
    "Crypto payments and Paystack payments are for 8thGuard digital services only.",
    "No trading, exchange, custody, escrow, or user-to-user settlement."
  ].join("\n");
}

function buildSubmitPaymentMessage(): string {
  return [
    "Submit Payment Proof",
    "",
    "Prepare one clean message with:",
    "- product selected",
    "- Paystack reference or crypto transaction hash",
    "- wallet, transaction hash, agent, or session being reviewed",
    "- Telegram contact",
    "- short context",
    "",
    "Command format:",
    "/submit_payment <session_id> <paystack_reference_or_crypto_tx_hash>",
    "",
    "For Paystack, use:",
    "/verify_paystack_payment <reference> <session_id>",
    "",
    "For crypto, use the public-chain verifier too:",
    "/verify_crypto_payment <rail> <tx_hash> <session_id>",
    "",
    "Full auto-unlock is being built. For now, the payment proof flow is manual, structured, and handled through official contact only.",
    "Never send seed phrases, private keys, wallet passwords, or unnecessary identity documents."
  ].join("\n");
}

function buildTonightOfferMessage(): string {
  return [
    "Priority Premium Review Paths",
    "",
    productLine("priority_scam_report_review"),
    productLine("agent_verification_review"),
    productLine("group_community_safety_review"),
    productLine("founding_partner_package"),
    "",
    "Choose the level of review that matches the risk and urgency of the situation.",
    "Early risk signals, not final fraud proof."
  ].join("\n");
}

function buildGuardedSendMessage(): string {
  return [
    "Guarded Send",
    "",
    "Guarded Send is the future 8thGuard flow where a user enters chain, token, amount, receiver wallet, and optional agent before sending.",
    "8thGuard checks risk, quotes service/protection fees, and helps the user decide before funds move.",
    "",
    "No full automated protected sending is live yet.",
    "No production escrow or custody is implemented."
  ].join("\n");
}

function buildPaymentSessionMessage(): string {
  return [
    "Payment Session v0",
    "",
    "Payment Session v0 is live as a Telegram-guided session flow.",
    "It creates a session ID, shows product price, points to official Paystack/crypto rails, and tells the user how to submit proof.",
    "",
    "Choose a product below or type /payment_session quick_wallet_check.",
    "Future persistence will connect the session ID to invoices, ledger entries, audit logs, and entitlements."
  ].join("\n");
}

function parseVerifyCryptoPaymentArgs(arg: string): { rail?: CryptoRailId; txHash?: string; sessionId?: string } {
  const [railRaw, txHash, sessionId] = arg.trim().split(/\s+/);
  return {
    rail: railRaw ? parseCryptoRailId(railRaw.toLowerCase()) : undefined,
    txHash,
    sessionId
  };
}

function parseVerifyPaystackArgs(arg: string): { reference?: string; sessionId?: string } {
  const [reference, sessionId] = arg.trim().split(/\s+/);
  return { reference, sessionId };
}

function buildFeeQuoteMessage(): string {
  return [
    "Fee Quote",
    "",
    "Quick checks start at $4.99.",
    "Detailed reviews start at $9.99.",
    "Future guarded payment sessions may charge a fixed fee or percentage.",
    "Future protected transactions may charge a service/protection fee.",
    "Network/gas fees are separate and paid to networks, not 8thGuard."
  ].join("\n");
}

function buildProtectedFlowMessage(): string {
  return [
    "Protected Flow",
    "",
    "Future protected transaction flow may use smart contracts, multisig, or chain-specific protection systems after legal, security, and compliance gates.",
    "No production escrow or custody is live yet.",
    "",
    "Every transaction has a before and after. 8thGuard lives in the before."
  ].join("\n");
}

function formatExplorerLinks(links: { label: string; url: string }[]): string {
  if (links.length === 0) return "Not available for this format yet.";
  return links.map((link) => `${link.label}: ${link.url}`).join("\n");
}

function levelLabel(score: number): string {
  if (score >= 70) return `${score}/100 - High caution`;
  if (score >= 50) return `${score}/100 - Medium caution`;
  if (score >= 35) return `${score}/100 - Low-to-medium caution`;
  return `${score}/100 - Lower immediate risk`;
}

function walletLiveDataLabel(liveDataUsed: boolean, sources: string[]): "Yes" | "No" | "Partial" {
  if (liveDataUsed) return "Yes";
  if (sources.length > 0) return "Partial";
  return "No";
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
    if (!arg) return { command, message: "Send a wallet address with the command.\n\nExample: /check_wallet 0x1234...", reply_markup: mainMenuKeyboard };
    const risk = await checkWalletRisk(arg);
    return {
      command,
      message: [
        "Wallet Intelligence Preview",
        "",
        `Detected network: ${risk.detectedChain}${risk.possibleNetworks.length > 1 ? ` (${risk.possibleNetworks.join(", ")})` : ""}`,
        `Risk score: ${risk.score}/100`,
        `Risk level: ${risk.level}`,
        `Live data used: ${walletLiveDataLabel(risk.liveDataUsed, risk.sources)}`,
        "",
        "Key signals:",
        ...risk.reasons.map((reason) => `- ${reason}`),
        "",
        "Explorer links:",
        formatExplorerLinks(risk.explorerLinks),
        "",
        "Sources used:",
        risk.sources.length > 0 ? risk.sources.join(", ") : "Format detection and explorer routing only",
        "",
        `${risk.disclaimer} Early risk signals, not final fraud proof.`,
        "MVP preview. Paid checks and detailed reviews are available through /pricing.",
        "For a paid detailed review, use /pricing."
      ].join("\n"),
      reply_markup: walletCheckKeyboard
    };
  }

  if (command === "/check_tx") {
    if (!arg) return { command, message: "Send a transaction hash with the command.\n\nExample: /check_tx <transaction_hash>", reply_markup: mainMenuKeyboard };
    const risk = checkTransactionRisk(arg);
    return {
      command,
      message: [
        "8thGuard Transaction Review",
        "",
        `Likely networks: ${risk.likelyNetworks.join(", ")}`,
        `Assessment: ${levelLabel(risk.score)}`,
        `Review depth: ${risk.liveDataUsed ? "Network data included" : "Format and explorer review"}`,
        "",
        "What we observed:",
        ...risk.reasons.map((reason) => `- ${reason}`),
        "",
        "Explorer links:",
        formatExplorerLinks(risk.explorerLinks),
        "",
        `${risk.disclaimer} Early risk signals, not final fraud proof.`,
        "MVP preview. Paid checks and detailed reviews are available through /pricing."
      ].join("\n"),
      reply_markup: walletCheckKeyboard
    };
  }

  if (command === "/check_agent") {
    if (!arg) return { command, message: "Send an agent name or username with the command.\n\nExample: /check_agent @username", reply_markup: mainMenuKeyboard };
    const risk = checkAgentRisk(arg);
    return {
      command,
      message: [
        "8thGuard Agent Risk Review",
        "",
        `Assessment: ${levelLabel(risk.score)}`,
        "What we observed:",
        ...risk.reasons.map((reason) => `- ${reason}`),
        "",
        `${risk.disclaimer} Early risk signals, not final fraud proof.`,
        "MVP preview. Paid checks and detailed reviews are available through /pricing."
      ].join("\n"),
      reply_markup: walletCheckKeyboard
    };
  }

  if (command === "/report_scam") {
    return {
      command,
      message:
        "Scam Report Evidence Checklist\n\nPrepare: wallet address, Telegram username, transaction hash, amount, screenshots, and a short timeline of what happened.\n\nDo not send sensitive documents in Telegram. Keep original screenshots and transaction links available for review.\n\nPriority scam report review is a paid service. Use /pricing.",
      reply_markup: scamReportKeyboard
    };
  }

  if (command === "/pricing") return { command, message: buildPricingMessage(), reply_markup: paymentKeyboard };
  if (command === "/pay") return { command, message: buildPayMessage(), reply_markup: buildPaystackPaymentKeyboard() };
  if (command === "/crypto_pay") return { command, message: buildCryptoPayMessage(), reply_markup: cryptoRailKeyboard };
  if (command === "/payment_warning") return { command, message: buildPaymentWarningMessage(), reply_markup: paymentKeyboard };
  if (command === "/submit_payment") return { command, message: buildSubmitPaymentMessage(), reply_markup: paymentKeyboard };
  if (command === "/verify_paystack_payment") {
    const parsed = parseVerifyPaystackArgs(arg);
    if (!parsed.reference) {
      return {
        command,
        message: [
          "Send the Paystack reference.",
          "",
          "Format:",
          "/verify_paystack_payment <reference> <session_id>",
          "",
          "Example:",
          "/verify_paystack_payment 9x8abc123 8G-260513-X7K2"
        ].join("\n"),
        reply_markup: paymentKeyboard
      };
    }
    const verification = await verifyPaystackReference(parsed.reference);
    return {
      command,
      message: formatPaystackVerification(verification, parsed.sessionId),
      reply_markup: paymentKeyboard
    };
  }
  if (command === "/verify_crypto_payment") {
    const parsed = parseVerifyCryptoPaymentArgs(arg);
    if (!parsed.rail || !parsed.txHash) {
      return {
        command,
        message: [
          "Send the crypto rail and transaction hash.",
          "",
          "Format:",
          "/verify_crypto_payment <rail> <tx_hash> <session_id>",
          "",
          "Rails: xrp, btc, usdt_trc20, usdt_bep20, evm, ton, solana",
          "",
          "Example:",
          "/verify_crypto_payment xrp ABC123... 8G-260513-X7K2"
        ].join("\n"),
        reply_markup: cryptoRailKeyboard
      };
    }
    const verification = await verifyCryptoPayment(parsed.rail, parsed.txHash);
    return {
      command,
      message: formatCryptoPaymentVerification(verification, parsed.sessionId),
      reply_markup: paymentKeyboard
    };
  }
  if (command === "/tonight_offer") return { command, message: buildTonightOfferMessage(), reply_markup: paymentKeyboard };
  if (command === "/contact") return { command, message: buildContactMessage(), reply_markup: mainMenuKeyboard };
  if (command === "/guarded_send") return { command, message: buildGuardedSendMessage(), reply_markup: guardedFlowKeyboard };
  if (command === "/payment_session") {
    if (!arg) return { command, message: buildPaymentSessionMessage(), reply_markup: buildProductSessionKeyboard() };
    const productId = arg.trim().split(/\s+/)[0];
    if (!PRODUCT_BY_ID[productId as ProductId]) {
      return {
        command,
        message: [
          "I did not recognize that product ID.",
          "",
          "Choose a product below or use one of these examples:",
          "/payment_session quick_wallet_check",
          "/payment_session detailed_wallet_review",
          "/payment_session priority_scam_report_review"
        ].join("\n"),
        reply_markup: buildProductSessionKeyboard()
      };
    }
    const validProductId = productId as ProductId;
    return {
      command,
      message: buildProductPaymentSessionMessage(validProductId),
      reply_markup: buildSessionPaymentKeyboard(validProductId)
    };
  }
  if (command === "/fee_quote") return { command, message: buildFeeQuoteMessage(), reply_markup: guardedFlowKeyboard };
  if (command === "/protected_flow") return { command, message: buildProtectedFlowMessage(), reply_markup: guardedFlowKeyboard };

  return {
    command: "unknown",
    message: "I didn't recognize that command. Use /help or choose an option below.",
    reply_markup: mainMenuKeyboard
  };
}

export async function buildCallbackReply(callbackData: string | undefined, appName: string): Promise<TelegramBotReply> {
  if (callbackData) {
    const productId = productIdFromCallback(callbackData);
    if (productId) {
      return {
        command: "payment_session",
        message: buildProductPaymentSessionMessage(productId),
        reply_markup: buildSessionPaymentKeyboard(productId)
      };
    }

    if (callbackData.startsWith("crypto:")) {
      const rail = parseCryptoRailId(callbackData.slice("crypto:".length));
      if (rail) {
        return {
          command: "crypto_pay",
          message: buildCryptoRailMessage(rail),
          reply_markup: cryptoRailKeyboard
        };
      }
    }
  }

  if (callbackData === "check_wallet") {
    return { command: "check_wallet", message: "Send a wallet address with the command.\n\nExample: /check_wallet 0x1234...", reply_markup: mainMenuKeyboard };
  }

  if (callbackData === "check_tx") {
    return { command: "check_tx", message: "Send a transaction hash with the command.\n\nExample: /check_tx <transaction_hash>", reply_markup: mainMenuKeyboard };
  }

  if (callbackData === "check_agent") {
    return { command: "check_agent", message: "Send an agent name or username with the command.\n\nExample: /check_agent @username", reply_markup: mainMenuKeyboard };
  }

  const commandByCallback: Record<string, string> = {
    report_scam: "/report_scam",
    pricing: "/pricing",
    pay: "/pay",
    crypto_pay: "/crypto_pay",
    contact: "/contact",
    payment_warning: "/payment_warning",
    submit_payment: "/submit_payment",
    verify_paystack_payment: "/verify_paystack_payment",
    verify_crypto_payment: "/verify_crypto_payment",
    guarded_send: "/guarded_send",
    payment_session: "/payment_session",
    fee_quote: "/fee_quote",
    protected_flow: "/protected_flow"
  };

  const command = callbackData ? commandByCallback[callbackData] : undefined;
  if (command) return buildBotReply(command, appName);

  return {
    command: "unknown_callback",
    message: "I didn't recognize that action. Use /help or choose an option below.",
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
