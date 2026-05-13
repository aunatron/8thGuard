import crypto from "crypto";
import { NextResponse } from "next/server";
import { PRODUCT_BY_ID, type ProductId } from "@/lib/payments/products";
import { recordPaystackPaymentConfirmed } from "@/lib/payments/records";
import { verifyPaystackReference } from "@/lib/payments/paystackVerification";
import { sendTelegramMessage } from "@/lib/telegram";

export const runtime = "nodejs";

type PaystackWebhookBody = {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    metadata?: string | Record<string, unknown>;
  };
};

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret || !signature) return false;
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  if (hash.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

function parseMetadata(metadata: string | Record<string, unknown> | undefined): Record<string, unknown> {
  if (!metadata) return {};
  if (typeof metadata === "object") return metadata;
  try {
    const parsed = JSON.parse(metadata);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function productIdFromMetadata(value: unknown): ProductId | undefined {
  if (typeof value !== "string") return undefined;
  return PRODUCT_BY_ID[value as ProductId] ? (value as ProductId) : undefined;
}

function siteUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || undefined;
}

function submitUrl(input: { sessionId?: string; productId?: ProductId; reference?: string }): string | undefined {
  const baseUrl = siteUrl();
  if (!baseUrl) return undefined;
  const url = new URL("/submit", baseUrl);
  if (input.sessionId) url.searchParams.set("session_id", input.sessionId);
  if (input.productId) url.searchParams.set("product_id", input.productId);
  if (input.reference) url.searchParams.set("payment_reference", input.reference);
  return url.toString();
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let body: PaystackWebhookBody;
  try {
    body = JSON.parse(rawBody) as PaystackWebhookBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.event !== "charge.success" || !body.data?.reference) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const verification = await verifyPaystackReference(body.data.reference);
  const metadata = parseMetadata(body.data.metadata);
  const telegramChatId = typeof metadata.telegram_chat_id === "number" ? metadata.telegram_chat_id : undefined;
  const sessionId = typeof metadata.session_id === "string" ? metadata.session_id : undefined;
  const productId = productIdFromMetadata(metadata.product_id);
  const productName = typeof metadata.product_name === "string" ? metadata.product_name : "8thGuard service";
  const reviewSubmitUrl = submitUrl({ sessionId, productId, reference: verification.reference });

  await recordPaystackPaymentConfirmed({
    sessionId,
    productId,
    reference: verification.reference,
    status: verification.status,
    amount: verification.amount,
    currency: verification.currency,
    channel: verification.channel
  });

  console.log(JSON.stringify({
    audit: {
      event_type: "paystack_webhook_charge_success",
      actor_type: "system",
      command: "paystack_webhook",
      timestamp: new Date().toISOString(),
      metadata: {
        reference: verification.reference,
        status: verification.status,
        amount: verification.amount,
        currency: verification.currency,
        session_id: sessionId,
        product_name: productName
      }
    }
  }));

  if (telegramChatId && verification.status === "success") {
    await sendTelegramMessage(
      telegramChatId,
      [
        "Payment received by 8thGuard.",
        "",
        sessionId ? `Session ID: ${sessionId}` : undefined,
        `Product: ${productName}`,
        `Paystack reference: ${verification.reference}`,
        "",
        "Your paid service is ready for review intake.",
        reviewSubmitUrl ? "Tap Submit Review Details below, or send the wallet, transaction hash, agent, or context connected to this session." : "Send the wallet, transaction hash, agent, or context connected to this session.",
        "",
        "Early risk signals, not final fraud proof."
      ]
        .filter((line): line is string => Boolean(line))
        .join("\n"),
      reviewSubmitUrl
        ? {
            inline_keyboard: [
              [{ text: "Submit Review Details", url: reviewSubmitUrl }],
              [{ text: "Paid Services", callback_data: "payment_session" }]
            ]
          }
        : undefined
    );
  }

  return NextResponse.json({ ok: true, status: verification.status });
}
