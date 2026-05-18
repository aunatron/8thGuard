import { getEnv } from "@/lib/config";
import { PRODUCT_BY_ID } from "@/lib/payments/products";
import { buildReviewDeliveryDraft } from "@/lib/review-delivery";
import { listReviewRequests, REVIEW_STATUS_OPTIONS } from "@/lib/reviews";

function shortDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function AdminReviewsPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; status?: string; reason?: string; request_id?: string }>;
}) {
  const params = await searchParams;
  const { adminReviewToken } = getEnv();

  if (!adminReviewToken || params.token !== adminReviewToken) {
    return (
      <main>
        <section className="page-hero compact">
          <p className="eyebrow">Admin Desk</p>
          <h1>Review desk locked.</h1>
          <p>Use an approved admin access link to view 8thGuard review intake.</p>
        </section>
      </main>
    );
  }

  const { configured, reviews } = await listReviewRequests();
  const statusMessage =
    params.status === "updated"
      ? `Review status updated for ${params.request_id || "selected request"}.`
      : params.status === "delivered"
        ? `Review result delivered for ${params.request_id || "selected request"}.`
      : params.status === "error"
        ? params.reason === "supabase_not_configured"
          ? "Supabase is not connected for this environment. Status changes need the live review queue."
          : params.reason === "request_not_found"
            ? "That review request was not found in the queue."
            : params.reason === "no_customer_chat"
              ? "Telegram delivery needs a paid session created from Telegram so the customer chat ID is available."
              : params.reason === "delivery_failed"
                ? "Telegram delivery failed. Check the bot token, chat access, and Telegram status."
                : params.reason === "message_required"
                  ? "Add a review result before sending."
                  : "Review status could not be updated."
        : undefined;

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Admin Desk</p>
        <h1>Paid review queue.</h1>
        <p>Track paid sessions, submitted wallet/transaction/agent context, and review status.</p>
      </section>

      <section className="section-band">
        {statusMessage && (
          <div className={params.status === "updated" ? "form-alert success" : "form-alert"}>{statusMessage}</div>
        )}

        {!configured && (
          <div className="form-alert">
            Supabase is not connected for this environment. Add the database env vars to activate the live review queue.
          </div>
        )}

        {configured && reviews.length === 0 && (
          <div className="form-alert success">No review requests in the queue yet.</div>
        )}

        <div className="admin-table">
          <div className="admin-row header">
            <span>Created</span>
            <span>Service</span>
            <span>Subject</span>
            <span>Status</span>
            <span>Contact</span>
            <span>Desk Action</span>
          </div>

          {reviews.map((review) => {
            const product = PRODUCT_BY_ID[review.productId];
            const deliveryDraft = buildReviewDeliveryDraft(review);
            return (
              <article className="admin-row" key={review.id}>
                <span>
                  <strong>{shortDate(review.createdAt)}</strong>
                  <small>{review.sessionId}</small>
                </span>
                <span>{product?.name || review.productId}</span>
                <span>
                  <strong>{review.subjectType.replace(/_/g, " ")}</strong>
                  <small>{review.subjectValue}</small>
                  {review.network && <small>{review.network}</small>}
                </span>
                <span>{review.status}</span>
                <span>
                  {review.telegramHandle || review.contactEmail || "No contact supplied"}
                  {review.paymentReference && <small>Ref: {review.paymentReference}</small>}
                  {review.cryptoTxHash && <small>Tx: {review.cryptoTxHash}</small>}
                </span>
                <span>
                  <form className="status-form" action="/api/reviews/status" method="post">
                    <input type="hidden" name="token" value={params.token || ""} />
                    <input type="hidden" name="request_id" value={review.id} />
                    <select name="status" defaultValue={review.status} aria-label={`Update ${review.id} status`}>
                      {REVIEW_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <button className="button primary compact" type="submit">Update</button>
                  </form>
                  <details className="delivery-draft">
                    <summary>Delivery Draft</summary>
                    <pre>{deliveryDraft}</pre>
                    <form className="delivery-form" action="/api/reviews/deliver" method="post">
                      <input type="hidden" name="token" value={params.token || ""} />
                      <input type="hidden" name="request_id" value={review.id} />
                      <textarea
                        name="message"
                        rows={16}
                        defaultValue={deliveryDraft}
                        aria-label={`Delivery result for ${review.id}`}
                      />
                      {review.customerTelegramChatId ? (
                        <button className="button primary compact" type="submit">Send Result</button>
                      ) : (
                        <small>Telegram delivery needs a Telegram-created paid session.</small>
                      )}
                    </form>
                  </details>
                </span>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
