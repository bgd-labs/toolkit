import { readFileSync } from "node:fs";
import { Command, Option } from "@commander-js/extra-typings";
import { Address } from "viem";
import {
  expandValidateConfig,
  validateVerification,
  type ValidateBatchConfig,
  type ValidateVerificationParams,
  type ValidateVerificationResult,
} from "@bgd-labs/toolbox/verification";

/**
 * Fill in api keys / proxy url from the environment when a job didn't set them.
 * Only the etherscan-compatible explorers need a key; OKLink ignores it.
 */
function withEnvKeys(job: ValidateVerificationParams): ValidateVerificationParams {
  return {
    ...job,
    apiKey: job.apiKey ?? process.env.ETHERSCAN_API_KEY,
    apiUrl: job.apiUrl ?? process.env.EXPLORER_PROXY,
  };
}

function printResult(result: ValidateVerificationResult) {
  // `null` means different things by context: for runtime it is a real "no
  // match", for creation it just means we never supplied a creator tx.
  const matchLabel = (status: ValidateVerificationResult["runtimeMatch"]) =>
    status === "perfect"
      ? "✅ perfect (incl. metadata)"
      : status === "partial"
        ? "🟡 partial (modulo metadata)"
        : status === null
          ? "❌ no match"
          : `❌ ${status}`;
  console.table({
    address: result.address,
    chainId: result.chainId,
    contract: result.contractName,
    compiler: result.compilerVersion,
    proxy: result.isProxy ? result.implementation : "no",
    verifiedAddress: result.verifiedAddress,
    explorerClaimsVerified: result.explorerClaimedVerified,
    runtimeMatch: matchLabel(result.runtimeMatch),
  });
}

export function registerValidateVerification(program: Command) {
  program
    .command("validateVerification")
    .description(
      "independently verify that an explorer's source compiles to the on-chain bytecode (supports batch via --config)",
    )
    .addOption(
      new Option(
        "--config <path>",
        "json config for batch validation (see README); when set, the flags below are ignored",
      ),
    )
    .addOption(new Option("--contractAddress <address>", "address of the contract to verify"))
    .addOption(new Option("--chainId <number>", "chain id of the contract"))
    .addOption(
      new Option("--explorer <name>", "explorer to source verification data from").choices([
        "etherscan",
        "blockscout",
        "routescan",
        "oklink",
        "sourcify",
      ]),
    )
    .addOption(
      new Option("-o, --output <format>").choices(["table", "json"]).default("table"),
    )
    .action((opts) =>
      run(opts).catch((e) => {
        console.error(`Error: ${(e as Error).message}`);
        process.exit(1);
      }),
    );
}

async function run(opts: {
  config?: string;
  contractAddress?: string;
  chainId?: string;
  explorer?: "etherscan" | "blockscout" | "routescan" | "oklink" | "sourcify";
  output?: string;
}) {
  if (opts.explorer === "sourcify") {
    throw new Error(
      "The sourcify explorer adapter is not implemented yet; use etherscan or blockscout.",
    );
  }
  const verbose = opts.output !== "json";

  let jobs: ValidateVerificationParams[];
  if (opts.config) {
    const parsed = JSON.parse(readFileSync(opts.config, "utf8")) as ValidateBatchConfig;
    jobs = expandValidateConfig(parsed).map(withEnvKeys);
    if (verbose) console.log(`Loaded ${jobs.length} contract(s) from ${opts.config}`);
  } else {
    if (!opts.contractAddress || !opts.chainId) {
      throw new Error("provide --config, or both --contractAddress and --chainId");
    }
    jobs = [
      withEnvKeys({
        chainId: Number(opts.chainId),
        address: opts.contractAddress as Address,
        explorer: opts.explorer,
      }),
    ];
  }

  const results: ValidateVerificationResult[] = [];
  for (const job of jobs) {
    if (verbose) console.log(`\nValidating ${job.address} on chain ${job.chainId}…`);
    const result = await validateVerification(job);
    results.push(result);
    if (verbose) printResult(result);
  }

  if (opts.output === "json") {
    console.log(JSON.stringify(opts.config ? results : results[0], null, 2));
  }

  // CI gate: a missing runtime match means the source does not reproduce the
  // deployed bytecode.
  if (results.some((r) => r.runtimeMatch === null || r.runtimeMatch === "error")) {
    process.exitCode = 1;
  }
}
