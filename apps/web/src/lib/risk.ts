export type RiskResult = {
  score: number;
  level: "Low" | "Medium" | "High" | "Unknown";
  reasons: string[];
  disclaimer: string;
};

function levelFromScore(score: number): RiskResult["level"] {
  if (score >= 70) return "High";
  if (score >= 35) return "Medium";
  if (score >= 0) return "Low";
  return "Unknown";
}

export function checkWalletRisk(address: string): RiskResult {
  const trimmed = address.trim();
  const looksHex = /^(0x)?[a-fA-F0-9]{30,80}$/.test(trimmed);
  const score = looksHex ? 42 : 64;
  return {
    score,
    level: levelFromScore(score),
    reasons: [
      looksHex ? "Address format detected" : "Address format not recognized confidently",
      "No live intelligence source connected yet"
    ],
    disclaimer: "MVP result only. This is not final fraud proof."
  };
}

export function checkTransactionRisk(hash: string): RiskResult {
  const trimmed = hash.trim();
  const looksTx = /^(0x)?[a-fA-F0-9]{40,100}$/.test(trimmed);
  const score = looksTx ? 48 : 68;
  return {
    score,
    level: levelFromScore(score),
    reasons: [
      looksTx ? "Transaction hash format detected" : "Transaction hash shape appears unusual",
      "Live blockchain lookup not connected in this MVP"
    ],
    disclaimer: "MVP result only. Live chain data integration is pending."
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
      "Verified agent registry integration is coming soon"
    ],
    disclaimer: "MVP result only. Registry verification is not active yet."
  };
}
