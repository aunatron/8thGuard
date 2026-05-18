export default function RiskDisclaimerPage() {
  return (
    <main>
      <h1>Risk Disclaimer</h1>
      <p>Effective date: May 13, 2026 | Last updated: May 16, 2026</p>

      <h2>What 8thGuard Provides</h2>
      <p>
        8thGuard provides early risk signals based on wallet address formats, transaction hash patterns,
        public-chain data, smart contract analysis, explorer links, third-party API data where
        available, and 8thGuard review records. These signals are intended to help users make more
        informed decisions before sending crypto funds.
      </p>

      <h2>What 8thGuard Does Not Prove</h2>
      <ul>
        <li>A low-risk result does not prove a wallet, transaction, agent, contract, token, group, or offer is safe.</li>
        <li>A high-caution result does not, by itself, prove someone is a scammer or that a contract is malicious.</li>
        <li>Explorer data, public APIs, and user-submitted reports can be delayed, incomplete, unavailable, or wrong.</li>
        <li>8thGuard is not financial, legal, investment, tax, or law-enforcement advice.</li>
        <li>8thGuard results are not certifications, endorsements, audits, or guarantees of any kind.</li>
      </ul>

      <h2>Data and API Limitations</h2>
      <p>
        8thGuard checks rely on public blockchain data, third-party APIs, automated pattern analysis,
        and external data providers. Results may be incomplete, delayed, or temporarily unavailable due
        to:
      </p>
      <ul>
        <li>API rate limits or quota exhaustion from third-party data providers.</li>
        <li>Blockchain network congestion, reorganizations, or delayed indexing.</li>
        <li>Third-party service outages or maintenance windows.</li>
        <li>Data gaps in coverage for specific chains, tokens, contracts, or address formats.</li>
        <li>Newly deployed contracts, recently created wallets, or emerging scam patterns not yet in any database.</li>
      </ul>
      <p>
        A delivered check reflects the data available at the time of the check. The same address or
        transaction checked at different times may produce different results as new data becomes
        available. 8thGuard does not guarantee the completeness, accuracy, or timeliness of any
        individual check.
      </p>

      <h2>Smart Contract and Token Limitations</h2>
      <p>
        Contract scans and token risk checks use automated static analysis and pattern matching. They
        do not replace a full professional smart contract audit. Automated analysis cannot detect all
        vulnerabilities, backdoors, or malicious patterns. Verified source code on a block explorer
        does not guarantee safety. Unverified contracts receive limited analysis.
      </p>

      <h2>User Decision Rule</h2>
      <p>
        If the payment is urgent, secretive, confusing, wrong-network, screenshot-only, or controlled
        by a stranger or random admin, pause before sending. Use independent verification, trusted
        channels, and your own judgment. 8thGuard is a tool to assist your decision — it is not a
        substitute for your decision.
      </p>

      <h2>No Guarantee of Safety</h2>
      <p>
        No automated or manual review service can guarantee the safety of a crypto transaction,
        wallet, agent, or contract. The crypto ecosystem evolves rapidly, and new attack vectors,
        scam patterns, and exploits emerge constantly. Users must exercise their own caution and
        accept responsibility for their own transactions.
      </p>
    </main>
  );
}
