import {
  http,
  type ClientConfig,
  type HttpTransportConfig,
  createPublicClient,
  PublicClient,
  HttpTransport,
  Chain,
  Transport,
  Client,
} from "viem";
import { alchemyNetworkMap } from "./generated/alchemyNetworkMap";
import { ChainId, ChainList } from "./chainIds";
import { quicknodeNetworkMap } from "./generated/quicknodeNetworkMap";
import { hyperRPCSupportedNetworks } from "..";
import { tenderlyNetworkMap } from "./generated/tenderly";

export type SupportedChainIds = (typeof ChainId)[keyof typeof ChainId];

/**
 * A manually maintained list of public rpcs.
 * These should only be used for prs coming from forks, which should not access secrets like the alchemy api key.
 */
export const publicRPCs = {
  [ChainId.mainnet]: "https://eth.llamarpc.com",
  [ChainId.polygon]: "https://polygon.llamarpc.com",
  [ChainId.arbitrum]: "https://polygon.llamarpc.com",
  [ChainId.base]: "https://base.llamarpc.com",
  [ChainId.bnb]: "https://binance.llamarpc.com",
  [ChainId.metis]: "https://andromeda.metis.io/?owner=1088",
  [ChainId.gnosis]: "https://rpc.ankr.com/gnosis",
  [ChainId.scroll]: "https://rpc.scroll.io",
  [ChainId.zksync]: "https://mainnet.era.zksync.io",
  [ChainId.fantom]: "https://rpc.ftm.tools",
  [ChainId.avalanche]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.linea]: "https://rpc.linea.build",
  [ChainId.bob]: "https://rpc.gobob.xyz",
  [ChainId.plasma]: "https://rpc.plasma.to",
  [ChainId.ink]: "https://ink-public.nodies.app",
} as const;

export const alchemySupportedChainIds = Object.values(ChainId).filter(
  (id) => alchemyNetworkMap[id as keyof typeof alchemyNetworkMap],
);

export const getNetworkEnv = (chainId: SupportedChainIds) => {
  const symbol = Object.entries(ChainId).find(
    ([, value]) => value === chainId,
  )?.[0] as keyof typeof ChainId | undefined;

  if (!symbol) {
    throw new Error(
      `Didn't find a viem symbol for chainId: ${chainId}. Wire it up in 'src/chainIds.ts'!`,
    );
  }

  const env =
    `RPC_${symbol.toUpperCase() as Uppercase<typeof symbol>}` as const;

  return env;
};

export function getExplicitRPC(chainId: SupportedChainIds) {
  const env = getNetworkEnv(chainId);

  // User provided RPC_ URL
  if (process.env[env]) {
    return process.env[env];
  }
  throw new Error(`Env '${env}' is not set. Please set it manually.`);
}

export function getAlchemyRPC(chainId: SupportedChainIds, alchemyKey: string) {
  const alchemyId =
    alchemyNetworkMap[chainId as keyof typeof alchemyNetworkMap];

  if (!alchemyId) {
    throw new Error(`ChainId '${chainId}' is not supported by Alchemy.`);
  }

  // Typescript prevents this, catching it in runtime for js-usages
  if (!alchemyKey) {
    throw new Error(
      `ChainId '${chainId}' is supported by Alchemy, but no 'alchemyKey' was provided.`,
    );
  }

  return `https://${alchemyId}.g.alchemy.com/v2/${alchemyKey}`;
}

export function getPublicRpc(chainId: SupportedChainIds) {
  const publicRpc = publicRPCs[chainId as keyof typeof publicRPCs];
  if (!publicRpc)
    throw new Error(`No default public rpc for '${chainId}' configured.`);
  return publicRpc;
}

/**
 * HyperRPCs are extremely fast **but** they only support a subset of the standard.
 * Therefore they are not used in the generalized getClient atm.
 * @param chainId
 */
export function getHyperRPC(chainId: number) {
  if (hyperRPCSupportedNetworks.includes(chainId as any)) {
    return `https://${chainId}.rpc.hypersync.xyz`;
  }
  throw new Error(`HyperRPC does not support chainId: '${chainId}'`);
}

export function getTenderlyRpc(
  chainId: number,
  { tenderlyAccessKey }: { tenderlyAccessKey: string },
) {
  const nodeSlug =
    tenderlyNetworkMap[chainId as keyof typeof tenderlyNetworkMap];
  if (!nodeSlug) {
    throw new Error(`Tenderly does not support chainId: '${chainId}'`);
  }
  if (!tenderlyAccessKey) {
    throw new Error(
      `ChainId '${chainId}' is supported by Tenderly, but no 'tenderlyAccessKey' was provided.`,
    );
  }
  return `https://${nodeSlug}.gateway.tenderly.co/${tenderlyAccessKey}`;
}

