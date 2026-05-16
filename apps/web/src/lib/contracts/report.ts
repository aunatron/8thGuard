import { formatGlobalPrice, PRODUCT_BY_ID } from "../payments/products";
import type { ContractAnalysisResult } from "./analyze";

function signalLines(result: ContractAnalysisResult): string[] {
  if (result.quickSignals.length === 0) return ["• No major static pattern surfaced in the preview."];
  return result.quickSignals.slice(0, 4).map((signal) => `• ${signal.label}`);
}

function explorerLines(result: ContractAnalysisResult): string[] {
  if (result.explorerLinks.length === 0) return ["Explorer: unavailable for this format"];
  return result.explorerLinks.slice(0, 2).map((link) => `Explorer: ${link.label} - ${link.url}`);
}

export function formatContractPreview(result: ContractAnalysisResult): string {
  return [
    "8thGuard Contract Preview",
    "",
    `Chain: ${result.chain}`,
    `Risk: ${result.riskLevel} — ${result.riskScore}/100`,
    `Source: ${result.sourceAvailability}`,
    "",
    "Signals:",
    ...signalLines(result),
    "",
    ...explorerLines(result),
    "",
    "Next:",
    "For full contract risk report, use /contract_pricing.",
    "",
    result.disclaimer
  ].join("\n");
}

export function formatGroupContractPreview(result: ContractAnalysisResult): string {
  return [
    "⚠️ 8thGuard Contract Preview",
    `Chain: ${result.chain}`,
    `Risk: ${result.riskLevel} — ${result.riskScore}/100`,
    "",
    "Full paid report: DM the bot.",
    "Not a full audit."
  ].join("\n");
}

export function formatContractPricing(): string {
  const ids = [
    "quick_contract_scan",
    "token_contract_risk_scan",
    "approval_risk_check",
    "deep_contract_review",
    "developer_prelaunch_scan"
  ] as const;

  return [
    "8thGuard Contract Risk Reports",
    "",
    "Automated risk preview first. Paid reports for deeper contract red-flag review.",
    "",
    ...ids.map((id) => `${PRODUCT_BY_ID[id].name} — ${formatGlobalPrice(PRODUCT_BY_ID[id])}\n${PRODUCT_BY_ID[id].description}`),
    "",
    "Use /scan_contract <chain> <contract_address>, /scan_token <chain> <token_address>, or /approval_check <chain> <spender_contract>.",
    "",
    "Early contract risk signals only. Not a full audit."
  ].join("\n");
}
