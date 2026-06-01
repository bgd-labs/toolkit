import { Command, Option } from "@commander-js/extra-typings";
import { Address } from "viem";
import { migrateVerification } from "@bgd-labs/toolbox/verification";

const EXPLORERS = ["etherscan", "blockscout", "routescan", "oklink"] as const;

export function registerMigrateVerification(program: Command) {
  program
    .command("migrateVerification")
    .description(
      "copy a contract's verification from one explorer to another (follows proxies)",
    )
    .addOption(
      new Option(
        "--contractAddress <address>",
        "address of the contract to migrate",
      ).makeOptionMandatory(),
    )
    .addOption(
      new Option(
        "--chainId <number>",
        "chain id of the contract",
      ).makeOptionMandatory(),
    )
    .addOption(
      new Option(
        "--fromExplorer <name>",
        "explorer to copy the verified source from",
      )
        .choices(EXPLORERS)
        .makeOptionMandatory(),
    )
    .addOption(
      new Option(
        "--toExplorer <name>",
        "explorer to publish the verification to",
      )
        .choices(EXPLORERS)
        .makeOptionMandatory(),
    )
    .addOption(
      new Option(
        "--rpcUrl <url>",
        "rpc url for proxy resolution (defaults to the toolbox's resolved url)",
      ),
    )
    .addOption(
      new Option(
        "--fromApiKey <key>",
        "api key for the source explorer (defaults to env.ETHERSCAN_API_KEY)",
      ),
    )
    .addOption(
      new Option(
        "--toApiKey <key>",
        "api key for the target explorer (defaults to env.ETHERSCAN_API_KEY)",
      ),
    )
    .addOption(new Option("--fromApiUrl <url>", "api url override for the source explorer"))
    .addOption(new Option("--toApiUrl <url>", "api url override for the target explorer"))
    .addOption(
      new Option(
        "--no-proxy",
        "migrate the address as-is instead of following proxies",
      ),
    )
    .addOption(
      new Option("--no-wait", "submit without polling for the verification result"),
    )
    .addOption(
      new Option(
        "--pollTimeout <seconds>",
        "max seconds to wait for verification (polls every 10s, default 180)",
      ),
    )
    .addOption(
      new Option("-o, --output <format>").choices(["table", "json"]).default("table"),
    )
    .action(
      async ({
        contractAddress,
        chainId,
        fromExplorer,
        toExplorer,
        rpcUrl,
        fromApiKey,
        toApiKey,
        fromApiUrl,
        toApiUrl,
        proxy,
        wait,
        pollTimeout,
        output,
      }) => {
        // Each explorer family reads from its own api key env var; OKLink uses
        // its own key (set OKLINK_API_KEY), the etherscan-compatible families
        // share ETHERSCAN_API_KEY.
        const defaultKey = (explorer: string) =>
          explorer === "oklink"
            ? process.env.OKLINK_API_KEY
            : process.env.ETHERSCAN_API_KEY;

        // In table mode stream progress to the console; keep json output clean.
        const verbose = output !== "json";
        if (verbose) {
          console.log(
            `Migrating verification ${fromExplorer} → ${toExplorer} on chain ${chainId} for ${contractAddress}…`,
          );
        }

        const result = await migrateVerification({
          chainId: Number(chainId),
          address: contractAddress as Address,
          fromExplorer,
          toExplorer,
          rpcUrl,
          fromApiKey: fromApiKey ?? defaultKey(fromExplorer),
          toApiKey: toApiKey ?? defaultKey(toExplorer),
          fromApiUrl: fromApiUrl ?? process.env.EXPLORER_PROXY,
          toApiUrl,
          resolveProxy: proxy,
          wait,
          pollTimeoutMs: pollTimeout ? Number(pollTimeout) * 1000 : undefined,
          onLog: verbose ? (m) => console.log(m) : undefined,
        });

        if (output === "json") {
          console.log(JSON.stringify(result, null, 2));
        } else {
          const icon = (status: string) =>
            status === "verified"
              ? "✅ verified"
              : status === "already-verified"
                ? "⏭️  already verified"
                : status === "pending"
                  ? "🟡 pending"
                  : `❌ ${status}`;
          console.log(`\nSummary (${result.fromExplorer} → ${result.toExplorer}):`);
          console.table(
            result.targets.reduce(
              (acc, t) => {
                acc[t.address] = {
                  role: t.role,
                  status: icon(t.status),
                  detail: t.message ?? "",
                };
                return acc;
              },
              {} as Record<string, { role: string; status: string; detail: string }>,
            ),
          );
        }

        // CI gate: any target that failed (or never settled) is a non-zero exit.
        if (result.targets.some((t) => t.status === "failed")) {
          process.exitCode = 1;
        }
      },
    );
}
