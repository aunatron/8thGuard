import { getDataSourceConfig } from "@/lib/payments/config";

type SourceResponse<T> =
  | { ok: true; source: string; data: T }
  | { ok: false; source: string; reason: string };

type BitcoinAddressResponse = {
  chain_stats?: {
    funded_txo_sum?: number;
    spent_txo_sum?: number;
    tx_count?: number;
  };
  mempool_stats?: {
    funded_txo_sum?: number;
    spent_txo_sum?: number;
    tx_count?: number;
  };
};

export type BitcoinAddressSummary = {
  txCount: number;
  mempoolTxCount: number;
  balanceSats?: number;
};

export type SolanaBalanceSummary = {
  lamports: number;
  sol: number;
};

export type XrpAccountSummary = {
  exists: boolean;
  balanceXrp?: number;
  sequence?: number;
  note?: string;
};

export type EvmBalanceSummary = {
  network: "Ethereum";
  wei: string;
  eth: number;
};

export type TronAccountSummary = {
  exists: boolean;
  balanceTrx?: number;
  txCount?: number;
};

export type TonAccountSummary = {
  exists: boolean;
  balanceTon?: number;
  status?: string;
};

async function fetchJsonWithTimeout<T>(url: string, init?: RequestInit, timeoutMs = 4500): Promise<T> {
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

    if (!response.ok) {
      throw new Error(`status_${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchEthereumBalance(address: string): Promise<SourceResponse<EvmBalanceSummary>> {
  const { etherscanApiKey } = getDataSourceConfig();
  if (!etherscanApiKey) {
    return { ok: false, source: "Etherscan V2", reason: "live EVM API not configured" };
  }

  try {
    const url = new URL("https://api.etherscan.io/v2/api");
    url.searchParams.set("chainid", "1");
    url.searchParams.set("module", "account");
    url.searchParams.set("action", "balance");
    url.searchParams.set("address", address);
    url.searchParams.set("tag", "latest");
    url.searchParams.set("apikey", etherscanApiKey);

    const json = await fetchJsonWithTimeout<{ status?: string; result?: string; message?: string }>(url.toString());
    if (!json.result || json.status === "0") {
      return { ok: false, source: "Etherscan V2", reason: json.message || "live EVM lookup failed" };
    }

    const wei = json.result;
    const eth = Number(wei) / 1e18;
    return { ok: true, source: "Etherscan V2", data: { network: "Ethereum", wei, eth } };
  } catch {
    return { ok: false, source: "Etherscan V2", reason: "live EVM lookup failed" };
  }
}

export async function fetchBitcoinAddress(address: string): Promise<SourceResponse<BitcoinAddressSummary>> {
  const { btcMempoolApiBase } = getDataSourceConfig();

  try {
    const base = btcMempoolApiBase.replace(/\/+$/, "");
    const json = await fetchJsonWithTimeout<BitcoinAddressResponse>(`${base}/address/${encodeURIComponent(address)}`);
    const chain = json.chain_stats || {};
    const mempool = json.mempool_stats || {};
    const funded = (chain.funded_txo_sum || 0) + (mempool.funded_txo_sum || 0);
    const spent = (chain.spent_txo_sum || 0) + (mempool.spent_txo_sum || 0);

    return {
      ok: true,
      source: "mempool.space",
      data: {
        txCount: chain.tx_count || 0,
        mempoolTxCount: mempool.tx_count || 0,
        balanceSats: funded - spent
      }
    };
  } catch {
    return { ok: false, source: "mempool.space", reason: "live Bitcoin lookup failed" };
  }
}

export async function fetchSolanaBalance(address: string): Promise<SourceResponse<SolanaBalanceSummary>> {
  const { solanaRpcUrl } = getDataSourceConfig();

  try {
    const json = await fetchJsonWithTimeout<{ result?: { value?: number }; error?: { message?: string } }>(
      solanaRpcUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "8thguard-wallet-balance",
          method: "getBalance",
          params: [address]
        })
      }
    );

    if (typeof json.result?.value !== "number") {
      return { ok: false, source: "Solana JSON-RPC", reason: json.error?.message || "live Solana lookup failed" };
    }

    return {
      ok: true,
      source: "Solana JSON-RPC",
      data: { lamports: json.result.value, sol: json.result.value / 1e9 }
    };
  } catch {
    return { ok: false, source: "Solana JSON-RPC", reason: "live Solana lookup failed" };
  }
}

export async function fetchXrpAccount(address: string): Promise<SourceResponse<XrpAccountSummary>> {
  const { xrplRpcUrl } = getDataSourceConfig();

  try {
    const json = await fetchJsonWithTimeout<{
      result?: {
        status?: string;
        error?: string;
        account_data?: { Balance?: string; Sequence?: number };
      };
    }>(xrplRpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "account_info",
        params: [{ account: address, ledger_index: "validated", queue: false }]
      })
    });

    if (json.result?.error === "actNotFound") {
      return {
        ok: true,
        source: "XRPL JSON-RPC",
        data: { exists: false, note: "account may be unfunded/not activated" }
      };
    }

    const accountData = json.result?.account_data;
    if (!accountData) {
      return { ok: false, source: "XRPL JSON-RPC", reason: "live XRP lookup failed" };
    }

    return {
      ok: true,
      source: "XRPL JSON-RPC",
      data: {
        exists: true,
        balanceXrp: Number(accountData.Balance || 0) / 1e6,
        sequence: accountData.Sequence
      }
    };
  } catch {
    return { ok: false, source: "XRPL JSON-RPC", reason: "live XRP lookup failed" };
  }
}

export async function fetchTronAccount(address: string): Promise<SourceResponse<TronAccountSummary>> {
  const { trongridApiKey } = getDataSourceConfig();
  if (!trongridApiKey) {
    return { ok: false, source: "TronGrid", reason: "live TRON API key not configured" };
  }

  try {
    const json = await fetchJsonWithTimeout<{ data?: Array<{ balance?: number; transactions_out?: number; transactions_in?: number }> }>(
      `https://api.trongrid.io/v1/accounts/${encodeURIComponent(address)}`,
      { headers: { "TRON-PRO-API-KEY": trongridApiKey } }
    );
    const account = json.data?.[0];
    return {
      ok: true,
      source: "TronGrid",
      data: {
        exists: Boolean(account),
        balanceTrx: account?.balance ? account.balance / 1e6 : undefined,
        txCount: (account?.transactions_in || 0) + (account?.transactions_out || 0)
      }
    };
  } catch {
    return { ok: false, source: "TronGrid", reason: "live TRON lookup failed" };
  }
}

