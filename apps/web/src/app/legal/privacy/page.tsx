export default function PrivacyPage() {
  return (
    <main>
      <h1>Privacy Policy</h1>
      <p>Effective date: May 13, 2026</p>

      <h2>1. What We Collect</h2>
      <ul>
        <li>Telegram identifiers and command metadata needed to operate the bot.</li>
        <li>Wallet addresses, transaction hashes, P2P usernames, and short context submitted for review.</li>
        <li>Payment references or crypto transaction hashes submitted for service-payment verification.</li>
        <li>Technical logs, timestamps, audit events, and abuse-prevention signals.</li>
      </ul>

      <h2>2. What We Do Not Want</h2>
      <p>
        Do not send seed phrases, private keys, passwords, wallet login credentials, bank credentials, or
        unnecessary identity documents through Telegram. 8thGuard is designed to minimize sensitive data.
      </p>

      <h2>3. How We Use Information</h2>
      <ul>
        <li>Operate wallet, transaction, agent, and scam-report review services.</li>
        <li>Verify service payments and manage review requests.</li>
        <li>Improve fraud intelligence, abuse prevention, and safety guidance.</li>
        <li>Maintain audit logs, security controls, and legal compliance records.</li>
      </ul>

      <h2>4. Sharing</h2>
      <p>
        8thGuard does not sell raw private user data. Information may be shared with service providers,
        payment processors, infrastructure providers, legal advisors, or authorities where required by law,
        needed to provide the service, or necessary to protect users and the platform.
      </p>

      <h2>5. Data Rights</h2>
      <p>
        Depending on location, users may have rights to access, correct, delete, restrict, or object to
        certain processing of personal information. Requests can be sent through the official contact
        published by 8thGuard.
      </p>

      <h2>6. Retention</h2>
      <p>
        8thGuard keeps data only as long as needed for service delivery, audit, payment, abuse-prevention,
        legal, and safety-intelligence purposes. Some records may be anonymized or aggregated.
      </p>

      <h2>7. Security</h2>
      <p>
        8thGuard uses environment-based secrets, webhook validation, structured audit logs, data minimization,
        and operational controls. No internet service can guarantee perfect security.
      </p>
    </main>
  );
}
