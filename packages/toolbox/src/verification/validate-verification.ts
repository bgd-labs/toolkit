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
import { type Address } from "viem";
import { getCode } from "viem/actions";
import { getSourceCode, type ExplorerName } from "../ecosystem/explorers";
import { ChainList } from "../ecosystem/chainIds";
import { getClient } from "../ecosystem/rpcs";
import { createSolcCompiler } from "./compiler";
import { normalizeExplorerSource } from "./normalize";
import { resolveImplementation } from "./proxy";

export type ValidateVerificationParams = {
  chainId: number;
  address: Address;
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
};

export type ValidateVerificationResult = {
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
export async function validateVerification(
  params: ValidateVerificationParams,
): Promise<ValidateVerificationResult> {
  const { chainId, address, explorer } = params;
  // The explorer api key / proxy url default from the env so callers (and the
  // CLI) don't have to thread them through.
  const apiKey = params.apiKey ?? process.env.ETHERSCAN_API_KEY;
  const apiUrl = params.apiUrl ?? process.env.EXPLORER_PROXY;
  // Resolve the rpc + client via the toolbox's getClient, which reads provider
  // keys from the env (RPC_<CHAIN> / ALCHEMY_API_KEY / QUICKNODE_*, then a public
  // rpc). lib-sourcify needs the url string too, so we read it off the transport.
  const client = getClient(chainId as keyof typeof ChainList, {
    providerConfig: {
      alchemyKey: process.env.ALCHEMY_API_KEY,
      quicknodeToken: process.env.QUICKNODE_TOKEN,
      quicknodeEndpointName: process.env.QUICKNODE_ENDPOINT_NAME,
    },
  });
  const rpcUrl = (client.transport as { url?: string }).url;
  if (!rpcUrl) {
    throw new Error(
      `No rpc url available for chain ${chainId}; set RPC_<CHAIN> or a provider key (ALCHEMY_API_KEY / QUICKNODE_*) in the env.`,
    );
  }

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

  // EIP-1967 slot is the source of truth; fall back to the explorer's own proxy
  // hint for non-standard proxies it happens to recognise. Resolving a
  // non-proxy is a no-op (returns undefined).
  const implementation = await resolveImplementation({
    address,
    client,
    explorerSource: rootSource as {
      Proxy?: string;
      Implementation?: string;
    },
  });

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
