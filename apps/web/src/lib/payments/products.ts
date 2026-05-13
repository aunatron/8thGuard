export type ProductId =
  | "quick_wallet_check"
  | "quick_transaction_check"
  | "quick_agent_check"
  | "detailed_wallet_review"
  | "detailed_transaction_review"
  | "detailed_agent_review"
  | "weekly_premium_access"
  | "priority_scam_report_review"
  | "agent_verification_review"
  | "group_community_safety_review"
  | "founding_partner_package";

export type ProductTier = "quick" | "premium" | "enterprise" | "supporter";

export type PaymentProduct = {
  id: ProductId;
  name: string;
  priceUsd: number;
  priceGhs: number;
  paystackSubunit: number;
  description: string;
  serviceType: string;
  requiresInput: boolean;
  inputLabel: string;
  tier: ProductTier;
};

export type CurrencyCode = "USD" | "GBP" | "EUR" | "JPY" | "NGN" | "GHS";

export const PRICING_RATES: Record<Exclude<CurrencyCode, "USD">, number> = {
  GBP: 0.7378,
  EUR: 0.8527,
  JPY: 156.94,
  NGN: 1360.34,
  GHS: 12.5
};

export const PRODUCTS: PaymentProduct[] = [
  {
    id: "quick_wallet_check",
    name: "Quick Wallet Check",
    priceUsd: 4.99,
    priceGhs: 65,
    paystackSubunit: 6500,
    description: "Fast wallet intelligence preview for one crypto address.",
    serviceType: "wallet_check",
    requiresInput: true,
    inputLabel: "Wallet address",
    tier: "quick"
  },
  {
    id: "quick_transaction_check",
    name: "Quick Transaction Check",
    priceUsd: 4.99,
    priceGhs: 65,
    paystackSubunit: 6500,
    description: "Fast transaction hash review with likely network and explorer guidance.",
    serviceType: "transaction_check",
    requiresInput: true,
    inputLabel: "Transaction hash",
    tier: "quick"
  },
  {
    id: "quick_agent_check",
    name: "Quick Agent Check",
    priceUsd: 4.99,
    priceGhs: 65,
    paystackSubunit: 6500,
    description: "Fast P2P agent or username risk indicator review.",
    serviceType: "agent_check",
    requiresInput: true,
    inputLabel: "Agent name or username",
    tier: "quick"
  },
  {
    id: "detailed_wallet_review",
    name: "Detailed Wallet Review",
    priceUsd: 9.99,
    priceGhs: 125,
    paystackSubunit: 12500,
    description: "Manual wallet review with context, explorer links, and risk notes.",
    serviceType: "wallet_review",
    requiresInput: true,
    inputLabel: "Wallet address and context",
    tier: "premium"
  },
  {
    id: "detailed_transaction_review",
    name: "Detailed Transaction Review",
    priceUsd: 9.99,
    priceGhs: 125,
    paystackSubunit: 12500,
    description: "Manual transaction review for hash, token, recipient, amount, and timing.",
    serviceType: "transaction_review",
    requiresInput: true,
    inputLabel: "Transaction hash and context",
    tier: "premium"
  },
  {
    id: "detailed_agent_review",
    name: "Detailed Agent Review",
    priceUsd: 9.99,
    priceGhs: 125,
    paystackSubunit: 12500,
    description: "Manual review of P2P agent signals, identity consistency, and payment context.",
    serviceType: "agent_review",
    requiresInput: true,
    inputLabel: "Agent username and context",
    tier: "premium"
  },
  {
    id: "weekly_premium_access",
    name: "Weekly Premium Access",
    priceUsd: 14.99,
    priceGhs: 190,
    paystackSubunit: 19000,
    description: "Weekly access for multiple safety checks, priority feedback, and safety guidance.",
    serviceType: "premium_access",
    requiresInput: false,
    inputLabel: "Telegram contact",
    tier: "supporter"
  },
  {
    id: "priority_scam_report_review",
    name: "Priority Scam Report Review",
    priceUsd: 24.99,
    priceGhs: 315,
    paystackSubunit: 31500,
    description: "Priority evidence review for a scam report, wallet, transaction, agent, and timeline.",
    serviceType: "scam_report_review",
    requiresInput: true,
    inputLabel: "Evidence summary",
    tier: "premium"
  },
  {
    id: "agent_verification_review",
    name: "Agent Verification Review",
    priceUsd: 49.99,
    priceGhs: 625,
    paystackSubunit: 62500,
    description: "P2P agent review for registry readiness. Not final verification or endorsement.",
    serviceType: "agent_verification_review",
    requiresInput: true,
    inputLabel: "Agent profile and payment context",
    tier: "premium"
  },
  {
    id: "group_community_safety_review",
    name: "Group/Community Safety Review",
    priceUsd: 99.99,
    priceGhs: 1250,
    paystackSubunit: 125000,
    description: "Safety review for Telegram/WhatsApp crypto groups, admins, rails, and visible risk patterns.",
    serviceType: "community_safety_review",
    requiresInput: true,
    inputLabel: "Group/community details",
    tier: "enterprise"
  },
  {
    id: "founding_partner_package",
    name: "Founding Partner Package",
    priceUsd: 199.99,
    priceGhs: 2500,
    paystackSubunit: 250000,
    description: "Premium founding partner package with priority review access and multiple safety reviews.",
    serviceType: "founding_partner",
    requiresInput: false,
    inputLabel: "Telegram contact",
    tier: "enterprise"
  }
];

export const PRODUCT_BY_ID: Record<ProductId, PaymentProduct> = PRODUCTS.reduce(
  (acc, product) => ({ ...acc, [product.id]: product }),
  {} as Record<ProductId, PaymentProduct>
);

export const PRICING_NOTES = [
  "USD is the reference price.",
  "Global guide prices are shown in USD, GBP, EUR, JPY, NGN, and GHS.",
  "Local rails may settle in supported checkout currency.",
  "Crypto payments use USDT/USDC equivalent or quoted crypto amount."
];

export function getProducts(): PaymentProduct[] {
  return PRODUCTS;
}

export function getProductById(id: ProductId): PaymentProduct {
  return PRODUCT_BY_ID[id];
}

export function formatUsd(priceUsd: number): string {
  return `$${priceUsd.toFixed(2)}`;
}

export function formatGhs(priceGhs: number): string {
  return `GHS ${priceGhs.toLocaleString("en-US")}`;
}

export function formatCurrency(priceUsd: number, currency: CurrencyCode): string {
  if (currency === "USD") return formatUsd(priceUsd);
  const value = priceUsd * PRICING_RATES[currency];
  if (currency === "GBP") return `GBP ${value.toFixed(2)}`;
  if (currency === "EUR") return `EUR ${value.toFixed(2)}`;
  if (currency === "JPY") return `JPY ${Math.round(value).toLocaleString("en-US")}`;
  if (currency === "NGN") return `NGN ${Math.round(value).toLocaleString("en-US")}`;
  return formatGhs(Math.round(value / 5) * 5);
}

export function formatGlobalPrice(product: PaymentProduct): string {
  return [
    formatCurrency(product.priceUsd, "USD"),
    formatCurrency(product.priceUsd, "GBP"),
    formatCurrency(product.priceUsd, "EUR"),
    formatCurrency(product.priceUsd, "JPY"),
    formatCurrency(product.priceUsd, "NGN"),
    formatCurrency(product.priceUsd, "GHS")
  ].join(" / ");
}

export function formatProductLine(product: PaymentProduct): string {
  return `${product.name} - ${formatGlobalPrice(product)}`;
}