export function getQuicknodeRpc(
  chainId: SupportedChainIds,
  options: { quicknodeEndpointName: string; quicknodeToken: string },
) {
  const quickNodeSlug =
    quicknodeNetworkMap[chainId as keyof typeof quicknodeNetworkMap];
  if (!quickNodeSlug) {
    throw new Error(`Quicknode does not support chainId: '${chainId}'`);
  }

  // Typescript prevents this, catching it in runtime for js-usages
  if (!options.quicknodeEndpointName) {
    throw new Error(
      `ChainId '${chainId}' is supported by Quicknode, but no 'quicknodeEndpointName' was provided.`,
    );
  }
  if (!options.quicknodeToken) {
    throw new Error(
      `ChainId '${chainId}' is supported by Quicknode, but no 'quicknodeToken' was provided.`,
    );
  }
  // for mainnet the api slug provided apparently is wrong and the network for whatever reason has no slug at all
  if (chainId === ChainId.mainnet) {
    return `https://${options.quicknodeEndpointName}.quiknode.pro/${options.quicknodeToken}`;
  }
  return `https://${options.quicknodeEndpointName}.${quickNodeSlug}.quiknode.pro/${options.quicknodeToken}`;
}

type GetRPCUrlOptions = {
  alchemyKey?: string;
  quicknodeEndpointName?: string;
  quicknodeToken?: string;
};

/**
 * Return a RPC_URL for supported chains.
 * If the RPC_URL environment variable is set, it will be used.
 * Otherwise will construct the URL based on the chain ID and Alchemy API key.
 *
 * @notice This method acts as fall-through and will only revert if the ChainId is strictly not supported.
 * If no RPC_URL is set, and non of the private rpc providers supports the chain, it will return undefined.
 * @param chainId
 * @param alchemyKey
 * @returns the RPC_URL for the given chain ID
 */
export const getRPCUrl = (
  chainId: SupportedChainIds,
  options?: GetRPCUrlOptions,
) => {
  // Typescript prevents this, catching it in runtime for js-usages
  if (!Object.values(ChainId).includes(chainId)) {
    throw new Error(
      `ChainId '${chainId}' is not supported by this library. Feel free to open an issue.`,
    );
  }

  try {
    return getExplicitRPC(chainId);
  } catch (e) {
    // ignore error as getRPCURL should never throw
  }
  if (options?.alchemyKey) {
    try {
      return getAlchemyRPC(chainId, options?.alchemyKey);
    } catch (e) {}
  }
  if (options?.quicknodeEndpointName && options.quicknodeToken) {
    try {
      return getQuicknodeRpc(chainId, {
        quicknodeToken: options.quicknodeToken,
        quicknodeEndpointName: options.quicknodeEndpointName,
      });
    } catch (e) {}
  }
  try {
    return getPublicRpc(chainId);
  } catch (e) {}
};

const clientCache: Record<number, Client> = {};

/**
 * Returns a viem client for the given chain with the supplied config.
 * @param chainId
 * @param param1
 * @returns A viem PublicClient with proper chain and transport types
 */
export function getClient<
  TChainId extends keyof typeof ChainList = keyof typeof ChainList,
  TTransport extends Transport = ReturnType<typeof http>,
>(
  chainId: TChainId,
  {
    httpConfig,
    clientConfig,
    providerConfig,
    forceRebuildClient,
  }: {
    httpConfig?: Partial<HttpTransportConfig>;
    clientConfig?: Partial<ClientConfig>;
    providerConfig?: GetRPCUrlOptions;
    // If supplied will create a new client, omitting the cache.
    // This can be useful when creating client with different configs.
    forceRebuildClient?: boolean;
  } = {},
): PublicClient<TTransport, (typeof ChainList)[TChainId]> {
  if (!clientCache[chainId as number] || forceRebuildClient) {
    const rpcURL = getRPCUrl(chainId as SupportedChainIds, providerConfig);

    clientCache[chainId as number] = createPublicClient({
      chain: ChainList[chainId] as Chain,
      transport: http(rpcURL, httpConfig) as TTransport,
      ...clientConfig,
    }) as PublicClient<TTransport, (typeof ChainList)[TChainId]>;
  }
  return clientCache[chainId as number] as PublicClient<
    TTransport,
    (typeof ChainList)[TChainId]
  >;
}
