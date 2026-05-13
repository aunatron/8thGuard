import { getPaystackPaymentLinks, getPublicCryptoWallets } from "./config";
import { PRODUCTS, PRODUCT_BY_ID, formatGhs, formatUsd, type PaymentProduct, type ProductId } from "./products";
import type { InlineKeyboardMarkup } from "../telegram-keyboards";

export type CryptoRailId = "xrp" | "btc" | "usdt_trc20" | "usdt_bep20" | "ton" | "solana" | "evm";

export type PaymentSessionDraft = {
  sessionId: string;
  product: PaymentProduct;
  createdAt: string;
};

const PRODUCT_CALLBACK_PREFIX = "session:";

export function isProductId(value: string): value is ProductId {
  return Object.prototype.hasOwnProperty.call(PRODUCT_BY_ID, value);
}

export function productCallbackData(productId: ProductId): string {
  return `${PRODUCT_CALLBACK_PREFIX}${productId}`;
}

export function productIdFromCallback(callbackData: string): ProductId | undefined {
  if (!callbackData.startsWith(PRODUCT_CALLBACK_PREFIX)) return undefined;
  const id = callbackData.slice(PRODUCT_CALLBACK_PREFIX.length);
  return isProductId(id) ? id : undefined;
}

export function createPaymentSessionDraft(productId: ProductId): PaymentSessionDraft {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return {
    sessionId: `8G-${datePart}-${randomPart}`,
    product: PRODUCT_BY_ID[productId],
    createdAt: now.toISOString()
  };
}

export function buildProductSessionKeyboard(): InlineKeyboardMarkup {
  const rows = PRODUCTS.map((product) => [
    {
      text: `${product.name} ${formatUsd(product.priceUsd)}`,
      callback_data: productCallbackData(product.id)
    }
  ]);

  return {
    inline_keyboard: [
      ...rows,
      [
        { text: "Crypto Pay", callback_data: "crypto_pay" },
        { text: "Payment Warning", callback_data: "payment_warning" }
      ]
    ]
  };
}

export function buildSessionPaymentKeyboard(productId: ProductId): InlineKeyboardMarkup {
  const paystackLinks = getPaystackPaymentLinks();
  const paystackLink = paystackLinks[productId];
  const rows: InlineKeyboardMarkup["inline_keyboard"] = [];

  if (paystackLink) {
    rows.push([{ text: "Pay with Paystack", url: paystackLink }]);
  }

  rows.push(
    [
      { text: "Pay XRP", callback_data: "crypto:xrp" },
      { text: "Pay BTC", callback_data: "crypto:btc" }
    ],
    [
      { text: "Pay USDT TRC20", callback_data: "crypto:usdt_trc20" },
      { text: "Pay USDT BEP20/EVM", callback_data: "crypto:usdt_bep20" }
    ],
    [
      { text: "Pay TON", callback_data: "crypto:ton" },
      { text: "Pay Solana", callback_data: "crypto:solana" }
    ],
    [{ text: "Submit Tx Hash", callback_data: "verify_crypto_payment" }]
  );

  return { inline_keyboard: rows };
}

export function buildPaymentSessionMessage(productId: ProductId): string {
  const session = createPaymentSessionDraft(productId);
  const paystackLinks = getPaystackPaymentLinks();
  const paystackStatus = paystackLinks[productId] ? "Paystack button is active below." : "Paystack link is not active yet for this product.";

  return [
    "8thGuard Payment Session",
    "",
    `Session ID: ${session.sessionId}`,
    `Product: ${session.product.name}`,
    `Price: ${formatUsd(session.product.priceUsd)} / ${formatGhs(session.product.priceGhs)}`,
    `Input needed: ${session.product.requiresInput ? session.product.inputLabel : "Telegram contact"}`,
    "",
    paystackStatus,
    "Crypto payments use official wallet rails only. Put the session ID in the wallet note/memo if your wallet supports it.",
    "",
    "After payment, send:",
    `/submit_payment ${session.sessionId} <paystack_reference_or_crypto_tx_hash>`,
    "",
    "For Paystack verification, use:",
    `/verify_paystack_payment <reference> ${session.sessionId}`,
    "",
    "For crypto chain verification, use:",
    `/verify_crypto_payment <rail> <tx_hash> ${session.sessionId}`,
    "",
    "Examples:",
    `/verify_crypto_payment xrp ABC123... ${session.sessionId}`,
    `/verify_crypto_payment btc abc123... ${session.sessionId}`,
    "",
    "No private keys. No seed phrases. No exchange, custody, escrow, trading, or user-to-user settlement."
  ].join("\n");
}

export function buildCryptoRailMessage(railId: CryptoRailId): string {
  const wallets = getPublicCryptoWallets();
  const walletByRail: Record<CryptoRailId, { label: string; envName: string; address?: string; destinationTag?: string } | undefined> = {
    xrp: wallets.find((wallet) => wallet.label === "XRP"),
    btc: wallets.find((wallet) => wallet.label === "BTC"),
    usdt_trc20: wallets.find((wallet) => wallet.label === "USDT TRC20"),
    usdt_bep20: wallets.find((wallet) => wallet.label === "USDT BEP20 / EVM"),
    evm: wallets.find((wallet) => wallet.label === "ETH / EVM rails"),
    ton: wallets.find((wallet) => wallet.label === "TON / USDT on TON"),
    solana: wallets.find((wallet) => wallet.label === "Solana")
  };
  const wallet = walletByRail[railId];
  const label = wallet?.label || railId.toUpperCase();
  const address = wallet?.address || "Not published yet";
  const xrpTag = railId === "xrp" ? wallet?.destinationTag || "No destination tag published. Confirm before sending." : undefined;

  return [
    `${label} Payment Rail`,
    "",
    `Official address: ${address}`,
    ...(xrpTag ? [`XRP destination tag status: ${xrpTag}`] : []),
    "",
    "Only send the exact network shown here.",
    "Wrong-network payments may be unrecoverable.",
    "Use the session ID in memo/note if your wallet supports it.",
    "",
    "After sending, submit the transaction hash:",
    `/verify_crypto_payment ${railId} <tx_hash> <session_id>`,
    "",
    "8thGuard never asks for private keys or seed phrases."
  ].join("\n");
}

export function parseCryptoRailId(value: string): CryptoRailId | undefined {
  if (["xrp", "btc", "usdt_trc20", "usdt_bep20", "ton", "solana", "evm"].includes(value)) {
    return value as CryptoRailId;
  }
  return undefined;
}
