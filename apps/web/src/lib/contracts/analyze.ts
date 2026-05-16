import { getDataSourceConfig } from "../payments/config";
import { detectContractTarget, type ContractChain } from "./detect";
import { scanContractSource, UNVERIFIED_SOURCE_SIGNAL, type ContractRiskSignal } from "./patterns";

export type ContractScanMode = "contract" | "token" | "approval";
export type ContractSourceAvailability = "Verified" | "Unverified" | "Unknown";
export type ContractRiskLevel = "Low" | "Medium" | "High" | "Critical";

export type ContractAnalysisInput = {
  chain?: string;
  address?: string;
  sourceCode?: string;
  mode?: ContractScanMode;
};

export type ContractAnalysisResult = {
  mode: ContractScanMode;
  chain: ContractChain;
  inputChain: string;
  address: string;
  isValidAddress: boolean;
  possibleChains: ContractChain[];
  sourceAvailability: ContractSourceAvailability;
  sourceLookupConfigured: boolean;
  riskScore: number;
  riskLevel: ContractRiskLevel;
  signals: ContractRiskSignal[];
  quickSignals: ContractRiskSignal[];
  explorerLinks: { label: string; url: string }[];
  disclaimer: string;
};

const CONTRACT_DISCLAIMER = "MVP result. Early contract risk signals only, not a full audit.";

function hasConfiguredSourceLookup(chain: ContractChain): boolean {
  const config = getDataSourceConfig();
  if (chain === "ethereum" || chain === "base" || chain === "bsc" || chain === "polygon" || chain === "arbitrum" || chain === "optimism" || chain === "avalanche" || chain === "evm") {
    return Boolean(config.etherscanApiKey);
  }
  return false;
}

function scoreToLevel(score: number): ContractRiskLevel {
  if (score >= 80) return "Critical";
  if (score >= 55) return "High";
  if (score >= 30) return "Medium";
  return "Low";
}

function uniqueSignals(signals: ContractRiskSignal[]): ContractRiskSignal[] {
  const seen = new Set<string>();
  return signals.filter((signal) => {
    if (seen.has(signal.id)) return false;
    seen.add(signal.id);
    return true;
  });
}

function modeSignals(mode: ContractScanMode): ContractRiskSignal[] {
  if (mode === "approval") {
    return [
      {
        id: "approval_spender_danger",
        label: "Approval checks should confirm spender purpose, allowance size, and revocation path before signing.",
        severity: "medium",
        score: 12
      }
    ];
  }
  if (mode === "token") {
    return [
      {
        id: "transfer_restriction",
        label: "Token review should check blacklist, mint, tax, pause, and transfer restriction controls.",
        severity: "medium",
        score: 10
      }
    ];
  }
  return [];
}

export async function analyzeContract(input: ContractAnalysisInput): Promise<ContractAnalysisResult> {
  const mode = input.mode || "contract";
  const detection = detectContractTarget(input.chain, input.address);
  const source = input.sourceCode?.trim();
  const sourceLookupConfigured = hasConfiguredSourceLookup(detection.chain);
  const sourceAvailability: ContractSourceAvailability = source ? "Verified" : sourceLookupConfigured ? "Unknown" : "Unverified";
  const staticSignals = source ? scanContractSource(source) : [UNVERIFIED_SOURCE_SIGNAL];
  const invalidAddressSignals: ContractRiskSignal[] = detection.isEvmAddress
    ? []
    : [
        {
          id: "suspicious_function_name",
          label: "Address format could not be validated as an EVM contract address.",
          severity: "high",
          score: 22
        }
      ];
  const signals = uniqueSignals([...invalidAddressSignals, ...modeSignals(mode), ...staticSignals]);
  const riskScore = Math.min(100, signals.reduce((total, signal) => total + signal.score, detection.isKnownChain ? 0 : 8));

  return {
    mode,
    chain: detection.chain,
    inputChain: detection.inputChain,
    address: detection.normalizedAddress,
    isValidAddress: detection.isEvmAddress,
    possibleChains: detection.possibleChains,
    sourceAvailability,
    sourceLookupConfigured,
    riskScore,
    riskLevel: scoreToLevel(riskScore),
    signals,
    quickSignals: signals.slice(0, 4),
    explorerLinks: detection.explorerLinks,
    disclaimer: CONTRACT_DISCLAIMER
  };
}
