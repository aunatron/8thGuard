export default function PrivacyPage() {
  return (
    <main>
      <h1>Privacy Policy</h1>
      <p>Effective date: May 13, 2026 | Last updated: May 16, 2026</p>

      <h2>1. Who We Are</h2>
      <p>
        8thGuard is a crypto safety intelligence service. This Privacy Policy explains how 8thGuard
        collects, uses, stores, and protects information across all platforms where the service
        operates, including Telegram bots, WhatsApp bots, web applications, and any future channels.
      </p>

      <h2>2. What We Collect</h2>

      <h3>2.1 Across All Platforms</h3>
      <ul>
        <li>Wallet addresses, transaction hashes, contract addresses, P2P usernames, and short context submitted for review.</li>
        <li>Payment references, crypto transaction hashes, and session IDs submitted for service-payment verification.</li>
        <li>Technical logs, timestamps, audit events, risk check results, and abuse-prevention signals.</li>
        <li>Service usage data including commands used, features accessed, and platform identifiers.</li>
      </ul>

      <h3>2.2 Telegram</h3>
      <ul>
        <li>Telegram user ID, username, first name, chat ID, and chat type (private or group).</li>
        <li>Command text and callback data sent to the bot.</li>
        <li>Group chat metadata when the bot is added to a group (group ID, chat type).</li>
      </ul>

      <h3>2.3 WhatsApp</h3>
      <ul>
        <li>Phone number associated with the WhatsApp account (required by the platform to operate).</li>
        <li>Display name and message content sent to the bot.</li>
        <li>Phone numbers are used only for service delivery and communication. They are not sold, shared for marketing, or used for purposes unrelated to the 8thGuard service.</li>
      </ul>

      <h3>2.4 Web Application</h3>
      <ul>
        <li>IP address, browser type, device type, and referral source for security, analytics, and abuse prevention.</li>
        <li>Session tokens or cookies necessary for authentication, payment processing, and service state.</li>
        <li>Form submissions including wallet addresses, payment references, review context, and contact information.</li>
        <li>Third-party cookies may be set by payment processors (such as Stripe or Paystack) during checkout. These are governed by the respective processor&apos;s privacy policy.</li>
      </ul>

      <h2>3. What We Do Not Want</h2>
      <p>
        Do not send seed phrases, private keys, passwords, wallet login credentials, bank credentials,
        government identity documents, or unnecessary personal information through any 8thGuard
        platform. 8thGuard is designed to minimize sensitive data collection. If sensitive data is
        submitted despite this warning, 8thGuard may delete it without notice.
      </p>

      <h2>4. How We Use Information</h2>
      <ul>
        <li>Operate wallet, transaction, contract, agent, and scam-report review services.</li>
        <li>Verify service payments and manage review requests across all supported payment rails.</li>
        <li>Deliver check results and paid reports to the correct user on the correct platform.</li>
        <li>Improve fraud intelligence, risk models, abuse prevention, and safety guidance.</li>
        <li>Maintain audit logs, security controls, and legal compliance records.</li>
        <li>Detect and prevent abuse, spam, and unauthorized use of the service.</li>
      </ul>

      <h2>5. Sharing</h2>
      <p>
        8thGuard does not sell raw private user data. Information may be shared with:
      </p>
      <ul>
        <li>Service providers and infrastructure partners necessary to operate the service (hosting, APIs, data providers).</li>
        <li>Payment processors (Stripe, Polar, Paystack) to process and verify service payments.</li>
        <li>Legal advisors, auditors, or authorities where required by law, court order, or regulatory obligation.</li>
        <li>Law enforcement where necessary to protect users, the platform, or public safety.</li>
      </ul>
      <p>
        Aggregated, anonymized, or de-identified data may be used for research, reporting, or product
        improvement without restriction.
      </p>

      <h2>6. Cross-Border Data</h2>
      <p>
        8thGuard is a global service. Data may be processed, stored, or transferred across jurisdictions
        including but not limited to Ghana, the United States, the European Economic Area, and other
        countries where our infrastructure and service providers operate. By using 8thGuard, you
        acknowledge and consent to this cross-border transfer. 8thGuard uses commercially reasonable
        measures to protect data during transfer and storage.
      </p>

      <h2>7. Data Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, restrict, export,
        or object to certain processing of your personal information. Users in the European Economic
        Area, United Kingdom, Ghana, and other jurisdictions with data protection laws may exercise
        these rights by contacting 8thGuard through the official contact published on the service.
        8thGuard will respond within a reasonable period and may request verification of identity before
        processing requests.
      </p>

      <h2>8. Retention</h2>
      <p>
        8thGuard keeps data only as long as needed for service delivery, payment verification, audit,
        abuse prevention, legal compliance, and safety intelligence purposes. Retention periods vary
        by data type: payment records and audit logs are retained longer than transient service logs.
        Some records may be anonymized or aggregated after the active retention period.
      </p>

      <h2>9. Children</h2>
      <p>
        8thGuard services are not directed at individuals under the age of 18. We do not knowingly
        collect personal information from children. If we become aware that personal information has
        been collected from a person under 18, we will take steps to delete it.
      </p>

      <h2>10. Cookies and Similar Technologies</h2>
      <p>
        The 8thGuard web application may use cookies, local storage, and similar technologies for
        authentication, session management, security, and basic analytics. Essential cookies are
        required for the service to function. Third-party cookies from payment processors and
        analytics providers may also be present and are governed by their respective privacy policies.
        You can manage cookie preferences through your browser settings, though disabling essential
        cookies may affect service functionality.
      </p>

      <h2>11. Security</h2>
      <p>
        8thGuard uses environment-based secrets, webhook validation, structured audit logs, data
        minimization, access controls, and operational security practices. No internet service can
        guarantee perfect security. If you believe your account or data has been compromised, contact
        8thGuard immediately through the official contact channel.
      </p>

      <h2>12. Changes</h2>
      <p>
        8thGuard may update this Privacy Policy as the service, platforms, and legal landscape evolve.
        Material changes will be communicated through the platforms where the service operates. The
        &quot;Last updated&quot; date at the top of this page reflects the most recent revision.
      </p>
    </main>
  );
}
