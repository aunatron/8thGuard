/**
 * Wave 5: Premium Result Report Templates
 *
 * Structured premium report formatters for paid review results.
 * Each report includes:
 *   - risk level
 *   - risk indicators
 *   - network context
 *   - recommended action
 *   - limits / disclaimer
 *   - 8thGuard branding
 *
 * These formatters are additive — they do not replace or modify the
 * existing quick-preview formatting in telegram.ts. They are designed
 * to be called when a paid entitlement is confirmed.
 */

import type { WalletRiskResult } from "./wallet/realCheck";
import type { TransactionRiskResult, RiskResult } from "./risk";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const BRAND_HEADER = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
const BRAND_FOOTER = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

function brandLine(): string {
  return "🛡 8thGuard — Check before you send.";
}

function timestampLine(): string {
  return `Report generated: ${new Date().toISOString()}`;
}

function riskBadge(level: string, score: number): string {
  const icons: Record<string, string> = {
    High: "🔴",
    Medium: "🟡",
    Low: "🟢",
    Unknown: "⚪",
  };
  const icon = icons[level] ?? "⚪";
  return `${icon} Risk Level: ${level} (${score}/100)`;
}

function formatIndicators(reasons: string[]): string[] {
  return reasons.map((r) => `  • ${r}`);
}

function confidenceLabel(score: number): string {
  if (score >= 70) return "High caution";
  if (score >= 50) return "Elevated caution";
  if (score >= 35) return "Watchlist review";
  return "Lower immediate risk";
}

function recommendedAction(score: number): string {
  if (score >= 70)
    return "⛔ Pause before sending. Request a detailed manual review before moving funds.";
  if (score >= 50)
    return "⚠️ Proceed carefully. Verify counterparty, network, token, and payment context.";
  if (score >= 35)
    return "ℹ️ No severe automated signal surfaced, but verify all details before sending.";
  return "✅ Lower immediate risk surfaced. Maintain standard transaction hygiene.";
}

function limitsDisclaimer(): string[] {
  return [
    "Limits & Disclaimer:",
    "  • This report reflects automated and semi-automated analysis at the time of generation.",
    "  • Results are early risk signals, not final fraud proof.",
    "  • 8thGuard does not guarantee the safety or legitimacy of any wallet, transaction, agent, or counterparty.",
    "  • Network data availability, API coverage, and chain-specific limitations may affect results.",
    "  • Always verify independently before sending funds.",
  ];
}

function coverageLabel(liveDataUsed: boolean, sources: string[]): string {
  if (liveDataUsed || sources.length > 0) return "Enhanced (live data)";
  return "Standard (pattern analysis)";
}

// ---------------------------------------------------------------------------
// 1. Wallet Intelligence Report
// ---------------------------------------------------------------------------

export type WalletIntelligenceReportInput = {
  address: string;
  result: WalletRiskResult;
  sessionId?: string;
};

