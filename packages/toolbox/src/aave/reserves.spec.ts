import { describe, it, expect } from "vitest";
import { decodeReserveConfiguration } from "./reserve";

describe("decoding", () => {
  it("decode v3 config", () => {
    expect(decodeReserveConfiguration(BigInt("184283194582935181459456")))
      .toMatchInlineSnapshot(`
        {
          "active": true,
          "borrowCap": 0n,
          "borrowingEnabled": false,
          "borrowingInIsolation": false,
          "debtCeiling": 0n,
          "decimals": 18,
          "flashloaningEnabled": false,
          "frozen": true,
          "liquidationBonus": 11000,
          "liquidationProtocolFee": 0,
          "liquidationThreshold": 6500,
          "ltv": 0,
          "paused": false,
          "reserveFactor": 9990,
          "siloedBorrowingEnabled": false,
          "supplyCap": 0n,
          "virtualAccountingEnabled": false,
        }
      `);

    expect(
      decodeReserveConfiguration(
        BigInt(
          "7237005577332262213973186563042994240829457118352273037090307903331189653504",
        ),
      ),
    ).toMatchInlineSnapshot(`
      {
        "active": true,
        "borrowCap": 1n,
        "borrowingEnabled": true,
        "borrowingInIsolation": false,
        "debtCeiling": 0n,
        "decimals": 18,
        "flashloaningEnabled": true,
        "frozen": false,
        "liquidationBonus": 0,
        "liquidationProtocolFee": 0,
        "liquidationThreshold": 0,
        "ltv": 0,
        "paused": false,
        "reserveFactor": 1000,
        "siloedBorrowingEnabled": false,
        "supplyCap": 1n,
        "virtualAccountingEnabled": true,
      }
    `);

    expect(
      decodeReserveConfiguration(
        BigInt(
          "7237005577332262213973186563042994365444498648130894503114824546631697825792",
        ),
      ),
    ).toMatchInlineSnapshot(`
      {
        "active": true,
        "borrowCap": 1400000n,
        "borrowingEnabled": true,
        "borrowingInIsolation": false,
        "debtCeiling": 0n,
        "decimals": 18,
        "flashloaningEnabled": true,
        "frozen": false,
        "liquidationBonus": 0,
        "liquidationProtocolFee": 0,
        "liquidationThreshold": 0,
        "ltv": 0,
        "paused": false,
        "reserveFactor": 1000,
        "siloedBorrowingEnabled": false,
        "supplyCap": 1500000n,
        "virtualAccountingEnabled": true,
      }
    `);
  });
});
