# @bgd-labs/cli

A cli tool to help with various web3 / solidity tasks. For a full overview of features you can run `@bgd-labs/cli --help`

## Installation

Make sure to setup your .env

```
# Used for code and storage diffs
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