export function formatWalletIntelligenceReport(
  input: WalletIntelligenceReportInput
): string {
  const { address, result, sessionId } = input;
  const lines: string[] = [
    BRAND_HEADER,
    "🛡 8thGuard Wallet Intelligence Report",
    BRAND_FOOTER,
    "",
    `Address: ${address}`,
    `Network: ${result.detectedChain}${result.possibleNetworks.length > 1 ? ` (${result.possibleNetworks.join(", ")})` : ""}`,
    `Coverage: ${coverageLabel(result.liveDataUsed, result.sources)}`,
    ...(result.sources.length > 0
      ? [`Sources: ${result.sources.join(", ")}`]
      : []),
    ...(sessionId ? [`Session: ${sessionId}`] : []),
    "",
    riskBadge(result.level, result.score),
    `Assessment: ${confidenceLabel(result.score)}`,
    "",
    "Risk Indicators:",
    ...formatIndicators(result.reasons),
    "",
    "Network Context:",
    `  • Detected chain: ${result.detectedChain}`,
    `  • Possible networks: ${result.possibleNetworks.join(", ")}`,
    `  • Explorer views: ${result.explorerLinks.length} available`,
    ...(result.explorerLinks.length > 0
      ? result.explorerLinks
          .slice(0, 4)
          .map((link) => `    → ${link.label}: ${link.url}`)
      : []),
    "",
    "Recommended Action:",
    recommendedAction(result.score),
    "",
    ...limitsDisclaimer(),
    "",
    timestampLine(),
    brandLine(),
  ];

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// 2. Transaction Review Report
// ---------------------------------------------------------------------------

export type TransactionReviewReportInput = {
  hash: string;
  result: TransactionRiskResult;
  sessionId?: string;
};

export function formatTransactionReviewReport(
  input: TransactionReviewReportInput
): string {
  const { hash, result, sessionId } = input;
  const lines: string[] = [
    BRAND_HEADER,
    "🛡 8thGuard Transaction Review Report",
    BRAND_FOOTER,
    "",
    `Transaction Hash: ${hash}`,
    `Network Family: ${result.likelyNetworks.join(", ")}`,
    `Live Data: ${result.liveDataUsed ? "Yes" : "Pattern analysis only"}`,
    ...(sessionId ? [`Session: ${sessionId}`] : []),
    "",
    riskBadge(result.level, result.score),
    `Assessment: ${confidenceLabel(result.score)}`,
    "",
    "Risk Indicators:",
    ...formatIndicators(result.reasons),
    "",
    "Network Context:",
    `  • Likely networks: ${result.likelyNetworks.join(", ")}`,
    `  • Explorer views: ${result.explorerLinks.length} available`,
    ...(result.explorerLinks.length > 0
      ? result.explorerLinks
          .slice(0, 4)
          .map((link) => `    → ${link.label}: ${link.url}`)
      : []),
    "",
    "Recommended Action:",
    recommendedAction(result.score),
    "",
    ...limitsDisclaimer(),
    "",
    timestampLine(),
    brandLine(),
  ];

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// 3. Agent Risk Review Report
// ---------------------------------------------------------------------------

export type AgentRiskReviewReportInput = {
  agent: string;
  result: RiskResult;
  sessionId?: string;
};

export function formatAgentRiskReviewReport(
  input: AgentRiskReviewReportInput
): string {
  const { agent, result, sessionId } = input;
  const lines: string[] = [
    BRAND_HEADER,
    "🛡 8thGuard Agent Risk Review Report",
    BRAND_FOOTER,
    "",
    `Agent: ${agent}`,
    ...(sessionId ? [`Session: ${sessionId}`] : []),
    "",
    riskBadge(result.level, result.score),
    `Assessment: ${confidenceLabel(result.score)}`,
    "",
    "Risk Indicators:",
    ...formatIndicators(result.reasons),
    "",
    "Network Context:",
    "  • Agent identity patterns are evaluated against known impersonation and social-engineering indicators.",
    "  • No verified adverse community report is included in this automated check.",
    "  • Confirm identity, payment terms, and community references before sending funds.",
    "",
    "Recommended Action:",
    recommendedAction(result.score),
    "",
    ...limitsDisclaimer(),
    "",
    timestampLine(),
    brandLine(),
  ];

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// 4. Priority Scam Report Review
// ---------------------------------------------------------------------------

export type ScamReportReviewInput = {
  /** Free-text summary of the scam report evidence provided by the user. */
  evidenceSummary: string;
  /** Optional wallet address associated with the report. */
  walletAddress?: string;
  /** Optional transaction hash associated with the report. */
  transactionHash?: string;
  /** Optional agent name or username associated with the report. */
  agentName?: string;
  /** Risk result from any automated checks run against the evidence. */
  result: RiskResult;
  sessionId?: string;
};

export function formatScamReportReviewReport(
  input: ScamReportReviewInput
): string {
  const {
    evidenceSummary,
    walletAddress,
    transactionHash,
    agentName,
    result,
    sessionId,
  } = input;

  const evidenceLines: string[] = [];
  if (walletAddress) evidenceLines.push(`  • Wallet: ${walletAddress}`);
  if (transactionHash)
    evidenceLines.push(`  • Transaction: ${transactionHash}`);
  if (agentName) evidenceLines.push(`  • Agent: ${agentName}`);
  evidenceLines.push(`  • Summary: ${evidenceSummary}`);

  const lines: string[] = [
    BRAND_HEADER,
    "🛡 8thGuard Priority Scam Report Review",
    BRAND_FOOTER,
    "",
    "Evidence Submitted:",
    ...evidenceLines,
    ...(sessionId ? ["", `Session: ${sessionId}`] : []),
    "",
    riskBadge(result.level, result.score),
    `Assessment: ${confidenceLabel(result.score)}`,
    "",
    "Risk Indicators:",
    ...formatIndicators(result.reasons),
    "",
    "Network Context:",
    "  • Evidence is reviewed against known scam patterns, wallet age, transaction flow, and agent impersonation signals.",
    "  • Community and on-chain signals are cross-referenced where available.",
    "  • This review does not constitute legal advice or a formal investigation.",
    "",
    "Recommended Action:",
    recommendedAction(result.score),
    "",
    ...limitsDisclaimer(),
    "",
    "Next Steps:",
    "  • Preserve all original screenshots, transaction links, chat logs, and wallet addresses.",
    "  • Do not send additional funds to the reported address or agent.",
    "  • If relevant, file a report with local authorities and the platform where the interaction occurred.",
    "",
    timestampLine(),
    brandLine(),
  ];

  return lines.join("\n");
}
