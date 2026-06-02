# @bgd-labs/cli

A cli tool to help with various web3 / solidity tasks. For a full overview of features you can run `@bgd-labs/cli --help`

## Installation

Make sure to setup your .env

```
# Used for code/storage diffs and for reading + publishing contract verification
# (etherscan, routescan). OKLink needs no key.
ETHERSCAN_API_KEY=

# Used for creating tenderly vnets
TENDERLY_ACCESS_TOKEN=
TENDERLY_PROJECT_SLUG=
TENDERLY_ACCOUNT=
```

Local installation
```
npm i @bgd-labs/cli
```

Global installation
```
npm i -g @bgd-labs/cli
```

Once installed you should be able to run commands via the `@bgd-labs/cli` or the cli binary.

Alteratively you can use `npx @bgd-labs/cli` to run the cli via npx.

## Code Diffs

`npx @bgd-labs/cli codeDiff` can be used to generate code diffs between two verified contracts

```
Usage: @bgd-labs/cli codeDiff [options]

generated the diff between any two addresses

Options:
  --address1 <address>
  --chainId1 <number>
  --address2 <address>
  --chainId2 <number>
  -f, --flatten
  -o, --output <format>   (choices: "stdout", "file", default: "stdout")
  -p, --path <path>       (default: "./diffs/code")
  -h, --help             display help for command
```

## Storage Diffs

`npx @bgd-labs/cli storageDiff` can be used to generate storage layout diffs between two contracts

```
Usage: @bgd-labs/cli storageDiff [options]

generated the storage diff between any two files

Options:
  --contract1 <Contract|path>
  --contract2 <Contract|path>
  -h, --help                   display help for command
```

## Aave Tenderly Vnets

`npx @bgd-labs/cli aave-vnet` can be used to create a tenderly virtual testnet to execute payloads

```
Usage: @bgd-labs/cli aave-vnet [options]

creates a tenderly virtual testnet and execute payloads

Options:
  -c,--chainId <number>
  -t, --tenderlyAccessToken <string>  defaults to env.TENDERLY_ACCESS_TOKEN
  -a, --tenderlyAccountSlug <string>  defaults to env.TENDERLY_ACCOUNT_SLUG
  -p, --tenderlyProjectSlug <string>  defaults to env.TENDERLY_PROJECT_SLUG
  -h, --help                          display help for command
```

## Validate Verification

`npx @bgd-labs/cli validateVerification` independently checks that the source an explorer serves for a contract actually compiles to the bytecode deployed on-chain. Instead of trusting the explorer's "verified" badge, it downloads the source + compiler settings, recompiles them locally with the exact solc version, and diffs the result against the live runtime bytecode (`perfect` = incl. metadata, `partial` = modulo metadata, `❌` = no match). Proxies are followed via EIP-1967, so the implementation is what gets checked. Exits non-zero when the source does not reproduce the on-chain bytecode.

```
Usage: @bgd-labs/cli validateVerification [options]

Options:
  --contractAddress <address>  address of the contract to verify
  --chainId <number>           chain id of the contract
  --rpc-url <url>              rpc url (defaults to the toolbox's resolved url)
  --explorer <name>            explorer to source verification data from
                               (choices: "etherscan", "blockscout", "routescan", "oklink")
  -o, --output <format>        (choices: "table", "json", default: "table")
  -h, --help                   display help for command
```

```sh
# verify the Aave V3 Pool — follows the proxy to its implementation
npx @bgd-labs/cli validateVerification --contractAddress 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2 --chainId 1

# force a specific explorer and emit json
npx @bgd-labs/cli validateVerification --contractAddress 0xa0208CE8356ad6C5EC6dFb8996c9A6B828212022 --chainId 1868 --explorer blockscout -o json
```

### Batch (`--config`)

Pass `--config <path>` to validate many contracts in one run (the flags above are ignored). The JSON has optional shared `defaults` plus a `contracts` list — each entry is a bare address (using the defaults) or an object overriding any of `chainId` / `explorer` / `rpcUrl`:

```json
{
  "defaults": { "chainId": 1, "explorer": "etherscan" },
  "contracts": [
    "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    { "address": "0xa0208CE8356ad6C5EC6dFb8996c9A6B828212022", "chainId": 1868, "explorer": "blockscout" }
  ]
}
```

```sh
npx @bgd-labs/cli validateVerification --config ./validate.json
```

## Migrate Verification

`npx @bgd-labs/cli migrateVerification` copies a contract's verification from one explorer to another — optionally on a different chain. It downloads the verified source from the `from` side, normalizes it to a solc standard-json input, and republishes it on the `to` side, skipping anything already verified and following EIP-1967 proxies (migrating both the proxy shell and its implementation). Because `from` and `to` are independent, a source verified on one network can be reused to verify the same deployment on another (e.g. Ethereum → Optimism).

For the common **same-chain** case only `--fromContract`, `--fromChainId` and `--toExplorer` are required — `--toContract`/`--toChainId` default to the `from` values and `--fromExplorer` auto-detects the chain's prioritized explorer.

```
Usage: @bgd-labs/cli migrateVerification [options]

Options:
  --fromContract <address>  address of the verified source contract
  --fromChainId <number>    chain id of the source contract
  --toExplorer <name>       explorer to publish the verification to
                            (choices: "etherscan", "blockscout", "routescan", "oklink")
  --toContract <address>    address to verify on the target (defaults to --fromContract)
  --toChainId <number>      chain id of the target contract (defaults to --fromChainId)
  --fromExplorer <name>     explorer to read the source from (defaults to the chain's prioritized explorer)
  --fromApiKey <key>        source explorer api key (defaults to env.ETHERSCAN_API_KEY)
  --toApiKey <key>          target explorer api key (defaults to env.ETHERSCAN_API_KEY)
  --fromApiUrl <url>        api url override for the source explorer
  --toApiUrl <url>          api url override for the target explorer
  --fromRpcUrl <url>        rpc url for proxy resolution on the source chain
  --toRpcUrl <url>          rpc url for proxy resolution on the target chain
  --no-wait                 submit without polling for the verification result
  --pollTimeout <seconds>   max seconds to wait for verification (polls every 10s, default 180)
  -o, --output <format>     (choices: "table", "json", default: "table")
  -h, --help                display help for command
```

```sh
# same chain — copy an etherscan verification over to blockscout
npx @bgd-labs/cli migrateVerification --fromContract 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2 --fromChainId 1 --toExplorer blockscout

# cross-chain — reuse an Ethereum-verified source to verify the same deployment on Optimism
npx @bgd-labs/cli migrateVerification --fromContract 0x... --fromChainId 1 --fromExplorer etherscan --toChainId 10 --toExplorer etherscan

# cross-chain + different target address
npx @bgd-labs/cli migrateVerification --fromContract 0xAAA... --fromChainId 1 --toContract 0xBBB... --toChainId 10 --toExplorer blockscout
```

### Batch (`--config`)

Pass `--config <path>` to migrate many contracts in one run (the flags above are ignored). `from`/`to` are the shared endpoints (chain/explorer/keys); each entry in `contracts` is an address (used on both sides) or `{ "from": "0x…", "to": "0x…" }` to point at different addresses:

```json
{
  "from": { "chainId": 1, "explorer": "etherscan" },
  "to": { "chainId": 1, "explorer": "blockscout" },
  "wait": true,
  "contracts": [
    "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    { "from": "0xAAA…", "to": "0xBBB…" }
  ]
}
```

```sh
npx @bgd-labs/cli migrateVerification --config ./migrate.json
```

API keys are never put in the config — they default from `ETHERSCAN_API_KEY` in your environment (OKLink needs no key).