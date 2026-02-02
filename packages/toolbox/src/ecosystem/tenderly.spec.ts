import { describe, expect, it } from "vitest";
import { tenderly_createVnet } from "./tenderly";

describe.skipIf(process.env.CI)("tenderly", () => {
  it("createVnet", { timeout: 60_000 }, async () => {
    const vnet = await tenderly_createVnet(
      {
        baseChainId: 1,
        forkChainId: 3030,
        slug: "tenderly-spec",
        displayName: "Vitest test",
      },
      {
        accessToken: process.env.TENDERLY_ACCESS_TOKEN!,
        accountSlug: process.env.TENDERLY_ACCOUNT_SLUG!,
        projectSlug: process.env.TENDERLY_PROJECT_SLUG!,
      },
    );
    expect(vnet.vnet.fork_config.network_id).toBe(1);
    expect(vnet.vnet.virtual_network_config.chain_config.chain_id).toBe(3030);

    await vnet.testClient.setStorageAt({
      address: "0xe846c6fcf817734ca4527b28ccb4aea2b6663c79",
      index:
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      value:
        "0x0000000000000000000000000000000000000000000000000000000000000069",
    });

    await vnet.delete();
  });

  it("createVnet_force", { timeout: 60_000 }, async () => {
    const vnet = await tenderly_createVnet(
      {
        baseChainId: 56,
        forkChainId: 3030,
        slug: "tenderly-diffspec-force",
        displayName: "Vitest test force",
        force: true,
      },
      {
        accessToken: process.env.TENDERLY_ACCESS_TOKEN!,
        accountSlug: process.env.TENDERLY_ACCOUNT_SLUG!,
        projectSlug: process.env.TENDERLY_PROJECT_SLUG!,
      },
    );
  });
});
