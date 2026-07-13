---
"@bgd-labs/toolbox": patch
"@bgd-labs/cli": patch
---

Add contract verification tooling under `@bgd-labs/toolbox/verification`, exposed through the CLI.

`validateVerification` downloads a contract's source from the explorer, recompiles it locally with the exact solc version (via lib-sourcify) and independently checks it against the on-chain runtime bytecode — instead of trusting the explorer's "verified" badge. Proxies are followed via EIP-1967. CLI: `cli validateVerification --contractAddress <addr> --chainId <id>`.

`migrateVerification` copies a contract's verification from a `from` endpoint to a `to` endpoint: it downloads the verified source, normalizes it to a solc standard-json input and republishes it — skipping anything the target already verified and following EIP-1967 proxies (migrating both the proxy shell and its implementation). `from` and `to` each carry their own chain/address/explorer, so a source verified on one network can be reused to verify the same deployment on another (e.g. Ethereum → Optimism). CLI: `cli migrateVerification --fromContract <addr> --fromChainId <id> --toExplorer blockscout` (add `--toContract` / `--toChainId` to cross addresses or chains).

Both commands accept a `--config <path>` JSON file to run in batch over many contracts (`expandValidateConfig` / `expandMigrateConfig` / `validateVerificationBatch` / `migrateVerificationBatch` are exported for programmatic use).

New explorer helpers `isVerified`, `verifySourceCode`, `checkVerificationStatus` and `waitForVerification` sit next to `getSourceCode` and speak the etherscan-compatible verify API (etherscan, routescan, blockscout, and OKLink via its etherscan-compatible plugin endpoint). The source normalizer also handles single-wrapped standard-json sources (as OKLink returns them), so OKLink works as both a source and a target.

Sourcify is supported too (as a source and a target, for both validate and migrate) via its own v2 API — `getSourceCode` / `verifySourceCode` / `checkVerificationStatus` route to Sourcify's `/v2/contract` (read) and `/v2/verify` (submit + poll by `verificationId`) endpoints. Like OKLink, Sourcify needs no API key.

