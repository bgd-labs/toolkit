import { Address, Hex } from "viem";
import { etherscanExplorers } from "./generated/etherscanExplorers";
import { routescanExplorers } from "./generated/routescanExplorers";
import { StandardJsonInput } from "./types";
import { blockscoutExplorers, ChainId } from "..";

export type ExplorerConfig = { api: string; explorer: string };

/**
 * Fetches what we consider the "best" explorer for a given chain.
 * For our tooling we have a opinionated prioritization for explorers:
 * 1. Etherscan
 * 2. Routescan
 * 3. Blockscout and others
 * @param chainId Id of the chain to fetch the explorer for
 */
export function getExplorer(chainId: number): ExplorerConfig {
  const etherscan =
    etherscanExplorers[chainId as keyof typeof etherscanExplorers];
  if (etherscan) return etherscan;
  const routescan =
    routescanExplorers[chainId as keyof typeof routescanExplorers];
  if (routescan) return routescan;
  const blockscout =
    blockscoutExplorers[chainId as keyof typeof blockscoutExplorers];
  if (blockscout) return blockscout;
  throw new Error(`No explorer found for chainId: ${chainId}`);
}

/**
 * Explorer families understood by the tooling. The first three are
 * etherscan-compatible and resolvable via {@link getExplorerByName}; `oklink`
 * speaks a bespoke API and is fetched directly by {@link getSourceCode}.
 */
export type ExplorerName = "etherscan" | "routescan" | "blockscout" | "oklink";

/**
 * Fetches the config for a specific etherscan-style explorer family on a given
 * chain, ignoring the {@link getExplorer} prioritization. Use this when you need
 * to force a particular explorer (e.g. a chain has no etherscan but does have
 * blockscout). Note `oklink` has no config map and is not resolvable here.
 * @param chainId Id of the chain to fetch the explorer for
 * @param name The explorer family to use
 */
export function getExplorerByName(
  chainId: number,
  name: ExplorerName,
): ExplorerConfig {
  const maps: Partial<Record<ExplorerName, Record<number, ExplorerConfig>>> = {
    etherscan: etherscanExplorers,
    routescan: routescanExplorers,
    blockscout: blockscoutExplorers,
  };
  const config = maps[name]?.[chainId];
  if (!config) {
    throw new Error(`No ${name} explorer found for chainId: ${chainId}`);
  }
  return config;
}

type GetSourceCodeParams = {
  chainId: number;
  address: Address;
  apiUrl?: string;
  apiKey?: string;
  /**
   * Force a specific explorer family. When omitted, xLayer defaults to OKLink
   * and every other chain uses the prioritized {@link getExplorer}.
   */
  explorer?: ExplorerName;
};

/**
 * chainId -> OKLink `chainShortName`. This single identifier serves both OKLink
 * endpoints the toolbox talks to: the read API takes it as a `chainShortName`
 * query param ({@link getOkLinkSourceCode}), and the etherscan-compatible verify
 * plugin takes it as the URL path segment (`/verify-source-code-plugin/{name}`,
 * the one Hardhat/Foundry target). OKLink matches it case-insensitively, so the
 * canonical uppercase form works for both. Extend from
 * https://www.oklink.com/docs/en/#blockchain-data-supported-blockchains
 */
const okLinkChainShortNames: Record<number, string> = {
  [ChainId.mainnet]: "ETH",
  [ChainId.bnb]: "BSC",
  [ChainId.polygon]: "POLYGON",
  [ChainId.zkEVM]: "POLYGON_ZKEVM",
  [ChainId.avalanche]: "AVAXC",
  [ChainId.fantom]: "FTM",
  [ChainId.optimism]: "OP",
  [ChainId.arbitrum]: "ARBITRUM",
  [ChainId.base]: "BASE",
  [ChainId.linea]: "LINEA",
  [ChainId.scroll]: "SCROLL",
  [ChainId.xLayer]: "XLAYER",
};

export type EtherscanStyleSourceCode = {
  ABI: any;
  CompilerVersion: string;
  ConstructorArguments: Hex;
  ContractName: string;
  EVMVersion: string;
  Implementation: Address;
  Library: string;
  LicenseType: string;
  OptimizationUsed: string;
  Proxy: string; // "1" meaning true (i think)
  Runs: string;
  SimilarMatch: string;
  SourceCode: string;
};

export type BlockscoutStyleSourceCode = {
  AdditionalSources: { SourceCode: string; Filename: string }[];
  CompilerSettings: {
    evmVersion: string;
    libraries: any;
    optimizer: { enabled: boolean; runs: number };
  };
  ConstructorArguments: Hex;
  ExternalLibraries: { address_hash: Address; name: string }[];
  SourceCode: string;
  ContractName: string;
  FileName: string;
  EVMVersion: string;
  OptimizationUsed: string;
};

