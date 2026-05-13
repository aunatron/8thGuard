export default function RiskDisclaimerPage() {
  return (
    <main>
      <h1>Risk Disclaimer</h1>
      <p>Effective date: May 13, 2026</p>

      <h2>What 8thGuard Provides</h2>
      <p>
        8thGuard provides early risk signals from user submissions, wallet formats, transaction hashes,
        explorer links, public-chain data where available, and 8thGuard review records.
      </p>

      <h2>What 8thGuard Does Not Prove</h2>
      <ul>
        <li>A low-risk result does not prove a wallet, transaction, agent, group, or offer is safe.</li>
        <li>A high-caution result does not, by itself, prove someone is a scammer.</li>
        <li>Explorer data, public APIs, and user-submitted reports can be delayed, incomplete, or wrong.</li>
        <li>8thGuard is not financial, legal, investment, tax, or law-enforcement advice.</li>
      </ul>

      <h2>User Decision Rule</h2>
      <p>
        If the payment is urgent, secretive, confusing, wrong-network, screenshot-only, or controlled by a
        stranger or random admin, pause before sending. Use independent verification and trusted channels.
      </p>
    </main>
  );
}
