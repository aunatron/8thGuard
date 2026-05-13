export default function PaymentPolicyPage() {
  return (
    <main>
      <h1>Payment Policy</h1>
      <p>Effective date: May 13, 2026</p>

      <h2>Service Payments Only</h2>
      <p>
        Paystack and official crypto wallet payments are accepted only for 8thGuard digital review services.
        They are not deposits, investments, exchange trades, escrow transfers, custody transfers, or
        user-to-user settlements.
      </p>

      <h2>Paystack and Local Rails</h2>
      <p>
        Paystack may support local rails such as card, bank transfer, Mobile Money, and other methods
        depending on region and availability. USD is the reference price; checkout rails may convert to
        local currency.
      </p>

      <h2>Crypto Payments</h2>
      <p>
        Crypto payments must be sent only to official 8thGuard addresses published through the bot or
        website. Users must confirm the exact network, token, amount, memo, and destination tag where
        applicable. Wrong-network payments may be unrecoverable.
      </p>

      <h2>Verification</h2>
      <p>
        Users may be asked to provide a Paystack reference, crypto transaction hash, selected product,
        Telegram contact, and review context. 8thGuard may delay fulfillment until a payment can be
        reasonably matched.
      </p>

      <h2>Payment Safety</h2>
      <ul>
        <li>Do not pay random admins.</li>
        <li>Do not trust screenshots alone.</li>
        <li>Do not send seed phrases or private keys.</li>
        <li>Use only official 8thGuard payment instructions.</li>
      </ul>
    </main>
  );
}
