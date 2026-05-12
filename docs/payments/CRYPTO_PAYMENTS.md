# Crypto Payments

Current MVP supports direct crypto wallet payment instructions for 8thGuard digital services only. Automated payment verification is not fully live yet.

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
5. 8thGuard manually reviews the payment and requested service.

Wrong-network payments may be unrecoverable. Users should only follow official bot or website instructions.
