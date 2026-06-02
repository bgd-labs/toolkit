import { createPublicClient, http, type Address, type Chain } from "viem";
import {
  getSourceCode,
  isVerified,
  verifySourceCode,
  waitForVerification,
  type ExplorerName,
} from "../ecosystem/explorers";
import { ChainList } from "../ecosystem/chainIds";
import { getRPCUrl, type SupportedChainIds } from "../ecosystem/rpcs";
import { normalizeExplorerSource } from "./normalize";
import { resolveImplementation } from "./proxy";

/**
 * One side of a migration — a contract on a specific chain/explorer. The same
 * shape describes both where the verified source is read from (`from`) and where
 * it is published (`to`), so a migration can cross chains and/or addresses (e.g.
 * a contract verified on Ethereum used to verify the same deployment on Optimism).
 */
export type MigrationEndpoint = {
  chainId: number;
  address: Address;
  /** Explorer family. Omit to use the toolbox's prioritized explorer. */
  explorer?: ExplorerName;
  /** Explorer api key (etherscan needs one to read; required to write). */
  apiKey?: string;
  /** Explorer api url override (e.g. a proxy). */
  apiUrl?: string;
  /** Rpc url for EIP-1967 proxy resolution; falls back to the toolbox's url. */
  rpcUrl?: string;
};

export type MigrateVerificationParams = {
  /** Where the verified source lives. */
  from: MigrationEndpoint;
  /** Where to publish the verification. */
  to: MigrationEndpoint;
  /** When true (default), poll the target until verification settles. */
  wait?: boolean;
  /** Polling overrides forwarded to {@link waitForVerification}. */
  pollIntervalMs?: number;
  pollTimeoutMs?: number;
  /** Optional progress sink; the CLI wires this to `console.log`. */
  onLog?: (message: string) => void;
};

export type MigrateTargetRole = "contract" | "proxy" | "implementation";

export type MigrateStatus =
  | "already-verified"
  | "verified"
  | "pending"
  | "failed";

export type MigrateTargetResult = {
  /** The address being verified on the target chain. */
  address: Address;
  /** The address the source was read from (differs when crossing chains). */
  sourceAddress: Address;
  /** Whether this entry is the proxy, its implementation, or a plain contract. */
  role: MigrateTargetRole;
  status: MigrateStatus;
  /** The verification job id, when one was queued. */
  guid?: string;
  /** Human-readable detail (explorer status string or failure reason). */
  message?: string;
};

export type MigrateVerificationResult = {
  from: { chainId: number; explorer?: ExplorerName };
  to: { chainId: number; explorer?: ExplorerName };
  /** Whether the source address resolved to a proxy. */
  isProxy: boolean;
  /** Implementation address on the source chain, when a proxy. */
  implementation?: Address;
  /** One entry per migrated address (the proxy and its implementation). */
  targets: MigrateTargetResult[];
};

/** Best-effort viem client for proxy resolution; `undefined` when no rpc resolves. */
function createClient(chainId: number, rpcUrl?: string) {
  let url = rpcUrl;
  if (!url) {
    try {
      // getRPCUrl throws for chains it doesn't know; proxy resolution is
      // optional here, so fall through to the chain default / no client.
      url = getRPCUrl(chainId as SupportedChainIds);
    } catch {
      // ignored
    }
  }
  url =
    url ?? ChainList[chainId as keyof typeof ChainList]?.rpcUrls?.default?.http?.[0];
  if (!url) return undefined;
  return createPublicClient({
    chain: ChainList[chainId as keyof typeof ChainList] as Chain | undefined,
    transport: http(url),
  });
}

/** The explorer-call fields of an endpoint (everything but the address). */
type EndpointConfig = Omit<MigrationEndpoint, "address">;

/** Shared per-migration context, threaded into each target. */
type MigrateContext = {
  from: EndpointConfig;
  to: EndpointConfig;
  wait?: boolean;
  pollIntervalMs?: number;
  pollTimeoutMs?: number;
  onLog?: (message: string) => void;
};

/**
 * Migrates a single address pair: skip if `toAddress` is already verified on the
 * target, otherwise download + normalize the source for `fromAddress` from the
 * origin and submit it for `toAddress` on the target. `knownSource` lets the
 * caller reuse a source payload it already fetched (e.g. the proxy shell used
 * for proxy detection).
 */
