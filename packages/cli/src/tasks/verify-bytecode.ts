import { Command, Option } from "@commander-js/extra-typings";
import { Address } from "viem";
import { verifyBytecode } from "@bgd-labs/toolbox/verification";

export function registerVerifyBytecode(program: Command) {
  program
    .command("verifyBytecode")
    .description(
      "independently verify that an explorer's source compiles to the on-chain bytecode",
    )
    .addOption(
      new Option(
        "--contractAddress <address>",
        "address of the contract to verify",
      ).makeOptionMandatory(),
    )
    .addOption(
      new Option("--chainId <number>", "chain id of the contract")
        .makeOptionMandatory(),
    )
    .addOption(
      new Option("--rpc-url <url>", "rpc url (defaults to the toolbox's resolved url)"),
    )
    .addOption(
      new Option("--explorer <name>", "explorer to source verification data from")
        .choices(["etherscan", "blockscout", "routescan", "oklink", "sourcify"]),
    )
    .addOption(
      new Option("--no-proxy", "verify the address as-is instead of following proxies"),
    )
    .addOption(
      new Option("-o, --output <format>")
        .choices(["table", "json"])
        .default("table"),
    )
    .action(
      async ({ contractAddress, chainId, rpcUrl, explorer, proxy, output }) => {
        if (explorer === "sourcify") {
          throw new Error(
            "The sourcify explorer adapter is not implemented yet; use etherscan or blockscout.",
          );
        }
        const result = await verifyBytecode({
          chainId: Number(chainId),
          address: contractAddress as Address,
          rpcUrl,
          explorer,
          apiKey: process.env.ETHERSCAN_API_KEY,
          apiUrl: process.env.EXPLORER_PROXY,
          resolveProxy: proxy,
        });

        if (output === "json") {
          console.log(JSON.stringify(result, null, 2));
        } else {
          // `null` means different things by context: for runtime it is a real
          // "no match", for creation it just means we never supplied a creator
          // tx so it was not checked.
          const matchLabel = (
            status: typeof result.runtimeMatch,
            nullLabel: string,
          ) =>
            status === "perfect"
              ? "✅ perfect (incl. metadata)"
              : status === "partial"
                ? "🟡 partial (modulo metadata)"
                : status === null
                  ? nullLabel
                  : `❌ ${status}`;
          console.table({
            address: result.address,
            chainId: result.chainId,
            contract: result.contractName,
            compiler: result.compilerVersion,
            proxy: result.isProxy ? result.implementation : "no",
            verifiedAddress: result.verifiedAddress,
            explorerClaimsVerified: result.explorerClaimedVerified,
            runtimeMatch: matchLabel(result.runtimeMatch, "❌ no match"),
          });
        }

        // CI gate: a missing runtime match means the explorer source does not
        // reproduce the deployed bytecode.
        if (result.runtimeMatch === null || result.runtimeMatch === "error") {
          process.exitCode = 1;
        }
      },
    );
}
