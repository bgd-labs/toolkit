import { describe, it } from "vitest";
import { tenderly_createVnet } from "../../ecosystem/tenderly";
import { makePayloadExecutableOnTestClient } from "./payloads-controller";
import { GovernanceV3Ethereum } from "@bgd-labs/aave-address-book";
import { encodeFunctionData, toHex } from "viem";
import { IPayloadsControllerCore_ABI } from "@bgd-labs/aave-address-book/abis";

describe.skipIf(process.env.CI)(
  "payloadsController",
  { timeout: 60_000 },
  () => {
    it("simulate payload via vnet", async () => {
      const vnet = await tenderly_createVnet(
        {
          baseChainId: 1,
          forkChainId: 3030,
          slug: "controller-spec",
          displayName: "Vitest test payload",
          blockNumber: toHex(22002625n),
        },
        {
          accessToken: process.env.TENDERLY_ACCESS_TOKEN!,
          accountSlug: process.env.TENDERLY_ACCOUNT_SLUG!,
          projectSlug: process.env.TENDERLY_PROJECT_SLUG!,
        },
      );

      await makePayloadExecutableOnTestClient(
        vnet.testClient,
        GovernanceV3Ethereum.PAYLOADS_CONTROLLER,
        254,
      );

      const result = await vnet.simulate({
        network_id: "1",
        from: "0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073",
        to: GovernanceV3Ethereum.PAYLOADS_CONTROLLER,
        input: encodeFunctionData({
          abi: IPayloadsControllerCore_ABI,
          functionName: "executePayload",
          args: [254],
        }),
        gas: 8000000,
        value: "0",
      });

      await vnet.delete();
    });
  },
);
