import { Metadata } from "next";
import Link from "next/link";
import { checkWalletRisk } from "@/lib/risk";
import { detectWalletAddress } from "@/lib/wallet/detect";
import { PRODUCTS, formatGlobalPrice } from "@/lib/payments/products";
import { getOfficialTelegramUrl, getTelegramBotUsername } from "@/lib/official-channels";

type Props = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const decoded = decodeURIComponent(address);
  const detection = detectWalletAddress(decoded);
  const chain = detection.isValidFormat ? detection.detectedChain : "Unknown";

  return {
    title: `${decoded} — Wallet Risk Check`,
    description: `8thGuard risk check for ${chain} wallet ${decoded}. Get instant risk signals and multi-chain intelligence before sending crypto.`,
    openGraph: {
      title: `${chain} Wallet Risk Check — 8thGuard`,
      description: `Risk check for wallet ${decoded.slice(0, 12)}... on ${chain}. Check before you send.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function riskColor(level: string): string {
  if (level === "High") return "#ef4444";
  if (level === "Medium") return "#f59e0b";
  if (level === "Low") return "#22c55e";
  return "#6b7280";
}

function riskEmoji(level: string): string {
  if (level === "High") return "🔴";
  if (level === "Medium") return "🟡";
  if (level === "Low") return "🟢";
  return "⚪";
}

export default async function CheckPage({ params }: Props) {
  const { address } = await params;
  const decoded = decodeURIComponent(address);
  const risk = await checkWalletRisk(decoded);
  const officialTelegram = getOfficialTelegramUrl();
  const telegramUsername = getTelegramBotUsername();

  const quickProducts = PRODUCTS.filter((p) => p.tier === "quick");
  const premiumProducts = PRODUCTS.filter((p) => p.tier === "premium");

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}>
          ← 8thGuard Home
        </Link>
      </div>

      {/* Risk Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          borderRadius: 16,
          padding: "2rem",
          color: "#fff",
          marginBottom: "2rem",
          border: `2px solid ${riskColor(risk.level)}40`,
        }}
      >
        <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: "0.5rem" }}>
          🛡 8thGuard Quick Check
        </p>

        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, wordBreak: "break-all", marginBottom: "1.5rem", lineHeight: 1.4 }}>
          {decoded}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase" }}>Network</p>
            <p style={{ fontSize: "1rem", fontWeight: 600 }}>{risk.detectedChain}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase" }}>Risk</p>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: riskColor(risk.level) }}>
              {riskEmoji(risk.level)} {risk.level}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase" }}>Score</p>
            <p style={{ fontSize: "1rem", fontWeight: 600 }}>{risk.score}/100</p>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ background: "#0f172a", borderRadius: 8, height: 8, marginBottom: "1.5rem", overflow: "hidden" }}>
          <div
            style={{
              width: `${risk.score}%`,
              height: "100%",
              background: riskColor(risk.level),
              borderRadius: 8,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Signals (max 3) */}
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Signals</p>
          {risk.reasons.slice(0, 3).map((reason, i) => (
            <p key={i} style={{ fontSize: "0.875rem", color: "#e2e8f0", marginBottom: "0.25rem" }}>
              • {reason}
            </p>
          ))}
        </div>

        {/* Explorer link (1 only) */}
        {risk.explorerLinks.length > 0 && (
          <a
            href={risk.explorerLinks[0].url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#a78bfa", fontSize: "0.8rem", textDecoration: "none" }}
          >
            🔗 View on {risk.explorerLinks[0].label} →
          </a>
        )}
      </div>

      {/* Paywall CTA */}
      <div
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
          borderRadius: 16,
          padding: "2rem",
          color: "#fff",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Want the full report?
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#e0e7ff", marginBottom: "1.5rem" }}>
          Premium reports include deeper signals, source breakdown, explorer evidence, transaction patterns, and community report cross-reference.
        </p>
        <a
          href="/pay"
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#4f46e5",
            fontWeight: 700,
            padding: "0.75rem 2rem",
            borderRadius: 10,
            textDecoration: "none",
            fontSize: "1rem",
          }}
        >
          Get Full Report →
        </a>
      </div>

      {/* Quick pricing */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#1e293b" }}>Quick Checks</h3>
        {quickProducts.map((p) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.875rem" }}>{p.name}</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{formatGlobalPrice(p)}</span>
          </div>
        ))}

        <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "1.5rem 0 1rem", color: "#1e293b" }}>Premium Reviews</h3>
        {premiumProducts.map((p) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.875rem" }}>{p.name}</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{formatGlobalPrice(p)}</span>
          </div>
        ))}
      </div>

      {/* Telegram CTA */}
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 12,
          padding: "1.5rem",
          textAlign: "center",
          marginBottom: "2rem",
          border: "1px solid #e2e8f0",
        }}
      >
        <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          💬 Use our Telegram bot for instant checks
        </p>
        <a
          href={officialTelegram}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#0088cc",
            color: "#fff",
            fontWeight: 600,
            padding: "0.6rem 1.5rem",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          Open @{telegramUsername} →
        </a>
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
        🛡 8thGuard provides early risk signals, not final fraud proof. This is a preview. Full reports are paid services.
      </p>
    </main>
  );
}