export async function getSourceCode(params: GetSourceCodeParams) {
  // OKLink (used for xLayer) speaks a different API; route to it explicitly when
  // requested, and keep it as the default for xLayer.
  if (
    params.explorer === "oklink" ||
    (params.chainId === ChainId.xLayer && !params.explorer)
  ) {
    return getOkLinkSourceCode(params);
  }
  const payload = {
    chainid: String(params.chainId),
    address: params.address,
    module: "contract",
    action: "getsourcecode",
  };
  if (params.apiKey) (payload as any).apikey = params.apiKey;
  const formattedPayload = new URLSearchParams(payload).toString();
  // An explicit apiUrl (e.g. a proxy) wins; then a forced explorer family; then
  // the prioritized default explorer for the chain.
  const apiUrl =
    params.apiUrl ??
    (params.explorer
      ? getExplorerByName(params.chainId, params.explorer).api
      : getExplorer(params.chainId).api);
  const url = `${apiUrl}?${formattedPayload}`;
  console.log(url);
  const request = await fetch(url);
  const { status, message, result } = (await request.json()) as {
    message: string;
    result: (EtherscanStyleSourceCode | BlockscoutStyleSourceCode)[];
    status: string;
  };
  if (status !== "1") {
    throw new Error(result as unknown as string);
  }
  return result[0];
}

export function parseEtherscanStyleSourceCode(
  sourceCode: string,
): StandardJsonInput {
  // Handling possible variations in SourceCode format
  if (sourceCode.startsWith("{{") && sourceCode.endsWith("}}")) {
    // Strip the extra curly braces and parse
    sourceCode = sourceCode.substring(1, sourceCode.length - 1);
  }
  return JSON.parse(sourceCode);
}

export function parseBlockscoutStyleSourceCode(
  sourceCode: BlockscoutStyleSourceCode,
): StandardJsonInput {
  const result: StandardJsonInput = {
    language: "unknown",
    settings: sourceCode.CompilerSettings,
    libraries: sourceCode.CompilerSettings.libraries,
    sources: {
      [sourceCode.FileName]: { content: sourceCode.SourceCode },
      ...sourceCode.AdditionalSources.reduce(
        (acc, code) => {
          acc[code.Filename] = { content: code.SourceCode };
          return acc;
        },
        {} as Record<string, { content: string }>,
      ),
    },
  };
  return result;
}

/**
 * Best-effort check of whether an explorer already serves verified sources for
 * an address. Reuses {@link getSourceCode}, treating either a thrown error
 * (some explorers answer unverified contracts with a non-`1` status, which
 * makes `getSourceCode` throw) or an empty `SourceCode` as "not verified".
 */
export async function isVerified(params: GetSourceCodeParams): Promise<boolean> {
  try {
    const source = await getSourceCode(params);
    return Boolean((source as { SourceCode?: string }).SourceCode);
  } catch {
    return false;
  }
}

type VerifyCodeFormat = "solidity-standard-json-input" | "solidity-single-file";

export type VerifySourceCodeParams = {
  chainId: number;
  address: Address;
  /**
   * The sources to submit. For `solidity-standard-json-input` (the default)
   * this is the stringified solc standard-json input; for `solidity-single-file`
   * it is the flattened source.
   */
  sourceCode: string;
  /** Fully-qualified contract, e.g. `contracts/Token.sol:Token`. */
  contractName: string;
  /** Full solc build id, e.g. `v0.8.19+commit.7dd6d404`. */
  compilerVersion: string;
  /** ABI-encoded constructor arguments (with or without the `0x` prefix). */
  constructorArguments?: string;
  /** Defaults to `solidity-standard-json-input`. */
  codeFormat?: VerifyCodeFormat;
  /** Single-file only: the compiler settings (standard-json carries its own). */
  optimizationUsed?: boolean;
  runs?: number;
  evmVersion?: string;
  licenseType?: string | number;
  /** Explorer api url override (e.g. a proxy). Takes precedence over `explorer`. */
  apiUrl?: string;
  apiKey?: string;
  /** Force a specific explorer family (defaults to the prioritized explorer). */
  explorer?: ExplorerName;
};

export type VerifySubmission = {
  /** The verification job id to poll with {@link checkVerificationStatus}. */
  guid: string | null;
  /** The target already had verified sources, so no job was queued. */
  alreadyVerified: boolean;
};

