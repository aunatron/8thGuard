import crypto from "crypto";
import { NextResponse } from "next/server";
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
  const productName = typeof metadata.product_name === "string" ? metadata.product_name : "8thGuard service";

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
        "Your paid service is ready for review intake. Send the wallet, transaction hash, agent, or context connected to this session.",
        "",
        "Early risk signals, not final fraud proof."
      ]
        .filter((line): line is string => Boolean(line))
        .join("\n")
    );
  }

  return NextResponse.json({ ok: true, status: verification.status });
}
