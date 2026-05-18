export default function PaymentPolicyPage() {
  return (
    <main>
      <h1>Payment Policy</h1>
      <p>Effective date: May 13, 2026 | Last updated: May 16, 2026</p>

      <h2>Service Payments Only</h2>
      <p>
        Stripe/Polar, Paystack/Others, and official crypto wallet payments are accepted only for
        8thGuard digital review services. They are not deposits, investments, exchange trades, escrow
        transfers, custody transfers, or user-to-user settlements. USD is the reference price for all
        services. Checkout rails may convert to local currency depending on your region and payment
        method.
      </p>

      <h2>Payment Methods</h2>

      <h3>Stripe and Polar</h3>
      <p>
        Stripe and Polar process USD payments via card, bank transfer, and other methods depending on
        availability. Checkout is handled on Stripe/Polar hosted pages. 8thGuard does not store card
        numbers or bank details.
      </p>

      <h3>Paystack and Others</h3>
      <p>
        Paystack may support card, bank transfer, Mobile Money, USSD, and other local methods
        depending on region and availability. Checkout is handled on Paystack hosted pages. 8thGuard
        does not store card numbers or bank details.
      </p>

      <h3>Crypto Payments</h3>
      <p>
        Crypto payments must be sent only to official 8thGuard addresses published through the bot or
        website. Users must confirm the exact network, token, amount, memo, and destination tag where
        applicable before sending. Wrong-network payments may be permanently unrecoverable. 8thGuard
        is not responsible for crypto sent to incorrect addresses, incorrect networks, or with missing
        memos or destination tags.
      </p>

      <h2>Verification and Fulfillment</h2>
      <p>
        Users may be asked to provide a Stripe/Polar order reference, Paystack reference, crypto
        transaction hash, selected product, session ID, Telegram or WhatsApp contact, and review
        context. 8thGuard may delay fulfillment until a payment can be reasonably matched to a service
        request. Fulfillment begins after payment confirmation and may be immediate for automated
        checks or within a reasonable period for manual reviews.
      </p>

      <h2>Data and API Limitations</h2>
      <p>
        8thGuard checks rely on public blockchain data, third-party APIs, and automated analysis.
        Results may be incomplete, delayed, or temporarily unavailable due to API rate limits,
        blockchain network congestion, third-party outages, or data gaps. A delivered check reflects
        the data available at the time of the check. 8thGuard does not guarantee the completeness of
        any individual check. Where a check is materially incomplete due to data unavailability, the
        report will indicate which data sources were unavailable.
      </p>

      <h2>Immediate Delivery and Consent</h2>
      <p>
        Quick checks and automated reviews are designed for immediate delivery upon payment
        confirmation. By purchasing these services, you consent to immediate performance and
        acknowledge that once the check result is delivered, the digital service is considered fully
        performed. For manual reviews that require a longer review period, delivery timelines are
        communicated through the platform where the service was requested.
      </p>

      <h2>Payment Safety</h2>
      <ul>
        <li>Do not pay random admins or individuals claiming to represent 8thGuard.</li>
        <li>Do not trust payment screenshots alone as proof of payment.</li>
        <li>Do not send seed phrases, private keys, or wallet credentials to anyone.</li>
        <li>Use only official 8thGuard payment instructions from the bot or website.</li>
        <li>Always verify the payment address, network, and amount before sending crypto.</li>
        <li>8thGuard will never contact you first to request payment outside the official service flow.</li>
      </ul>
    </main>
  );
}
