import { PRODUCTS, formatGlobalPrice } from "@/lib/payments/products";

const featuredIds = [
  "quick_wallet_check",
  "quick_transaction_check",
  "quick_agent_check",
  "priority_scam_report_review",
  "agent_verification_review",
  "group_community_safety_review",
  "founding_partner_package"
];

const featuredProducts = PRODUCTS.filter((product) => featuredIds.includes(product.id));

export default function ServicesPage() {
  return (
    <main>
      <h1>8thGuard Review Services</h1>
      <p>
        For high-pressure crypto decisions, 8thGuard provides focused review support for wallets,
        transactions, P2P agents, groups, and scam-report evidence. The service is global, with practical
        attention to local payment rails, Telegram groups, and P2P risks in fast-moving markets.
      </p>

      <h2>Priority Services</h2>
      <ul>
        {featuredProducts.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> - {formatGlobalPrice(product)}
            <br />
            {product.description}
          </li>
        ))}
      </ul>

      <h2>How To Start</h2>
      <ol>
        <li>Open the 8thGuard Telegram bot.</li>
        <li>Choose the paid check or review that matches the risk.</li>
        <li>Pay through official checkout or crypto wallet rails.</li>
        <li>Continue the review session with the wallet, transaction, agent, or case context.</li>
        <li>Receive risk indicators and review guidance.</li>
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
