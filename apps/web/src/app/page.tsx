export default function HomePage() {
  return (
    <main>
      <h1>8thGuard</h1>
      <p>
        Ghana-first crypto P2P protection platform for safer wallet checks, transaction checks,
        and agent checks before you send money.
      </p>

      <h2>What we do in this MVP</h2>
      <ul>
        <li>Telegram bot for basic risk checks and safety guidance.</li>
        <li>Wallet and transaction screening with explainable placeholder scoring.</li>
        <li>Agent verification workflow foundation and scam report preparation guidance.</li>
      </ul>

      <h2>Safety boundaries</h2>
      <ul>
        <li>No custody of customer funds.</li>
        <li>No escrow execution in current MVP.</li>
        <li>No private-key storage.</li>
      </ul>

      <p>Telegram bot is active once webhook is configured on deployment.</p>
    </main>
  );
}
