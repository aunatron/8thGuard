import { logAuditEvent } from "./audit";
import { PRODUCT_BY_ID, type ProductId } from "./payments/products";
import { notifyAdminReviewSubmitted } from "./review-notifications";
import type { ReviewRequest, ReviewStatus, ReviewSubjectType } from "./payments/types";
import { hasSupabaseConfig, insertSupabaseRow, selectSupabaseRows, updateSupabaseRows } from "./supabase";

export const REVIEW_SUBJECT_TYPES: ReviewSubjectType[] = ["wallet", "transaction", "agent", "scam_report", "group", "payment_session", "other"];
export const REVIEW_STATUS_OPTIONS: ReviewStatus[] = ["paid", "reviewing", "needs_more_info", "completed"];

export type ReviewSubmissionInput = {
  sessionId: string;
  productId: ProductId;
  subjectType: ReviewSubjectType;
  subjectValue: string;
  paymentReference?: string;
  cryptoTxHash?: string;
  telegramHandle?: string;
  contactEmail?: string;
  network?: string;
  context?: string;
};

export type ReviewRequestRow = {
  id: string;
  session_id: string;
  product_id: ProductId;
  status: ReviewRequest["status"];
  subject_type: ReviewSubjectType;
  subject_value: string;
  network?: string;
  payment_reference?: string;
  crypto_tx_hash?: string;
  customer_telegram_chat_id?: number;
  telegram_handle?: string;
  contact_email?: string;
  context?: string;
  created_at: string;
  updated_at: string;
};

type PaymentSessionContactRow = {
  id: string;
  telegram_chat_id?: number;
  telegram_user_id?: number;
  telegram_username?: string;
};

