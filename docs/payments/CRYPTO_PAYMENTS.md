# Crypto Payments

8thGuard supports direct crypto wallet payment instructions for 8thGuard digital services only. Users pay from their own wallets and submit public-chain transaction evidence for confirmation.

## Boundaries
- No escrow.
- No custody.
- No exchange or trading.
- No user-to-user settlement.
- No private key or seed phrase handling.

## Manual flow
1. User selects a service from `/pricing`.
2. User confirms the exact official wallet rail from `/crypto_pay`.
3. User sends the quoted amount on the exact network.
4. User prepares the transaction hash and service context for `/submit_payment`.
5. 8thGuard confirms the payment evidence and routes the requested service.

Wrong-network payments may be unrecoverable. Users should only follow official bot or website instructions.
