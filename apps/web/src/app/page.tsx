import Image from "next/image";
import { PRODUCTS, formatGlobalPrice } from "@/lib/payments/products";

const productCards = [
  "Wallet Intelligence",
  "Transaction Review",
  "Agent Risk Review",
  "Smart Contract Risk",
  "Guarded Send",
  "Payment Sessions",
  "Group Safety",
  "Protected Transactions"
];

const paymentRails = ["Stripe/Polar", "Paystack/Others", "Crypto wallets", "BTC", "XRP", "USDT TRC20", "USDT BEP20/EVM", "TON", "Solana"];

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <Image className="brand-mark" src="/assets/logo_dark-removebg-preview.png" alt="8thGuard" width={172} height={64} priority />
          <h1>Check before you send.</h1>
          <p className="hero-subhead">
            8thGuard helps users review wallets, transactions, agents, and protected payment flows for early risk signals before funds move.
          </p>
          <p className="trust-line">Paid crypto safety. No private keys. No exchange. No custody.</p>
          <div className="hero-actions">
            <a className="button primary" href="/pay">View Paid Services</a>
            <a className="button secondary" href="/services">Explore Reviews</a>
            <a className="button secondary" href="/official">Official Channels</a>
          </div>
        </div>
        <div className="signal-panel" aria-label="8thGuard risk signal preview">
          <p className="panel-kicker">Wallet Intelligence Preview</p>
          <div className="score-row">
            <span>Risk Score</span>
            <strong>42/100</strong>
          </div>
          <div className="signal-bar"><span /></div>
          <ul>
            <li>Detected network: EVM</li>
            <li>Coverage: Enhanced</li>
            <li>Network intelligence active</li>
            <li>Early risk signals only</li>
          </ul>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <p className="eyebrow">Premium Safety Products</p>
          <h2>Built for the moment before funds move.</h2>
        </div>
        <div className="product-grid">
          {productCards.map((name) => (
            <article className="product-card" key={name}>
              <h3>{name}</h3>
              <p>
                Chain-aware review surfaces for crypto decisions where speed, pressure, and bad information create real risk.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Pricing</p>
          <h2>Free education. Paid utility.</h2>
          <p>
            Checks and reviews are paid services. Public pricing is shown across major global reference currencies.
          </p>
        </div>
        <div className="pricing-list">
          {PRODUCTS.map((product) => (
            <div className="price-row" key={product.id}>
              <span>{product.name}</span>
              <strong>{formatGlobalPrice(product)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band muted">
        <div className="section-heading">
          <p className="eyebrow">Smart Contract Risk Analyzer</p>
          <h2>Scan contracts before buying or interacting.</h2>
          <p>
            8thGuard gives users an automated risk preview for token contracts, spender approvals, and dApp interactions before they buy, approve, or send funds.
          </p>
        </div>
        <div className="product-grid">
          <article className="product-card">
            <h3>Contract red flags</h3>
            <p>Detect early contract risk signals such as owner controls, minting, pause controls, blacklist logic, upgradeability, and hidden external calls.</p>
          </article>
          <article className="product-card">
            <h3>Token and approval risk</h3>
            <p>Review token restrictions and spender approval risks before signing transactions or granting allowances.</p>
          </article>
          <article className="product-card">
            <h3>Premium reports</h3>
            <p>Quick previews stay lightweight. Paid contract reports provide deeper red-flag review while remaining clear that this is not a full audit.</p>
          </article>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <p className="eyebrow">Official Rails</p>
          <h2>Pay through service rails only.</h2>
          <p>
            Stripe/Polar, Paystack/Others, and published crypto wallets are for 8thGuard digital service payments only. They are not trading, exchange, custody, or user-to-user settlement rails.
          </p>
        </div>
        <div className="rail-grid">
          {paymentRails.map((rail) => (
            <span key={rail}>{rail}</span>
          ))}
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">How It Works</p>
          <h2>Choose, pay, submit, review.</h2>
        </div>
        <ol className="steps">
          <li>Choose service</li>
          <li>Pay through official rail</li>
          <li>Submit wallet, transaction, agent, or session context</li>
          <li>Receive risk indicators or detailed review</li>
          <li>Continue the protected review flow</li>
        </ol>
      </section>

      <section className="trust-section">
        <div>
          <p className="eyebrow">Safety Boundaries</p>
          <h2>Urgent, but qualified.</h2>
        </div>
        <ul>
          <li>No seed phrase requests.</li>
          <li>No private keys.</li>
          <li>No exchange.</li>
          <li>No final fraud proof claims.</li>
          <li>Early risk signals only.</li>
        </ul>
      </section>

      <section className="miniapp-section">
        <p className="eyebrow">Platform Coverage</p>
        <h2>Built for Telegram, web, and protected transaction flows.</h2>
        <p>
          8thGuard combines payments, wallet intelligence, review sessions, and protected-flow readiness without crossing into exchange, custody, or trading.
        </p>
      </section>
    </main>
  );
}
