import { logAuditEvent } from "./audit";
import { PRODUCT_BY_ID, type ProductId } from "./payments/products";
import type { ReviewRequest, ReviewSubjectType } from "./payments/types";
import { hasSupabaseConfig, insertSupabaseRow, selectSupabaseRows } from "./supabase";

export const REVIEW_SUBJECT_TYPES: ReviewSubjectType[] = ["wallet", "transaction", "agent", "scam_report", "group", "payment_session", "other"];

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
  telegram_handle?: string;
  contact_email?: string;
  context?: string;
  created_at: string;
  updated_at: string;
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
    telegramHandle: row.telegram_handle,
    contactEmail: row.contact_email,
    context: row.context,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function createReviewRequest(input: ReviewSubmissionInput): Promise<{ request: ReviewRequest; stored: boolean }> {
  const now = new Date().toISOString();
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

  return {
    request: toReviewRequest(storedRow || row),
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
