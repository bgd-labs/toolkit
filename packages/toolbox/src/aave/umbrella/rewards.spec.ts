import { describe, expect, it } from "vitest";
import { calculateAccruedRewards } from "./rewards";

describe("umbrella:rewards", () => {
  it("calculate rewards", () => {
    const result = calculateAccruedRewards({
      accrued: 0n,
      userIndex: 104013600651097202379242771200n,
      reserveIndex: 104013600651097202379242771200n,
      userBalance: 1714238009n,
      lastUpdateTimestamp: 1771325932n,
      currentTimestamp: 1771330334n,
      distributionEnd: 1788279900n,
      emissionPerSecond: 158548n,
      totalSupply: 378469011790n,
    });
    expect(result).toEqual(3161197n);
  });
});
