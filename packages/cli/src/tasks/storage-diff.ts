import { Command, Option } from "@commander-js/extra-typings";
import {
  diffFoundryStorageLayout,
  foundry_getStorageLayout,
} from "@bgd-labs/toolbox";

export function registerStorageDiff(program: Command) {
  program
    .command("storageDiff")
    .description("generated the storage diff between any two files")
    .addOption(new Option("--contract1 <Contract|path>").makeOptionMandatory())
    .addOption(new Option("--contract2 <Contract|path>").makeOptionMandatory())
    .action(async ({ contract1, contract2 }) => {
      const storage1 = foundry_getStorageLayout(contract1);
      const storage2 = foundry_getStorageLayout(contract2);
      const result = diffFoundryStorageLayout(storage1, storage2);
      console.log(result);
    });
}
