import type { ProductId } from "./products";

type PaystackLinkEnv = {
  productId: ProductId;
  envName: string;
};

type PolarLinkEnv = {
  productId: ProductId;
  envName: string;
};

const PAYSTACK_LINK_ENVS: PaystackLinkEnv[] = [
  { productId: "quick_wallet_check", envName: "NEXT_PUBLIC_PAYSTACK_LINK_QUICK_WALLET_CHECK" },
  { productId: "quick_transaction_check", envName: "NEXT_PUBLIC_PAYSTACK_LINK_QUICK_TRANSACTION_CHECK" },
  { productId: "quick_agent_check", envName: "NEXT_PUBLIC_PAYSTACK_LINK_QUICK_AGENT_CHECK" },
  { productId: "quick_contract_scan", envName: "NEXT_PUBLIC_PAYSTACK_LINK_QUICK_CONTRACT_SCAN" },
  { productId: "token_contract_risk_scan", envName: "NEXT_PUBLIC_PAYSTACK_LINK_TOKEN_CONTRACT_RISK_SCAN" },
  { productId: "approval_risk_check", envName: "NEXT_PUBLIC_PAYSTACK_LINK_APPROVAL_RISK_CHECK" },
  { productId: "detailed_wallet_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_WALLET_REVIEW" },
  { productId: "detailed_transaction_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_TRANSACTION_REVIEW" },
  { productId: "detailed_agent_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_DETAILED_AGENT_REVIEW" },
  { productId: "deep_contract_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_DEEP_CONTRACT_REVIEW" },
  { productId: "weekly_premium_access", envName: "NEXT_PUBLIC_PAYSTACK_LINK_WEEKLY_PREMIUM" },
  { productId: "priority_scam_report_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_PRIORITY_SCAM_REPORT" },
  { productId: "agent_verification_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_AGENT_VERIFICATION" },
  { productId: "group_community_safety_review", envName: "NEXT_PUBLIC_PAYSTACK_LINK_GROUP_SAFETY_REVIEW" },
  { productId: "developer_prelaunch_scan", envName: "NEXT_PUBLIC_PAYSTACK_LINK_DEVELOPER_PRELAUNCH_SCAN" },
  { productId: "founding_partner_package", envName: "NEXT_PUBLIC_PAYSTACK_LINK_FOUNDING_PARTNER" }
];

const POLAR_LINK_ENVS: PolarLinkEnv[] = [
  { productId: "quick_wallet_check", envName: "NEXT_PUBLIC_POLAR_LINK_QUICK_WALLET_CHECK" },
  { productId: "quick_transaction_check", envName: "NEXT_PUBLIC_POLAR_LINK_QUICK_TRANSACTION_CHECK" },
  { productId: "quick_agent_check", envName: "NEXT_PUBLIC_POLAR_LINK_QUICK_AGENT_CHECK" },
  { productId: "quick_contract_scan", envName: "NEXT_PUBLIC_POLAR_LINK_QUICK_CONTRACT_SCAN" },
  { productId: "token_contract_risk_scan", envName: "NEXT_PUBLIC_POLAR_LINK_TOKEN_CONTRACT_RISK_SCAN" },
  { productId: "approval_risk_check", envName: "NEXT_PUBLIC_POLAR_LINK_APPROVAL_RISK_CHECK" },
  { productId: "detailed_wallet_review", envName: "NEXT_PUBLIC_POLAR_LINK_DETAILED_WALLET_REVIEW" },
  { productId: "detailed_transaction_review", envName: "NEXT_PUBLIC_POLAR_LINK_DETAILED_TRANSACTION_REVIEW" },
  { productId: "detailed_agent_review", envName: "NEXT_PUBLIC_POLAR_LINK_DETAILED_AGENT_REVIEW" },
  { productId: "deep_contract_review", envName: "NEXT_PUBLIC_POLAR_LINK_DEEP_CONTRACT_REVIEW" },
  { productId: "weekly_premium_access", envName: "NEXT_PUBLIC_POLAR_LINK_WEEKLY_PREMIUM" },
  { productId: "priority_scam_report_review", envName: "NEXT_PUBLIC_POLAR_LINK_PRIORITY_SCAM_REPORT" },
  { productId: "agent_verification_review", envName: "NEXT_PUBLIC_POLAR_LINK_AGENT_VERIFICATION" },
  { productId: "group_community_safety_review", envName: "NEXT_PUBLIC_POLAR_LINK_GROUP_SAFETY_REVIEW" },
  { productId: "developer_prelaunch_scan", envName: "NEXT_PUBLIC_POLAR_LINK_DEVELOPER_PRELAUNCH_SCAN" },
  { productId: "founding_partner_package", envName: "NEXT_PUBLIC_POLAR_LINK_FOUNDING_PARTNER" }
];