async function migrateOne(
  ctx: MigrateContext,
  fromAddress: Address,
  toAddress: Address,
  role: MigrateTargetRole,
  knownSource?: Awaited<ReturnType<typeof getSourceCode>>,
): Promise<MigrateTargetResult> {
  const log = ctx.onLog;
  const roleTag = role === "contract" ? "" : ` (${role})`;
  const label =
    fromAddress.toLowerCase() === toAddress.toLowerCase()
      ? `${toAddress}${roleTag}`
      : `${fromAddress} → ${toAddress}${roleTag}`;
  const base = { address: toAddress, sourceAddress: fromAddress, role } as const;
  const toReadParams = {
    chainId: ctx.to.chainId,
    address: toAddress,
    apiKey: ctx.to.apiKey,
    apiUrl: ctx.to.apiUrl,
    explorer: ctx.to.explorer,
  };

  // 1. Don't re-verify what the target already serves.
  if (await isVerified(toReadParams)) {
    log?.(`⏭️  ${label} is already verified on the target, skipping.`);
    return { ...base, status: "already-verified" };
  }

  // 2. Pull the verified source from the origin explorer.
  let source = knownSource;
  if (!source) {
    log?.(`↓  reading ${label} source from the origin…`);
    try {
      source = await getSourceCode({
        chainId: ctx.from.chainId,
        address: fromAddress,
        apiKey: ctx.from.apiKey,
        apiUrl: ctx.from.apiUrl,
        explorer: ctx.from.explorer,
      });
    } catch (e) {
      const message = `could not read source from the origin: ${(e as Error).message}`;
      log?.(`❌ ${label}: ${message}`);
      return { ...base, status: "failed", message };
    }
  }
  if (!(source as { SourceCode?: string }).SourceCode) {
    const message = `the origin has no verified source for ${fromAddress}`;
    log?.(`❌ ${label}: ${message}`);
    return { ...base, status: "failed", message };
  }

  // 3. Normalize to standard-json and submit it to the target explorer.
  let normalized: ReturnType<typeof normalizeExplorerSource>;
  try {
    normalized = normalizeExplorerSource(
      source as Parameters<typeof normalizeExplorerSource>[0],
    );
  } catch (e) {
    const message = `could not normalize source: ${(e as Error).message}`;
    log?.(`❌ ${label}: ${message}`);
    return { ...base, status: "failed", message };
  }

  const constructorArguments = (source as { ConstructorArguments?: string })
    .ConstructorArguments;
  log?.(`↑  submitting ${label} (${normalized.target.name}) to the target…`);
  // Isolate the submission: a rate-limit or rejection on one target must not
  // abort the others (e.g. a proxy's implementation).
  let submission: Awaited<ReturnType<typeof verifySourceCode>>;
  try {
    submission = await verifySourceCode({
      chainId: ctx.to.chainId,
      address: toAddress,
      sourceCode: JSON.stringify(normalized.jsonInput),
      contractName: `${normalized.target.path}:${normalized.target.name}`,
      compilerVersion: normalized.compilerVersion.startsWith("v")
        ? normalized.compilerVersion
        : `v${normalized.compilerVersion}`,
      constructorArguments,
      codeFormat: "solidity-standard-json-input",
      apiKey: ctx.to.apiKey,
      apiUrl: ctx.to.apiUrl,
      explorer: ctx.to.explorer,
    });
  } catch (e) {
    const message = (e as Error).message;
    log?.(`❌ ${label}: ${message}`);
    return { ...base, status: "failed", message };
  }

  if (submission.alreadyVerified) {
    log?.(`⏭️  ${label} is already verified on the target.`);
    return { ...base, status: "already-verified" };
  }
  const guid = submission.guid ?? undefined;
  if (ctx.wait === false || !guid) {
    log?.(`🟡 ${label} submitted${guid ? ` (guid ${guid})` : ""}; not waiting for the result.`);
    return { ...base, status: "pending", guid };
  }

  // 4. Poll until it settles. If the explorer never gives a definitive verdict
  //    (e.g. it has no checkverifystatus endpoint), confirm via a source read.
  log?.(`⏳ waiting for the target to verify ${label} (guid ${guid})…`);
  const settled = await waitForVerification(
    { guid, ...toReadParams },
    {
      intervalMs: ctx.pollIntervalMs,
      timeoutMs: ctx.pollTimeoutMs,
      // Some explorers (e.g. routescan) never flip checkverifystatus off
      // "Pending in queue" even once the source is live, so treat an
      // actually-verified source on the target as success too.
      confirm: () => isVerified(toReadParams),
      onPoll: ({ elapsedMs, status }) =>
        log?.(`   …still verifying ${label} (${Math.round(elapsedMs / 1000)}s) — ${status.message}`),
    },
  );
  if (settled.state === "verified") {
    log?.(`✅ ${label} verified on the target.`);
    return { ...base, status: "verified", guid, message: settled.message };
  }
  if (settled.state === "failed") {
    log?.(`❌ ${label} failed on the target: ${settled.message}`);
    return { ...base, status: "failed", guid, message: settled.message };
  }

  // No definitive verdict before the timeout — confirm via a direct source read.
  log?.(`…  no verdict for ${label}; confirming via a target source read…`);
  const confirmed = await isVerified(toReadParams);
  log?.(
    confirmed
      ? `✅ ${label} verified on the target.`
      : `🟡 ${label} still pending after the timeout.`,
  );
  return {
    ...base,
    status: confirmed ? "verified" : "pending",
    guid,
    message: settled.message,
  };
}

