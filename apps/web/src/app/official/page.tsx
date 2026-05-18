import type { Metadata } from "next";
import Link from "next/link";
import { getOfficialChannels } from "@/lib/official-channels";

export const metadata: Metadata = {
  title: "Official 8thGuard Channels",
  description: "Verify the official 8thGuard website, Telegram bot, WhatsApp channel, and payment safety rules."
};

function statusLabel(status: "active" | "preparing" | "backup"): string {
  if (status === "active") return "Active";
  if (status === "backup") return "Backup";
  return "Preparing";
}

export default function OfficialChannelsPage() {
  const channels = getOfficialChannels();

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Official Channels</p>
        <h1>Verify 8thGuard before you pay or submit a review.</h1>
        <p>
          Use this page to confirm the current official website, Telegram bot, WhatsApp channel, and safety boundaries.
        </p>
      </section>

      <section className="section-band">
        <div className="official-grid">
          {channels.map((channel) => (
            <article className="official-card" key={channel.label}>
              <div className="official-card-head">
                <p className="eyebrow">{statusLabel(channel.status)}</p>
                <h2>{channel.label}</h2>
              </div>
              {channel.href ? (
                <a className="official-value" href={channel.href}>{channel.value}</a>
              ) : (
                <p className="official-value">{channel.value}</p>
              )}
              <p>{channel.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <div>
          <p className="eyebrow">Payment Safety</p>
          <h2>Only trust channels listed here.</h2>
        </div>
        <ul>
          <li>Never pay random admins or impersonators.</li>
          <li>Only use official payment links or wallet addresses published by 8thGuard.</li>
          <li>8thGuard does not provide exchange, custody, escrow, trading, or user-to-user settlement.</li>
          <li>Reviews provide early risk signals and wallet intelligence where applicable, not final fraud proof.</li>
        </ul>
      </section>

      <section className="miniapp-section">
        <p className="eyebrow">Next Step</p>
        <h2>Start through an official channel.</h2>
        <p>
          If a bot, number, group, or payment instruction is not listed here, treat it as unverified until 8thGuard updates this page.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/pay">View Paid Services</Link>
          <Link className="button secondary dark" href="/legal/payment-policy">Payment Policy</Link>
        </div>
      </section>
    </main>
  );
}
