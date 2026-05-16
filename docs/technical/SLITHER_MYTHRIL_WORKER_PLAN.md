# Slither Mythril Worker Plan

Heavy smart-contract analysis should run outside the Vercel request path.

## Worker Jobs

Planned job types:

- `source_fetch`: fetch verified source and compiler metadata from explorers.
- `slither_static`: run Slither for static analysis findings.
- `mythril_symbolic`: run Mythril for symbolic execution and exploit-path indicators.
- `echidna_fuzz`: run Echidna property fuzzing for developer-submitted or paid deep scans.
- `simulation_preview`: future Tenderly-style transaction simulation for approvals, swaps, and token transfers.

## Queue Model

1. Vercel creates `scan_jobs` after payment or authorized preview request.
2. Worker leases a pending job.
3. Worker runs the analyzer in an isolated environment.
4. Worker writes normalized findings to `contract_reports` and `contract_risk_signals`.
5. Report delivery sends a Telegram/web notification.

## Isolation

Workers should treat source code and ABI metadata as untrusted input. Analyzer containers should be ephemeral, network-restricted where possible, and time-limited.

## MVP Constraint

The current MVP ships only lightweight static previews and explorer links. It does not run Slither, Mythril, Echidna, full formal verification, or transaction simulation inside Vercel.
