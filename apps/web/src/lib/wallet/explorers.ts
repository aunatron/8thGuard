import type { WalletChain } from "./detect";

export type ExplorerLink = {
  label: string;
  url: string;
};

export function getWalletExplorerLinks(chain: WalletChain, address: string): ExplorerLink[] {
  const encoded = encodeURIComponent(address);

  if (chain === "EVM") {
    return [
      { label: "Ethereum", url: `https://etherscan.io/address/${encoded}` },
      { label: "BNB Smart Chain", url: `https://bscscan.com/address/${encoded}` },
      { label: "Base", url: `https://basescan.org/address/${encoded}` },
      { label: "Polygon", url: `https://polygonscan.com/address/${encoded}` }
    ];
  }

  if (chain === "Bitcoin") return [{ label: "mempool.space", url: `https://mempool.space/address/${encoded}` }];
  if (chain === "Solana") return [{ label: "Solana Explorer", url: `https://explorer.solana.com/address/${encoded}` }];
  if (chain === "XRP") return [{ label: "XRPSCAN", url: `https://xrpscan.com/account/${encoded}` }];
  if (chain === "TRON") return [{ label: "TRONSCAN", url: `https://tronscan.org/#/address/${encoded}` }];
  if (chain === "TON") return [{ label: "TON Viewer", url: `https://tonviewer.com/${encoded}` }];

  return [];
}

export function getTransactionExplorerLinks(hash: string): ExplorerLink[] {
  const raw = hash.trim();
  const normalized = raw.replace(/^0x/i, "");
  const evmHash = raw.startsWith("0x") || raw.startsWith("0X") ? raw : `0x${normalized}`;
  const encodedEvm = encodeURIComponent(evmHash);
  const encoded = encodeURIComponent(normalized);
  return [
    { label: "Ethereum", url: `https://etherscan.io/tx/${encodedEvm}` },
    { label: "BNB Smart Chain", url: `https://bscscan.com/tx/${encodedEvm}` },
    { label: "Base", url: `https://basescan.org/tx/${encodedEvm}` },
    { label: "Polygon", url: `https://polygonscan.com/tx/${encodedEvm}` },
    { label: "Bitcoin", url: `https://mempool.space/tx/${encoded}` },
    { label: "XRPL", url: `https://xrpscan.com/tx/${encoded}` }
  ];
}

export function getSolanaTransactionExplorerLink(signature: string): ExplorerLink {
  return {
    label: "Solana",
    url: `https://explorer.solana.com/tx/${encodeURIComponent(signature.trim())}`
  };
}
