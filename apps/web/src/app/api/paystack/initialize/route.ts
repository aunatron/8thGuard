import { NextResponse } from "next/server";
import { initializePaystackTransaction } from "@/lib/payments/paystackVerification";
import { createPaymentSessionDraft, isProductId } from "@/lib/payments/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = typeof body.productId === "string" ? body.productId : "";
    const email = typeof body.email === "string" ? body.email : "";

    if (!isProductId(productId)) {
      return NextResponse.json({ ok: false, error: "invalid_product" }, { status: 400 });
    }

    const session = createPaymentSessionDraft(productId);
    const result = await initializePaystackTransaction({
      productId,
      sessionId: session.sessionId,
      email,
      telegramChatId: typeof body.telegramChatId === "number" ? body.telegramChatId : undefined,
      telegramUserId: typeof body.telegramUserId === "number" ? body.telegramUserId : undefined,
      telegramUsername: typeof body.telegramUsername === "string" ? body.telegramUsername : undefined
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.reason, sessionId: result.sessionId }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      sessionId: result.sessionId,
      reference: result.reference,
      authorizationUrl: result.authorizationUrl,
      accessCode: result.accessCode
    });
  } catch {
    return NextResponse.json({ ok: false, error: "initialize_failed" }, { status: 500 });
  }
}
