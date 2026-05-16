# Contract Analyzer Limitations

Smart Contract Risk Analyzer v0 provides early contract risk signals only. It is not a full audit, formal verification, legal review, or final fraud proof.

## False Positives

The scanner may flag legitimate controls such as owner roles, pause controls, fee updates, or upgradeability when they are disclosed and governed appropriately.

## False Negatives

The scanner may miss:

- obfuscated malicious logic
- proxy implementation changes
- inherited behavior hidden across files
- runtime-only behavior
- off-chain admin practices
- social engineering around otherwise normal contracts
- exploitable issues that require symbolic execution or fuzzing

## User Safety

Users must never send seed phrases, private keys, wallet passwords, or unnecessary sensitive documents. 8thGuard does not custody funds and does not execute trades or approvals for users.

## Report Language

All outputs should use qualified language:

- early contract risk signals
- automated risk preview
- MVP result
- not a full audit

Avoid definitive claims that a contract is safe, fraudulent, guaranteed malicious, or fully audited.
