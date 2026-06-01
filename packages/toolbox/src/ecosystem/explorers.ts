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

/** chainId -> OKLink `chainShortName`, as expected by its explorer API. */
const okLinkChainShortNames: Record<number, string> = {
  [ChainId.xLayer]: "xlayer",
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
