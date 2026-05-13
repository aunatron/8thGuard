import Link from "next/link";

export default async function PaystackCallbackPage({
  searchParams
}: {
  searchParams: Promise<{ reference?: string; trxref?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference || params.trxref;
  const sessionId = params.session_id;
  const telegramUrl = process.env.NEXT_PUBLIC_OFFICIAL_TELEGRAM || "https://t.me/";

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Payment Callback</p>
        <h1>Payment received for review.</h1>
        <p>
          Paystack has redirected you back to 8thGuard. The backend webhook is the final confirmation signal.
        </p>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Next Step</p>
          <h2>Return to Telegram.</h2>
          <p>
            Send your session details and review context in the official 8thGuard bot so the paid service can be fulfilled.
          </p>
        </div>
        <div className="pricing-list">
          {sessionId && (
            <div className="price-row">
              <span>Session ID</span>
              <strong>{sessionId}</strong>
            </div>
          )}
          {reference && (
            <div className="price-row">
              <span>Paystack Reference</span>
              <strong>{reference}</strong>
            </div>
          )}
          <div className="price-row">
            <span>Telegram</span>
            <strong><a href={telegramUrl}>Open 8thGuard Bot</a></strong>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div>
          <p className="eyebrow">Safety</p>
          <h2>Service payment only.</h2>
        </div>
        <ul>
          <li>No private keys or seed phrases.</li>
          <li>No exchange, custody, escrow, trading, or user-to-user settlement.</li>
          <li>Early risk signals, not final fraud proof.</li>
        </ul>
      </section>

      <section className="miniapp-section">
        <Link className="button primary" href="/pay">Back to payment options</Link>
      </section>
    </main>
  );
}