/**
 * Migrates a contract's verification from one explorer/chain to another: it
 * downloads the verified source from `from`, normalizes it, and submits it for
 * `to` — skipping anything the target already has verified.
 *
 * `from` and `to` may differ in chain and/or address, so the same verified
 * source can be reused to verify the same deployment on another network. When
 * the source address is a proxy, the proxy shell and its implementation are both
 * migrated: the implementation source is read from the source chain and verified
 * against the target chain's implementation address (resolved via its EIP-1967
 * slot, falling back to the same address for deterministic deployments).
 */
export async function migrateVerification(
  params: MigrateVerificationParams,
): Promise<MigrateVerificationResult> {
  const { from, to } = params;
  const log = params.onLog;

  // The origin must actually have the source for the root address.
  let rootSource: Awaited<ReturnType<typeof getSourceCode>>;
  try {
    rootSource = await getSourceCode({
      chainId: from.chainId,
      address: from.address,
      apiKey: from.apiKey,
      apiUrl: from.apiUrl,
      explorer: from.explorer,
    });
  } catch (e) {
    throw new Error(
      `Contract ${from.address} is not verified on the source explorer (chain ${from.chainId}): ${(e as Error).message}`,
    );
  }
  if (!(rootSource as { SourceCode?: string }).SourceCode) {
    throw new Error(
      `Contract ${from.address} is not verified on the source explorer (chain ${from.chainId}); nothing to migrate.`,
    );
  }

  // Resolve the proxy on the source chain (where the proxy hint is available);
  // resolve the implementation address on the target chain separately, since it
  // can differ per chain. Resolving a non-proxy is a no-op (returns undefined).
  let implTo: Address | undefined;
  const implFrom = await resolveImplementation({
    address: from.address,
    client: createClient(from.chainId, from.rpcUrl),
    explorerSource: rootSource as { Proxy?: string; Implementation?: string },
  });
  if (implFrom) {
    const sameTarget =
      to.chainId === from.chainId &&
      to.address.toLowerCase() === from.address.toLowerCase();
    implTo = sameTarget
      ? implFrom
      : ((await resolveImplementation({
          address: to.address,
          client: createClient(to.chainId, to.rpcUrl),
        })) ?? implFrom);
  }

  const ctx: MigrateContext = {
    from: {
      chainId: from.chainId,
      explorer: from.explorer,
      apiKey: from.apiKey,
      apiUrl: from.apiUrl,
    },
    to: {
      chainId: to.chainId,
      explorer: to.explorer,
      apiKey: to.apiKey,
      apiUrl: to.apiUrl,
    },
    wait: params.wait,
    pollIntervalMs: params.pollIntervalMs,
    pollTimeoutMs: params.pollTimeoutMs,
    onLog: params.onLog,
  };

  const targets: MigrateTargetResult[] = [];
  if (implFrom) {
    log?.(
      `🔁 source is a proxy → implementation ${implFrom}` +
        (implTo && implTo !== implFrom ? ` (target implementation ${implTo})` : "") +
        "; migrating both.",
    );
    // Run sequentially: the same target explorer rate-limits writes.
    targets.push(
      await migrateOne(ctx, from.address, to.address, "proxy", rootSource),
    );
    targets.push(
      await migrateOne(ctx, implFrom, implTo ?? implFrom, "implementation"),
    );
  } else {
    targets.push(
      await migrateOne(ctx, from.address, to.address, "contract", rootSource),
    );
  }

  return {
    from: { chainId: from.chainId, explorer: from.explorer },
    to: { chainId: to.chainId, explorer: to.explorer },
    isProxy: Boolean(implFrom),
    implementation: implFrom,
    targets,
  };
}
