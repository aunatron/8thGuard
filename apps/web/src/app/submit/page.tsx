import Link from "next/link";
import { PRODUCTS } from "@/lib/payments/products";
import {
  productIdFromForm,
  REVIEW_SUBJECT_TYPES,
  subjectPlaceholderForType,
  subjectTypeFromProductId,
  subjectTypeFromForm
} from "@/lib/reviews";

function statusMessage(status?: string, requestId?: string, reason?: string): string | undefined {
  if (status === "received") return `Review details received. Request ID: ${requestId || "8thGuard review"}.`;
  if (status === "error") {
    if (reason === "missing_session") return "Add your 8thGuard session ID before submitting.";
    if (reason === "invalid_product") return "Choose the paid service connected to this review.";
    if (reason === "missing_subject") return "Add the wallet, transaction hash, agent, or case detail to review.";
    return "Review details could not be submitted. Check the form and try again.";
  }
  return undefined;
}

export default async function SubmitReviewPage({
  searchParams
}: {
  searchParams: Promise<{
    session_id?: string;
    product_id?: string;
    payment_reference?: string;
    subject_type?: string;
    status?: string;
    request_id?: string;
    reason?: string;
  }>;
}) {
  const params = await searchParams;
  const message = statusMessage(params.status, params.request_id, params.reason);
  const selectedProductId = productIdFromForm(params.product_id || null) || "quick_wallet_check";
  const selectedSubjectType = params.subject_type
    ? subjectTypeFromForm(params.subject_type)
    : subjectTypeFromProductId(selectedProductId);
  const subjectPlaceholder = subjectPlaceholderForType(selectedSubjectType);

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Review Intake</p>
        <h1>Submit your paid review details.</h1>
        <p>
          Send the wallet, transaction, agent, or case context connected to your 8thGuard paid service.
        </p>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Paid Service</p>
          <h2>One clean intake.</h2>
          <p>
            Use the same session ID and payment reference from Telegram or checkout. Keep the context short and focused on what needs review.
          </p>
          <ul className="plain-list">
            <li>No seed phrases.</li>
            <li>No private keys.</li>
            <li>No wallet passwords.</li>
            <li>Early risk signals, not final fraud proof.</li>
          </ul>
        </div>

        <form className="intake-form" action="/api/reviews/submit" method="post">
          {message && <div className={params.status === "received" ? "form-alert success" : "form-alert"}>{message}</div>}

          <label>
            Session ID
            <input name="session_id" defaultValue={params.session_id || ""} required placeholder="8G-260513-X7K2" />
          </label>

          <label>
            Paid service
            <select name="product_id" defaultValue={selectedProductId} required>
              {PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Review type
            <select name="subject_type" defaultValue={selectedSubjectType} required>
              {REVIEW_SUBJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <label>
            Wallet, transaction hash, agent, or case detail
            <input name="subject_value" required placeholder={subjectPlaceholder} />
          </label>

          <label>
            Network
            <input name="network" placeholder="EVM, TRON, BTC, XRP, TON, Solana, unknown" />
          </label>

          <label>
            Payment reference
            <input name="payment_reference" defaultValue={params.payment_reference || ""} placeholder="Stripe/Polar order or Paystack reference" />
          </label>

          <label>
            Crypto transaction hash
            <input name="crypto_tx_hash" placeholder="Only if paid by crypto" />
          </label>

          <label>
            Telegram handle
            <input name="telegram_handle" placeholder="@username" />
          </label>

          <label>
            Email
            <input name="contact_email" type="email" placeholder="Optional contact email" />
          </label>

          <label>
            Short context
            <textarea name="context" rows={5} placeholder="What happened? What are you about to send? What feels suspicious?" />
          </label>

          <button className="button primary" type="submit">Submit Review Details</button>
        </form>
      </section>

      <section className="miniapp-section">
        <Link className="button secondary dark" href="/pay">Back to paid services</Link>
      </section>
    </main>
  );
}
