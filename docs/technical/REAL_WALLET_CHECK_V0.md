# Real Wallet Check v0

The code lives in `apps/web/src/lib/wallet`.

## Modules
- `detect.ts`: chain/address format detection.
- `explorers.ts`: wallet and transaction explorer links.
- `sources.ts`: public API calls with timeout and no-crash fallbacks.
- `realCheck.ts`: scoring and response orchestration.

## Scoring v0
- Unknown format: higher caution.
- Valid format without live data: medium caution.
- Existing account or transaction history: lower caution unless reports exist later.
- New, empty, unfunded, or unactivated accounts: medium caution.
- Internal report matches are planned for future high-risk scoring.

The system never claims final fraud proof.
