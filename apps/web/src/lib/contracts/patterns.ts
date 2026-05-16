export type ContractRiskPatternId =
  | "owner_admin_control"
  | "mint_function"
  | "burn_function"
  | "pause_unpause"
  | "blacklist_whitelist"
  | "tax_fee_control"
  | "transfer_restriction"
  | "upgradeable_proxy"
  | "approval_spender_danger"
  | "selfdestruct_delegatecall"
  | "hidden_external_call"
  | "unverified_source"
  | "suspicious_function_name";

export type ContractRiskSeverity = "low" | "medium" | "high" | "critical";

export type ContractRiskPattern = {
  id: ContractRiskPatternId;
  label: string;
  severity: ContractRiskSeverity;
  score: number;
  tests: RegExp[];
};

export type ContractRiskSignal = {
  id: ContractRiskPatternId;
  label: string;
  severity: ContractRiskSeverity;
  score: number;
};

export const CONTRACT_RISK_PATTERNS: ContractRiskPattern[] = [
  {
    id: "owner_admin_control",
    label: "Owner/admin control can change sensitive contract behavior.",
    severity: "medium",
    score: 14,
    tests: [/\bonlyOwner\b/i, /\bowner\(\)/i, /\bOwnable\b/i, /\bDEFAULT_ADMIN_ROLE\b/i, /\badmin\b/i]
  },
  {
    id: "mint_function",
    label: "Mint capability may increase token supply after launch.",
    severity: "high",
    score: 18,
    tests: [/\bmint\s*\(/i, /\b_mint\s*\(/i]
  },
  {
    id: "burn_function",
    label: "Burn capability can alter supply or balances.",
    severity: "low",
    score: 6,
    tests: [/\bburn\s*\(/i, /\b_burn\s*\(/i]
  },
  {
    id: "pause_unpause",
    label: "Pause/unpause controls may stop transfers or contract activity.",
    severity: "high",
    score: 16,
    tests: [/\bPausable\b/i, /\bpause\s*\(/i, /\bunpause\s*\(/i, /\b_paused\b/i]
  },
  {
    id: "blacklist_whitelist",
    label: "Blacklist/whitelist logic may restrict who can transfer.",
    severity: "high",
    score: 18,
    tests: [/\bblacklist/i, /\bwhitelist/i, /\bisBlacklisted\b/i, /\bblocked\b/i, /\ballowed\b/i]
  },
  {
    id: "tax_fee_control",
    label: "Tax or fee controls may change transfer costs.",
    severity: "high",
    score: 17,
    tests: [/\bsetTax\s*\(/i, /\bsetFee\s*\(/i, /\btaxFee\b/i, /\bmarketingFee\b/i, /\bbuyTax\b/i, /\bsellTax\b/i]
  },
  {
    id: "transfer_restriction",
    label: "Transfer restriction logic may block sells or wallet movement.",
    severity: "high",
    score: 18,
    tests: [/\b_canTransfer\b/i, /\bmaxTx/i, /\bmaxWallet/i, /\btradingEnabled\b/i, /\btransferDelay\b/i, /\bcooldown\b/i]
  },
  {
    id: "upgradeable_proxy",
    label: "Upgradeable/proxy pattern can change implementation after deployment.",
    severity: "high",
    score: 20,
    tests: [/\bdelegatecall\b/i, /\bUpgradeable\b/i, /\bUUPSUpgradeable\b/i, /\bTransparentUpgradeableProxy\b/i, /\bERC1967\b/i]
  },
  {
    id: "approval_spender_danger",
    label: "Approval/allowance logic needs spender review before signing.",
    severity: "medium",
    score: 12,
    tests: [/\bapprove\s*\(/i, /\ballowance\s*\(/i, /\btransferFrom\s*\(/i, /\bincreaseAllowance\s*\(/i, /\bspender\b/i]
  },
  {
    id: "selfdestruct_delegatecall",
    label: "Selfdestruct or delegatecall can create severe execution risk.",
    severity: "critical",
    score: 28,
    tests: [/\bselfdestruct\s*\(/i, /\bsuicide\s*\(/i, /\bdelegatecall\b/i]
  },
  {
    id: "hidden_external_call",
    label: "Hidden external call pattern may route control outside the contract.",
    severity: "high",
    score: 18,
    tests: [/\.call\s*\{/i, /\.call\s*\(/i, /\blowLevelCall\b/i, /\bfunctionCall\b/i, /\bassembly\s*\{/i]
  },
  {
    id: "suspicious_function_name",
    label: "Suspicious function naming deserves deeper manual review.",
    severity: "medium",
    score: 12,
    tests: [/\brescueTokens\s*\(/i, /\bsetRouter\s*\(/i, /\bsetPair\s*\(/i, /\bremoveLimits\s*\(/i, /\bexcludeFromFee\s*\(/i]
  }
];

export const UNVERIFIED_SOURCE_SIGNAL: ContractRiskSignal = {
  id: "unverified_source",
  label: "Source is not available yet; preview is explorer-only.",
  severity: "medium",
  score: 16
};

export function scanContractSource(sourceCode: string): ContractRiskSignal[] {
  const source = sourceCode.trim();
  if (!source) return [];

  return CONTRACT_RISK_PATTERNS.flatMap((pattern) => {
    const matched = pattern.tests.some((test) => test.test(source));
    if (!matched) return [];
    return [{ id: pattern.id, label: pattern.label, severity: pattern.severity, score: pattern.score }];
  });
}
