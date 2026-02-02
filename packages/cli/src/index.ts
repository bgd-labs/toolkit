#!/usr/bin/env node
import "dotenv/config";
import { Command, Option } from "@commander-js/extra-typings";
import packageJson from "../package.json";
import { registerCodeDiff } from "./tasks/code-diff";
import { registerAaveVNet } from "./tasks/aave-vnet";
import { registerStorageDiff } from "./tasks/storage-diff";
import { registerRpcs } from "./tasks/rpcs";
import { registerProtocol } from "./tasks/protocol";
import { registerSeatbeltReport } from "./tasks/seatbelt-report.js";

const program = new Command();

program
  .name("@bgd-labs/cli")
  .description("A cli to help with web3 / solidity tasks")
  .version(packageJson.version)
  .showHelpAfterError();

registerCodeDiff(program);
registerAaveVNet(program);
registerStorageDiff(program);
registerRpcs(program);
registerProtocol(program);
registerSeatbeltReport(program);

program.parse();
