import { describe, it, expect } from "vitest";
import {
  HALF_RAY,
  HALF_WAD,
  RAY,
  rayDiv,
  rayMul,
  wadDiv,
  rayToWad,
  WAD,
  wadToRay,
  WAD_RAY_RATIO,
} from "./ray-math";

describe("ray math", () => {
  it("WAD should be equal to 1000000000000000000", () => {
    expect(WAD).toEqual(1000000000000000000n);
  });

  it("HALF_WAD be should equal to 500000000000000000", () => {
    expect(HALF_WAD).toEqual(500000000000000000n);
  });

  it("RAY should be equal to 1000000000000000000000000000", () => {
    expect(RAY).toEqual(1000000000000000000000000000n);
  });

  it("HALF_RAY should be equal to 500000000000000000000000000", () => {
    expect(HALF_RAY).toEqual(500000000000000000000000000n);
  });

  it("WAD_RAY_RATIO should be equal to 1000000000", () => {
    expect(WAD_RAY_RATIO).toEqual(1000000000n);
  });

  it("wadToRay should convert wads to ray", () => {
    expect(wadToRay(WAD)).toBe(RAY);
  });

  it("rayToWad should convert ray to wads", () => {
    expect(rayToWad(RAY)).toBe(WAD);
  });

  describe("rayMul", () => {
    it.each`
      a                      | b            | expected
      ${RAY}                 | ${RAY}       | ${RAY}
      ${RAY}                 | ${0n}        | ${0n}
      ${RAY}                 | ${RAY + 1n}  | ${RAY + 1n}
      ${RAY}                 | ${RAY * 10n} | ${RAY * 10n}
      ${RAY}                 | ${RAY / 10n} | ${RAY / 10n}
      ${RAY + HALF_RAY}      | ${RAY + 1n}  | ${RAY + HALF_RAY + 2n}
      ${RAY + HALF_RAY - 1n} | ${RAY + 1n}  | ${RAY + HALF_RAY}
    `("returns $expected when rayMul($a,$b)", ({ a, b, expected }) => {
      expect(rayMul(a, b)).toBe(expected);
    });
  });

  describe("rayDiv", () => {
    it.each`
      a           | b            | expected
      ${RAY}      | ${RAY}       | ${RAY}
      ${RAY}      | ${RAY * 10n} | ${RAY / 10n}
      ${RAY}      | ${RAY / 10n} | ${RAY * 10n}
      ${RAY}      | ${1n}        | ${RAY * RAY}
      ${RAY}      | ${3n * RAY}  | ${RAY / 3n}
      ${RAY - 1n} | ${2n * RAY}  | ${RAY / 2n}
      ${RAY - 2n} | ${5n * RAY}  | ${RAY / 5n}
    `("returns $expected when rayDiv($a,$b)", ({ a, b, expected }) => {
      expect(rayDiv(a, b)).toBe(expected);
    });
  });

  describe("wadDiv", () => {
    it.each`
      a           | b            | expected
      ${WAD}      | ${WAD}       | ${WAD}
      ${WAD}      | ${WAD * 10n} | ${WAD / 10n}
      ${WAD}      | ${WAD / 10n} | ${WAD * 10n}
      ${WAD}      | ${1n}        | ${WAD * WAD}
      ${WAD}      | ${3n * WAD}  | ${WAD / 3n}
      ${WAD - 1n} | ${2n * WAD}  | ${WAD / 2n}
      ${WAD - 2n} | ${5n * WAD}  | ${WAD / 5n}
    `("returns $expected when wadDiv($a,$b)", ({ a, b, expected }) => {
      expect(wadDiv(a, b)).toBe(expected);
    });
  });
});