/**
 * Resolves the etherscan-compatible verify endpoint for a chain/explorer and
 * normalizes it to end in `/api`: routescan exposes the compatibility layer at
 * `/etherscan`, whereas etherscan and blockscout already include `/api`.
 *
 * OKLink exposes its own etherscan-compatible "plugin" endpoint (the one Hardhat
 * and Foundry verify against) at `/verify-source-code-plugin/{chainName}`, which
 * we resolve from {@link okLinkChainShortNames} and use verbatim (no `/api`).
 */
function resolveEtherscanCompatibleApi(params: {
  chainId: number;
  apiUrl?: string;
  explorer?: ExplorerName;
}): string {
  if (params.explorer === "oklink") {
    if (params.apiUrl) return params.apiUrl;
    const chainName = okLinkChainShortNames[params.chainId];
    if (!chainName) {
      throw new Error(
        `OKLink verification is not configured for chainId: ${params.chainId}. Pass an explicit apiUrl.`,
      );
    }
    return `https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/${chainName}`;
  }
  const base =
    params.apiUrl ??
    (params.explorer
      ? getExplorerByName(params.chainId, params.explorer).api
      : getExplorer(params.chainId).api);
  return base.endsWith("/api") ? base : `${base}/api`;
}

/**
 * Submits a contract for verification against an etherscan-compatible explorer
 * (etherscan, routescan or blockscout). Mirrors {@link getSourceCode}'s explorer
 * selection (apiUrl > explorer family > prioritized default) but POSTs the
 * payload, since standard-json sources exceed practical query-string limits.
 *
 * Returns the verification job `guid` to poll with {@link checkVerificationStatus},
 * or `{ alreadyVerified: true }` when the explorer reports the address is already
 * verified.
 */
export async function verifySourceCode(
  params: VerifySourceCodeParams,
): Promise<VerifySubmission> {
  const apiUrl = resolveEtherscanCompatibleApi(params);
  // Routing params (module/action/apikey/chainid) go on the query string, where
  // most explorers dispatch on them. We also repeat them in the POST body
  // because some etherscan-compatible servers (OKLink's plugin endpoint, which
  // mirrors Hardhat's request shape) only read them there. The values are
  // identical, so sending both is safe.
  const routing: Record<string, string> = {
    chainid: String(params.chainId),
    module: "contract",
    action: "verifysourcecode",
  };
  if (params.apiKey) routing.apikey = params.apiKey;
  const url = `${apiUrl}?${new URLSearchParams(routing).toString()}`;

  const body: Record<string, string> = {
    ...routing,
    contractaddress: params.address,
    sourceCode: params.sourceCode,
    codeformat: params.codeFormat ?? "solidity-standard-json-input",
    contractname: params.contractName,
    compilerversion: params.compilerVersion,
  };
  if (params.constructorArguments) {
    const args = params.constructorArguments.replace(/^0x/, "");
    // Etherscan historically reads the misspelled `constructorArguements`,
    // while its newer docs use the correct spelling; send both so every
    // explorer family picks up the one it expects.
    body.constructorArguments = args;
    body.constructorArguements = args;
  }
  // The optimizer/evm settings below only apply to single-file submissions; for
  // standard-json they live inside the json payload itself.
  if ((params.codeFormat ?? "solidity-standard-json-input") === "solidity-single-file") {
    if (params.optimizationUsed !== undefined)
      body.optimizationUsed = params.optimizationUsed ? "1" : "0";
    if (params.runs !== undefined) body.runs = String(params.runs);
    if (params.evmVersion) body.evmversion = params.evmVersion;
  }
  if (params.licenseType !== undefined)
    body.licenseType = String(params.licenseType);

  const request = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  const { status, message, result } = (await request.json()) as {
    status: string;
    message: string;
    result: string;
  };
  const haystack = `${message ?? ""} ${result ?? ""}`.toLowerCase();
  if (haystack.includes("already verified")) {
    return { guid: null, alreadyVerified: true };
  }
  if (status !== "1") {
    throw new Error(
      `Verification submission failed: ${message}${result ? ` - ${result}` : ""}`,
    );
  }
  return { guid: result, alreadyVerified: false };
}

export type VerificationState = "pending" | "verified" | "failed" | "unknown";

export type VerificationStatusResult = {
  state: VerificationState;
  /** The raw status string the explorer returned, for surfacing to the user. */
  message: string;
};

export type CheckVerificationStatusParams = {
  guid: string;
  chainId: number;
  apiUrl?: string;
  apiKey?: string;
  explorer?: ExplorerName;
};

/**
 * Polls a single verification job (by `guid`) on an etherscan-compatible
 * explorer and maps the free-form `result` string onto a {@link VerificationState}.
 */
