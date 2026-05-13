import { getPaystackPaymentLinks, getPublicCryptoWallets } from "@/lib/payments/config";
import { PRODUCTS, formatGhs, formatUsd } from "@/lib/payments/products";

export default function PayPage() {
  const paystackLinks = getPaystackPaymentLinks();
  const cryptoWallets = getPublicCryptoWallets();

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Official Payments</p>
        <h1>Pay for 8thGuard services.</h1>
        <p>
          Checks, reviews, payment sessions, and future protected flows are paid products. Pay through official rails only.
        </p>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <p className="eyebrow">Paystack</p>
          <h2>Service payment links</h2>
          <p>Paystack is for 8thGuard digital service payments only. Product pages are activated by the founder.</p>
        </div>
        <div className="product-grid">
          {PRODUCTS.map((product) => {
            const link = paystackLinks[product.id];
            return (
              <article className="product-card" key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{formatUsd(product.priceUsd)} / {formatGhs(product.priceGhs)}</strong>
                {link ? (
                  <a className="button primary full" href={link}>Pay with Paystack</a>
                ) : (
                  <span className="status-pill">Paystack link activating</span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Crypto Wallets</p>
          <h2>Official crypto payment callout</h2>
          <p>
            Crypto rails use USDT/USDC equivalent or quoted crypto amounts for service payments. Wrong-network payments may be unrecoverable.
          </p>
        </div>
        <div className="pricing-list">
          {cryptoWallets.map((wallet) => (
            <div className="price-row" key={wallet.envName}>
              <span>{wallet.label}</span>
              <strong>{wallet.address || "Not published yet"}</strong>
              {wallet.label === "XRP" && (
                <small>{wallet.destinationTag ? `Destination tag: ${wallet.destinationTag}` : "No destination tag published. Confirm before sending."}</small>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <div>
          <p className="eyebrow">No-Free-Check Policy</p>
          <h2>Free education. Paid utility.</h2>
        </div>
        <ul>
          <li>Checks and reviews are paid services.</li>
          <li>8thGuard never asks for private keys or seed phrases.</li>
          <li>No exchange, trading, custody, escrow, or user-to-user settlement.</li>
          <li>Built for Telegram bot today and mini-app payment flows tomorrow.</li>
        </ul>
      </section>
    </main>
  );
}
