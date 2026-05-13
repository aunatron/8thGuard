import { getDataSourceConfig, getPublicCryptoWallets } from "./config";
import type { CryptoRailId } from "./session";

type VerificationStatus = "verified" | "partial" | "not_verified";

export type CryptoPaymentVerificationResult = {
  status: VerificationStatus;
  rail: CryptoRailId;
  source: string;
  txHash: string;
  expectedAddress?: string;
  observedTo?: string;
  observedAmount?: string;
  confirmations?: number;
  notes: string[];
  explorerUrl?: string;
};

async function fetchJsonWithTimeout<T>(url: string, init?: RequestInit, timeoutMs = 5500): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {})
      }
    });

    if (!response.ok) throw new Error(`status_${response.status}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function officialAddressForRail(rail: CryptoRailId): string | undefined {
  const wallets = getPublicCryptoWallets();
  if (rail === "xrp") return wallets.find((wallet) => wallet.label === "XRP")?.address;
  if (rail === "btc") return wallets.find((wallet) => wallet.label === "BTC")?.address;
  if (rail === "usdt_trc20") return wallets.find((wallet) => wallet.label === "USDT TRC20")?.address;
  if (rail === "usdt_bep20") return wallets.find((wallet) => wallet.label === "USDT BEP20 / EVM")?.address;
  if (rail === "evm") return wallets.find((wallet) => wallet.label === "ETH / EVM rails")?.address;
  if (rail === "ton") return wallets.find((wallet) => wallet.label === "TON / USDT on TON")?.address;
  if (rail === "solana") return wallets.find((wallet) => wallet.label === "Solana")?.address;
  return undefined;
}

function notConfigured(rail: CryptoRailId, txHash: string): CryptoPaymentVerificationResult {
  return {
    status: "partial",
    rail,
    source: "8thGuard payment desk",
    txHash,
    notes: ["This rail requires 8thGuard support confirmation. Use an official published address before sending."]
  };
}

function normalized(value?: string): string {
  return (value || "").trim().toLowerCase();
}

export async function verifyCryptoPayment(rail: CryptoRailId, txHash: string): Promise<CryptoPaymentVerificationResult> {
  const cleanHash = txHash.trim();
  const expectedAddress = officialAddressForRail(rail);
  if (!expectedAddress) return notConfigured(rail, cleanHash);

  if (rail === "btc") return verifyBitcoinPayment(cleanHash, expectedAddress);
  if (rail === "xrp") return verifyXrpPayment(cleanHash, expectedAddress);
  if (rail === "evm") return verifyEvmNativePayment(cleanHash, expectedAddress);
  if (rail === "usdt_trc20") return verifyTronPayment(cleanHash, expectedAddress);
  if (rail === "solana") return verifySolanaPayment(cleanHash, expectedAddress);

  return {
    status: "partial",
    rail,
    source: "8thGuard payment desk",
    txHash: cleanHash,
    expectedAddress,
    notes: ["This rail requires payment desk confirmation. Submit the transaction hash with your session ID."]
  };
}

async function verifyBitcoinPayment(txHash: string, expectedAddress: string): Promise<CryptoPaymentVerificationResult> {
  const { btcMempoolApiBase } = getDataSourceConfig();
  const source = "mempool.space";
  const explorerUrl = `https://mempool.space/tx/${encodeURIComponent(txHash)}`;

  try {
    const base = btcMempoolApiBase.replace(/\/+$/, "");
    const json = await fetchJsonWithTimeout<{
      status?: { confirmed?: boolean; block_height?: number };
      vout?: Array<{ scriptpubkey_address?: string; value?: number }>;
    }>(`${base}/tx/${encodeURIComponent(txHash)}`);
    const output = json.vout?.find((item) => normalized(item.scriptpubkey_address) === normalized(expectedAddress));

    return {
      status: output ? "verified" : "not_verified",
      rail: "btc",
      source,
      txHash,
      expectedAddress,
      observedTo: output?.scriptpubkey_address,
      observedAmount: typeof output?.value === "number" ? `${output.value} sats` : undefined,
      confirmations: json.status?.confirmed ? 1 : 0,
      explorerUrl,
      notes: output
        ? ["Transaction includes an output to the official BTC address.", json.status?.confirmed ? "Transaction is confirmed on-chain." : "Transaction is seen but not confirmed yet."]
        : ["Transaction was found, but no output to the official BTC address was detected."]
    };
  } catch {
    return {
      status: "partial",
      rail: "btc",
      source,
      txHash,
      expectedAddress,
      explorerUrl,
      notes: ["Bitcoin confirmation needs payment desk review. Keep the explorer link and session ID ready."]
    };
  }
}

