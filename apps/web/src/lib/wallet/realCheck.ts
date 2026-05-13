import { detectWalletAddress, type WalletChain } from "./detect";
import { getWalletExplorerLinks, type ExplorerLink } from "./explorers";
import {
  fetchBitcoinAddress,
  fetchEthereumBalance,
  fetchSolanaBalance,
  fetchTonAccount,
  fetchTronAccount,
  fetchXrpAccount
} from "./sources";

export type WalletRiskLevel = "Low" | "Medium" | "High" | "Unknown";

export type WalletRiskResult = {
  score: number;
  level: WalletRiskLevel;
  detectedChain: WalletChain;
  possibleNetworks: string[];
  liveDataUsed: boolean;
  sources: string[];
  reasons: string[];
  explorerLinks: ExplorerLink[];
  disclaimer: string;
};

function levelFromScore(score: number): WalletRiskLevel {
  if (score >= 70) return "High";
  if (score >= 35) return "Medium";
  if (score >= 0) return "Low";
  return "Unknown";
}

function baseResult(address: string): WalletRiskResult {
  const detection = detectWalletAddress(address);
  return {
    score: detection.isValidFormat ? 45 : 70,
    level: detection.isValidFormat ? "Medium" : "Unknown",
    detectedChain: detection.detectedChain,
    possibleNetworks: detection.possibleNetworks,
    liveDataUsed: false,
    sources: [],
    reasons: [
      detection.isValidFormat ? "Address format recognized" : "Address format not recognized confidently",
      "No verified adverse report is included in this automated check",
      "Use explorer links and payment context before sending funds"
    ],
    explorerLinks: getWalletExplorerLinks(detection.detectedChain, detection.normalizedAddress),
    disclaimer: "This is not final fraud proof."
  };
}

function finish(result: WalletRiskResult, score: number): WalletRiskResult {
  return { ...result, score, level: levelFromScore(score) };
}

export async function runWalletIntelligenceCheck(address: string): Promise<WalletRiskResult> {
  const result = baseResult(address);
  const detection = detectWalletAddress(address);

  if (!detection.isValidFormat) {
    result.reasons.push("Use extra caution and confirm the exact network before sending funds");
    return finish(result, 70);
  }

  if (detection.detectedChain === "EVM") {
    const evm = await fetchEthereumBalance(detection.normalizedAddress);
    result.sources.push(evm.source);
    if (!evm.ok) {
      result.reasons.push("Live Ethereum balance data was not available for this check");
      result.reasons.push("Explorer links are provided for Ethereum, BNB Smart Chain, Base, and Polygon");
      return finish(result, 45);
    }

    result.liveDataUsed = true;
    result.reasons.push(`Ethereum balance observed: ${evm.data.eth.toFixed(6)} ETH`);
    result.reasons.push("Explorer links are available for the main EVM networks");
    return finish(result, evm.data.eth > 0 ? 35 : 55);
  }

  if (detection.detectedChain === "Bitcoin") {
    const btc = await fetchBitcoinAddress(detection.normalizedAddress);
    result.sources.push(btc.source);
    if (!btc.ok) {
      result.reasons.push("Live Bitcoin network data was not available for this check");
      return finish(result, 45);
    }

    result.liveDataUsed = true;
    result.reasons.push(`Confirmed transaction count: ${btc.data.txCount}`);
    result.reasons.push(`Pending transaction count: ${btc.data.mempoolTxCount}`);
    if (typeof btc.data.balanceSats === "number") result.reasons.push(`Observed balance: ${btc.data.balanceSats} sats`);
    return finish(result, btc.data.txCount > 0 ? 35 : 55);
  }

  if (detection.detectedChain === "Solana") {
    const sol = await fetchSolanaBalance(detection.normalizedAddress);
    result.sources.push(sol.source);
    if (!sol.ok) {
      result.reasons.push("Live Solana balance data was not available for this check");
      return finish(result, 45);
    }

    result.liveDataUsed = true;
    result.reasons.push(`Observed balance: ${sol.data.lamports} lamports (${sol.data.sol.toFixed(6)} SOL)`);
    return finish(result, sol.data.lamports > 0 ? 35 : 55);
  }

  if (detection.detectedChain === "XRP") {
    const xrp = await fetchXrpAccount(detection.normalizedAddress);
    result.sources.push(xrp.source);
    if (!xrp.ok) {
      result.reasons.push("Live XRP account data was not available for this check");
      return finish(result, 45);
    }

    result.liveDataUsed = true;
    if (!xrp.data.exists) {
      result.reasons.push(xrp.data.note || "account may be unfunded/not activated");
      return finish(result, 55);
    }

    if (typeof xrp.data.balanceXrp === "number") result.reasons.push(`Observed balance: ${xrp.data.balanceXrp.toFixed(6)} XRP`);
    if (typeof xrp.data.sequence === "number") result.reasons.push(`Account sequence: ${xrp.data.sequence}`);
    return finish(result, 35);
  }

  if (detection.detectedChain === "TRON") {
    const tron = await fetchTronAccount(detection.normalizedAddress);
    result.sources.push(tron.source);
    if (!tron.ok) {
      result.reasons.push("Live TRON account data was not available for this check");
      result.reasons.push("Confirm any USDT TRC20 payment using the exact token transfer details");
      return finish(result, 45);
    }

    result.liveDataUsed = true;
    result.reasons.push(tron.data.exists ? "TRON account found" : "TRON account may be new or unfunded");
    if (typeof tron.data.balanceTrx === "number") result.reasons.push(`Observed balance: ${tron.data.balanceTrx.toFixed(6)} TRX`);
    if (typeof tron.data.txCount === "number") result.reasons.push(`Transaction count observed: ${tron.data.txCount}`);
    result.reasons.push("Confirm any USDT TRC20 payment using the exact token transfer details");
    return finish(result, tron.data.exists ? 35 : 55);
  }

  if (detection.detectedChain === "TON") {
    const ton = await fetchTonAccount(detection.normalizedAddress);
    result.sources.push(ton.source);
    if (!ton.ok) {
      result.reasons.push("Live TON account data was not available for this check");
      result.reasons.push("Confirm any USDT on TON payment using the exact token transfer details");
      return finish(result, 45);
    }

    result.liveDataUsed = true;
    result.reasons.push(ton.data.exists ? "TON account found" : "TON account may be new or uninitialized");
    if (typeof ton.data.balanceTon === "number") result.reasons.push(`Observed balance: ${ton.data.balanceTon.toFixed(6)} TON`);
    if (ton.data.status) result.reasons.push(`Account status: ${ton.data.status}`);
    result.reasons.push("Confirm any USDT on TON payment using the exact token transfer details");
    return finish(result, ton.data.exists ? 35 : 55);
  }

  return finish(result, 70);
}
