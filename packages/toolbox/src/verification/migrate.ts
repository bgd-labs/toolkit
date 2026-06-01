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

export type MigrateVerificationParams = {
  chainId: number;
  address: Address;
  /** Explorer family to copy the verified source from. */
  fromExplorer: ExplorerName;
  /** Explorer family to publish the verification to. */
  toExplorer: ExplorerName;
  /** Api key for the source explorer (etherscan needs one to read). */
  fromApiKey?: string;
  /** Api key for the target explorer (etherscan needs one to write). */
  toApiKey?: string;
  /** Api url override for the source explorer (e.g. a proxy). */
  fromApiUrl?: string;
  /** Api url override for the target explorer (e.g. a proxy). */
  toApiUrl?: string;
  /**
   * When true (default), proxies are followed and the implementation is
   * migrated alongside the proxy shell.
   */
  resolveProxy?: boolean;
  /** Rpc url for EIP-1967 proxy resolution; falls back to the toolbox's url. */
  rpcUrl?: string;
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
  address: Address;
  /** Whether this entry is the proxy, its implementation, or a plain contract. */
  role: MigrateTargetRole;
  status: MigrateStatus;
  /** The verification job id, when one was queued. */
  guid?: string;
  /** Human-readable detail (explorer status string or failure reason). */
  message?: string;
};

export type MigrateVerificationResult = {
  chainId: number;
  fromExplorer: ExplorerName;
  toExplorer: ExplorerName;
  /** Whether `address` resolved to a proxy. */
  isProxy: boolean;
  /** Implementation address, when `address` is a proxy. */
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

/** Shared per-migration context, threaded into each target. */
type MigrateContext = Pick<
  MigrateVerificationParams,
  | "chainId"
  | "fromExplorer"
  | "toExplorer"
  | "fromApiKey"
  | "toApiKey"
  | "fromApiUrl"
  | "toApiUrl"
  | "wait"
  | "pollIntervalMs"
  | "pollTimeoutMs"
  | "onLog"
>;

/**
 * Migrates a single address: skip if already verified on the target, otherwise
 * download + normalize the source from the origin and submit it to the target.
 * `knownSource` lets the caller reuse a source payload it already fetched (e.g.
 * the proxy shell that was used for proxy detection).
 */
async function migrateOne(
  ctx: MigrateContext,
  address: Address,
  role: MigrateTargetRole,
  knownSource?: Awaited<ReturnType<typeof getSourceCode>>,
): Promise<MigrateTargetResult> {
  const log = ctx.onLog;
  const label = role === "contract" ? `${address}` : `${address} (${role})`;
  const toReadParams = {
    chainId: ctx.chainId,
    address,
    apiKey: ctx.toApiKey,
    apiUrl: ctx.toApiUrl,
    explorer: ctx.toExplorer,
  };

  // 1. Don't re-verify what the target already serves.
  if (await isVerified(toReadParams)) {
    log?.(`⏭️  ${label} is already verified on ${ctx.toExplorer}, skipping.`);
    return { address, role, status: "already-verified" };
  }

  // 2. Pull the verified source from the origin explorer.
  let source = knownSource;
  if (!source) {
    log?.(`↓  reading ${label} source from ${ctx.fromExplorer}…`);
    try {
      source = await getSourceCode({
        chainId: ctx.chainId,
        address,
        apiKey: ctx.fromApiKey,
        apiUrl: ctx.fromApiUrl,
        explorer: ctx.fromExplorer,
      });
    } catch (e) {
      const message = `could not read source from ${ctx.fromExplorer}: ${(e as Error).message}`;
      log?.(`❌ ${label}: ${message}`);
      return { address, role, status: "failed", message };
    }
  }
  if (!(source as { SourceCode?: string }).SourceCode) {
    const message = `${ctx.fromExplorer} has no verified source for ${address}`;
    log?.(`❌ ${label}: ${message}`);
    return { address, role, status: "failed", message };
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
    return { address, role, status: "failed", message };
  }

  const constructorArguments = (source as { ConstructorArguments?: string })
    .ConstructorArguments;
  log?.(`↑  submitting ${label} (${normalized.target.name}) to ${ctx.toExplorer}…`);
  // Isolate the submission: a rate-limit or rejection on one target must not
  // abort the others (e.g. a proxy's implementation).
  let submission: Awaited<ReturnType<typeof verifySourceCode>>;
  try {
    submission = await verifySourceCode({
      chainId: ctx.chainId,
      address,
      sourceCode: JSON.stringify(normalized.jsonInput),
      contractName: `${normalized.target.path}:${normalized.target.name}`,
      compilerVersion: normalized.compilerVersion.startsWith("v")
        ? normalized.compilerVersion
        : `v${normalized.compilerVersion}`,
      constructorArguments,
      codeFormat: "solidity-standard-json-input",
      apiKey: ctx.toApiKey,
      apiUrl: ctx.toApiUrl,
      explorer: ctx.toExplorer,
    });
  } catch (e) {
    const message = (e as Error).message;
    log?.(`❌ ${label}: ${message}`);
    return { address, role, status: "failed", message };
  }

  if (submission.alreadyVerified) {
    log?.(`⏭️  ${label} is already verified on ${ctx.toExplorer}.`);
    return { address, role, status: "already-verified" };
  }
  const guid = submission.guid ?? undefined;
  if (ctx.wait === false || !guid) {
    log?.(`🟡 ${label} submitted${guid ? ` (guid ${guid})` : ""}; not waiting for the result.`);
    return { address, role, status: "pending", guid };
  }

  // 4. Poll until it settles. If the explorer never gives a definitive verdict
  //    (e.g. it has no checkverifystatus endpoint), confirm via a source read.
  log?.(`⏳ waiting for ${ctx.toExplorer} to verify ${label} (guid ${guid})…`);
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
    log?.(`✅ ${label} verified on ${ctx.toExplorer}.`);
    return { address, role, status: "verified", guid, message: settled.message };
  }
  if (settled.state === "failed") {
    log?.(`❌ ${label} failed on ${ctx.toExplorer}: ${settled.message}`);
    return { address, role, status: "failed", guid, message: settled.message };
  }

  // No definitive verdict before the timeout — confirm via a direct source read.
  log?.(`…  no verdict for ${label}; confirming via ${ctx.toExplorer} source read…`);
  const confirmed = await isVerified(toReadParams);
  log?.(
    confirmed
      ? `✅ ${label} verified on ${ctx.toExplorer}.`
      : `🟡 ${label} still pending after the timeout.`,
  );
  return {
    address,
    role,
    status: confirmed ? "verified" : "pending",
    guid,
    message: settled.message,
  };
}

