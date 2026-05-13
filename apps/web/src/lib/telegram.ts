import { MAX_INPUT_LENGTH, getEnv } from "./config";
import { getPaymentContact, getPaystackPaymentLinks, getPublicCryptoWallets } from "./payments/config";
import { formatCryptoPaymentVerification, verifyCryptoPayment } from "./payments/cryptoVerification";
import { formatPaystackVerification, initializePaystackTransaction, paymentEmailForTelegram, verifyPaystackReference } from "./payments/paystackVerification";
import {
  PRODUCTS,
  PRODUCT_BY_ID,
  PRICING_NOTES,
  formatGlobalPrice,
  formatProductLine,
  type ProductId
} from "./payments/products";
import {
  buildCryptoRailMessage,
  buildInitializedSessionPaymentKeyboard,
  buildPaystackInitializedMessage,
  buildProductSessionKeyboard,
  buildStartServicesKeyboard,
  createPaymentSessionDraft,
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
  quickCheckKeyboard,
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

export type TelegramReplyContext = {
  chatId?: number;
  user?: TelegramUser;
  chatType?: string;
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
    "/pay - Card and mobile money checkout",
    "/crypto_pay - Official crypto wallet service-payment rails",
    "/payment_warning - Payment safety guidance",
    "/submit_payment - Confirm payment",
    "/verify_paystack_payment <reference> [session_id] - Check payment reference",
    "/verify_crypto_payment <rail> <tx_hash> [session_id] - Confirm crypto payment",
    "/tonight_offer - Priority premium review paths",
    "/contact - Official contact options",
    "",
    "Protected flow:",
    "/guarded_send - Guarded Send",
    "/payment_session - Choose service",
    "/fee_quote - Service and protection fee guidance",
    "/protected_flow - Protected flow",
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
    "8thGuard helps you review crypto wallets, transaction hashes, P2P agents, and protected payment flows for early risk signals before funds move.",
    "",
    "This is a paid crypto safety and fraud-intelligence service. Public scam education may be free, but checks, reviews, payment sessions, and protected flows are paid products.",
    "",
    "Paid services are available now: quick checks, detailed reviews, priority scam report review, agent verification review, group/community safety review, and founding partner access.",
    "",
    "Crypto has speed. Now it needs a guard.",
    "",
    "Choose a service below to start, or use /pricing to view the full catalog."
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
    "Card and mobile money checkout is for 8thGuard digital service payments only.",
    "Crypto wallets are for 8thGuard digital service payments only.",
    "Early risk signals, not final fraud proof."
  ].join("\n");
}

function buildContactMessage(): string {
  const { contactHandle, officialTelegram } = getPaymentContact();
  if (contactHandle && officialTelegram) return `Official contact: ${contactHandle}\nOfficial Telegram: ${officialTelegram}`;
  if (contactHandle) return `Official contact: ${contactHandle}`;
  if (officialTelegram) return `Official Telegram: ${officialTelegram}`;
  return "Use the official 8thGuard Telegram bot or website contact channel for support.";
}

function buildPayMessage(): string {
  const links = getPaystackPaymentLinks();
  const configuredLinks = PRODUCTS.filter((product) => links[product.id]);

  const base = [
    "Card / Mobile Money",
    "",
    "Use the buttons below to pay for 8thGuard digital services through supported local checkout rails.",
    "No trading, exchange, custody, escrow, or user-to-user settlement.",
    "For the smoothest flow, choose a service from /payment_session."
  ];

  if (configuredLinks.length === 0) {
    return [
      ...base,
      "",
      "Choose a service from /payment_session for available checkout options, or use Crypto Pay.",
      "",
      buildContactMessage()
    ].join("\n");
  }

  return [
    ...base,
    "",
    "Service payment links:",
    ...configuredLinks.map((product) => `${product.name} (${formatGlobalPrice(product)}): ${links[product.id]}`)
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
        { text: "Crypto Wallets", callback_data: "crypto_pay" },
        { text: "Confirm Payment", callback_data: "submit_payment" }
      ],
      [{ text: "Payment Safety", callback_data: "payment_warning" }]
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
    "Choose a rail below. After sending, tap Confirm Crypto Payment."
  ].join("\n");
}

