export type ProductId =
  | "detailed_wallet_review"
  | "detailed_transaction_review"
  | "agent_risk_review"
  | "priority_scam_report_review"
  | "weekly_early_access_supporter"
  | "agent_verification_review"
  | "group_community_safety_review"
  | "founding_supporter_package";

export type Product = {
  id: ProductId;
  name: string;
  priceUsd: number;
  description: string;
};

export const FREE_MVP_OFFER = {
  name: "Basic checks",
  priceUsd: 0,
  description: "Free during MVP"
} as const;

export const PRODUCTS: Product[] = [
  {
    id: "detailed_wallet_review",
    name: "Detailed Wallet Review",
    priceUsd: 4.99,
    description: "Manual review of wallet risk indicators during MVP."
  },
  {
    id: "detailed_transaction_review",
    name: "Detailed Transaction Review",
    priceUsd: 4.99,
    description: "Manual review of a transaction hash during MVP."
  },
  {
    id: "agent_risk_review",
    name: "Agent Risk Review",
    priceUsd: 4.99,
    description: "Manual review of P2P agent risk indicators during MVP."
  },
  {
    id: "priority_scam_report_review",
    name: "Priority Scam Report Review",
    priceUsd: 9.99,
    description: "Priority guidance for scam-report evidence during MVP."
  },
  {
    id: "weekly_early_access_supporter",
    name: "Weekly Early-Access Supporter",
    priceUsd: 14.99,
    description: "Early supporter access, priority feedback, and updates during MVP."
  },
  {
    id: "agent_verification_review",
    name: "Agent Verification Review",
    priceUsd: 29.99,
    description: "Early agent review for future verification registry readiness. Do not call it final verification."
  },
  {
    id: "group_community_safety_review",
    name: "Group/Community Safety Review",
    priceUsd: 49.99,
    description: "Safety review for Telegram/WhatsApp crypto groups and communities."
  },
  {
    id: "founding_supporter_package",
    name: "Founding Supporter Package",
    priceUsd: 99.99,
    description: "Founding supporter package with priority access and multiple manual reviews during MVP."
  }
];

export const PRODUCT_BY_ID: Record<ProductId, Product> = PRODUCTS.reduce(
  (acc, product) => ({ ...acc, [product.id]: product }),
  {} as Record<ProductId, Product>
);

export const PRICING_NOTES = [
  "Prices may change as MVP evolves.",
  "USD is the reference price.",
  "Paystack/MoMo/card/bank may convert to local currency at checkout.",
  "Crypto payments use USDT/USDC equivalent or quoted crypto amount."
];

export function formatUsd(priceUsd: number): string {
  return priceUsd === 0 ? "Free" : `$${priceUsd.toFixed(2)}`;
}