async function verifyXrpPayment(txHash: string, expectedAddress: string): Promise<CryptoPaymentVerificationResult> {
  const { xrplRpcUrl } = getDataSourceConfig();
  const source = "XRPL JSON-RPC";
  const explorerUrl = `https://xrpscan.com/tx/${encodeURIComponent(txHash)}`;

  try {
    const json = await fetchJsonWithTimeout<{
      result?: {
        Destination?: string;
        Amount?: string | { value?: string; currency?: string };
        validated?: boolean;
        meta?: { TransactionResult?: string };
      };
    }>(xrplRpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "tx", params: [{ transaction: txHash, binary: false }] })
    });
    const result = json.result;
    const amount = typeof result?.Amount === "string" ? `${Number(result.Amount) / 1e6} XRP` : `${result?.Amount?.value || "unknown"} ${result?.Amount?.currency || ""}`.trim();
    const matched = normalized(result?.Destination) === normalized(expectedAddress);

    return {
      status: matched ? "verified" : "not_verified",
      rail: "xrp",
      source,
      txHash,
      expectedAddress,
      observedTo: result?.Destination,
      observedAmount: amount,
      confirmations: result?.validated ? 1 : 0,
      explorerUrl,
      notes: matched
        ? ["Transaction destination matches the official XRP address.", result?.meta?.TransactionResult ? `XRPL result: ${result.meta.TransactionResult}` : "Check destination tag requirements before fulfillment."]
        : ["Transaction was found, but the destination does not match the official XRP address."]
    };
  } catch {
    return {
      status: "partial",
      rail: "xrp",
      source,
      txHash,
      expectedAddress,
      explorerUrl,
      notes: ["XRP confirmation needs payment desk review. Keep the explorer link and session ID ready."]
    };
  }
}

async function verifyEvmNativePayment(txHash: string, expectedAddress: string): Promise<CryptoPaymentVerificationResult> {
  const { etherscanApiKey } = getDataSourceConfig();
  const source = "Etherscan V2";
  const explorerUrl = `https://etherscan.io/tx/${encodeURIComponent(txHash)}`;
  if (!etherscanApiKey) {
    return {
      status: "partial",
      rail: "evm",
      source,
      txHash,
      expectedAddress,
      explorerUrl,
      notes: ["EVM confirmation needs payment desk review. Keep the transaction hash and session ID ready."]
    };
  }

  try {
    const url = new URL("https://api.etherscan.io/v2/api");
    url.searchParams.set("chainid", "1");
    url.searchParams.set("module", "proxy");
    url.searchParams.set("action", "eth_getTransactionByHash");
    url.searchParams.set("txhash", txHash);
    url.searchParams.set("apikey", etherscanApiKey);
    const json = await fetchJsonWithTimeout<{ result?: { to?: string; value?: string } }>(url.toString());
    const to = json.result?.to;
    const wei = json.result?.value ? Number.parseInt(json.result.value, 16) : undefined;
    const matched = normalized(to) === normalized(expectedAddress);

    return {
      status: matched ? "verified" : "not_verified",
      rail: "evm",
      source,
      txHash,
      expectedAddress,
      observedTo: to,
      observedAmount: typeof wei === "number" && Number.isFinite(wei) ? `${wei / 1e18} ETH` : undefined,
      explorerUrl,
      notes: matched
        ? ["Native EVM transaction recipient matches the official EVM address."]
        : ["Transaction lookup completed, but recipient did not match the official EVM address or the transaction is not native ETH."]
    };
  } catch {
    return {
      status: "partial",
      rail: "evm",
      source,
      txHash,
      expectedAddress,
      explorerUrl,
      notes: ["EVM confirmation needs payment desk review. Keep the explorer link and session ID ready."]
    };
  }
}