function buildPaymentWarningMessage(): string {
  return [
    "Payment Safety",
    "",
    "Never pay random admins.",
    "Never trust screenshots alone.",
    "Only pay through official 8thGuard bot/website instructions.",
    "8thGuard will never ask for seed phrases or private keys.",
    "Crypto and card/mobile money payments are for 8thGuard digital services only.",
    "No trading, exchange, custody, escrow, or user-to-user settlement."
  ].join("\n");
}

function buildSubmitPaymentMessage(): string {
  return [
    "Confirm Payment",
    "",
    "Use this when you need to confirm a payment reference or crypto transaction hash.",
    "",
    "Send:",
    "/submit_payment <session_id> <paystack_reference_or_crypto_tx_hash>",
    "",
    "For card / mobile money reference:",
    "/verify_paystack_payment <reference> <session_id>",
    "",
    "For crypto transaction hash:",
    "/verify_crypto_payment <rail> <tx_hash> <session_id>",
    "",
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
    "Guarded Send is the 8thGuard pre-send review flow for chain, token, amount, receiver wallet, and optional agent context.",
    "8thGuard checks risk, quotes service/protection fees, and helps the user decide before funds move.",
    "",
    "No private keys. No seed phrases. No exchange, custody, escrow, trading, or user-to-user settlement."
  ].join("\n");
}

function buildPaymentSessionMessage(): string {
  return [
    "8thGuard Paid Services",
    "",
    "Choose the service that matches the risk and urgency. Your session and official payment options will be prepared instantly.",
    "",
    ...PRODUCTS.map((product) => formatProductLine(product)),
    "",
    "Tap a service below to continue."
  ].join("\n");
}

function parsePaymentSessionArgs(arg: string): { productId?: ProductId; email?: string } {
  const [productIdRaw, email] = arg.trim().split(/\s+/);
  if (!productIdRaw || !PRODUCT_BY_ID[productIdRaw as ProductId]) return { email };
  return { productId: productIdRaw as ProductId, email };
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
    "Guarded payment sessions may use a fixed fee or percentage-based protection fee.",
    "Protected review flows may include a service/protection fee.",
    "Network/gas fees are separate and paid to networks, not 8thGuard."
  ].join("\n");
}

function buildProtectedFlowMessage(): string {
  return [
    "Protected Flow",
    "",
    "Protected Flow gives users a structured pre-send safety layer before funds move.",
    "8thGuard reviews wallet, transaction, agent, payment, and network context before the user makes a decision.",
    "No private keys. No seed phrases. No exchange, custody, escrow, trading, or user-to-user settlement.",
    "",
    "Every transaction has a before and after. 8thGuard lives in the before."
  ].join("\n");
}

function isGroupChat(context: TelegramReplyContext): boolean {
  return context.chatType === "group" || context.chatType === "supergroup";
}

function walletLiveDataLabel(liveDataUsed: boolean, sources: string[]): "Enhanced" | "Standard" {
  if (liveDataUsed || sources.length > 0) return "Enhanced";
  return "Standard";
}

function liveDataShortLabel(liveDataUsed: boolean, sources: string[]): string {
  if (liveDataUsed) return "Yes";
  if (sources.length > 0) return "Partial";
  return "No";
}

function confidenceLabel(score: number): string {
  if (score >= 70) return "High caution";
  if (score >= 50) return "Elevated caution";
  if (score >= 35) return "Watchlist review";
  return "Lower immediate risk";
}

function actionSummary(score: number): string {
  if (score >= 70) return "Pause before sending. Use a detailed review before moving funds.";
  if (score >= 50) return "Proceed carefully. Verify counterparty, network, token, and payment context.";
  if (score >= 35) return "No severe automated signal surfaced, but verify details before sending.";
  return "Lower immediate risk surfaced in this check. Keep standard transaction hygiene.";
}

function quickSignals(reasons: string[]): string[] {
  return reasons.slice(0, 3).map((reason) => `• ${polishSignal(reason)}`);
}

function compactExplorerLine(links: { label: string; url: string }[]): string | undefined {
  if (links.length === 0) return undefined;
  const first = links[0];
  return `Explorer: ${first.label}`;
}

function txStatusLabel(liveDataUsed: boolean): string {
  if (liveDataUsed) return "Live lookup available";
  return "Explorer-only";
}

