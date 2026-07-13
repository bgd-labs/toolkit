import { readFileSync } from "node:fs";
import { Command, Option } from "@commander-js/extra-typings";
import { Address } from "viem";
import {
  expandMigrateConfig,
  migrateVerification,
  type MigrateBatchConfig,
  type MigrateVerificationParams,
  type MigrateVerificationResult,
} from "@bgd-labs/toolbox/verification";

const EXPLORERS = [
  "etherscan",
  "blockscout",
  "routescan",
  "oklink",
  "sourcify",
] as const;

function printSummary(result: MigrateVerificationResult) {
  const icon = (status: string) =>
    status === "verified"
      ? "✅ verified"
      : status === "already-verified"
        ? "⏭️  already verified"
        : status === "pending"
          ? "🟡 pending"
          : `❌ ${status}`;
  console.log(
    `\nSummary (${result.from.explorer ?? "auto"}@${result.from.chainId} → ${result.to.explorer}@${result.to.chainId}):`,
  );
  console.table(
    result.targets.reduce(
      (acc, t) => {
        acc[t.address] = {
          role: t.role,
          status: icon(t.status),
          ...(t.sourceAddress.toLowerCase() !== t.address.toLowerCase()
            ? { source: t.sourceAddress }
            : {}),
          detail: t.message ?? "",
        };
        return acc;
      },
      {} as Record<string, Record<string, string>>,
    ),
  );
}

export function registerMigrateVerification(program: Command) {
  program
    .command("migrateVerification")
    .description(
      "copy a contract's verification to another explorer and/or chain (follows proxies; supports batch via --config)",
    )
    .addOption(
      new Option(
        "--config <path>",
        "json config for batch migration (see README); when set, the flags below are ignored",
      ),
    )
    .addOption(
      new Option("--fromContract <address>", "address of the verified source contract"),
    )
    .addOption(new Option("--toContract <address>", "address to verify on the target (defaults to --fromContract)"))
    .addOption(new Option("--fromChainId <number>", "chain id of the source contract"))
    .addOption(new Option("--toChainId <number>", "chain id of the target contract (defaults to --fromChainId)"))
    .addOption(
      new Option(
        "--fromExplorer <name>",
        "explorer to copy the verified source from (defaults to the chain's prioritized explorer)",
      ).choices(EXPLORERS),
    )
    .addOption(
      new Option("--toExplorer <name>", "explorer to publish the verification to").choices(EXPLORERS),
    )
    .addOption(new Option("--no-wait", "submit without polling for the verification result"))
    .addOption(
      new Option(
        "--pollTimeout <seconds>",
        "max seconds to wait for verification (polls every 10s, default 180)",
      ),
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
  fromContract?: string;
  toContract?: string;
  fromChainId?: string;
  toChainId?: string;
  fromExplorer?: (typeof EXPLORERS)[number];
  toExplorer?: (typeof EXPLORERS)[number];
  wait?: boolean;
  pollTimeout?: string;
  output?: string;
}) {
  const verbose = opts.output !== "json";

  // Build the list of jobs: from a config file (batch) or the flags (single).
  let jobs: MigrateVerificationParams[];
  if (opts.config) {
    const parsed = JSON.parse(readFileSync(opts.config, "utf8")) as MigrateBatchConfig;
    jobs = expandMigrateConfig(parsed);
    if (verbose) console.log(`Loaded ${jobs.length} migration(s) from ${opts.config}`);
  } else {
    if (!opts.fromContract || !opts.fromChainId || !opts.toExplorer) {
      throw new Error(
        "provide --config, or at least --fromContract, --fromChainId and --toExplorer",
      );
    }
    jobs = [
      {
        from: {
          chainId: Number(opts.fromChainId),
          address: opts.fromContract as Address,
          explorer: opts.fromExplorer,
        },
        to: {
          chainId: Number(opts.toChainId ?? opts.fromChainId),
          address: (opts.toContract ?? opts.fromContract) as Address,
          explorer: opts.toExplorer,
        },
        wait: opts.wait,
        pollTimeoutMs: opts.pollTimeout ? Number(opts.pollTimeout) * 1000 : undefined,
      },
    ];
  }

  const results: MigrateVerificationResult[] = [];
  for (const job of jobs) {
    if (verbose) {
      console.log(
        `\nMigrating: ${job.from.explorer ?? "auto"}@${job.from.chainId} ${job.from.address} → ${job.to.explorer}@${job.to.chainId} ${job.to.address}…`,
      );
    }
    // Read explorer creds from the env here (node) and pass them in per
    // endpoint; the toolbox stays free of process.env.
    const result = await migrateVerification({
      ...job,
      from: {
        ...job.from,
        apiKey: job.from.apiKey ?? process.env.ETHERSCAN_API_KEY,
        apiUrl: job.from.apiUrl ?? process.env.EXPLORER_PROXY,
      },
      to: {
        ...job.to,
        apiKey: job.to.apiKey ?? process.env.ETHERSCAN_API_KEY,
      },
      onLog: verbose ? (m) => console.log(m) : undefined,
    });
    results.push(result);
    if (verbose) printSummary(result);
  }

  if (opts.output === "json") {
    console.log(JSON.stringify(opts.config ? results : results[0], null, 2));
  }

  // CI gate: any target that failed (or never settled) is a non-zero exit.
  if (results.some((r) => r.targets.some((t) => t.status === "failed"))) {
    process.exitCode = 1;
  }
}
