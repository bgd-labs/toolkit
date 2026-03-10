import { describe, expect, it } from "vitest";
import { getClosestBlock } from "./rpc-helpers";
import { getClient } from "./rpcs";

describe.skipIf(process.env.CI)("ecosystem:rpc-helpers", () => {
  it(
    "should find the closest block for a given timestamp",
    { timeout: 30000 },
    async () => {
      const client = getClient(1, {
        providerConfig: { alchemyKey: process.env.ALCHEMY_API_KEY },
      });

      const block = await getClosestBlock({
        client,
        timestamp: 1772535647n,
      });

      // The returned block timestamp should be <= the target
      expect(block.timestamp).toBeLessThanOrEqual(1772535647n);
      // And the block should exist
      expect(block.number).toBeGreaterThan(0n);
    },
  );
});
