import { describe, expect, it } from "vitest";
import { verifyBytecode } from "./verify-bytecode";

// These hit a live explorer + rpc and download the matching solc compiler, so
// they are skipped on CI (same convention as ecosystem/explorers.spec.ts) and
// run locally with `ETHERSCAN_API_KEY` set.
describe("verification:verifyBytecode", () => {
  it.skipIf(process.env.CI)(
    "follows the Aave V3 Pool proxy and matches its implementation",
    async () => {
      const result = await verifyBytecode({
        chainId: 1,
        address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
        apiKey: process.env.ETHERSCAN_API_KEY,
      });

      expect(result.isProxy).toBe(true);
      expect(result.implementation).toBeDefined();
      expect(result.verifiedAddress).toEqual(result.implementation);
      // explorer source should reproduce the deployed runtime bytecode
      expect(["perfect", "partial"]).toContain(result.runtimeMatch);
    },
    120_000,
  );
});
