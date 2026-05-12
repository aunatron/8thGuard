import type { ProductId } from "./products";

type PaystackLinkEnv = {
  productId: ProductId;
  envName: string;
};

const PAYSTACK_LINK_ENVS: PaystackLinkEnv[] = [
  { productId: "detailed_wallet_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_WALLET_REVIEW" },
  { productId: "detailed_transaction_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_TRANSACTION_REVIEW" },
  { productId: "agent_risk_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_AGENT_RISK_REVIEW" },
  { productId: "priority_scam_report_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_PRIORITY_SCAM_REPORT" },
  { productId: "weekly_early_access_supporter", envName: "NEXT_PUBLIC_PAYSTACK_LINK_WEEKLY_SUPPORTER" },
  { productId: "agent_verification_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_AGENT_VERIFICATION" },
  { productId: "group_community_safety_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_GROUP_SAFETY_REVIEW" },
  { productId: "founding_supporter_package", envName: "NEXT_PUBLIC_PAYSTACK_LINK_FOUNDING_SUPPORTER" }
];

export type CryptoWalletRail = {
  label: string;
  envName: string;
  address?: string;
  destinationTag?: string;
  note?: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getPaystackPaymentLinks(): Partial<Record<ProductId, string>> {
  return PAYSTACK_LINK_ENVS.reduce<Partial<Record<ProductId, string>>>((links, item) => {
    const value = readEnv(item.envName);
    if (value) links[item.productId] = value;
    return links;
  }, {});
}

export function getPaymentContact() {
  return {
    contactHandle: readEnv("NEXT_PUBLIC_CONTACT_HANDLE"),
    officialTelegram: readEnv("NEXT_PUBLIC_OFFICIAL_TELEGRAM")
  };
}

export function getPublicCryptoWallets(): CryptoWalletRail[] {
  return [
    { label: "BTC", envName: "NEXT_PUBLIC_CRYPTO_BTC_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_BTC_ADDRESS") },
    {
      label: "ETH / EVM rails",
      envName: "NEXT_PUBLIC_CRYPTO_ETH_EVM_ADDRESS",
      address: readEnv("NEXT_PUBLIC_CRYPTO_ETH_EVM_ADDRESS")
    },
    {
      label: "USDT TRC20",
      envName: "NEXT_PUBLIC_CRYPTO_USDT_TRC20_ADDRESS",
      address: readEnv("NEXT_PUBLIC_CRYPTO_USDT_TRC20_ADDRESS")
    },
    {
      label: "USDT BEP20",
      envName: "NEXT_PUBLIC_CRYPTO_USDT_BEP20_ADDRESS",
      address: readEnv("NEXT_PUBLIC_CRYPTO_USDT_BEP20_ADDRESS")
    },
    { label: "TON / USDT on TON", envName: "NEXT_PUBLIC_CRYPTO_TON_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_TON_ADDRESS") },
    {
      label: "XRP",
      envName: "NEXT_PUBLIC_CRYPTO_XRP_ADDRESS",
      address: readEnv("NEXT_PUBLIC_CRYPTO_XRP_ADDRESS"),
      destinationTag: readEnv("NEXT_PUBLIC_CRYPTO_XRP_DESTINATION_TAG")
    },
    { label: "Solana", envName: "NEXT_PUBLIC_CRYPTO_SOLANA_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_SOLANA_ADDRESS") }
  ];
}

export function getPaymentServerConfig() {
  return {
    paystackPublicKey: readEnv("PAYSTACK_PUBLIC_KEY"),
    paystackSecretKeyConfigured: Boolean(readEnv("PAYSTACK_SECRET_KEY")),
    paystackCallbackUrl: readEnv("PAYSTACK_CALLBACK_URL"),
    paystackWebhookSecretConfigured: Boolean(readEnv("PAYSTACK_WEBHOOK_SECRET"))
  };
}

export function getDataSourceConfig() {
  return {
    etherscanApiKey: readEnv("ETHERSCAN_API_KEY"),
    trongridApiKey: readEnv("TRONGRID_API_KEY"),
    toncenterApiKey: readEnv("TONCENTER_API_KEY"),
    tonapiKey: readEnv("TONAPI_KEY"),
    solanaRpcUrl: readEnv("SOLANA_RPC_URL") || "https://api.mainnet-beta.solana.com",
    xrplRpcUrl: readEnv("XRPL_RPC_URL") || "https://s1.ripple.com:51234/",
    btcMempoolApiBase: readEnv("BTC_MEMPOOL_API_BASE") || "https://mempool.space/api"
  };
}
