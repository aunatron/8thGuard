# Contract Analyzer Architecture

Smart Contract Risk Analyzer v0 is a lightweight Vercel-safe preview layer.

## Runtime Flow

1. Telegram receives `/scan_contract`, `/scan_token`, or `/approval_check`.
2. `apps/web/src/lib/contracts/detect.ts` normalizes chain input, validates EVM address format, and creates explorer links.
3. `apps/web/src/lib/contracts/analyze.ts` checks source availability, runs static pattern checks when source is present, calculates score, and returns a qualified preview.
4. `apps/web/src/lib/contracts/report.ts` formats private and group Telegram responses.

## Source Handling

v0 does not run heavy scanner jobs inside Vercel. If source is provided or later fetched through configured explorer APIs, lightweight static checks can run in-process. If source is unavailable, the preview stays explorer-only and says source is not available yet.

## Future Worker Path

Heavy analysis should move to a queue-backed worker:

- Vercel route records a scan request.
- `scan_jobs` stores job status and requested analyzer type.
- A worker fetches verified source or receives developer-submitted source.
- Slither, Mythril, Echidna, and transaction simulation run outside Vercel.
- Results are normalized into `contract_reports` and `contract_risk_signals`.
- Telegram or web surfaces show a paid report summary.

## Why Not Run Heavy Scans In Vercel

Slither, Mythril, Echidna, compiler installs, symbolic execution, and fuzzing can exceed serverless execution time, memory, filesystem, and dependency limits. They also need stronger isolation because contract source can be untrusted input.

Vercel should orchestrate requests, payments, and report delivery. Worker infrastructure should perform heavyweight analysis.