export type CryptoWalletRail = {
  label: string;
  envName: string;
  address?: string;
  destinationTag?: string;
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

export function getPolarPaymentLinks(): Partial<Record<ProductId, string>> {
  return POLAR_LINK_ENVS.reduce<Partial<Record<ProductId, string>>>((links, item) => {
    const value = readEnv(item.envName);
    if (value) links[item.productId] = value;
    return links;
  }, {});
}

function polarProductEnvName(productId: ProductId): string {
  return `POLAR_PRODUCT_ID_${productId.toUpperCase()}`;
}

const POLAR_PRODUCT_ID_ENV_ALIASES: Partial<Record<ProductId, string[]>> = {
  quick_wallet_check: ["POLAR_PRODUCT_ID__QUICK_WALLET_CHECK"],
  quick_transaction_check: ["POLAR_PRODUCT_ID__QUICK_TRANSACTION_CHECK"],
  quick_agent_check: ["POLAR_PRODUCT_ID__QUICK_AGENT_CHECK"],
  weekly_premium_access: ["POLAR_PRODUCT_ID_WEEKLY_PREMIUM"],
  priority_scam_report_review: ["POLAR_PRODUCT_ID_PRIORITY_SCAM_REPORT"],
  agent_verification_review: ["POLAR_PRODUCT_ID_AGENT_VERIFICATION"],
  group_community_safety_review: ["POLAR_PRODUCT_ID_GROUP_SAFETY_REVIEW"],
  founding_partner_package: ["POLAR_PRODUCT_ID_FOUNDING_PARTNER"]
};

export function getPolarProductId(productId: ProductId): string | undefined {
  const canonical = readEnv(polarProductEnvName(productId));
  if (canonical) return canonical;

  const aliases = POLAR_PRODUCT_ID_ENV_ALIASES[productId] || [];
  for (const alias of aliases) {
    const value = readEnv(alias);
    if (value) return value;
  }

  return undefined;
}

export function getPolarServerConfig() {
  const server = readEnv("POLAR_SERVER");
  const polarServer: "sandbox" | "production" = server === "sandbox" ? "sandbox" : "production";
  return {
    accessTokenConfigured: Boolean(readEnv("POLAR_ACCESS_TOKEN")),
    webhookSecretConfigured: Boolean(readEnv("POLAR_WEBHOOK_SECRET")),
    server: polarServer,
    successUrl: readEnv("POLAR_SUCCESS_URL"),
    returnUrl: readEnv("POLAR_RETURN_URL") || readEnv("NEXT_PUBLIC_SITE_URL")
  };
}

export function buildPolarCheckoutUrl(productId: ProductId, referenceId?: string): string | undefined {
  const polarProductId = getPolarProductId(productId);
  const siteUrl = readEnv("NEXT_PUBLIC_SITE_URL");
  const apiCheckoutAvailable = polarProductId && readEnv("POLAR_ACCESS_TOKEN") && siteUrl;
  const baseUrl = apiCheckoutAvailable ? `${siteUrl.replace(/\/$/, "")}/api/polar/checkout` : getPolarPaymentLinks()[productId];
  if (!baseUrl) return undefined;

  const url = new URL(baseUrl);
  if (apiCheckoutAvailable) {
    url.searchParams.set("productId", productId);
    url.searchParams.set("products", polarProductId);
    const metadata = {
      session_id: referenceId || "",
      product_id: productId,
      source: "8thguard"
    };
    url.searchParams.set("metadata", JSON.stringify(metadata));
    if (referenceId) url.searchParams.set("customerExternalId", referenceId);
  } else if (referenceId) {
    url.searchParams.set("reference_id", referenceId);
  }
  url.searchParams.set("utm_source", "8thguard");
  url.searchParams.set("utm_medium", "telegram_web");
  return url.toString();
}

export function buildPaymentPageUrl(productId?: ProductId, referenceId?: string): string | undefined {
  const siteUrl = readEnv("NEXT_PUBLIC_SITE_URL");
  if (!siteUrl) return undefined;

  const url = new URL(`${siteUrl.replace(/\/$/, "")}/pay`);
  if (productId) url.searchParams.set("product", productId);
  if (referenceId) url.searchParams.set("session_id", referenceId);
  url.searchParams.set("utm_source", "8thguard");
  url.searchParams.set("utm_medium", "telegram_web");
  return url.toString();
}

export function getPaymentContact() {
  return {
    contactHandle: readEnv("NEXT_PUBLIC_CONTACT_HANDLE"),
    officialTelegram: readEnv("NEXT_PUBLIC_OFFICIAL_TELEGRAM"),
    siteUrl: readEnv("NEXT_PUBLIC_SITE_URL")
  };
}

export function getPublicCryptoWallets(): CryptoWalletRail[] {
  return [
    { label: "XRP", envName: "NEXT_PUBLIC_CRYPTO_XRP_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_XRP_ADDRESS"), destinationTag: readEnv("NEXT_PUBLIC_CRYPTO_XRP_DESTINATION_TAG") },
    { label: "BTC", envName: "NEXT_PUBLIC_CRYPTO_BTC_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_BTC_ADDRESS") },
    { label: "USDT TRC20", envName: "NEXT_PUBLIC_CRYPTO_USDT_TRC20_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_USDT_TRC20_ADDRESS") },
    { label: "USDT BEP20 / EVM", envName: "NEXT_PUBLIC_CRYPTO_USDT_BEP20_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_USDT_BEP20_ADDRESS") },
    { label: "ETH / EVM rails", envName: "NEXT_PUBLIC_CRYPTO_ETH_EVM_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_ETH_EVM_ADDRESS") },
    { label: "TON / USDT on TON", envName: "NEXT_PUBLIC_CRYPTO_TON_ADDRESS", address: readEnv("NEXT_PUBLIC_CRYPTO_TON_ADDRESS") },
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
