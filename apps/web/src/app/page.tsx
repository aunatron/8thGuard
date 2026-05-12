import { PRODUCTS, formatUsd } from "@/lib/payments/products";

export default function HomePage() {
  const launchOffers = PRODUCTS.filter((product) =>
    [
      "detailed_wallet_review",
      "priority_scam_report_review",
      "agent_verification_review",
      "group_community_safety_review",
      "founding_supporter_package"
    ].includes(product.id)
  );

  return (
    <main>
      <h1>8thGuard</h1>
      <p>
        Global crypto fraud intelligence and transaction safety for reviewing wallets,
        transaction hashes, and P2P agents before funds move.
      </p>

      <h2>Real Wallet Intelligence Preview</h2>
      <p>
        8thGuard is beginning to connect live blockchain signals from public sources and
        explorer APIs. Current checks may include address format recognition, explorer links,
        transaction-count previews, and limited chain-specific lookups.
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
        <li>No escrow in the current MVP.</li>
        <li>No custody of customer funds.</li>
        <li>No exchange, trading, or user-to-user settlement.</li>
      </ul>

      <h2>Tonight Launch Offers</h2>
      <ul>
        {launchOffers.map((product) => (
          <li key={product.id}>
            {product.name.replace("Detailed Wallet Review", "Detailed Review")} - {formatUsd(product.priceUsd)}
          </li>
        ))}
      </ul>

      <h2>Safety boundaries</h2>
      <ul>
        <li>No custody of customer funds.</li>
        <li>No escrow execution in current MVP.</li>
        <li>No private-key storage.</li>
        <li>MVP results are early risk signals, not final fraud proof.</li>
      </ul>

      <p>Telegram bot is active once webhook is configured on deployment.</p>
    </main>
  );
}
