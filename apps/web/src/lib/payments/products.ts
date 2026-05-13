export type ProductId =
  | "detailed_wallet_review"
  | "detailed_transaction_review"
  | "agent_risk_review"
  | "priority_scam_report_review"
  | "weekly_early_access_supporter"
  | "agent_verification_review"
  | "group_community_safety_review"
  | "founding_supporter_package"
  | "rapid_wallet_risk_review"
  | "priority_scam_case_triage"
  | "agent_group_safety_review"
  | "business_community_safety_review"
  | "founder_protection_package"
  | "same_day_response_desk";

export type Product = {
  id: ProductId;
  name: string;
  priceUsd: number;
  description: string;
};

export const FREE_BASIC_OFFER = {
  name: "Basic checks",
  priceUsd: 0,
  description: "Free automated first-pass checks"
} as const;

export const PRODUCTS: Product[] = [
  {
    id: "detailed_wallet_review",
    name: "Detailed Wallet Review",
    priceUsd: 4.99,
    description: "Manual review of wallet risk indicators."
  },
  {
    id: "detailed_transaction_review",
    name: "Detailed Transaction Review",
    priceUsd: 4.99,
    description: "Manual review of a transaction hash."
  },
  {
    id: "agent_risk_review",
    name: "Agent Risk Review",
    priceUsd: 4.99,
    description: "Manual review of P2P agent risk indicators."
  },
  {
    id: "priority_scam_report_review",
    name: "Priority Scam Report Review",
    priceUsd: 9.99,
    description: "Priority guidance for scam-report evidence."
  },
  {
    id: "weekly_early_access_supporter",
    name: "Weekly Early-Access Supporter",
    priceUsd: 14.99,
    description: "Supporter access, priority feedback, and updates."
  },
  {
    id: "agent_verification_review",
    name: "Agent Verification Review",
    priceUsd: 29.99,
    description: "Agent review for future verification registry readiness. Do not call it final verification."
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
    description: "Founding supporter package with priority access and multiple manual reviews."
  },
  {
    id: "rapid_wallet_risk_review",
    name: "Rapid Wallet Risk Review",
    priceUsd: 49,
    description: "Same-day wallet review summary for a single address, where capacity allows."
  },
  {
    id: "priority_scam_case_triage",
    name: "Priority Scam Case Triage",
    priceUsd: 99,
    description: "Priority review of wallet, transaction, agent, and evidence context for one urgent case."
  },
  {
    id: "agent_group_safety_review",
    name: "Agent/Group Safety Review",
    priceUsd: 149,
    description: "Review of a P2P agent, Telegram/WhatsApp group, payment flow, and visible risk signals."
  },
  {
    id: "business_community_safety_review",
    name: "Business/Community Safety Review",
    priceUsd: 299,
    description: "Safety review for a team, trader community, group admins, or high-activity P2P desk."
  },
  {
    id: "founder_protection_package",
    name: "Founder Protection Package",
    priceUsd: 499,
    description: "Priority protection package with multiple manual reviews and safety recommendations."
  },
  {
    id: "same_day_response_desk",
    name: "Same-Day Response Desk",
    priceUsd: 999,
    description: "High-priority response desk for several related wallets, transactions, agents, or groups."
  }
];

export const PRODUCT_BY_ID: Record<ProductId, Product> = PRODUCTS.reduce(
  (acc, product) => ({ ...acc, [product.id]: product }),
  {} as Record<ProductId, Product>
);

export const PRICING_NOTES = [
  "Prices may change as the service evolves.",
  "USD is the reference price.",
  "Paystack/MoMo/card/bank may convert to local currency at checkout.",
  "Crypto payments use USDT/USDC equivalent or quoted crypto amount."
];

export function formatUsd(priceUsd: number): string {
  return priceUsd === 0 ? "Free" : `$${priceUsd.toFixed(2)}`;
}
