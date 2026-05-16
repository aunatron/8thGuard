# Smart Contract Risk Analyzer

8thGuard Smart Contract Risk Analyzer v0 gives users an automated risk preview before they buy tokens, approve spenders, interact with dApps, or send funds.

## Product Boundary

- This is not a full formal audit.
- Results are early contract risk signals, not final fraud proof.
- 8thGuard does not ask for seed phrases, private keys, or wallet passwords.
- No escrow, custody, exchange, trading, or user-to-user settlement is added by this feature.
- Full contract risk reports are paid utility.

## v0 Scope

The v0 scanner validates the chain and contract address, detects EVM `0x` contract format, generates explorer links, checks whether source/API lookup keys are configured, and runs static pattern checks only when source code is provided or available.

When source is not available, v0 returns an explorer-only preview with a clear source status and a paid report CTA.

## Telegram Commands

- `/scan_contract <chain> <contract_address>`
- `/scan_token <chain> <token_address>`
- `/approval_check <chain> <spender_contract>`
- `/contract_pricing`

Private chat output includes up to four signals and a CTA to `/contract_pricing`. Group output stays short and tells users to DM the bot for the paid report.

## Paid Utility

Contract analyzer products:

- Quick Contract Scan
- Token Contract Risk Scan
- Approval Risk Check
- Deep Contract Review
- Developer Pre-Launch Scan

Free education remains separate from paid utility. Checks and reviews are paid services.
