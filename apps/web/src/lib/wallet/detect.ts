export type WalletChain = "EVM" | "Bitcoin" | "Solana" | "XRP" | "TRON" | "TON" | "Unknown";

export type WalletDetection = {
  detectedChain: WalletChain;
  possibleNetworks: string[];
  isValidFormat: boolean;
  normalizedAddress: string;
};

const BASE58_PATTERN = /^[1-9A-HJ-NP-Za-km-z]+$/;

export function detectWalletAddress(address: string): WalletDetection {
  const normalizedAddress = address.trim();

  if (/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
    return {
      detectedChain: "EVM",
      possibleNetworks: ["Ethereum", "BNB Smart Chain", "Base", "Polygon"],
      isValidFormat: true,
      normalizedAddress
    };
  }

  if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/.test(normalizedAddress)) {
    return {
      detectedChain: "Bitcoin",
      possibleNetworks: ["Bitcoin"],
      isValidFormat: true,
      normalizedAddress
    };
  }

  if (/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(normalizedAddress)) {
    return {
      detectedChain: "XRP",
      possibleNetworks: ["XRPL"],
      isValidFormat: true,
      normalizedAddress
    };
  }

  if (/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(normalizedAddress)) {
    return {
      detectedChain: "TRON",
      possibleNetworks: ["TRON"],
      isValidFormat: true,
      normalizedAddress
    };
  }

  if (/^(EQ|UQ)[A-Za-z0-9_-]{46}$/.test(normalizedAddress) || /^-?\d:[a-fA-F0-9]{64}$/.test(normalizedAddress)) {
    return {
      detectedChain: "TON",
      possibleNetworks: ["TON"],
      isValidFormat: true,
      normalizedAddress
    };
  }

  if (normalizedAddress.length >= 32 && normalizedAddress.length <= 44 && BASE58_PATTERN.test(normalizedAddress)) {
    return {
      detectedChain: "Solana",
      possibleNetworks: ["Solana"],
      isValidFormat: true,
      normalizedAddress
    };
  }

  return {
    detectedChain: "Unknown",
    possibleNetworks: [],
    isValidFormat: false,
    normalizedAddress
  };
}
