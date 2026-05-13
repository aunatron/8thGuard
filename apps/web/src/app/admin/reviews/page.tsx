import { getEnv } from "@/lib/config";
import { PRODUCT_BY_ID } from "@/lib/payments/products";
import { listReviewRequests } from "@/lib/reviews";

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
  searchParams: Promise<{ token?: string }>;
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

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Admin Desk</p>
        <h1>Paid review queue.</h1>
        <p>Track paid sessions, submitted wallet/transaction/agent context, and review status.</p>
      </section>

      <section className="section-band">
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
          </div>

          {reviews.map((review) => {
            const product = PRODUCT_BY_ID[review.productId];
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
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
