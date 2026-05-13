# Protection Engine Architecture

The protection engine evaluates transaction context before funds move.

Responsibilities:
- call chain adapters
- call risk scoring facade
- attach source confidence
- request fee quote
- create payment session
- emit audit logs
- route to manual review or future protected flow

It must not sign transactions, store keys, request seed phrases, or custody user funds.
