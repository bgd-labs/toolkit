import { describe, expect, it } from "vitest";
import { fetchPoolAddresses } from "./addresses";
import { getClient } from "../../ecosystem/rpcs";
import { AaveV3Ethereum } from "@bgd-labs/aave-address-book";

describe("pool:addresses", () => {
  it("should generate same addresses", async () => {
    expect(
      await fetchPoolAddresses(
        getClient(1, {
          providerConfig: { alchemyKey: process.env.ALCHEMY_API_KEY },
        }),
        AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
      ),
    ).toMatchInlineSnapshot(`
      {
        "aclAdmin": "0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A",
        "configurator": "0x64b761D848206f447Fe2dd461b0c635Ec39EbB27",
        "emissionManager": "0x223d844fc4B006D67c0cDbd39371A9F73f69d974",
        "incentivesController": "0x8164Cc65827dcFe994AB23944CBC90e0aa80bFcb",
        "oracle": "0x54586bE62E3c3580375aE3723C145253060Ca0C2",
        "oracleSentinel": "0x0000000000000000000000000000000000000000",
        "pdp": "0x0a16f2FCC0D44FaE41cc54e079281D84A363bECD",
        "pool": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
      }
    `);
  });
});
