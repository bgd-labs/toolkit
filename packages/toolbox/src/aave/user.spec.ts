import { describe, expect, it } from "vitest";
import { decodeUserConfiguration } from "./user";

describe("aave:user", () => {
  it("decodeUserConfiguration should return correct indexes", () => {
    const userConfig = decodeUserConfiguration(0b110001n);
    expect(userConfig).toEqual({
      borrowedAssetIds: [0, 2],
      collateralAssetIds: [2],
    });
  });
});