function compactText(value: FormDataEntryValue | string | null | undefined, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function makeReviewId(): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `8GR-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

export function productIdFromForm(value: FormDataEntryValue | null): ProductId | undefined {
  if (typeof value !== "string") return undefined;
  return PRODUCT_BY_ID[value as ProductId] ? (value as ProductId) : undefined;
}

export function subjectTypeFromForm(value: FormDataEntryValue | null): ReviewSubjectType {
  if (typeof value === "string" && REVIEW_SUBJECT_TYPES.includes(value as ReviewSubjectType)) {
    return value as ReviewSubjectType;
  }
  return "wallet";
}

export function subjectTypeFromProductId(productId?: ProductId): ReviewSubjectType {
  if (!productId) return "wallet";
  const product = PRODUCT_BY_ID[productId];
  const serviceType = product?.serviceType || productId;

  if (serviceType.includes("transaction")) return "transaction";
  if (serviceType.includes("agent")) return "agent";
  if (serviceType.includes("scam_report")) return "scam_report";
  if (serviceType.includes("community")) return "group";
  if (serviceType.includes("contract") || serviceType.includes("approval")) return "other";
  if (serviceType.includes("premium_access") || serviceType.includes("founding_partner")) return "payment_session";
  return "wallet";
}

export function subjectPlaceholderForType(subjectType: ReviewSubjectType): string {
  const placeholders: Record<ReviewSubjectType, string> = {
    wallet: "Wallet address to review",
    transaction: "Transaction hash to review",
    agent: "@agent, username, phone label, or profile name",
    scam_report: "Case title, wallet, transaction hash, or reported agent",
    group: "Group/community name, link, or admin context",
    payment_session: "Telegram handle or short service request",
    other: "Chain, contract address, approval, or case detail"
  };

  return placeholders[subjectType];
}

export function reviewStatusFromForm(value: FormDataEntryValue | null): ReviewStatus | undefined {
  if (typeof value === "string" && REVIEW_STATUS_OPTIONS.includes(value as ReviewStatus)) {
    return value as ReviewStatus;
  }
  return undefined;
}

export function reviewSubmissionFromForm(formData: FormData): { ok: true; input: ReviewSubmissionInput } | { ok: false; error: string } {
  const productId = productIdFromForm(formData.get("product_id"));
  const sessionId = compactText(formData.get("session_id"), 80);
  const subjectType = subjectTypeFromForm(formData.get("subject_type"));
  const subjectValue = compactText(formData.get("subject_value"), 280);

  if (!sessionId) return { ok: false, error: "missing_session" };
  if (!productId) return { ok: false, error: "invalid_product" };
  if (!subjectValue) return { ok: false, error: "missing_subject" };

  return {
    ok: true,
    input: {
      sessionId,
      productId,
      subjectType,
      subjectValue,
      paymentReference: compactText(formData.get("payment_reference"), 120),
      cryptoTxHash: compactText(formData.get("crypto_tx_hash"), 160),
      telegramHandle: compactText(formData.get("telegram_handle"), 80),
      contactEmail: compactText(formData.get("contact_email"), 120),
      network: compactText(formData.get("network"), 80),
      context: compactText(formData.get("context"), 1200)
    }
  };
}

export function toReviewRequest(row: ReviewRequestRow): ReviewRequest {
  return {
    id: row.id,
    sessionId: row.session_id,
    productId: row.product_id,
    status: row.status,
    subjectType: row.subject_type,
    subjectValue: row.subject_value,
    network: row.network,
    paymentReference: row.payment_reference,
    cryptoTxHash: row.crypto_tx_hash,
    customerTelegramChatId: row.customer_telegram_chat_id,
    telegramHandle: row.telegram_handle,
    contactEmail: row.contact_email,
    context: row.context,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function findPaymentSessionContact(sessionId: string): Promise<PaymentSessionContactRow | undefined> {
  if (!hasSupabaseConfig()) return undefined;
  const rows = await selectSupabaseRows<PaymentSessionContactRow>(
    "payment_sessions",
    `select=id,telegram_chat_id,telegram_user_id,telegram_username&id=eq.${encodeURIComponent(sessionId)}&limit=1`
  );
  return rows[0];
}

export async function createReviewRequest(input: ReviewSubmissionInput): Promise<{ request: ReviewRequest; stored: boolean }> {
  const now = new Date().toISOString();
  const paymentSessionContact = await findPaymentSessionContact(input.sessionId);
  const row: ReviewRequestRow = {
    id: makeReviewId(),
    session_id: input.sessionId,
    product_id: input.productId,
    status: "paid",
    subject_type: input.subjectType,
    subject_value: input.subjectValue,
    network: input.network || undefined,
    payment_reference: input.paymentReference || undefined,
    crypto_tx_hash: input.cryptoTxHash || undefined,
    customer_telegram_chat_id: paymentSessionContact?.telegram_chat_id,
    telegram_handle: input.telegramHandle || undefined,
    contact_email: input.contactEmail || undefined,
    context: input.context || undefined,
    created_at: now,
    updated_at: now
  };

  const storedRow = await insertSupabaseRow("review_requests", row);

  await logAuditEvent({
    event_type: "review_request_submitted",
    actor_type: "system",
    command: "review_submit",
    timestamp: now,
    metadata: {
      request_id: row.id,
      session_id: row.session_id,
      product_id: row.product_id,
      subject_type: row.subject_type,
      stored: Boolean(storedRow)
    }
  });

  const request = toReviewRequest(storedRow || row);
  await notifyAdminReviewSubmitted(request, Boolean(storedRow));

  return {
    request,
    stored: Boolean(storedRow)
  };
}

export async function listReviewRequests(): Promise<{ configured: boolean; reviews: ReviewRequest[] }> {
  if (!hasSupabaseConfig()) return { configured: false, reviews: [] };
  const rows = await selectSupabaseRows<ReviewRequestRow>("review_requests", "select=*&order=created_at.desc&limit=100");
  return {
    configured: true,
    reviews: rows.map(toReviewRequest)
  };
}

export async function getReviewRequestById(requestId: string): Promise<{ configured: boolean; review?: ReviewRequest }> {
  const id = compactText(requestId, 120);
  if (!hasSupabaseConfig()) return { configured: false };
  const rows = await selectSupabaseRows<ReviewRequestRow>("review_requests", `select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  return {
    configured: true,
    review: rows[0] ? toReviewRequest(rows[0]) : undefined
  };
}

export async function updateReviewRequestStatus(input: {
  requestId: string;
  status: ReviewStatus;
  actorId?: string;
}): Promise<{ configured: boolean; updated?: ReviewRequest }> {
  const requestId = compactText(input.requestId, 120);
  const now = new Date().toISOString();

  if (!hasSupabaseConfig()) {
    await logAuditEvent({
      event_type: "review_status_update_skipped",
      actor_type: "admin",
      actor_id: input.actorId,
      command: "admin_review_status",
      timestamp: now,
      metadata: {
        request_id: requestId,
        status: input.status,
        reason: "supabase_not_configured"
      }
    });
    return { configured: false };
  }

  const rows = await updateSupabaseRows<ReviewRequestRow>(
    "review_requests",
    `id=eq.${encodeURIComponent(requestId)}`,
    {
      status: input.status,
      updated_at: now
    }
  );
  const updated = rows[0] ? toReviewRequest(rows[0]) : undefined;

  await logAuditEvent({
    event_type: updated ? "review_status_updated" : "review_status_update_missing",
    actor_type: "admin",
    actor_id: input.actorId,
    command: "admin_review_status",
    timestamp: now,
    metadata: {
      request_id: requestId,
      status: input.status,
      updated: Boolean(updated)
    }
  });

  return { configured: true, updated };
}
