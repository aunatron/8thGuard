import { logAuditEvent } from "../audit";
import { insertSupabaseRow } from "../supabase";
import { PRODUCT_BY_ID, type ProductId } from "./products";

export async function recordPaystackCheckoutInitialized(input: {
  sessionId: string;
  productId: ProductId;
  reference: string;
  telegramChatId?: number;
  telegramUserId?: number;
  telegramUsername?: string;
}): Promise<void> {
  const product = PRODUCT_BY_ID[input.productId];
  const now = new Date().toISOString();

  await insertSupabaseRow("payment_sessions", {
    id: input.sessionId,
    telegram_chat_id: input.telegramChatId,
    telegram_user_id: input.telegramUserId,
    telegram_username: input.telegramUsername,
    selected_product_id: input.productId,
    payment_provider: "paystack",
    status: "pending",
    created_at: now,
    updated_at: now
  });

  await insertSupabaseRow("invoices", {
    id: `INV-${input.sessionId}`,
    session_id: input.sessionId,
    product_id: input.productId,
    amount_usd: product.priceUsd,
    amount_ghs: product.priceGhs,
    provider: "paystack",
    status: "pending",
    external_reference: input.reference,
    created_at: now
  });

  await logAuditEvent({
    event_type: "paystack_checkout_initialized",
    actor_type: "system",
    command: "paystack_initialize",
    timestamp: now,
    metadata: {
      session_id: input.sessionId,
      product_id: input.productId,
      reference: input.reference
    }
  });
}

export async function recordPaystackPaymentConfirmed(input: {
  sessionId?: string;
  productId?: ProductId;
  reference: string;
  status: string;
  amount?: number;
  currency?: string;
  channel?: string;
}): Promise<void> {
  const now = new Date().toISOString();
  const paymentId = `PAY-${input.reference}`;

  await insertSupabaseRow("payments", {
    id: paymentId,
    invoice_id: input.sessionId ? `INV-${input.sessionId}` : undefined,
    session_id: input.sessionId,
    product_id: input.productId,
    provider: "paystack",
    status: input.status === "success" ? "confirmed" : input.status,
    reference: input.reference,
    amount_received: typeof input.amount === "number" ? String(input.amount / 100) : undefined,
    currency: input.currency,
    channel: input.channel,
    created_at: now
  });

  if (input.status === "success" && typeof input.amount === "number") {
    await insertSupabaseRow("ledger_entries", {
      id: `LED-${input.reference}`,
      payment_id: paymentId,
      session_id: input.sessionId,
      direction: "credit",
      amount: String(input.amount / 100),
      currency: input.currency || "GHS",
      provider: "paystack",
      description: "8thGuard paid service checkout",
      created_at: now
    });
  }

  await logAuditEvent({
    event_type: "paystack_payment_confirmed",
    actor_type: "system",
    command: "paystack_webhook",
    timestamp: now,
    metadata: {
      session_id: input.sessionId,
      product_id: input.productId,
      reference: input.reference,
      status: input.status
    }
  });
}
