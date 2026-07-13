import { describe, expect, it } from "vitest";
import { getAddress } from "viem";
import { resolveImplementation, slotToAddress } from "./proxy";

const IMPL = "0xef434e4573b90b6ecd4a00f4888381e4d0cc5ccd";

describe("verification:proxy", () => {
  describe("slotToAddress", () => {
    it("extracts a checksummed address from a 32-byte slot value", () => {
      const slot = `0x${"00".repeat(12)}${IMPL.slice(2)}`;
      expect(slotToAddress(slot)).toEqual(getAddress(IMPL));
    });

    it("treats an empty / zero slot as not-a-proxy", () => {
      expect(slotToAddress(undefined)).toBeUndefined();
      expect(slotToAddress(`0x${"00".repeat(32)}`)).toBeUndefined();
    });
  });

  describe("resolveImplementation (explorer hint, no client)", () => {
    it("returns the reported implementation when the explorer flags a proxy", async () => {
      const impl = await resolveImplementation({
        address: "0x1111111111111111111111111111111111111111",
        explorerSource: { Proxy: "1", Implementation: IMPL },
      });
      expect(impl).toEqual(getAddress(IMPL));
    });

    it("returns undefined when the explorer does not flag a proxy", async () => {
      expect(
        await resolveImplementation({
          address: "0x1111111111111111111111111111111111111111",
          explorerSource: { Proxy: "0", Implementation: IMPL },
        }),
      ).toBeUndefined();
    });

    it("returns undefined for a zero implementation hint", async () => {
      expect(
        await resolveImplementation({
          address: "0x1111111111111111111111111111111111111111",
          explorerSource: {
            Proxy: "1",
            Implementation: "0x0000000000000000000000000000000000000000",
          },
        }),
      ).toBeUndefined();
    });
  });
});
