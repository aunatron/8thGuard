import type { PaymentProduct } from "./products";

export type PaymentProvider = "paystack" | "crypto_wallet" | "manual" | "future_gateway";

export type PaymentStatus =
  | "draft"
  | "pending"
  | "submitted"
  | "reviewing"
  | "paid"
  | "failed"
  | "expired"
  | "refunded";

export type PaymentSession = {
  id: string;
  telegramUserId?: number;
  selectedProductId: PaymentProduct["id"];
  chain?: string;
  token?: string;
  amount?: string;
  receiverWallet?: string;
  agentUsername?: string;
  paymentProvider: PaymentProvider;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export type Invoice = {
  id: string;
  sessionId: string;
  productId: PaymentProduct["id"];
  amountUsd: number;
  amountGhs?: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  externalReference?: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  invoiceId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  reference?: string;
  cryptoTxHash?: string;
  network?: string;
  amountReceived?: string;
  createdAt: string;
};

export type Entitlement = {
  id: string;
  userId: string;
  productId: PaymentProduct["id"];
  status: "active" | "used" | "expired" | "revoked";
  unlockReason: "payment_confirmed" | "manual_admin" | "support_adjustment";
  createdAt: string;
  expiresAt?: string;
};

export type LedgerEntry = {
  id: string;
  paymentId?: string;
  sessionId?: string;
  direction: "credit" | "debit";
  amount: string;
  currency: "USD" | "GHS" | "USDT" | "USDC" | "BTC" | "XRP" | "TON" | "SOL" | string;
  provider: PaymentProvider;
  description: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  eventType: string;
  actorType: "telegram_user" | "admin" | "system";
  actorId?: string;
  sessionId?: string;
  paymentId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};
