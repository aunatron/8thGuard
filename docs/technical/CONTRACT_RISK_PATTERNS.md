# Contract Risk Patterns

v0 looks for early contract risk signals in available source code. Signals are indicators for review, not proof of malicious intent.

## Pattern Set

- Owner/admin control: privileged owner, role, or admin paths.
- Mint function: functions that can increase supply.
- Burn function: functions that can alter supply or balances.
- Pause/unpause: controls that can stop transfers or activity.
- Blacklist/whitelist: address restriction controls.
- setTax/setFee: mutable fee or tax logic.
- Transfer restriction: max transaction, max wallet, cooldown, or trading toggle controls.
- Upgradeable/proxy pattern: proxy or implementation-change risk.
- Approve/allowance/spender danger: approval and transferFrom behavior that should be reviewed before signing.
- selfdestruct/delegatecall: severe execution and implementation-control risks.
- Hidden external calls: low-level calls, assembly, or external routing that needs deeper review.
- Unverified source: source not available yet.
- Suspicious function names: names commonly associated with launch controls or hidden restrictions.

## Scoring

Each signal contributes to a bounded 0-100 score. The score is a prioritization aid for paid review, not a final fraud verdict.

## Limits

Pattern matching can miss renamed logic, obfuscated code, inherited behavior, proxy implementation changes, and runtime-only behavior. It can also flag legitimate admin controls that are properly disclosed and governed.
