import {
  SolidityCompilation,
  SourcifyChain,
  Verification,
  type VerificationStatus,
} from "@ethereum-sourcify/lib-sourcify";
import {
  AuxdataStyle,
  decode,
  type SolidityDecodedObject,
} from "@ethereum-sourcify/bytecode-utils";
import {
  createPublicClient,
  http,
  type Address,
  type Chain,
} from "viem";
import { getCode } from "viem/actions";
import { getSourceCode, type ExplorerName } from "../ecosystem/explorers";
import { ChainList } from "../ecosystem/chainIds";
import { getRPCUrl, type SupportedChainIds } from "../ecosystem/rpcs";
import { createSolcCompiler } from "./compiler";
import { normalizeExplorerSource } from "./normalize";
import { resolveImplementation } from "./proxy";

export type VerifyBytecodeParams = {
  chainId: number;
  address: Address;
  /** Explicit RPC url. Falls back to the toolbox's resolved url when omitted. */
  rpcUrl?: string;
  /** Explorer api key (etherscan-style). */
  apiKey?: string;
  /** Explorer api url override (e.g. a proxy). Takes precedence over `explorer`. */
  apiUrl?: string;
  /**
   * Force a specific explorer family (e.g. `blockscout` on chains that have no
   * etherscan, or `oklink` for xLayer). When omitted, xLayer defaults to OKLink
   * and other chains use the prioritized explorer.
   */
  explorer?: ExplorerName;
  /**
   * When true (default), EIP-1967 / explorer-reported proxies are followed and
   * the implementation contract is verified instead of the proxy shell.
   */
  resolveProxy?: boolean;
};

export type VerifyBytecodeResult = {
  /** The address requested by the caller. */
  address: Address;
  chainId: number;
  /** Whether `address` resolved to a proxy. */
  isProxy: boolean;
  /** Implementation address, when `address` is a proxy. */
  implementation?: Address;
  /** The address whose bytecode was actually verified (impl when proxy). */
  verifiedAddress: Address;
  contractName: string;
  compilerVersion: string;
  /** Independent runtime-bytecode match against the recompiled source. */
  runtimeMatch: VerificationStatus;
  /** Independent creation-bytecode match (null unless a creation tx is found). */
  creationMatch: VerificationStatus;
  /** Whether the explorer served source at all (i.e. claims it is verified). */
  explorerClaimedVerified: boolean;
  /** CBOR auxdata decoded straight from the on-chain runtime bytecode. */
  onchainAuxdata: SolidityDecodedObject;
};

/**
 * Independently verifies that the source an explorer serves for a contract
 * actually compiles to the bytecode deployed on-chain.
 *
 * This does not trust the explorer's "verified" badge: it downloads the source
 * + compiler settings, recompiles them locally with the exact solc version, and
 * lets lib-sourcify compare the result against the live runtime bytecode,
 * reporting a `perfect` (incl. metadata) / `partial` (modulo metadata) / `null`
 * (no match) status.
 */
export async function verifyBytecode(
  params: VerifyBytecodeParams,
): Promise<VerifyBytecodeResult> {
  const { chainId, address, apiKey, apiUrl, explorer, resolveProxy = true } =
    params;
  // Resolve an rpc: explicit > toolbox's resolved url > the chain's default rpc.
  const rpcUrl =
    params.rpcUrl ??
    getRPCUrl(chainId as SupportedChainIds) ??
    ChainList[chainId as keyof typeof ChainList]?.rpcUrls?.default?.http?.[0];
  if (!rpcUrl) {
    throw new Error(
      `No rpc url available for chain ${chainId}; pass one explicitly via rpcUrl.`,
    );
  }
  const client = createPublicClient({
    chain: ChainList[chainId as keyof typeof ChainList] as Chain | undefined,
    transport: http(rpcUrl),
  });

  // 1. Pull the explorer payload for the requested address first, so we can use
  //    its proxy hints alongside the on-chain EIP-1967 slot. getSourceCode owns
  //    explorer selection (apiUrl > explorer family > prioritized default).
  const rootSource = await getSourceCode({
    chainId,
    address,
    apiKey,
    apiUrl,
    explorer,
  });

  let implementation: Address | undefined;
  if (resolveProxy) {
    // EIP-1967 slot is the source of truth; fall back to the explorer's own
    // proxy hint for non-standard proxies it happens to recognise.
    implementation = await resolveImplementation({
      address,
      client,
      explorerSource: rootSource as {
        Proxy?: string;
        Implementation?: string;
      },
    });
  }

  const verifiedAddress = implementation ?? address;
  const source =
    implementation && verifiedAddress !== address
      ? await getSourceCode({
          chainId,
          address: verifiedAddress,
          apiKey,
          apiUrl,
          explorer,
        })
      : rootSource;

  const normalized = normalizeExplorerSource(
    source as Parameters<typeof normalizeExplorerSource>[0],
  );

  // 2. Recompile locally and let lib-sourcify diff against the on-chain code.
  const compilation = new SolidityCompilation(
    createSolcCompiler(),
    normalized.compilerVersion,
    normalized.jsonInput,
    normalized.target,
  );
  const sourcifyChain = new SourcifyChain({
    name: ChainList[chainId as keyof typeof ChainList]?.name ?? `chain-${chainId}`,
    chainId,
    supported: true,
    rpcs: [{ rpc: rpcUrl }],
  });
  const verification = new Verification(
    compilation,
    sourcifyChain,
    verifiedAddress,
  );
  await verification.verify();
  const status = verification.status;

  // 3. Decode the auxdata embedded in the live runtime bytecode for reporting.
  const onchainCode = await getCode(client, { address: verifiedAddress });
  const onchainAuxdata = onchainCode
    ? decode(onchainCode, AuxdataStyle.SOLIDITY)
    : {};

  return {
    address,
    chainId,
    isProxy: Boolean(implementation),
    implementation,
    verifiedAddress,
    contractName: normalized.target.name,
    compilerVersion: normalized.compilerVersion,
    runtimeMatch: status.runtimeMatch,
    creationMatch: status.creationMatch,
    explorerClaimedVerified: Boolean(source.SourceCode),
    onchainAuxdata,
  };
}
