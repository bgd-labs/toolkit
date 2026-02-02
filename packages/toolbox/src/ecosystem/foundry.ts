import { execSync } from "node:child_process";
import { StandardJsonInput } from "./types";
import { createPatch } from "diff";

/**
 * Returns the standardJsonInput format as consumed by most explorers
 * @param input Contract or path:Contract if contract is not unique.
 */
export function foundry_getStandardJsonInput(input: string) {
  const output = JSON.parse(
    execSync(
      `forge verify-contract --show-standard-json-input --verifier etherscan 0x0000000000000000000000000000000000000000 ${input}`,
    ).toString(),
  ) as StandardJsonInput;
  return output;
}

export type Storage = {
  astId: string;
  contract: string;
  label: string;
  offset: number;
  slot: number;
  type: string;
};

export type StorageType = {
  encoding: string;
  label: string;
  numberOfBytes: number;
  base?: string;
  key?: string;
  value?: string;
  members?: {
    astId: string;
    contract: string;
    offset: number;
    slot: number;
    type: string;
    label: string;
  }[];
};

export type FoundryStorage = {
  storage: Storage[];
  types: Record<string, StorageType>;
};

export function foundry_getStorageLayout(input: string) {
  const output = JSON.parse(
    execSync(`forge inspect ${input} storage --json`).toString(),
  ) as FoundryStorage;
  return output;
}

export function foundry_format(input: string) {
  return execSync(`forge fmt - ${input}`).toString();
}

function cleanupFoundryStorageForDiffing(layout: FoundryStorage) {
  const cleanTypes = { ...layout.types };
  for (const key of Object.keys(cleanTypes)) {
    if (cleanTypes[key].members)
      cleanTypes[key].members = cleanTypes[key].members.map((member) => ({
        label: member.label,
        contract: member.contract.split(":")[1],
        offset: member.offset,
        slot: member.slot,
        type: member.type,
      })) as any;
    if (cleanTypes[key].value)
      cleanTypes[key].value = cleanTypes[cleanTypes[key].value] as any;
  }
  const cleanStorage = layout.storage.map((storage) => ({
    label: storage.label,
    slot: storage.slot,
    offset: storage.offset,
    type: cleanTypes[storage.type],
    contract: storage.contract.split(":")[1],
  }));
  return cleanStorage;
}

export function diffFoundryStorageLayout(
  layoutBefore: FoundryStorage,
  layoutAfter: FoundryStorage,
) {
  const beforeString = JSON.stringify(
    cleanupFoundryStorageForDiffing(layoutBefore),
    null,
    2,
  );
  const afterString = JSON.stringify(
    cleanupFoundryStorageForDiffing(layoutAfter),
    null,
    2,
  );
  return createPatch("storage", beforeString, afterString);
}
