import { getSolanaTransactionExplorerLink, getTransactionExplorerLinks, type ExplorerLink } from "./wallet/explorers";
import { runWalletIntelligenceCheck, type WalletRiskResult } from "./wallet/realCheck";

export type RiskResult = {
  score: number;
  level: "Low" | "Medium" | "High" | "Unknown";
  reasons: string[];
  disclaimer: string;
};

export type TransactionRiskResult = RiskResult & {
  likelyNetworks: string[];
  liveDataUsed: boolean;
  explorerLinks: ExplorerLink[];
};

function levelFromScore(score: number): RiskResult["level"] {
  if (score >= 70) return "High";
  if (score >= 35) return "Medium";
  if (score >= 0) return "Low";
  return "Unknown";
}

export async function checkWalletRisk(address: string): Promise<WalletRiskResult> {
  return runWalletIntelligenceCheck(address);
}

export function checkTransactionRisk(hash: string): TransactionRiskResult {
  const trimmed = hash.trim();
  const hex64 = /^(0x)?[a-fA-F0-9]{64}$/.test(trimmed);
  const solanaLike = /^[1-9A-HJ-NP-Za-km-z]{80,100}$/.test(trimmed);
  const score = hex64 || solanaLike ? 45 : 68;
  const explorerLinks = solanaLike ? [getSolanaTransactionExplorerLink(trimmed)] : hex64 ? getTransactionExplorerLinks(trimmed) : [];

  return {
    score,
    level: levelFromScore(score),
    reasons: [
      hex64 ? "64-character hex transaction hash detected" : solanaLike ? "Solana signature-like format detected" : "Transaction hash shape appears unusual",
      "Explorer links are provided where the format is recognized",
      "Use the matching explorer to confirm amount, recipient, token, and timestamp"
    ],
    likelyNetworks: hex64 ? ["Ethereum/EVM", "Bitcoin", "XRPL"] : solanaLike ? ["Solana"] : ["Unknown"],
    liveDataUsed: false,
    explorerLinks,
    disclaimer: "This is not final fraud proof."
  };
}

export function checkAgentRisk(agent: string): RiskResult {
  const cleaned = agent.trim().toLowerCase();
  const suspicious = /(admin|support|guarantee|fast)/.test(cleaned);
  const score = suspicious ? 72 : 38;
  return {
    score,
    level: levelFromScore(score),
    reasons: [
      suspicious ? "Name contains high-impersonation keywords" : "No obvious impersonation keyword pattern",
      "Confirm identity, payment terms, and community references before sending funds"
    ],
    disclaimer: "This is not final fraud proof."
  };
}
