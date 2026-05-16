import { buildPolarCheckoutUrl, getPaystackPaymentLinks, getPublicCryptoWallets } from "@/lib/payments/config";
import { PRODUCTS, formatGlobalPrice } from "@/lib/payments/products";

export default function PayPage() {
  const paystackLinks = getPaystackPaymentLinks();
  const cryptoWallets = getPublicCryptoWallets();

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Official Payments</p>
        <h1>Pay for 8thGuard services.</h1>
        <p>
          Checks, reviews, payment sessions, and protected flows are paid products. Pay through official rails only.
        </p>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <p className="eyebrow">Payment Options</p>
          <h2>Stripe/Polar and Paystack/Others</h2>
          <p>Use official 8thGuard checkout rails for smart contract checks, code-risk reports, and review services only.</p>
        </div>
        <div className="product-grid">
          {PRODUCTS.map((product) => {
            const link = paystackLinks[product.id];
            const polarLink = buildPolarCheckoutUrl(product.id);
            return (
              <article className="product-card" key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{formatGlobalPrice(product)}</strong>
                {polarLink && (
                  <a className="button primary full" href={polarLink}>Stripe/Polar</a>
                )}
                {link ? (
                  <a className="button secondary full" href={link}>Paystack/Others</a>
                ) : (
                  !polarLink && <span className="status-pill">Available in Telegram checkout</span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Crypto Wallets</p>
          <h2>Official crypto wallets</h2>
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
          <li>Built for Telegram, web, and protected payment review flows.</li>
        </ul>
      </section>
    </main>
  );
}
