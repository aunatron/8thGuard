import { PRODUCTS, formatUsd } from "@/lib/payments/products";

const featuredIds = [
  "rapid_wallet_risk_review",
  "priority_scam_case_triage",
  "agent_group_safety_review",
  "business_community_safety_review",
  "founder_protection_package",
  "same_day_response_desk"
];

const featuredProducts = PRODUCTS.filter((product) => featuredIds.includes(product.id));

export default function ServicesPage() {
  return (
    <main>
      <h1>8thGuard Review Services</h1>
      <p>
        For high-pressure crypto decisions, 8thGuard provides focused review support for wallets,
        transactions, P2P agents, groups, and scam-report evidence. The service is global, with practical
        attention to local payment rails, Telegram/WhatsApp groups, and P2P risks common across Ghana and Africa.
      </p>

      <h2>Priority Services</h2>
      <ul>
        {featuredProducts.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> - {formatUsd(product.priceUsd)}
            <br />
            {product.description}
          </li>
        ))}
      </ul>

      <h2>How To Start</h2>
      <ol>
        <li>Open the 8thGuard Telegram bot.</li>
        <li>Run a first-pass check with `/check_wallet`, `/check_tx`, or `/check_agent`.</li>
        <li>Choose the review service that matches the risk and urgency.</li>
        <li>Use `/pay` or `/crypto_pay` for official payment instructions.</li>
        <li>Use `/submit_payment` and official contact to send payment proof and review context.</li>
      </ol>

      <h2>Important Boundaries</h2>
      <ul>
        <li>Risk indicators are not final fraud proof.</li>
        <li>8thGuard does not provide escrow, custody, exchange, trading, or guaranteed recovery.</li>
        <li>Never send seed phrases, private keys, wallet passwords, or unnecessary identity documents.</li>
      </ul>

      <p>
        Need a review now? Use the Telegram bot and choose Pricing, Pay, or Crypto Pay from the menu.
      </p>
    </main>
  );
}
