import { PRODUCTS, formatUsd } from "@/lib/payments/products";

export default function HomePage() {
  const launchOffers = PRODUCTS.filter((product) =>
    [
      "rapid_wallet_risk_review",
      "priority_scam_case_triage",
      "agent_group_safety_review",
      "business_community_safety_review",
      "founder_protection_package",
      "same_day_response_desk"
    ].includes(product.id)
  );

  return (
    <main>
      <h1>8thGuard</h1>
      <p>
        Global crypto fraud intelligence and transaction safety for reviewing wallets,
        transaction hashes, and P2P agents before funds move. Built for global crypto safety
        with practical attention to the payment habits and P2P risks users face across Ghana,
        Africa, and other fast-moving markets.
      </p>

      <h2>Wallet Intelligence</h2>
      <p>
        8thGuard reviews wallet formats, explorer links, public-chain signals where available,
        transaction activity, and user-submitted context to help you spot risk before sending funds.
      </p>
      <ul>
        <li>Wallet checks with early risk signals and source notes.</li>
        <li>Transaction hash previews with likely network and explorer links.</li>
        <li>P2P agent review workflow foundation and scam report preparation guidance.</li>
      </ul>

      <h2>Payment Rails</h2>
      <p>
        8thGuard uses USD reference pricing for global clarity. Paystack service payments
        may support local rails such as MoMo, card, bank transfer, and local-currency
        conversion at checkout. Official crypto wallet payments use USDT/USDC equivalent
        or quoted crypto amounts for 8thGuard digital services only.
      </p>
      <ul>
        <li>No escrow.</li>
        <li>No custody of customer funds.</li>
        <li>No exchange, trading, or user-to-user settlement.</li>
      </ul>

      <h2>Priority Review Services</h2>
      <p>
        When the situation is urgent or the amount at risk is meaningful, choose a higher-touch
        review path with clearer next steps and focused safety guidance.
      </p>
      <ul>
        {launchOffers.map((product) => (
          <li key={product.id}>
            {product.name.replace("Detailed Wallet Review", "Detailed Review")} - {formatUsd(product.priceUsd)}
          </li>
        ))}
      </ul>
      <p><a href="/services">View priority review services</a></p>

      <h2>Safety boundaries</h2>
      <ul>
        <li>No custody of customer funds.</li>
        <li>No escrow execution.</li>
        <li>No private-key storage.</li>
        <li>Results are early risk signals, not final fraud proof.</li>
      </ul>
      <h2>Trust Center</h2>
      <p>
        Clear rules protect users and the platform. 8thGuard does not provide escrow, custody,
        exchange, trading, or guaranteed fraud-proof claims.
      </p>
      <ul>
        <li><a href="/legal/terms">Terms of Service</a></li>
        <li><a href="/legal/privacy">Privacy Policy</a></li>
        <li><a href="/legal/risk-disclaimer">Risk Disclaimer</a></li>
        <li><a href="/legal/payment-policy">Payment Policy</a></li>
        <li><a href="/legal/refund-policy">Refund Policy</a></li>
      </ul>
    </main>
  );
}
