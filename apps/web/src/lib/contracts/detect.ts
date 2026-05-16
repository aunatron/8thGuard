export type ContractChain =
  | "ethereum"
  | "base"
  | "bsc"
  | "polygon"
  | "arbitrum"
  | "optimism"
  | "avalanche"
  | "evm";

export type ContractDetection = {
  inputChain: string;
  chain: ContractChain;
  isKnownChain: boolean;
  isEvmAddress: boolean;
  normalizedAddress: string;
  possibleChains: ContractChain[];
  explorerLinks: { label: string; url: string }[];
  reasons: string[];
};

const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

const CHAIN_ALIASES: Record<string, ContractChain> = {
  eth: "ethereum",
  ethereum: "ethereum",
  mainnet: "ethereum",
  base: "base",
  bsc: "bsc",
  bnb: "bsc",
  "bnb-chain": "bsc",
  polygon: "polygon",
  matic: "polygon",
  arbitrum: "arbitrum",
  arb: "arbitrum",
  optimism: "optimism",
  op: "optimism",
  avalanche: "avalanche",
  avax: "avalanche",
  evm: "evm"
};

const EXPLORERS: Record<ContractChain, { label: string; baseUrl: string }> = {
  ethereum: { label: "Etherscan", baseUrl: "https://etherscan.io/address/" },
  base: { label: "BaseScan", baseUrl: "https://basescan.org/address/" },
  bsc: { label: "BscScan", baseUrl: "https://bscscan.com/address/" },
  polygon: { label: "PolygonScan", baseUrl: "https://polygonscan.com/address/" },
  arbitrum: { label: "Arbiscan", baseUrl: "https://arbiscan.io/address/" },
  optimism: { label: "Optimistic Etherscan", baseUrl: "https://optimistic.etherscan.io/address/" },
  avalanche: { label: "SnowTrace", baseUrl: "https://snowtrace.io/address/" },
  evm: { label: "EVM explorer search", baseUrl: "https://blockscan.com/address/" }
};

const EVM_CHAINS: ContractChain[] = ["ethereum", "base", "bsc", "polygon", "arbitrum", "optimism", "avalanche"];

export function normalizeContractChain(input: string | undefined): ContractChain {
  const clean = (input || "").trim().toLowerCase();
  return CHAIN_ALIASES[clean] || "evm";
}

export function isSupportedContractChain(input: string | undefined): boolean {
  const clean = (input || "").trim().toLowerCase();
  return Boolean(CHAIN_ALIASES[clean]);
}

export function isEvmAddress(value: string | undefined): boolean {
  return EVM_ADDRESS_PATTERN.test((value || "").trim());
}

export function generateExplorerLinks(chain: ContractChain, address: string): { label: string; url: string }[] {
  if (!isEvmAddress(address)) return [];
  if (chain !== "evm") {
    const explorer = EXPLORERS[chain];
    return [{ label: explorer.label, url: `${explorer.baseUrl}${address}` }];
  }

  return [
    { label: EXPLORERS.evm.label, url: `${EXPLORERS.evm.baseUrl}${address}` },
    ...EVM_CHAINS.slice(0, 3).map((evmChain) => ({
      label: EXPLORERS[evmChain].label,
      url: `${EXPLORERS[evmChain].baseUrl}${address}`
    }))
  ];
}

export function detectContractTarget(chainInput: string | undefined, addressInput: string | undefined): ContractDetection {
  const chain = normalizeContractChain(chainInput);
  const normalizedAddress = (addressInput || "").trim();
  const isKnownChain = isSupportedContractChain(chainInput);
  const evmAddress = isEvmAddress(normalizedAddress);
  const possibleChains = chain === "evm" ? EVM_CHAINS : [chain];
  const reasons: string[] = [];

  if (isKnownChain) reasons.push(`Chain recognized as ${chain}.`);
  else reasons.push("Chain was not recognized; using EVM-family preview.");

  if (evmAddress) reasons.push("EVM 0x contract address format detected.");
  else reasons.push("Contract address does not match EVM 0x format.");

  return {
    inputChain: chainInput || "",
    chain,
    isKnownChain,
    isEvmAddress: evmAddress,
    normalizedAddress,
    possibleChains,
    explorerLinks: generateExplorerLinks(chain, normalizedAddress),
    reasons
  };
}
