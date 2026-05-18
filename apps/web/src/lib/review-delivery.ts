import { PRODUCT_BY_ID } from "./payments/products";
import type { ReviewRequest } from "./payments/types";

function subjectLabel(value: string): string {
  return value.replace(/_/g, " ");
}

function contactLine(review: ReviewRequest): string {
  if (review.telegramHandle && review.contactEmail) return `${review.telegramHandle} / ${review.contactEmail}`;
  return review.telegramHandle || review.contactEmail || "Contact not supplied";
}

export function buildReviewDeliveryDraft(review: ReviewRequest): string {
  const product = PRODUCT_BY_ID[review.productId];
  const lines = [
    "8thGuard Paid Review Result",
    "",
    `Request ID: ${review.id}`,
    `Session ID: ${review.sessionId}`,
    `Service: ${product?.name || review.productId}`,
    `Status: ${subjectLabel(review.status)}`,
    "",
    "Review Subject",
    `Type: ${subjectLabel(review.subjectType)}`,
    `Value: ${review.subjectValue}`,
    review.network ? `Network: ${review.network}` : undefined,
    "",
    "Payment Evidence",
    review.paymentReference ? `Payment reference: ${review.paymentReference}` : "Payment reference: not supplied in intake",
    review.cryptoTxHash ? `Crypto transaction hash: ${review.cryptoTxHash}` : undefined,
    `Customer contact: ${contactLine(review)}`,
    "",
    "MVP Result",
    "Risk level: [Low / Medium / High / Needs more information]",
    "Risk indicators:",
    "- [Add public wallet, transaction, agent, or case signal observed]",
    "- [Add any missing-context warning or mismatch]",
    "",
    "Recommended next step:",
    "[Tell the customer whether to pause, verify more details, avoid sending, or proceed carefully.]",
    "",
    "Limits",
    "This is an 8thGuard MVP result based on available public/contextual signals at review time.",
    "It provides early risk signals and wallet intelligence where applicable, not final fraud proof, legal advice, custody, escrow, recovery, exchange, trading, or a guarantee of safety."
  ];

  return lines.filter((line): line is string => Boolean(line)).join("\n");
}
