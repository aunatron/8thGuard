import { NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { getEnv } from "@/lib/config";
import { getReviewRequestById, updateReviewRequestStatus } from "@/lib/reviews";
import { sendTelegramMessage } from "@/lib/telegram";

function redirectToAdmin(req: Request, params: Record<string, string>): NextResponse {
  const url = new URL("/admin/reviews", req.url);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return NextResponse.redirect(url, { status: 303 });
}

function compactFormText(value: FormDataEntryValue | null, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function deliveryText(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\r\n/g, "\n").slice(0, 12000);
}

function deliveryChunks(message: string): string[] {
  const chunks: string[] = [];
  let remaining = message.trim();

  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, 3500));
    remaining = remaining.slice(3500);
  }

  return chunks;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = compactFormText(formData.get("token"), 220);
  const requestId = compactFormText(formData.get("request_id"), 120);
  const message = deliveryText(formData.get("message"));
  const { adminReviewToken } = getEnv();

  if (!adminReviewToken || token !== adminReviewToken) {
    return redirectToAdmin(req, { status: "locked" });
  }

  if (!requestId || !message) {
    return redirectToAdmin(req, { token, status: "error", reason: "message_required", request_id: requestId });
  }

  const { configured, review } = await getReviewRequestById(requestId);
  if (!configured) {
    return redirectToAdmin(req, { token, status: "error", reason: "supabase_not_configured", request_id: requestId });
  }
  if (!review) {
    return redirectToAdmin(req, { token, status: "error", reason: "request_not_found", request_id: requestId });
  }
  if (!review.customerTelegramChatId) {
    return redirectToAdmin(req, { token, status: "error", reason: "no_customer_chat", request_id: requestId });
  }

  const now = new Date().toISOString();

  try {
    for (const chunk of deliveryChunks(message)) {
      await sendTelegramMessage(review.customerTelegramChatId, chunk);
    }

    await updateReviewRequestStatus({
      requestId,
      status: "completed",
      actorId: "admin_review_desk"
    });

    await logAuditEvent({
      event_type: "review_result_delivered",
      actor_type: "admin",
      actor_id: "admin_review_desk",
      command: "admin_review_deliver",
      timestamp: now,
      metadata: {
        request_id: requestId,
        session_id: review.sessionId,
        delivery_channel: "telegram",
        chunks: deliveryChunks(message).length
      }
    });

    return redirectToAdmin(req, { token, status: "delivered", request_id: requestId });
  } catch (error) {
    await logAuditEvent({
      event_type: "review_result_delivery_failed",
      actor_type: "admin",
      actor_id: "admin_review_desk",
      command: "admin_review_deliver",
      timestamp: now,
      metadata: {
        request_id: requestId,
        session_id: review.sessionId,
        error: error instanceof Error ? error.message : "unknown"
      }
    });

    return redirectToAdmin(req, { token, status: "error", reason: "delivery_failed", request_id: requestId });
  }
}
