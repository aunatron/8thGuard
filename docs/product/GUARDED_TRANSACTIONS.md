# Guarded Transactions

Guarded Transactions are a future 8thGuard product direction, not a live MVP capability.

The intended flow is pre-transaction: user enters chain, token, amount, receiver wallet, and optional agent context. 8thGuard checks wallet intelligence, transaction risk indicators, agent signals, and payment context before funds move.

Current status:
- Architecture-ready only.
- No production escrow.
- No production custody.
- No private key or seed phrase handling.
- No automated protected sending live yet.

The goal is to keep 8thGuard in the "before" moment: pause, check, quote fees, and help the user decide.