function formatSignals(reasons: string[]): string[] {
  return reasons.slice(0, 4).map((reason) => `- ${polishSignal(reason)}`);
}

function polishSignal(reason: string): string {
  const lower = reason.toLowerCase();
  if (lower.includes("api not configured") || lower.includes("api key not configured") || lower.includes("data was not available")) {
    return "Extended network confirmation requires a deeper review pass";
  }
  if (lower.includes("address format recognized")) return "Recognized wallet format";
  if (lower.includes("format not recognized")) return "Wallet format requires caution";
  if (lower.includes("explorer links are provided")) return "Network reference views are available";
  if (lower.includes("use the matching explorer")) return "Confirm amount, recipient, token, and timestamp before sending";
  if (lower.includes("64-character hex transaction hash detected")) return "Recognized transaction hash pattern";
  if (lower.includes("solana signature-like format detected")) return "Recognized Solana transaction signature pattern";
  if (lower.includes("no obvious impersonation keyword pattern")) return "No obvious impersonation keyword pattern surfaced";
  if (lower.includes("name contains high-impersonation keywords")) return "High-impersonation keyword pattern surfaced";
  return reason;
}

function explorerSummary(count: number): string {
  if (count === 0) return "Explorer route: unavailable for this format";
  return `Explorer coverage: ${count} network view${count === 1 ? "" : "s"} available`;
}

function paymentEmailNotice(user?: TelegramUser): string {
  if (user?.username) return `Checkout contact: @${user.username}`;
  return "Checkout contact: Telegram user";
}

function userFacingNetwork(chain: string, possibleNetworks: string[]): string {
  if (possibleNetworks.length > 1) return `${chain} family`;
  return chain;
}

function userFriendlyDisclaimer(): string {
  return "8thGuard provides early risk signals, not final fraud proof.";
}

function userFriendlyPaidCta(): string {
  return "For paid review options, choose Paid Services below.";
}

function paymentSessionEmail(context: TelegramReplyContext): string {
  return paymentEmailForTelegram({
    telegramChatId: context.chatId,
    telegramUserId: context.user?.id,
    telegramUsername: context.user?.username
  });
}

function paymentSessionContactLine(context: TelegramReplyContext): string {
  return paymentEmailNotice(context.user);
}

function formatReferenceLinks(score: number, links: { label: string; url: string }[]): string[] {
  if (score < 50 || links.length === 0) return [];
  return ["Reference links:", ...links.slice(0, 3).map((link) => `${link.label}: ${link.url}`)];
}

