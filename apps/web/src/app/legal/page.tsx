const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service", note: "Use rules, service boundaries, and liability limits." },
  { href: "/legal/privacy", label: "Privacy Policy", note: "How 8thGuard handles account, report, payment, and technical data." },
  { href: "/legal/risk-disclaimer", label: "Risk Disclaimer", note: "What 8thGuard checks can and cannot prove." },
  { href: "/legal/payment-policy", label: "Payment Policy", note: "Paystack and crypto service-payment rules." },
  { href: "/legal/refund-policy", label: "Refund Policy", note: "Review-service refund and cancellation rules." }
];

export default function LegalIndexPage() {
  return (
    <main>
      <h1>8thGuard Legal Center</h1>
      <p>
        Clear operating rules for a global crypto safety service built with local payment realities in mind.
        These policies protect users, protect the 8thGuard service, and keep the product inside its stated
        boundaries: no escrow, no custody, no exchange, and no trading.
      </p>

      <ul>
        {legalLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a> - {link.note}
          </li>
        ))}
      </ul>

      <p>
        These documents are operational templates and should be reviewed by qualified counsel before heavy
        commercial scale or jurisdiction-specific launches.
      </p>
    </main>
  );
}