/**
 * Migrates a contract's verification from one explorer to another: it downloads
 * the verified source from `fromExplorer`, normalizes it, and submits it to
 * `toExplorer` — skipping any address the target already has verified.
 *
 * When `address` is a proxy (resolved via the EIP-1967 slot, with the origin
 * explorer's proxy hint as a fallback) both the proxy shell and its
 * implementation are migrated.
 */
export async function migrateVerification(
  params: MigrateVerificationParams,
): Promise<MigrateVerificationResult> {
  const {
    chainId,
    address,
    fromExplorer,
    toExplorer,
    resolveProxy = true,
    rpcUrl,
  } = params;

  // The origin must actually have the source for the root address.
  let rootSource: Awaited<ReturnType<typeof getSourceCode>>;
  try {
    rootSource = await getSourceCode({
      chainId,
      address,
      apiKey: params.fromApiKey,
      apiUrl: params.fromApiUrl,
      explorer: fromExplorer,
    });
  } catch (e) {
    throw new Error(
      `Contract ${address} is not verified on ${fromExplorer} (chain ${chainId}): ${(e as Error).message}`,
    );
  }
  if (!(rootSource as { SourceCode?: string }).SourceCode) {
    throw new Error(
      `Contract ${address} is not verified on ${fromExplorer} (chain ${chainId}); nothing to migrate.`,
    );
  }

  const implementation = resolveProxy
    ? await resolveImplementation({
        address,
        client: createClient(chainId, rpcUrl),
        explorerSource: rootSource as {
          Proxy?: string;
          Implementation?: string;
        },
      })
    : undefined;

  const ctx: MigrateContext = {
    chainId,
    fromExplorer,
    toExplorer,
    fromApiKey: params.fromApiKey,
    toApiKey: params.toApiKey,
    fromApiUrl: params.fromApiUrl,
    toApiUrl: params.toApiUrl,
    wait: params.wait,
    pollIntervalMs: params.pollIntervalMs,
    pollTimeoutMs: params.pollTimeoutMs,
    onLog: params.onLog,
  };

  const targets: MigrateTargetResult[] = [];
  if (implementation && implementation !== address) {
    params.onLog?.(
      `🔁 ${address} is a proxy → implementation ${implementation}; migrating both.`,
    );
    // Run sequentially: the same target explorer rate-limits writes.
    targets.push(await migrateOne(ctx, address, "proxy", rootSource));
    targets.push(await migrateOne(ctx, implementation, "implementation"));
  } else {
    targets.push(await migrateOne(ctx, address, "contract", rootSource));
  }

  return {
    chainId,
    fromExplorer,
    toExplorer,
    isProxy: Boolean(implementation),
    implementation: implementation ?? undefined,
    targets,
  };
}
