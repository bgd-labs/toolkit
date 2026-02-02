import { bitmapToIndexes } from "../math/binary";

/**
 * The userConfiguration on aave is stored as an alteranting bitmap.
 * The least significant bit starts with borrowing on reserve 0
 * In practice this means that the following bitmap b'1011 would mean a user
 * is borrowing(bit 0) reserve 0, and supplies(bit 1,3) collateral on reserve 0 and 1
 * @param userConfiguration bitmap
 */
export function decodeUserConfiguration(userConfiguration: bigint) {
  const indexes = bitmapToIndexes(userConfiguration);
  const borrowedAssetIds: number[] = [];
  const collateralAssetIds: number[] = [];
  for (const index of indexes) {
    if (index % 2 == 0) borrowedAssetIds.push(index / 2);
    else collateralAssetIds.push((index - 1) / 2);
  }
  return { borrowedAssetIds, collateralAssetIds };
}