async function verifyTronPayment(txHash: string, expectedAddress: string): Promise<CryptoPaymentVerificationResult> {
  const { trongridApiKey } = getDataSourceConfig();
  const source = "TronGrid";
  const explorerUrl = `https://tronscan.org/#/transaction/${encodeURIComponent(txHash)}`;
  if (!trongridApiKey) {
    return {
      status: "partial",
      rail: "usdt_trc20",
      source,
      txHash,
      expectedAddress,
      explorerUrl,
      notes: ["TRON confirmation needs payment desk review. Keep the transaction hash and session ID ready."]
    };
  }

  try {
    const json = await fetchJsonWithTimeout<{
      ret?: Array<{ contractRet?: string }>;
      trc20TransferInfo?: Array<{ to_address?: string; amount_str?: string; symbol?: string }>;
    }>(`https://api.trongrid.io/wallet/gettransactioninfobyid?value=${encodeURIComponent(txHash)}`, {
      headers: { "TRON-PRO-API-KEY": trongridApiKey }
    });
    const transfer = json.trc20TransferInfo?.find((item) => normalized(item.to_address) === normalized(expectedAddress));

    return {
      status: transfer ? "verified" : "not_verified",
      rail: "usdt_trc20",
      source,
      txHash,
      expectedAddress,
      observedTo: transfer?.to_address,
      observedAmount: transfer ? `${transfer.amount_str || "unknown"} ${transfer.symbol || "TRC20"}` : undefined,
      explorerUrl,
      notes: transfer
        ? ["TRC20 transfer recipient matches the official USDT TRC20 address."]
        : ["TRON lookup completed, but no matching TRC20 transfer to the official address was detected."]
    };
  } catch {
    return {
      status: "partial",
      rail: "usdt_trc20",
      source,
      txHash,
      expectedAddress,
      explorerUrl,
      notes: ["TRON confirmation needs payment desk review. Keep the explorer link and session ID ready."]
    };
  }
}

async function verifySolanaPayment(txHash: string, expectedAddress: string): Promise<CryptoPaymentVerificationResult> {
  const { solanaRpcUrl } = getDataSourceConfig();
  const source = "Solana JSON-RPC";
  const explorerUrl = `https://explorer.solana.com/tx/${encodeURIComponent(txHash)}`;

  try {
    const json = await fetchJsonWithTimeout<{
      result?: {
        meta?: { postBalances?: number[]; preBalances?: number[] };
        transaction?: { message?: { accountKeys?: Array<string | { pubkey?: string }> } };
      };
    }>(solanaRpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "8thguard-payment-tx",
        method: "getTransaction",
        params: [txHash, { encoding: "json", maxSupportedTransactionVersion: 0 }]
      })
    });
    const accountKeys = json.result?.transaction?.message?.accountKeys || [];
    const matchedAccount = accountKeys
      .map((account) => (typeof account === "string" ? account : account.pubkey))
      .find((account) => normalized(account) === normalized(expectedAddress));

    return {
      status: matchedAccount ? "partial" : "not_verified",
      rail: "solana",
      source,
      txHash,
      expectedAddress,
      observedTo: matchedAccount,
      explorerUrl,
      notes: matchedAccount
        ? ["Official Solana address appears in the transaction accounts. Amount confirmation is required before service release."]
        : ["Solana transaction was found, but the official address was not detected in account keys."]
    };
  } catch {
    return {
      status: "partial",
      rail: "solana",
      source,
      txHash,
      expectedAddress,
      explorerUrl,
      notes: ["Solana confirmation needs payment desk review. Keep the explorer link and session ID ready."]
    };
  }
}

export function formatCryptoPaymentVerification(result: CryptoPaymentVerificationResult, sessionId?: string): string {
  const statusLabel =
    result.status === "verified"
      ? "Verified match"
      : result.status === "partial"
        ? "Review needed"
        : "Not verified";

  return [
    "Crypto Payment Check",
    "",
    sessionId ? `Session ID: ${sessionId}` : undefined,
    `Rail: ${result.rail}`,
    `Status: ${statusLabel}`,
    `Tx hash: ${result.txHash}`,
    result.expectedAddress ? `Expected address: ${result.expectedAddress}` : undefined,
    result.observedTo ? `Observed recipient: ${result.observedTo}` : undefined,
    result.observedAmount ? `Observed amount: ${result.observedAmount}` : undefined,
    typeof result.confirmations === "number" ? `Confirmation signal: ${result.confirmations > 0 ? "Yes" : "Pending/No"}` : undefined,
    result.explorerUrl ? `Explorer: ${result.explorerUrl}` : undefined,
    "",
    "Notes:",
    ...result.notes.map((note) => `- ${note}`),
    "",
    "This confirms payment evidence only. 8thGuard does not provide custody, escrow, exchange, trading, or user-to-user settlement."
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}
