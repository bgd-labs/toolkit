/**
 * In solidity it is a quite common practice to encode bit variables in bitmaps opposed to bool structs.
 * The reason for this is that solidity will pack one boolean per byte, while with a bitmap, one can pack one bit.. per bit.
 * These utilities help with extracting the indexes of a given bitmap.
 */

/**
 * Decodes a bitmap as an array of indexes.
 * @param bitmap The bitmap
 * @returns an array of indexes
 */
export function bitmapToIndexes(bitmap: bigint): number[] {
  const indexes: number[] = [];
  for (let i = 0; bitmap != 0n; i++) {
    if (bitmap & 0x1n) indexes.push(i);
    bitmap = bitmap >> 1n;
  }
  return indexes;
}

/**
 * Returns the selected bits of a uint256 as bigint
 * @param uint256 The input number (must be non-negative)
 * @param startBit Starting bit position (inclusive, 0-indexed)
 * @param endBit Ending bit position (inclusive)
 * @returns The extracted bits as a bigint
 * @example
 * getBits(0b110001n, 0n, 0n); // 0b1n (bit 0)
 * getBits(0b110001n, 4n, 5n); // 0b11n (bits 4-5)
 */
export function getBits(
  uint256: bigint,
  startBit: bigint,
  endBit: bigint,
): bigint {
  // Validation
  if (uint256 < 0n) {
    throw new Error("uint256 must be non-negative");
  }
  if (startBit < 0n || endBit < 0n) {
    throw new Error("Bit positions must be non-negative");
  }
  if (startBit > endBit) {
    throw new Error(
      "Invalid bit range: startBit must be less than or equal to endBit",
    );
  }

  // Fast path for zero
  if (uint256 === 0n) {
    return 0n;
  }

  // More efficient bit length calculation (fixed from previous buggy implementation)
  const bitLength = uint256.toString(2).length;

  // If the range is entirely beyond the actual bits, return 0
  if (startBit >= bitLength) {
    return 0n;
  }

  // Clamp endBit to actual bit length
  const actualEndBit = endBit >= bitLength ? BigInt(bitLength - 1) : endBit;

  const mask = (1n << (actualEndBit - startBit + 1n)) - 1n;
  return (uint256 >> startBit) & mask;
}

/**
 * Sets the bits in a bigint
 * @param input
 * @param startBit inclusive
 * @param endBit inclusive
 * @param value the value to replace
 * @returns
 */
export function setBits(
  input: bigint,
  startBit: bigint,
  endBit: bigint,
  replaceValue: bigint | number,
) {
  const bigIntReplaceValue = BigInt(replaceValue);

  // Calculate the mask for the specified range
  let mask = BigInt(0);
  for (let i = startBit; i < endBit + 1n; i++) {
    mask |= BigInt(1) << BigInt(i);
  }
  // Clear the bits in the original number within the specified range
  const clearedNumber = input & ~mask;

  // Set the new bits in the specified range
  const result = clearedNumber | (bigIntReplaceValue << BigInt(startBit));
  return result;
}
