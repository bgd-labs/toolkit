import { describe, expect, it } from "vitest";
import { bitmapToIndexes, getBits, setBits } from "./binary";

describe("math:binary", () => {
  it("bitmapToIndexes should return correct indexes", () => {
    expect(bitmapToIndexes(0b110001n)).toEqual([0, 4, 5]);
  });

  it("getBits should return correct bits", () => {
    expect(getBits(0b110001n, 0n, 0n)).toEqual(1n);
    expect(getBits(0b110001n, 1n, 1n)).toEqual(0n);
    expect(getBits(0b110001n, 0n, 1n)).toEqual(1n);
    expect(getBits(0b110001n, 4n, 5n)).toEqual(3n);
  });

  it("setBits should set correct bits", () => {
    expect(setBits(0b110001n, 0n, 0n, 0n)).toEqual(0b110000n);
    expect(setBits(0b110001n, 0n, 2n, 0b110n)).toEqual(0b110110n);
  });
});
