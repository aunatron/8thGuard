# Data Source Failure Handling

External data providers can fail, rate limit, or return incomplete data. 8thGuard must continue responding safely.

## Rules
- Use short request timeouts.
- Catch external API errors.
- Return partial results with explorer links where possible.
- Do not expose raw provider errors to users.
- Do not crash `/api/telegram/webhook`.
- Do not call too many APIs per request.

The current EVM implementation checks Ethereum through Etherscan V2 when configured and provides explorer links for other EVM networks.