export async function fetchTonAccount(address: string): Promise<SourceResponse<TonAccountSummary>> {
  const { tonapiKey, toncenterApiKey } = getDataSourceConfig();

  if (tonapiKey) {
    try {
      const json = await fetchJsonWithTimeout<{ balance?: number; status?: string }>(
        `https://tonapi.io/v2/accounts/${encodeURIComponent(address)}`,
        { headers: { Authorization: `Bearer ${tonapiKey}` } }
      );
      return {
        ok: true,
        source: "TONAPI",
        data: { exists: true, balanceTon: typeof json.balance === "number" ? json.balance / 1e9 : undefined, status: json.status }
      };
    } catch {
      return { ok: false, source: "TONAPI", reason: "live TON lookup failed" };
    }
  }

  if (toncenterApiKey) {
    try {
      const json = await fetchJsonWithTimeout<{ ok?: boolean; result?: { balance?: string; state?: string } }>(
        `https://toncenter.com/api/v2/getAddressInformation?address=${encodeURIComponent(address)}`,
        { headers: { "X-API-Key": toncenterApiKey } }
      );
      if (!json.ok || !json.result) {
        return { ok: false, source: "TON Center", reason: "live TON lookup failed" };
      }
      return {
        ok: true,
        source: "TON Center",
        data: {
          exists: json.result.state !== "uninitialized",
          balanceTon: Number(json.result.balance || 0) / 1e9,
          status: json.result.state
        }
      };
    } catch {
      return { ok: false, source: "TON Center", reason: "live TON lookup failed" };
    }
  }

  return { ok: false, source: "TON Center / TONAPI", reason: "live TON API key not configured" };
}