export async function checkVerificationStatus(
  params: CheckVerificationStatusParams,
): Promise<VerificationStatusResult> {
  const apiUrl = resolveEtherscanCompatibleApi(params);
  const query: Record<string, string> = {
    chainid: String(params.chainId),
    module: "contract",
    action: "checkverifystatus",
    guid: params.guid,
  };
  if (params.apiKey) query.apikey = params.apiKey;
  const url = `${apiUrl}?${new URLSearchParams(query).toString()}`;
  const request = await fetch(url);
  const { status, result, message } = (await request.json()) as {
    status: string;
    message: string;
    result: string;
  };
  const text = `${result ?? message ?? ""}`;
  const lower = text.toLowerCase();
  // Order matters: a job can be "Pending in queue" while status is still "0".
  if (lower.includes("pending")) return { state: "pending", message: text };
  if (lower.includes("fail")) return { state: "failed", message: text };
  if (lower.includes("already verified") || lower.includes("pass") || status === "1")
    return { state: "verified", message: text };
  if (lower.includes("unknown")) return { state: "unknown", message: text };
  return { state: "pending", message: text };
}

/** Progress info handed to {@link waitForVerification}'s `onPoll` callback. */
export type VerificationPoll = {
  /** 1-based poll attempt number. */
  attempt: number;
  /** Milliseconds elapsed since polling started. */
  elapsedMs: number;
  status: VerificationStatusResult;
};

/**
 * Polls {@link checkVerificationStatus} until the job settles (verified/failed)
 * or `timeoutMs` elapses, returning the last observed status. Transient fetch
 * errors are swallowed and retried, since some explorers briefly 404 a freshly
 * submitted guid. `onPoll` is invoked after every attempt for progress display.
 *
 * `confirm` is an optional secondary success signal: some explorers (notably
 * routescan) leave `checkverifystatus` reporting "Pending in queue" indefinitely
 * even once the source is live, so callers can pass e.g. an {@link isVerified}
 * check to short-circuit the wait the moment the target actually serves sources.
 *
 * Defaults to a 10s interval and a 180s timeout.
 */
export async function waitForVerification(
  params: CheckVerificationStatusParams,
  opts?: {
    intervalMs?: number;
    timeoutMs?: number;
    onPoll?: (poll: VerificationPoll) => void;
    confirm?: () => Promise<boolean>;
  },
): Promise<VerificationStatusResult> {
  const intervalMs = opts?.intervalMs ?? 10_000;
  const timeoutMs = opts?.timeoutMs ?? 180_000;
  const started = Date.now();
  let attempt = 0;
  let last: VerificationStatusResult = {
    state: "pending",
    message: "Pending in queue",
  };
  while (Date.now() - started < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    attempt += 1;
    try {
      last = await checkVerificationStatus(params);
    } catch (e) {
      last = { state: "pending", message: `status check failed: ${(e as Error).message}` };
    }
    // The guid status is authoritative for failures; for success we also accept
    // an actually-live source, since not every explorer flips checkverifystatus.
    if (last.state !== "verified" && last.state !== "failed" && opts?.confirm) {
      if (await opts.confirm()) {
        last = { state: "verified", message: "source is live on the target explorer" };
      }
    }
    opts?.onPoll?.({ attempt, elapsedMs: Date.now() - started, status: last });
    if (last.state === "verified" || last.state === "failed") return last;
  }
  return last;
}

async function getOkLinkSourceCode(params: GetSourceCodeParams) {
  const chainShortName = okLinkChainShortNames[params.chainId];
  if (!chainShortName) {
    throw new Error(
      `OKLink explorer is not configured for chainId: ${params.chainId}`,
    );
  }
  const payload = {
    chainShortName,
    contractAddress: params.address,
  };

  const formattedPayload = new URLSearchParams(payload).toString();
  const apiUrl =
    "https://www.oklink.com/api/v5/explorer/contract/verify-contract-info";
  const url = `${apiUrl}?${formattedPayload}`;

  const request = await fetch(url);
  const { data, message } = (await request.json()) as {
    message: string;
    data: any[];
    status: string;
  };
  if (data.length === 0) {
    throw new Error(message);
  }
  return {
    SourceCode: data[0].sourceCode,
    ABI: data[0].contractAbi,
    CompilerVersion: data[0].compilerVersion,
    ContractName: data[0].contractName,
    EVMVersion: data[0].evmVersion,
    Implementation: data[0].implementation,
    Library: data[0].libraryInfo,
    LicenseType: data[0].licenseType,
    OptimizationUsed: data[0].optimization,
    Proxy: data[0].proxy,
    Runs: data[0].optimizationRuns,
  };
}
