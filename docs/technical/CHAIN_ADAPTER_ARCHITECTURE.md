# Chain Adapter Architecture

Adapters should normalize chain-specific wallet, transaction, and fee data without exposing secrets to the frontend.

Initial adapter families:
- EVM: Ethereum, BNB Smart Chain, Base, Polygon, later Arbitrum and Optimism.
- TRON: TronLink and USDT TRC20 awareness.
- TON: Tonkeeper and TON/USDT on TON awareness.
- Solana: Phantom-compatible public key and transaction signature awareness.
- Bitcoin: BTC address, transaction, and future multisig/PSBT readiness.
- XRP: Xaman/XRPL address, transaction, and destination tag awareness.

Adapters return source status, confidence, explorer links, and normalized risk signals. API failures must return partial results, not crash the bot.
