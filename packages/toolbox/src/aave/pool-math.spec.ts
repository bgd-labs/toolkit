import { describe, it, expect } from "vitest";
import {
  calculateCompoundedInterest,
  calculateLinearInterest,
  getCurrentDebtBalance,
  getNormalizedDebt,
} from "./pool-math";

import { RAY } from "./ray-math";
import { SECONDS_PER_YEAR } from "./constants";

describe("pool math", () => {
  it("check getCurrentDebtBalance", () => {
    expect(
      getCurrentDebtBalance({
        scaledBalance: 1000n,
        index: RAY,
        rate: 0n,
        currentTimestamp: 1,
        lastUpdateTimestamp: 0,
      }),
    ).toEqual(1000n);
  });

  it("check calculateLinearInterest", () => {
    const lastUpdateTimestamp = Number(BigInt(Date.now()) / 1000n);
    const currentTimestamp =
      lastUpdateTimestamp + Number(SECONDS_PER_YEAR / 2n);
    expect(
      calculateLinearInterest({
        rate: 10005n * 10n ** 23n,
        currentTimestamp,
        lastUpdateTimestamp,
      }).toString(),
    ).toEqual((150025n * BigInt(10 ** 22)).toString());
  });

  it("check getNormalizedDebt", () => {
    expect(
      getNormalizedDebt({
        index: RAY,
        rate: 0n,
        currentTimestamp: 1,
        lastUpdateTimestamp: 0,
      }),
    ).toEqual(RAY);
  });

  it("check many blocks, 0 interest", () => {
    expect(
      calculateCompoundedInterest({
        rate: 0n,
        currentTimestamp: 10000000,
        lastUpdateTimestamp: 0,
      }),
    ).toEqual(RAY);
  });

  it("check same block, high interest rate", () => {
    expect(
      calculateCompoundedInterest({
        rate: 32323123231232131232312312n,
        currentTimestamp: 1,
        lastUpdateTimestamp: 1,
      }),
    ).toEqual(RAY);
  });

  it("check calculateCompoundInterest_1", () => {
    const lastUpdateTimestamp = Number(BigInt(Date.now()) / 1000n);
    const currentTimestamp =
      lastUpdateTimestamp + Number(SECONDS_PER_YEAR / 2n);
    expect(
      calculateCompoundedInterest({
        rate: 10005n * 10n ** 23n,
        currentTimestamp,
        lastUpdateTimestamp,
      }).toString(),
    ).toEqual(1646239361880034706419516000n.toString());
  });
});
