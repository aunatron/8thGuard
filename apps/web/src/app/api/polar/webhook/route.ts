import { Webhooks } from "@polar-sh/nextjs";
import type { Order } from "@polar-sh/sdk/models/components/order";
import { recordPolarPaymentConfirmed } from "@/lib/payments/records";
import { PRODUCT_BY_ID, type ProductId } from "@/lib/payments/products";

function metadataString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function productIdFromOrder(order: Order): ProductId | undefined {
  const metadataProductId = metadataString(order.metadata.product_id);
  if (metadataProductId && PRODUCT_BY_ID[metadataProductId as ProductId]) return metadataProductId as ProductId;

  const productName = order.product?.name?.trim().toLowerCase();
  if (!productName) return undefined;
  return Object.values(PRODUCT_BY_ID).find((product) => product.name.trim().toLowerCase() === productName)?.id;
}

function sessionIdFromOrder(order: Order): string | undefined {
  return metadataString(order.metadata.session_id) || order.checkoutId || undefined;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onOrderPaid: async (payload) => {
    const order = payload.data;
    if (!order.paid) return;

    await recordPolarPaymentConfirmed({
      sessionId: sessionIdFromOrder(order),
      productId: productIdFromOrder(order),
      orderId: order.id,
      checkoutId: order.checkoutId || undefined,
      status: order.status,
      amount: order.totalAmount,
      currency: order.currency,
      customerEmail: order.customer.email || undefined,
      customerId: order.customerId,
      metadata: order.metadata
    });
  }
});
