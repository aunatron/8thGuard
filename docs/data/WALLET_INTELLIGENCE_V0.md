# Wallet Intelligence v0

Wallet Intelligence v0 provides early risk signals using:
- address format detection
- possible network detection
- explorer links
- limited live public lookups where feasible
- internal report lookup placeholder
- external scam database placeholder

## Live or partial lookups
- Bitcoin: mempool.space address endpoint.
- Solana: JSON-RPC `getBalance`.
- XRP: JSON-RPC `account_info`.
- EVM: Etherscan V2 Ethereum balance when `ETHERSCAN_API_KEY` is configured.
- TRON: TronGrid account endpoint when `TRONGRID_API_KEY` is configured.
- TON: TONAPI or TON Center when an API key is configured.

Every response must say the result is an MVP result and not final fraud proof.
