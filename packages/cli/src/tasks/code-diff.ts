import { Command, Option } from "@commander-js/extra-typings";
import {
  BlockscoutStyleSourceCode,
  diffCode,
  getSourceCode,
  parseBlockscoutStyleSourceCode,
  parseEtherscanStyleSourceCode,
  StandardJsonInput,
} from "@bgd-labs/toolbox";
import { mkdirSync, writeFileSync } from "node:fs";

export function registerCodeDiff(program: Command) {
  program
    .command("codeDiff")
    .description("generated the diff between any two addresses")
    .addOption(new Option("--address1 <address>").makeOptionMandatory())
    .addOption(new Option("--chainId1 <number>").makeOptionMandatory())
    .addOption(new Option("--address2 <address>").makeOptionMandatory())
    .addOption(new Option("--chainId2 <number>").makeOptionMandatory())
    .addOption(new Option("-f, --flatten"))
    .addOption(
      new Option("-o, --output <format>")
        .choices(["stdout", "file"])
        .default("stdout"),
    )
    .addOption(new Option("-p, --path <path>").default("./diffs/code"))
    .action(
      async ({
        address1,
        address2,
        chainId1,
        chainId2,
        flatten,
        output,
        path,
      }) => {
        const sources = await Promise.all([
          getSourceCode({
            chainId: Number(chainId1),
            address: address1 as any,
            apiKey: process.env.ETHERSCAN_API_KEY,
            apiUrl: process.env.EXPLORER_PROXY,
          }),
          getSourceCode({
            chainId: Number(chainId2),
            address: address2 as any,
            apiKey: process.env.ETHERSCAN_API_KEY,
            apiUrl: process.env.EXPLORER_PROXY,
          }),
        ]);
        const source1: StandardJsonInput = (
          sources[0] as BlockscoutStyleSourceCode
        ).AdditionalSources
          ? parseBlockscoutStyleSourceCode(
              sources[0] as BlockscoutStyleSourceCode,
            )
          : parseEtherscanStyleSourceCode(sources[0].SourceCode);
        const source2: StandardJsonInput = (
          sources[0] as BlockscoutStyleSourceCode
        ).AdditionalSources
          ? parseBlockscoutStyleSourceCode(
              sources[1] as BlockscoutStyleSourceCode,
            )
          : parseEtherscanStyleSourceCode(sources[1].SourceCode);
        const diff = await diffCode(source1, source2);
        if (flatten || output === "stdout") {
          const flat = Object.keys(diff).reduce((acc, key) => {
            acc += diff[key];
            return acc;
          }, "");
          if (output === "stdout") {
            console.log(flat);
          } else {
            const filePath = `${path}/${chainId1}`;
            mkdirSync(filePath, { recursive: true });
            writeFileSync(`${filePath}/${address1}_${address2}.patch`, flat);
          }
        } else {
          const filePath = `${path}/${chainId1}/${address1}_${address2}`;
          mkdirSync(filePath, { recursive: true });
          Object.keys(diff).map((file) => {
            writeFileSync(`${filePath}/${file}.patch`, diff[file]);
          });
        }
      },
    );
}
