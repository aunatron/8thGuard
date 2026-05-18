import { logAuditEvent } from "./audit";
import { getEnv } from "./config";
import { PRODUCT_BY_ID } from "./payments/products";
import type { ReviewRequest } from "./payments/types";
import { sendTelegramMessage } from "./telegram";

function compact(value: string | undefined, maxLength: number): string | undefined {
  if (!value) return undefined;
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function adminDeskHint(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (!siteUrl) return "Open the protected admin review desk with the approved token.";
  return `Admin desk: ${siteUrl}/admin/reviews`;
}

function adminChatId(): number | undefined {
  const raw = getEnv().adminTelegramChatId?.trim();
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function notifyAdminReviewSubmitted(review: ReviewRequest, stored: boolean): Promise<void> {
  const chatId = adminChatId();
  const now = new Date().toISOString();

  if (!chatId) {
    await logAuditEvent({
      event_type: "admin_review_notification_skipped",
      actor_type: "system",
      command: "review_submit",
      timestamp: now,
      metadata: {
        request_id: review.id,
        reason: "admin_telegram_chat_not_configured"
      }
    });
    return;
  }

  const product = PRODUCT_BY_ID[review.productId];
  const message = [
    "8thGuard Paid Review Intake",
    "",
    `Request ID: ${review.id}`,
    `Session ID: ${review.sessionId}`,
    `Service: ${product?.name || review.productId}`,
    `Status: ${review.status}`,
    `Stored: ${stored ? "yes" : "audit-only fallback"}`,
    "",
    `Subject: ${review.subjectType}`,
    compact(review.subjectValue, 160) ? `Value: ${compact(review.subjectValue, 160)}` : undefined,
    review.network ? `Network: ${review.network}` : undefined,
    review.paymentReference ? `Payment ref: ${compact(review.paymentReference, 120)}` : undefined,
    review.cryptoTxHash ? `Crypto tx: ${compact(review.cryptoTxHash, 120)}` : undefined,
    review.telegramHandle || review.contactEmail
      ? `Contact: ${[review.telegramHandle, review.contactEmail].filter(Boolean).join(" / ")}`
      : "Contact: not supplied",
    "",
    adminDeskHint(),
    "",
    "Use reviewing when work starts. Use completed only after delivery."
  ].filter((line): line is string => Boolean(line));

  try {
    await sendTelegramMessage(chatId, message.join("\n"));
    await logAuditEvent({
      event_type: "admin_review_notification_sent",
      actor_type: "system",
      command: "review_submit",
      timestamp: now,
      metadata: {
        request_id: review.id,
        session_id: review.sessionId
      }
    });
  } catch (error) {
    await logAuditEvent({
      event_type: "admin_review_notification_failed",
      actor_type: "system",
      command: "review_submit",
      timestamp: now,
      metadata: {
        request_id: review.id,
        error: error instanceof Error ? error.message : "unknown"
      }
    });
  }
}
