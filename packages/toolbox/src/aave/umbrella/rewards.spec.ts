import { describe, expect, it } from "vitest";
import { calculateAccruedRewards } from "./rewards";

describe("umbrella:rewards", () => {
  const SCALING_FACTOR = 10n ** 18n;

  it("should return only accrued when userIndex equals reserveIndex", () => {
    expect(
      calculateAccruedRewards({
        accrued: 100n,
        userIndex: 1000n,
        reserveIndex: 1000n,
        userBalance: 500n,
      }),
    ).toBe(100n);
  });

  it("calculate rewards", () => {
    expect(
      calculateAccruedRewards({
        accrued: 0n,
        userIndex: 104013600651097202379242771200n,
        reserveIndex: 104013600651097202379242771200n,
        userBalance: 1714238009n,
      }),
    ).toBe(0n);
  });

  it("should calculate pending rewards correctly", () => {
    const result = calculateAccruedRewards({
      accrued: 0n,
      userIndex: 0n,
      reserveIndex: SCALING_FACTOR,
      userBalance: 50n,
    });
    expect(result).toBe(50n);
  });

  it("should add pending to existing accrued", () => {
    const result = calculateAccruedRewards({
      accrued: 200n,
      userIndex: 0n,
      reserveIndex: SCALING_FACTOR,
      userBalance: 100n,
    });
    expect(result).toBe(300n);
  });

  it("should return zero when all inputs are zero", () => {
    expect(
      calculateAccruedRewards({
        accrued: 0n,
        userIndex: 0n,
        reserveIndex: 0n,
        userBalance: 0n,
      }),
    ).toBe(0n);
  });

  it("should handle large values without overflow", () => {
    const result = calculateAccruedRewards({
      accrued: 10n ** 24n,
      userIndex: 10n ** 27n,
      reserveIndex: 2n * 10n ** 27n,
      userBalance: 10n ** 18n,
    });
    // pending = (1e18 * (2e27 - 1e27)) / 1e18 = 1e27
    expect(result).toBe(10n ** 24n + 10n ** 27n);
  });

  it("should truncate fractional pending rewards (floor division)", () => {
    const result = calculateAccruedRewards({
      accrued: 0n,
      userIndex: 0n,
      reserveIndex: 1n,
      userBalance: SCALING_FACTOR - 1n,
    });
    // pending = ((1e18 - 1) * 1) / 1e18 = 0 (truncated)
    expect(result).toBe(0n);
  });
});
