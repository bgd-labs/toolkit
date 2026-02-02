import { describe, expect, it } from "vitest";
import { renderTenderlyReport } from "./tenderly-report";
import { createPublicClient, http } from "viem";
import { gnosis, mainnet } from "viem/chains";
import { MOCK_SIMULATION } from "./mocks/mockSimulation";
import { MOCK_SIM_GNOSIS } from "./mocks/gnosis";

import { getAlchemyRPC } from "..";

describe.skipIf(process.env.CI)(
  "seatbelt:renderTenderlyReport",
  { timeout: 20000 },
  () => {
    it("should render a well formatted report", async () => {
      const report = await renderTenderlyReport({
        payload: {
          actions: [
            {
              target: "0x100c6aB6Dc8875Aa6023DA8aD04b352414b47cD3",
              withDelegateCall: true,
              accessLevel: 1,
              value: 0n,
              signature: "execute()",
              callData: "0x",
            },
            {
              target: "0xd0391675Ac61Ed550F6e5241535e59544ec94c19",
              withDelegateCall: true,
              accessLevel: 1,
              value: 0n,
              signature: "execute()",
              callData: "0x",
            },
          ],
        },
        onchainLogs: {
          createdLog: {
            blockNumber: 123,
            transactionHash:
              "0x2694ccb0b585b6a54b8d8b4a47aa874b05c257b43d34e98aee50838be00d3405",
          },
        },
        payloadId: 79,
        client: createPublicClient({
          chain: mainnet,
          transport: http(getAlchemyRPC(1, process.env.ALCHEMY_API_KEY!)),
        }),
        sim: MOCK_SIMULATION,
        config: {
          etherscanApiKey: process.env.ETHERSCAN_API_KEY!,
        },
      });
      expect(report).toMatchInlineSnapshot(`
        {
          "eventCache": [
            {
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "asset",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "factor",
                  "type": "uint256",
                },
              ],
              "name": "ReserveFactorChanged",
              "type": "event",
            },
            {
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "target",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "signature",
                  "type": "string",
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "executionTime",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "withDelegatecall",
                  "type": "bool",
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "resultData",
                  "type": "bytes",
                },
              ],
              "name": "ExecutedAction",
              "type": "event",
            },
            {
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint40",
                  "name": "payloadId",
                  "type": "uint40",
                },
              ],
              "name": "PayloadExecuted",
              "type": "event",
            },
          ],
          "report": "## Payload 79 on Ethereum

        - creator: undefined
        - maximumAccessLevelRequired: undefined
        - state: undefined(undefined)
        - actions:
          - [0x100c6aB6Dc8875Aa6023DA8aD04b352414b47cD3](https://etherscan.io/address/0x100c6aB6Dc8875Aa6023DA8aD04b352414b47cD3), accessLevel: 1, withDelegateCall: true, value: 0, signature: execute(), callData: 0x
          - [0xd0391675Ac61Ed550F6e5241535e59544ec94c19](https://etherscan.io/address/0xd0391675Ac61Ed550F6e5241535e59544ec94c19), accessLevel: 1, withDelegateCall: true, value: 0, signature: execute(), callData: 0x
        - createdAt: [Invalid Date](https://etherscan.io/tx/0x2694ccb0b585b6a54b8d8b4a47aa874b05c257b43d34e98aee50838be00d3405)

        #### InitializableImmutableAdminUpgradeabilityProxy at \`0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9\` with implementation LendingPool at \`0x085E34722e04567Df9E6d2c32e82fd74f3342e79\`

        \`\`\`diff
        @@ \`_reserves\` mapping (address => tuple) key \`0x0000000000085d4780b73119b644ae5ecd22b376\`.configuration.data @@
        - "184283194582935181459456"
        + "184449215279598567424000"

        @@ \`_reserves\` mapping (address => tuple) key \`0x0000000000085d4780b73119b644ae5ecd22b376\`.configuration.reserveFactor @@
        - "99.9 % [9990, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x03ab458634910aad20ef5f1c8ee96f1d6ac54919\`.configuration.data @@
        - "182623275799432407285760"
        + "184449503462729652895744"

        @@ \`_reserves\` mapping (address => tuple) key \`0x03ab458634910aad20ef5f1c8ee96f1d6ac54919\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x056fd409e1d7a124bd7017459dfea2f387b6d5cd\`.configuration.data @@
        - "36893848998339246292992"
        + "46117221035194022100992"

        @@ \`_reserves\` mapping (address => tuple) key \`0x056fd409e1d7a124bd7017459dfea2f387b6d5cd\`.configuration.reserveFactor @@
        - "20 % [2000, 2 decimals]"
        + "25 % [2500, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e\`.configuration.data @@
        - "182623275846677047869440"
        + "184449503509974293479424"

        @@ \`_reserves\` mapping (address => tuple) key \`0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x0d8775f648430679a709e98d2b0cb6250d2887ef\`.configuration.data @@
        - "182622987616300896157696"
        + "184449215279598141767680"

        @@ \`_reserves\` mapping (address => tuple) key \`0x0d8775f648430679a709e98d2b0cb6250d2887ef\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x0f5d2fb29fb7d3cfee444a200298f468908cc942\`.configuration.data @@
        - "182623275846677047869440"
        + "184449503509974293479424"

        @@ \`_reserves\` mapping (address => tuple) key \`0x0f5d2fb29fb7d3cfee444a200298f468908cc942\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x111111111117dc0aa78b770fa6a738034120c302\`.configuration.data @@
        - "182622987615656651063296"
        + "184449215278953896673280"

        @@ \`_reserves\` mapping (address => tuple) key \`0x111111111117dc0aa78b770fa6a738034120c302\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b\`.configuration.data @@
        - "182622987616300896157696"
        + "184449215279598141767680"

        @@ \`_reserves\` mapping (address => tuple) key \`0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x1f9840a85d5af5bf1d1762f925bdaddc4201f984\`.configuration.data @@
        - "182622987615871490850816"
        + "184449215279168736460800"

        @@ \`_reserves\` mapping (address => tuple) key \`0x1f9840a85d5af5bf1d1762f925bdaddc4201f984\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x2260fac5e5542a773aa44fbcfedf7c193bc2c599\`.configuration.data @@
        - "55340594805996352183328"
        + "64563966842851127991328"

        @@ \`_reserves\` mapping (address => tuple) key \`0x2260fac5e5542a773aa44fbcfedf7c193bc2c599\`.configuration.reserveFactor @@
        - "30 % [3000, 2 decimals]"
        + "35 % [3500, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x408e41876cccdc0f92210600ef50372656052a38\`.configuration.data @@
        - "182622987616300896157696"
        + "184449215279598141767680"

        @@ \`_reserves\` mapping (address => tuple) key \`0x408e41876cccdc0f92210600ef50372656052a38\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b\`.configuration.data @@
        - "182622987615656651063296"
        + "184449215278953896673280"

        @@ \`_reserves\` mapping (address => tuple) key \`0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x4fabb145d64652a948d72533023f6e7a623c7c53\`.configuration.data @@
        - "184283482766066266931200"
        + "184449503462729652895744"

        @@ \`_reserves\` mapping (address => tuple) key \`0x4fabb145d64652a948d72533023f6e7a623c7c53\`.configuration.reserveFactor @@
        - "99.9 % [9990, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x514910771af9ca656af840dff83e8264ecf986ca\`.configuration.data @@
        - "55340453506416971350016"
        + "64563825543271747158016"

        @@ \`_reserves\` mapping (address => tuple) key \`0x514910771af9ca656af840dff83e8264ecf986ca\`.configuration.reserveFactor @@
        - "30 % [3000, 2 decimals]"
        + "35 % [3500, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x57ab1ec28d129707052df4df418d58a2d46d5f51\`.configuration.data @@
        - "55340597575648425279488"
        + "64563969612503201087488"

        @@ \`_reserves\` mapping (address => tuple) key \`0x57ab1ec28d129707052df4df418d58a2d46d5f51\`.configuration.reserveFactor @@
        - "30 % [3000, 2 decimals]"
        + "35 % [3500, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x5f98805a4e8be255a32880fdec7f6728c6568ba0\`.configuration.data @@
        - "46117225538793649471488"
        + "55340597575648425279488"

        @@ \`_reserves\` mapping (address => tuple) key \`0x5f98805a4e8be255a32880fdec7f6728c6568ba0\`.configuration.reserveFactor @@
        - "25 % [2500, 2 decimals]"
        + "30 % [3000, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x6b175474e89094c44da98b954eedeac495271d0f\`.configuration.data @@
        - "46117225583461879520588"
        + "55340597620316655328588"

        @@ \`_reserves\` mapping (address => tuple) key \`0x6b175474e89094c44da98b954eedeac495271d0f\`.configuration.reserveFactor @@
        - "25 % [2500, 2 decimals]"
        + "30 % [3000, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x853d955acef822db058eb8505911ed77f175b99e\`.configuration.data @@
        - "55340597575648425279488"
        + "64563969612503201087488"

        @@ \`_reserves\` mapping (address => tuple) key \`0x853d955acef822db058eb8505911ed77f175b99e\`.configuration.reserveFactor @@
        - "30 % [3000, 2 decimals]"
        + "35 % [3500, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x8798249c2e607446efb7ad49ec89dd1865ff4272\`.configuration.data @@
        - "182622987616300896157696"
        + "184449215279598141767680"

        @@ \`_reserves\` mapping (address => tuple) key \`0x8798249c2e607446efb7ad49ec89dd1865ff4272\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x8e870d67f660d95d5be530380d0ec0bd388289e1\`.configuration.data @@
        - "36893853501938873663488"
        + "46117225538793649471488"

        @@ \`_reserves\` mapping (address => tuple) key \`0x8e870d67f660d95d5be530380d0ec0bd388289e1\`.configuration.reserveFactor @@
        - "20 % [2000, 2 decimals]"
        + "25 % [2500, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x956f47f50a910163d8bf957cf5846d573e7f87ca\`.configuration.data @@
        - "182623275846677047869440"
        + "184449503509974293479424"

        @@ \`_reserves\` mapping (address => tuple) key \`0x956f47f50a910163d8bf957cf5846d573e7f87ca\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2\`.configuration.data @@
        - "182622987615227245756416"
        + "184449215278524491366400"

        @@ \`_reserves\` mapping (address => tuple) key \`0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\`.configuration.data @@
        - "46117222205976910634816"
        + "55340594242831686442816"

        @@ \`_reserves\` mapping (address => tuple) key \`0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\`.configuration.reserveFactor @@
        - "25 % [2500, 2 decimals]"
        + "30 % [3000, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xa693b19d2931d498c5b318df961919bb4aee87a5\`.configuration.data @@
        - "182623272421732686757888"
        + "184449500085029932367872"

        @@ \`_reserves\` mapping (address => tuple) key \`0xa693b19d2931d498c5b318df961919bb4aee87a5\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xba100000625a3754423978a60c9317c58a424e3d\`.configuration.data @@
        - "182622987615441902698496"
        + "184449215278739148308480"

        @@ \`_reserves\` mapping (address => tuple) key \`0xba100000625a3754423978a60c9317c58a424e3d\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f\`.configuration.data @@
        - "182622987615227154333696"
        + "184449215278524399943680"

        @@ \`_reserves\` mapping (address => tuple) key \`0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\`.configuration.data @@
        - "46117225583891369697338"
        + "55340597620746145505338"

        @@ \`_reserves\` mapping (address => tuple) key \`0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\`.configuration.reserveFactor @@
        - "25 % [2500, 2 decimals]"
        + "30 % [3000, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xc18360217d8f7ab5e7c516566761ea12ce7f9d72\`.configuration.data @@
        - "182622987615441902698496"
        + "184449215278739148308480"

        @@ \`_reserves\` mapping (address => tuple) key \`0xc18360217d8f7ab5e7c516566761ea12ce7f9d72\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xd46ba6d942050d489dbd938a2c909a5d5039a161\`.configuration.data @@
        - "184283480232791476535296"
        + "184449500929454862499840"

        @@ \`_reserves\` mapping (address => tuple) key \`0xd46ba6d942050d489dbd938a2c909a5d5039a161\`.configuration.reserveFactor @@
        - "99.9 % [9990, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xd533a949740bb3306d119cc777fa900ba034cd52\`.configuration.data @@
        - "182622987615441994121216"
        + "184449215278739239731200"

        @@ \`_reserves\` mapping (address => tuple) key \`0xd533a949740bb3306d119cc777fa900ba034cd52\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xdac17f958d2ee523a2206206994597c13d831ec7\`.configuration.data @@
        - "46117222161093928943616"
        + "55340594197948704751616"

        @@ \`_reserves\` mapping (address => tuple) key \`0xdac17f958d2ee523a2206206994597c13d831ec7\`.configuration.reserveFactor @@
        - "25 % [2500, 2 decimals]"
        + "30 % [3000, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xdd974d5c2e2928dea5f71b9825b8b646686bd200\`.configuration.data @@
        - "182623275846677047869440"
        + "184449503509974293479424"

        @@ \`_reserves\` mapping (address => tuple) key \`0xdd974d5c2e2928dea5f71b9825b8b646686bd200\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xe41d2489571d322189246dafa5ebde1f4699f498\`.configuration.data @@
        - "182622987616300948258816"
        + "184449215279598193868800"

        @@ \`_reserves\` mapping (address => tuple) key \`0xe41d2489571d322189246dafa5ebde1f4699f498\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        @@ \`_reserves\` mapping (address => tuple) key \`0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c\`.configuration.data @@
        - "182623275846677047869440"
        + "184449503509974293479424"

        @@ \`_reserves\` mapping (address => tuple) key \`0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c\`.configuration.reserveFactor @@
        - "99 % [9900, 2 decimals]"
        + "99.99 % [9999, 2 decimals]"

        \`\`\`
        #### TransparentUpgradeableProxy at \`0xdAbad81aF85554E9ae636395611C58F7eC1aAEc5\` with implementation PayloadsController at \`0x7222182cB9c5320587b5148BF03eeE107AD64578\`

        \`\`\`diff
        @@ \`0x35cf9ccc5fb50786824d0efe505d33216d9658f34614e7c25f0d5baeb2b0c672\` raw  @@
        - "\\"0x0065f066320065ef4eaf020157ab7ee15ce5ecacb1ab84ee42d5a9d0d8112922\\""
        + "\\"0x0065f066320065ef4eaf030157ab7ee15ce5ecacb1ab84ee42d5a9d0d8112922\\""

        @@ \`0x35cf9ccc5fb50786824d0efe505d33216d9658f34614e7c25f0d5baeb2b0c673\` raw  @@
        - "\\"0x000000000000000000093a80000001518000661d732f00000000000000000000\\""
        + "\\"0x000000000000000000093a80000001518000661d732f00000000000065f1b88b\\""

        \`\`\`
        ### Verification status for contracts touched in the proposal

        | Contract | Status |
        |---------|------------|
        | LendingPool at \`0x085E34722e04567Df9E6d2c32e82fd74f3342e79\` | Contract |
        | LendingPoolConfigurator at \`0x246ca67522dF5895cD6cf8807Ec161954ea1bA61\` | Contract |
        | InitializableImmutableAdminUpgradeabilityProxy at \`0x311Bb771e4F8952E6Da169b425E7e92d6Ac45756\` with implementation LendingPoolConfigurator at \`0x246ca67522dF5895cD6cf8807Ec161954ea1bA61\` | Contract |
        | Executor at \`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A\` | Contract |
        | PayloadsController at \`0x7222182cB9c5320587b5148BF03eeE107AD64578\` | Contract |
        | InitializableImmutableAdminUpgradeabilityProxy at \`0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9\` with implementation LendingPool at \`0x085E34722e04567Df9E6d2c32e82fd74f3342e79\` | Contract |
        | LendingPoolAddressesProvider at \`0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5\` | Contract |
        | AaveV2Ethereum_EthereumV2ReserveFactorAdjustment_20240304 at \`0xc7c080511aDCE1e4728ab4e28A31D97243d1C581\` | Contract |
        | unknown contract name at \`0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073\` | EOA |
        | TransparentUpgradeableProxy at \`0xdAbad81aF85554E9ae636395611C58F7eC1aAEc5\` with implementation PayloadsController at \`0x7222182cB9c5320587b5148BF03eeE107AD64578\` | Contract |

        ### Selfdestruct analysis

        | Address | Result |
        |---------|------------|
        | LendingPool at \`0x085E34722e04567Df9E6d2c32e82fd74f3342e79\` | DelegateCall |
        | LendingPoolConfigurator at \`0x246ca67522dF5895cD6cf8807Ec161954ea1bA61\` | DelegateCall |
        | InitializableImmutableAdminUpgradeabilityProxy at \`0x311Bb771e4F8952E6Da169b425E7e92d6Ac45756\` with implementation LendingPoolConfigurator at \`0x246ca67522dF5895cD6cf8807Ec161954ea1bA61\` | DelegateCall |
        | Executor at \`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A\` | DelegateCall |
        | PayloadsController at \`0x7222182cB9c5320587b5148BF03eeE107AD64578\` | Safe |
        | InitializableImmutableAdminUpgradeabilityProxy at \`0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9\` with implementation LendingPool at \`0x085E34722e04567Df9E6d2c32e82fd74f3342e79\` | DelegateCall |
        | LendingPoolAddressesProvider at \`0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5\` | DelegateCall |
        | AaveV2Ethereum_EthereumV2ReserveFactorAdjustment_20240304 at \`0xc7c080511aDCE1e4728ab4e28A31D97243d1C581\` | Safe |
        | unknown contract name at \`0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073\` | Empty |
        | TransparentUpgradeableProxy at \`0xdAbad81aF85554E9ae636395611C58F7eC1aAEc5\` with implementation PayloadsController at \`0x7222182cB9c5320587b5148BF03eeE107AD64578\` | DelegateCall |

        ### Events emitted from the proposal

        - InitializableImmutableAdminUpgradeabilityProxy at \`0x311Bb771e4F8952E6Da169b425E7e92d6Ac45756\` with implementation LendingPoolConfigurator at \`0x246ca67522dF5895cD6cf8807Ec161954ea1bA61\`
          - \`ReserveFactorChanged({"asset":"0x111111111117dC0aa78b770fA6A738034120C302 (symbol: 1INCH)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0xD46bA6D942050d489DBd938a2C909A5d5039A161 (symbol: AMPL)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x4Fabb145d64652a948d72533023f6E7A623C7C53 (symbol: BUSD)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0xba100000625a3754423978a60c9317c58a424e3D (symbol: BAL)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x0D8775F648430679A709E98d2b0Cb6250d2887EF (symbol: BAT)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0xD533a949740bb3306d119CC777fa900bA034cd52 (symbol: CRV)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B (symbol: CVX)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x6B175474E89094C44Da98b954EedeAC495271d0F (symbol: DAI)","factor":"30 % [3000]"})\`
          - \`ReserveFactorChanged({"asset":"0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b (symbol: DPI)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72 (symbol: ENS)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c (symbol: ENJ)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x956F47F50A910163D8BF957Cf5846D573E7f87CA (symbol: FEI)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x853d955aCEf822Db058eb8505911ED77F175b99e (symbol: FRAX)","factor":"35 % [3500]"})\`
          - \`ReserveFactorChanged({"asset":"0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd (symbol: GUSD)","factor":"25 % [2500]"})\`
          - \`ReserveFactorChanged({"asset":"0xdd974D5C2e2928deA5F71b9825b8b646686BD200 (symbol: KNC)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x514910771AF9Ca656af840dff83E8264EcF986CA (symbol: LINK)","factor":"35 % [3500]"})\`
          - \`ReserveFactorChanged({"asset":"0x5f98805A4E8be255a32880FDeC7F6728C6568bA0 (symbol: LUSD)","factor":"30 % [3000]"})\`
          - \`ReserveFactorChanged({"asset":"0x0F5D2fB29fb7d3CFeE444a200298f468908cC942 (symbol: MANA)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2 (symbol: unknown)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919 (symbol: RAI)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x408e41876cCCDC0F92210600ef50372656052a38 (symbol: REN)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F (symbol: SNX)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x57Ab1ec28D129707052df4dF418D58a2D46d5f51 (symbol: sUSD)","factor":"35 % [3500]"})\`
          - \`ReserveFactorChanged({"asset":"0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272 (symbol: xSUSHI)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x0000000000085d4780B73119b644AE5ecd22b376 (symbol: TUSD)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 (symbol: UNI)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 (symbol: USDC)","factor":"30 % [3000]"})\`
          - \`ReserveFactorChanged({"asset":"0x8E870D67F660D95d5be530380D0eC0bd388289E1 (symbol: USDP)","factor":"25 % [2500]"})\`
          - \`ReserveFactorChanged({"asset":"0xdAC17F958D2ee523a2206206994597C13D831ec7 (symbol: USDT)","factor":"30 % [3000]"})\`
          - \`ReserveFactorChanged({"asset":"0xa693B19d2931d498c5B318dF961919BB4aee87a5 (symbol: UST)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 (symbol: WBTC)","factor":"35 % [3500]"})\`
          - \`ReserveFactorChanged({"asset":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 (symbol: WETH)","factor":"30 % [3000]"})\`
          - \`ReserveFactorChanged({"asset":"0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e (symbol: YFI)","factor":"99.99 % [9999]"})\`
          - \`ReserveFactorChanged({"asset":"0xE41d2489571d322189246DaFA5ebDe1F4699F498 (symbol: ZRX)","factor":"99.99 % [9999]"})\`
        - Executor at \`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A\`
          - \`ExecutedAction({"target":"0xc7c080511aDCE1e4728ab4e28A31D97243d1C581","value":"0","signature":"execute()","data":"0x","executionTime":"1710340235","withDelegatecall":true,"resultData":"0x"})\`
        - TransparentUpgradeableProxy at \`0xdAbad81aF85554E9ae636395611C58F7eC1aAEc5\` with implementation PayloadsController at \`0x7222182cB9c5320587b5148BF03eeE107AD64578\`
          - \`PayloadExecuted({"payloadId":79})\`
        ",
        }
      `);
    });

    it("should render a well formatted report", async () => {
      const report = await renderTenderlyReport({
        payload: {
          actions: [
            {
              target: "0x100c6aB6Dc8875Aa6023DA8aD04b352414b47cD3",
              withDelegateCall: true,
              accessLevel: 1,
              value: 0n,
              signature: "execute()",
              callData: "0x",
            },
            {
              target: "0xd0391675Ac61Ed550F6e5241535e59544ec94c19",
              withDelegateCall: true,
              accessLevel: 1,
              value: 0n,
              signature: "execute()",
              callData: "0x",
            },
          ],
        },
        onchainLogs: {
          createdLog: {
            blockNumber: 123,
            transactionHash:
              "0x2694ccb0b585b6a54b8d8b4a47aa874b05c257b43d34e98aee50838be00d3405",
          },
        },
        payloadId: 79,
        client: createPublicClient({
          chain: gnosis,
          transport: http(getAlchemyRPC(100, process.env.ALCHEMY_API_KEY!)),
        }),
        sim: MOCK_SIM_GNOSIS,
        config: {
          etherscanApiKey: process.env.ETHERSCAN_API_KEY!,
        },
      });
      expect(report).toMatchInlineSnapshot(`
        {
          "eventCache": [
            {
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "asset",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "oldSupplyCap",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "newSupplyCap",
                  "type": "uint256",
                },
              ],
              "name": "SupplyCapChanged",
              "type": "event",
            },
            {
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "asset",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "oldBorrowCap",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "newBorrowCap",
                  "type": "uint256",
                },
              ],
              "name": "BorrowCapChanged",
              "type": "event",
            },
            {
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "target",
                  "type": "address",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "signature",
                  "type": "string",
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "data",
                  "type": "bytes",
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "executionTime",
                  "type": "uint256",
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "withDelegatecall",
                  "type": "bool",
                },
                {
                  "indexed": false,
                  "internalType": "bytes",
                  "name": "resultData",
                  "type": "bytes",
                },
              ],
              "name": "ExecutedAction",
              "type": "event",
            },
            {
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint40",
                  "name": "payloadId",
                  "type": "uint40",
                },
              ],
              "name": "PayloadExecuted",
              "type": "event",
            },
          ],
          "report": "## Payload 79 on Gnosis

        - creator: undefined
        - maximumAccessLevelRequired: undefined
        - state: undefined(undefined)
        - actions:
          - [0x100c6aB6Dc8875Aa6023DA8aD04b352414b47cD3](https://gnosisscan.io/address/0x100c6aB6Dc8875Aa6023DA8aD04b352414b47cD3), accessLevel: 1, withDelegateCall: true, value: 0, signature: execute(), callData: 0x
          - [0xd0391675Ac61Ed550F6e5241535e59544ec94c19](https://gnosisscan.io/address/0xd0391675Ac61Ed550F6e5241535e59544ec94c19), accessLevel: 1, withDelegateCall: true, value: 0, signature: execute(), callData: 0x
        - createdAt: [Invalid Date](https://gnosisscan.io/tx/0x2694ccb0b585b6a54b8d8b4a47aa874b05c257b43d34e98aee50838be00d3405)

        #### TransparentUpgradeableProxy at \`0x9A1F491B86D09fC1484b5fab10041B189B60756b\` with implementation PayloadsController at \`0xe59470B3BE3293534603487E00A44C72f2CD466d\`

        \`\`\`diff
        @@ \`0xfc869d08d1790d4602743c5b6e4adb33c74c1d0d7c8c47359779d859193dcb05\` raw  @@
        - "\\"0x00690b354b00690c6b740201956de559dfc27678fd69d4f49f485196b50bdd0f\\""
        + "\\"0x00690b354b00690c6b740301956de559dfc27678fd69d4f49f485196b50bdd0f\\""

        @@ \`0xfc869d08d1790d4602743c5b6e4adb33c74c1d0d7c8c47359779d859193dcb06\` raw  @@
        - "\\"0x000000000000000000093a80000001518000693a8ff400000000000000000000\\""
        + "\\"0x000000000000000000093a80000001518000693a8ff4000000000000690c87c6\\""

        \`\`\`
        #### InitializableImmutableAdminUpgradeabilityProxy at \`0xb50201558B00496A145fE76f7424749556E326D8\` with implementation PoolInstance at \`0xf30E36C6bf04067B721636525Cf8Cb44ef73E12a\`

        \`\`\`diff
        @@ \`_reserves\` mapping (address => tuple) key \`0x2a22f9c3b484c3629090feed35f17ff8f88f76f0\`.configuration.data @@
        - "7237005577332262213973186568751985011653296642585416914890590959269337111884"
        + "7237005577332262213973186568751986008574210417820767842338930988725262884172"

        @@ \`_reserves\` mapping (address => tuple) key \`0x2a22f9c3b484c3629090feed35f17ff8f88f76f0\`.configuration.borrowCap @@
        - "1"
        + "11000000"

        @@ \`_reserves\` mapping (address => tuple) key \`0x2a22f9c3b484c3629090feed35f17ff8f88f76f0\`.configuration.supplyCap @@
        - "1"
        + "12000000"

        @@ \`_reserves\` mapping (address => tuple) key \`0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1\`.configuration.data @@
        - "7237005577332262213973186942896404168364443702728734099480113563162880253760"
        + "7237005577332262213973186942896404168663436925033503826682669159174810378048"

        @@ \`_reserves\` mapping (address => tuple) key \`0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1\`.configuration.borrowCap @@
        - "1"
        + "2400"

        @@ \`_reserves\` mapping (address => tuple) key \`0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1\`.configuration.supplyCap @@
        - "1"
        + "3600"

        @@ \`_reserves\` mapping (address => tuple) key \`0x6c76971f98945ae98dd7d4dfca8711ebea946ea6\`.configuration.data @@
        - "7237005577332262213973186942896404168364443702728734081033369489453302422860"
        + "7237005577332262213973186942896404169610511872027536284585754700271889161548"

        @@ \`_reserves\` mapping (address => tuple) key \`0x6c76971f98945ae98dd7d4dfca8711ebea946ea6\`.configuration.borrowCap @@
        - "1"
        + "150"

        @@ \`_reserves\` mapping (address => tuple) key \`0x6c76971f98945ae98dd7d4dfca8711ebea946ea6\`.configuration.supplyCap @@
        - "1"
        + "15000"

        @@ \`_reserves\` mapping (address => tuple) key \`0x9c58bacc331c9aa871afd802db6379a98e80cedb\`.configuration.data @@
        - "7237005577332262213973186568751985011653296642585416933335032569816715367104"
        + "7237005577332262213973186568751985023283958528977871571467760828193411699392"

        @@ \`_reserves\` mapping (address => tuple) key \`0x9c58bacc331c9aa871afd802db6379a98e80cedb\`.configuration.borrowCap @@
        - "1"
        + "20000"

        @@ \`_reserves\` mapping (address => tuple) key \`0x9c58bacc331c9aa871afd802db6379a98e80cedb\`.configuration.supplyCap @@
        - "1"
        + "140000"

        @@ \`_reserves\` mapping (address => tuple) key \`0xaf204776c7245bf4147c2612bf6e5972ee483701\`.configuration.data @@
        - "7237005577332262213973186574460975782477136166818559583760161194485504023884"
        + "7237005577332262213973186574460977776319046767442633591154514741690275208524"

        @@ \`_reserves\` mapping (address => tuple) key \`0xaf204776c7245bf4147c2612bf6e5972ee483701\`.configuration.borrowCap @@
        - "0"
        + "1"

        @@ \`_reserves\` mapping (address => tuple) key \`0xaf204776c7245bf4147c2612bf6e5972ee483701\`.configuration.supplyCap @@
        - "1"
        + "24000000"

        @@ \`_reserves\` mapping (address => tuple) key \`0xcb444e90d8198415266c6a2724b7900fb12fc56e\`.configuration.data @@
        - "7237005577332262213973186563042996483901616928648072005022665638471394131968"
        + "7237005577332262213973186563042996483901616955848901737426002454731179425792"

        @@ \`_reserves\` mapping (address => tuple) key \`0xcb444e90d8198415266c6a2724b7900fb12fc56e\`.configuration.borrowCap @@
        - "1"
        + "22500000"

        @@ \`_reserves\` mapping (address => tuple) key \`0xe91d153e0b41518a2ce8dd3d7944fa863463a97d\`.configuration.data @@
        - "7237005577332262213973186574460975782477136166818560820358690993064365004956"
        + "7237005577332262213973186574460976114784052040770816812716707906992917977244"

        @@ \`_reserves\` mapping (address => tuple) key \`0xe91d153e0b41518a2ce8dd3d7944fa863463a97d\`.configuration.borrowCap @@
        - "1"
        + "3700000"

        @@ \`_reserves\` mapping (address => tuple) key \`0xe91d153e0b41518a2ce8dd3d7944fa863463a97d\`.configuration.supplyCap @@
        - "1"
        + "4000000"

        @@ \`_reserves\` mapping (address => tuple) key \`0xfc421ad3c883bf9e7c4f42de845c4e4405799e73\`.configuration.data @@
        - "7237005577332262213973186563042994240829457118352273037090307903331189653504"
        + "7237005577332262213973186563042994365444498648130894503114824546631697825792"

        @@ \`_reserves\` mapping (address => tuple) key \`0xfc421ad3c883bf9e7c4f42de845c4e4405799e73\`.configuration.borrowCap @@
        - "1"
        + "1400000"

        @@ \`_reserves\` mapping (address => tuple) key \`0xfc421ad3c883bf9e7c4f42de845c4e4405799e73\`.configuration.supplyCap @@
        - "1"
        + "1500000"

        \`\`\`
        ### Verification status for contracts touched in the proposal

        | Contract | Status |
        |---------|------------|
        | AaveV3ConfigEngine at \`0x0FC9eB644dF453B53C7d9A6892c878f14382ddc3\` | Contract |
        | Executor at \`0x1dF462e2712496373A347f8ad10802a5E95f053D\` | Contract |
        | PoolAddressesProvider at \`0x36616cf17557639614c1cdDb356b1B83fc0B2132\` | Contract |
        | PoolConfiguratorWithCustomInitialize at \`0x5793FE4de34532F162B4e207aF872729880ec2b6\` | Contract |
        | InitializableImmutableAdminUpgradeabilityProxy at \`0x7304979ec9E4EaA0273b6A037a31c4e9e5A75D16\` with implementation PoolConfiguratorWithCustomInitialize at \`0x5793FE4de34532F162B4e207aF872729880ec2b6\` | Contract |
        | TransparentUpgradeableProxy at \`0x9A1F491B86D09fC1484b5fab10041B189B60756b\` with implementation PayloadsController at \`0xe59470B3BE3293534603487E00A44C72f2CD466d\` | Contract |
        | InitializableImmutableAdminUpgradeabilityProxy at \`0xb50201558B00496A145fE76f7424749556E326D8\` with implementation PoolInstance at \`0xf30E36C6bf04067B721636525Cf8Cb44ef73E12a\` | Contract |
        | CapsEngine at \`0xC3DeCF0c8821384644B923F08f840c23f6d24634\` | Contract |
        | AaveV3Gnosis_ReinstateSupplyAndBorrowCapsOnAaveV3GnosisInstance_20251106 at \`0xd52006e40C7e98E69A456B089b16aF6fAfe63032\` | Contract |
        | unknown contract name at \`0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073\` | EOA |
        | PayloadsController at \`0xe59470B3BE3293534603487E00A44C72f2CD466d\` | Contract |
        | ACLManager at \`0xEc710f59005f48703908bC519D552Df5B8472614\` | Contract |
        | PoolInstance at \`0xf30E36C6bf04067B721636525Cf8Cb44ef73E12a\` | Contract |

        ### Selfdestruct analysis

        | Address | Result |
        |---------|------------|
        | AaveV3ConfigEngine at \`0x0FC9eB644dF453B53C7d9A6892c878f14382ddc3\` | DelegateCall |
        | Executor at \`0x1dF462e2712496373A347f8ad10802a5E95f053D\` | DelegateCall |
        | PoolAddressesProvider at \`0x36616cf17557639614c1cdDb356b1B83fc0B2132\` | DelegateCall |
        | PoolConfiguratorWithCustomInitialize at \`0x5793FE4de34532F162B4e207aF872729880ec2b6\` | DelegateCall |
        | InitializableImmutableAdminUpgradeabilityProxy at \`0x7304979ec9E4EaA0273b6A037a31c4e9e5A75D16\` with implementation PoolConfiguratorWithCustomInitialize at \`0x5793FE4de34532F162B4e207aF872729880ec2b6\` | DelegateCall |
        | TransparentUpgradeableProxy at \`0x9A1F491B86D09fC1484b5fab10041B189B60756b\` with implementation PayloadsController at \`0xe59470B3BE3293534603487E00A44C72f2CD466d\` | DelegateCall |
        | InitializableImmutableAdminUpgradeabilityProxy at \`0xb50201558B00496A145fE76f7424749556E326D8\` with implementation PoolInstance at \`0xf30E36C6bf04067B721636525Cf8Cb44ef73E12a\` | DelegateCall |
        | CapsEngine at \`0xC3DeCF0c8821384644B923F08f840c23f6d24634\` | Safe |
        | AaveV3Gnosis_ReinstateSupplyAndBorrowCapsOnAaveV3GnosisInstance_20251106 at \`0xd52006e40C7e98E69A456B089b16aF6fAfe63032\` | DelegateCall |
        | unknown contract name at \`0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073\` | Empty |
        | PayloadsController at \`0xe59470B3BE3293534603487E00A44C72f2CD466d\` | Safe |
        | ACLManager at \`0xEc710f59005f48703908bC519D552Df5B8472614\` | Safe |
        | PoolInstance at \`0xf30E36C6bf04067B721636525Cf8Cb44ef73E12a\` | DelegateCall |

        ### Events emitted from the proposal

        - Executor at \`0x1dF462e2712496373A347f8ad10802a5E95f053D\`
          - \`ExecutedAction({"target":"0xd52006e40C7e98E69A456B089b16aF6fAfe63032","value":"0","signature":"execute()","data":"0x","executionTime":"1762428870","withDelegatecall":true,"resultData":"0x"})\`
        - InitializableImmutableAdminUpgradeabilityProxy at \`0x7304979ec9E4EaA0273b6A037a31c4e9e5A75D16\` with implementation PoolConfiguratorWithCustomInitialize at \`0x5793FE4de34532F162B4e207aF872729880ec2b6\`
          - \`SupplyCapChanged({"asset":"0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1 (symbol: WETH)","oldSupplyCap":"1","newSupplyCap":"3600"})\`
          - \`BorrowCapChanged({"asset":"0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1 (symbol: WETH)","oldBorrowCap":"1","newBorrowCap":"2400"})\`
          - \`SupplyCapChanged({"asset":"0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6 (symbol: wstETH)","oldSupplyCap":"1","newSupplyCap":"15000"})\`
          - \`BorrowCapChanged({"asset":"0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6 (symbol: wstETH)","oldBorrowCap":"1","newBorrowCap":"150"})\`
          - \`SupplyCapChanged({"asset":"0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb (symbol: GNO)","oldSupplyCap":"1","newSupplyCap":"140000"})\`
          - \`BorrowCapChanged({"asset":"0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb (symbol: GNO)","oldBorrowCap":"1","newBorrowCap":"20000"})\`
          - \`SupplyCapChanged({"asset":"0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d (symbol: WXDAI)","oldSupplyCap":"1","newSupplyCap":"4000000"})\`
          - \`BorrowCapChanged({"asset":"0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d (symbol: WXDAI)","oldBorrowCap":"1","newBorrowCap":"3700000"})\`
          - \`BorrowCapChanged({"asset":"0xcB444e90D8198415266c6a2724b7900fb12FC56E (symbol: EURe)","oldBorrowCap":"1","newBorrowCap":"22500000"})\`
          - \`SupplyCapChanged({"asset":"0xaf204776c7245bF4147c2612BF6e5972Ee483701 (symbol: sDAI)","oldSupplyCap":"1","newSupplyCap":"24000000"})\`
          - \`BorrowCapChanged({"asset":"0xaf204776c7245bF4147c2612BF6e5972Ee483701 (symbol: sDAI)","oldBorrowCap":"0","newBorrowCap":"1"})\`
          - \`SupplyCapChanged({"asset":"0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0 (symbol: USDC.e)","oldSupplyCap":"1","newSupplyCap":"12000000"})\`
          - \`BorrowCapChanged({"asset":"0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0 (symbol: USDC.e)","oldBorrowCap":"1","newBorrowCap":"11000000"})\`
          - \`SupplyCapChanged({"asset":"0xfc421aD3C883Bf9E7C4f42dE845C4e4405799e73 (symbol: GHO)","oldSupplyCap":"1","newSupplyCap":"1500000"})\`
          - \`BorrowCapChanged({"asset":"0xfc421aD3C883Bf9E7C4f42dE845C4e4405799e73 (symbol: GHO)","oldBorrowCap":"1","newBorrowCap":"1400000"})\`
        - TransparentUpgradeableProxy at \`0x9A1F491B86D09fC1484b5fab10041B189B60756b\` with implementation PayloadsController at \`0xe59470B3BE3293534603487E00A44C72f2CD466d\`
          - \`PayloadExecuted({"payloadId":66})\`
        ",
        }
      `);
    });
  },
);
