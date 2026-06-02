import { Command, Option } from "@commander-js/extra-typings";
import { Address } from "viem";
import { migrateVerification } from "@bgd-labs/toolbox/verification";

const EXPLORERS = ["etherscan", "blockscout", "routescan", "oklink"] as const;

export function registerMigrateVerification(program: Command) {
  program
    .command("migrateVerification")
    .description(
      "copy a contract's verification to another explorer and/or chain (follows proxies)",
    )
    .addOption(
      new Option(
        "--fromContract <address>",
        "address of the verified source contract",
      ).makeOptionMandatory(),
    )
    .addOption(
      new Option(
        "--toContract <address>",
        "address to verify on the target (defaults to --fromContract)",
      ),
    )
    .addOption(
      new Option(
        "--fromChainId <number>",
        "chain id of the source contract",
      ).makeOptionMandatory(),
    )
    .addOption(
      new Option(
        "--toChainId <number>",
        "chain id of the target contract (defaults to --fromChainId)",
      ),
    )
    .addOption(
      new Option(
        "--fromExplorer <name>",
        "explorer to copy the verified source from (defaults to the chain's prioritized explorer)",
      ).choices(EXPLORERS),
    )
    .addOption(
      new Option("--toExplorer <name>", "explorer to publish the verification to")
        .choices(EXPLORERS)
        .makeOptionMandatory(),
    )
    .addOption(
      new Option(
        "--fromApiKey <key>",
        "api key for the source explorer (defaults to env.ETHERSCAN_API_KEY / env.OKLINK_API_KEY)",
      ),
    )
    .addOption(
      new Option(
        "--toApiKey <key>",
        "api key for the target explorer (defaults to env.ETHERSCAN_API_KEY / env.OKLINK_API_KEY)",
      ),
    )
    .addOption(new Option("--fromApiUrl <url>", "api url override for the source explorer"))
    .addOption(new Option("--toApiUrl <url>", "api url override for the target explorer"))
    .addOption(
      new Option("--fromRpcUrl <url>", "rpc url for proxy resolution on the source chain"),
    )
    .addOption(
      new Option("--toRpcUrl <url>", "rpc url for proxy resolution on the target chain"),
    )
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
        fromContract,
        toContract,
        fromChainId,
        toChainId,
        fromExplorer,
        toExplorer,
        fromApiKey,
        toApiKey,
        fromApiUrl,
        toApiUrl,
        fromRpcUrl,
        toRpcUrl,
        proxy,
        wait,
        pollTimeout,
        output,
      }) => {
        // The target defaults to the same contract/chain as the source, so the
        // common "same address, different explorer" case stays concise.
        const toAddress = (toContract ?? fromContract) as Address;
        const toChain = Number(toChainId ?? fromChainId);

        // Each explorer family reads from its own api key env var; OKLink uses
        // its own key (set OKLINK_API_KEY), the etherscan-compatible families
        // share ETHERSCAN_API_KEY.
        const defaultKey = (explorer?: string) =>
          explorer === "oklink"
            ? process.env.OKLINK_API_KEY
            : process.env.ETHERSCAN_API_KEY;

        // In table mode stream progress to the console; keep json output clean.
        const verbose = output !== "json";
        if (verbose) {
          console.log(
            `Migrating verification: ${fromExplorer ?? "auto"}@${fromChainId} ${fromContract} → ${toExplorer}@${toChain} ${toAddress}…`,
          );
        }

        const result = await migrateVerification({
          from: {
            chainId: Number(fromChainId),
            address: fromContract as Address,
            explorer: fromExplorer,
            apiKey: fromApiKey ?? defaultKey(fromExplorer),
            apiUrl: fromApiUrl ?? process.env.EXPLORER_PROXY,
            rpcUrl: fromRpcUrl,
          },
          to: {
            chainId: toChain,
            address: toAddress,
            explorer: toExplorer,
            apiKey: toApiKey ?? defaultKey(toExplorer),
            apiUrl: toApiUrl,
            rpcUrl: toRpcUrl,
          },
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
          console.log(
            `\nSummary (${result.from.explorer ?? "auto"}@${result.from.chainId} → ${result.to.explorer}@${result.to.chainId}):`,
          );
          console.table(
            result.targets.reduce(
              (acc, t) => {
                acc[t.address] = {
                  role: t.role,
                  status: icon(t.status),
                  // surface the source address only when it differs (cross-chain)
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

        // CI gate: any target that failed (or never settled) is a non-zero exit.
        if (result.targets.some((t) => t.status === "failed")) {
          process.exitCode = 1;
        }
      },
    );
}
