import {
  type Hex,
  concat,
  encodeAbiParameters,
  fromHex,
  getAddress,
  keccak256,
  pad,
  parseAbiParameters,
  slice,
  toBytes,
  toHex,
  trim,
} from "viem";
/**
 * @notice Returns the storage slot for a Solidity mapping with bytes32 keys, given the slot of the mapping itself
 * @dev Read more at https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#mappings-and-dynamic-arrays
 * @param mappingSlot Mapping slot in storage
 * @param key Mapping key to find slot for
 * @returns Storage slot
 */
export function getSolidityStorageSlotBytes(mappingSlot: Hex, key: Hex) {
  const slot = pad(mappingSlot, { size: 32 });
  return trim(
    keccak256(
      encodeAbiParameters(parseAbiParameters("bytes32, uint256"), [
        key,
        BigInt(slot),
      ]),
    ),
  );
}

/**
 * @notice Returns the storage slot for a Solidity mapping with uint keys, given the slot of the mapping itself
 * @dev Read more at https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#mappings-and-dynamic-arrays
 * @param mappingSlot Mapping slot in storage
 * @param key Mapping key to find slot for
 * @returns Storage slot
 */
export function getSolidityStorageSlotUint(mappingSlot: bigint, key: bigint) {
  return keccak256(
    encodeAbiParameters(parseAbiParameters("uint256, uint256"), [
      key,
      mappingSlot,
    ]),
  );
}

export function getSolidityStorageSlotAddress(
  mappingSlot: bigint | number,
  key: Hex,
) {
  return keccak256(
    encodeAbiParameters(parseAbiParameters("address, uint256"), [
      key,
      BigInt(mappingSlot),
    ]),
  );
}

/**
 * Returns the slot of an array item
 * @param baseSlot baseSlot of the array size pointer
 * @param arrayIndex index within the array
 * @param itemSize number of slots consumed per array item
 * @returns
 */
export function getDynamicArraySlot(
  baseSlot: bigint,
  arrayIndex: number,
  itemSize: number,
): Hex {
  return pad(
    toHex(
      fromHex(
        keccak256(
          encodeAbiParameters(parseAbiParameters("uint256"), [baseSlot]),
        ),
        "bigint",
      ) + BigInt(arrayIndex * itemSize),
    ),
    { size: 32 },
  );
}

/**
 * https://ethereum.stackexchange.com/questions/107282/storage-and-memory-layout-of-strings
 * @param value string | bytes
 */
export function getBytesValue(value: string | Hex) {
  const bytesString = toBytes(value);
  if (bytesString.length > 31)
    throw new Error("Error: strings > 31 bytes are not implemented");
  return concat([
    toHex(pad(bytesString, { size: 31, dir: "right" })),
    toHex(bytesString.length * 2, { size: 1 }),
  ]);
}

export function bytes32ToAddress(bytes32: Hex) {
  return getAddress(slice(bytes32, 12, 32));
}
