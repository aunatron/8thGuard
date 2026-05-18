const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service", note: "Use rules, service boundaries, eligibility, intellectual property, and liability limits." },
  { href: "/legal/privacy", label: "Privacy Policy", note: "How 8thGuard handles data across Telegram, WhatsApp, web, and all platforms." },
  { href: "/legal/risk-disclaimer", label: "Risk Disclaimer", note: "What 8thGuard checks can and cannot prove, including API and data limitations." },
  { href: "/legal/payment-policy", label: "Payment Policy", note: "Stripe/Polar, Paystack, and crypto service-payment rules, verification, and fulfillment." },
  { href: "/legal/refund-policy", label: "Refund Policy", note: "Digital service refund rules, chargeback handling, and cancellation process." }
];

export default function LegalIndexPage() {
  return (
    <main>
      <h1>8thGuard Legal Center</h1>
      <p>
        Clear operating rules for a global crypto safety service built with local payment realities
        in mind. These policies protect users, protect the 8thGuard service, and keep the product
        inside its stated boundaries: no escrow, no custody, no exchange, no trading, and no
        user-to-user settlement.
      </p>

      <ul>
        {legalLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a> — {link.note}
          </li>
        ))}
      </ul>

      <p>
        These documents apply to all 8thGuard services regardless of the platform used to access
        them, including Telegram bots, WhatsApp bots, web applications, and future channels.
      </p>

      <p>
        These documents are operational templates and should be reviewed by qualified counsel before
        heavy commercial scale or jurisdiction-specific launches. Last updated: May 16, 2026.
      </p>
    </main>
  );
}