export async function buildBotReply(text: string, appName: string, context: TelegramReplyContext = {}): Promise<TelegramBotReply> {
  const { command, arg } = parseCommand(text);
  if (command === "/start") {
    return { command, message: buildStartMessage(), reply_markup: buildStartServicesKeyboard() };
  }

  if (command === "/help") {
    return { command, message: buildCommandHelp(appName), reply_markup: mainMenuKeyboard };
  }

  if (command === "/check_wallet") {
    if (!arg) return { command, message: "Send a wallet address with the command.\n\nExample: /check_wallet 0x1234...", reply_markup: mainMenuKeyboard };
    const risk = await checkWalletRisk(arg);

    if (isGroupChat(context)) {
      return {
        command,
        message: [
          `⚠️ 8thGuard Preview`,
          `Network: ${userFacingNetwork(risk.detectedChain, risk.possibleNetworks)}`,
          `Risk: ${risk.level} — ${risk.score}/100`,
          "",
          "Full paid report: DM the bot.",
          "Check before you send."
        ].join("\n"),
        reply_markup: quickCheckKeyboard
      };
    }

    const explorer = compactExplorerLine(risk.explorerLinks);
    return {
      command,
      message: [
        "8thGuard Quick Check",
        "",
        `Network: ${userFacingNetwork(risk.detectedChain, risk.possibleNetworks)}`,
        `Risk: ${risk.level} — ${risk.score}/100`,
        `Live data: ${liveDataShortLabel(risk.liveDataUsed, risk.sources)}`,
        "",
        "Signals:",
        ...quickSignals(risk.reasons),
        ...(explorer ? ["", explorer] : []),
        "",
        "Next:",
        "For full report, use /pricing.",
        "",
        "\u{1F6E1} MVP result. Early risk signals only, not final fraud proof."
      ].join("\n"),
      reply_markup: quickCheckKeyboard
    };
  }

  if (command === "/check_tx") {
    if (!arg) return { command, message: "Send a transaction hash with the command.\n\nExample: /check_tx <transaction_hash>", reply_markup: mainMenuKeyboard };
    const risk = checkTransactionRisk(arg);

    if (isGroupChat(context)) {
      return {
        command,
        message: [
          `⚠️ 8thGuard Tx Preview`,
          `Network: ${risk.likelyNetworks.join(", ")}`,
          `Risk: ${risk.level} — ${risk.score}/100`,
          "",
          "Full paid report: DM the bot.",
          "Check before you send."
        ].join("\n"),
        reply_markup: quickCheckKeyboard
      };
    }

    return {
      command,
      message: [
        "8thGuard Tx Preview",
        "",
        `Likely network: ${risk.likelyNetworks.join(", ")}`,
        `Risk: ${risk.level} — ${risk.score}/100`,
        `Status: ${txStatusLabel(risk.liveDataUsed)}`,
        "",
        "Next:",
        "For transaction review, use /pricing.",
        "",
        "\u{1F6E1} MVP result. Early risk signals only."
      ].join("\n"),
      reply_markup: quickCheckKeyboard
    };
  }

  if (command === "/check_agent") {
    if (!arg) return { command, message: "Send an agent name or username with the command.\n\nExample: /check_agent @username", reply_markup: mainMenuKeyboard };
    const risk = checkAgentRisk(arg);

    if (isGroupChat(context)) {
      return {
        command,
        message: [
          `⚠️ 8thGuard Agent Preview`,
          `Agent: ${arg}`,
          `Risk: ${risk.level} — ${risk.score}/100`,
          "",
          "Full paid report: DM the bot.",
          "Check before you send."
        ].join("\n"),
        reply_markup: quickCheckKeyboard
      };
    }

    return {
      command,
      message: [
        "8thGuard Agent Preview",
        "",
        `Agent: ${arg}`,
        `Risk: ${risk.level} — ${risk.score}/100`,
        "Status: Registry check not fully live yet",
        "",
        "Signals:",
        "• Username format captured",
        "• Public registry coming soon",
        "• Use caution before sending funds",
        "",
        "Next:",
        "For Agent Risk Review, use /pricing.",
        "",
        "\u{1F6E1} MVP result. Early risk signals only."
      ].join("\n"),
      reply_markup: quickCheckKeyboard
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
          "Send the payment reference.",
          "",
          "Use:",
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
          "Use:",
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
    const parsed = parsePaymentSessionArgs(arg);
    if (!parsed.productId) {
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
    const validProductId = parsed.productId;

    const session = createPaymentSessionDraft(validProductId);
    const initialized = await initializePaystackTransaction({
      productId: validProductId,
      sessionId: session.sessionId,
      email: parsed.email || paymentSessionEmail(context),
      telegramChatId: context.chatId,
      telegramUserId: context.user?.id,
      telegramUsername: context.user?.username
    });

    return {
      command,
      message: [
        buildPaystackInitializedMessage(initialized),
        "",
        paymentSessionContactLine(context)
      ].join("\n"),
      reply_markup: buildInitializedSessionPaymentKeyboard(validProductId, initialized.ok ? initialized.authorizationUrl : undefined)
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

export async function buildCallbackReply(callbackData: string | undefined, appName: string, context: TelegramReplyContext = {}): Promise<TelegramBotReply> {
  if (callbackData) {
    const productId = productIdFromCallback(callbackData);
    if (productId) {
      const session = createPaymentSessionDraft(productId);
      const initialized = await initializePaystackTransaction({
        productId,
        sessionId: session.sessionId,
        email: paymentSessionEmail(context),
        telegramChatId: context.chatId,
        telegramUserId: context.user?.id,
        telegramUsername: context.user?.username
      });

      return {
        command: "payment_session",
        message: [
          buildPaystackInitializedMessage(initialized),
          "",
          paymentSessionContactLine(context)
        ].join("\n"),
        reply_markup: buildInitializedSessionPaymentKeyboard(productId, initialized.ok ? initialized.authorizationUrl : undefined)
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
  if (command) return buildBotReply(command, appName, context);

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
