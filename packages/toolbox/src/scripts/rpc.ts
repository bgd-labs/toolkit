import { writeFileSync } from "node:fs";
import { prefixWithGeneratedWarning } from "./common";

const data = (await (
  await fetch("https://app-api.alchemy.com/trpc/config.getNetworkConfig")
).json()) as {
  result: { data: [{ networkChainId: number; kebabCaseId: string }] };
};

const result = data.result.data.reduce(
  (acc, val) => {
    acc[val.networkChainId] = val.kebabCaseId;
    return acc;
  },
  {} as Record<number, string>,
);

const replacer = (key: string, value: string) => {
  if (key === "undefined") return undefined;
  return value;
};

writeFileSync(
  "src/ecosystem/generated/alchemyNetworkMap.ts",
  prefixWithGeneratedWarning(
    `export const alchemyNetworkMap = ${JSON.stringify(result, replacer, 2).replace(/"([\d\.]+)"/g, "$1")} as const;`,
  ),
);

const myHeaders = new Headers();
myHeaders.append("accept", "application/json");
myHeaders.append("x-api-key", process.env.QUICKNODE_API_KEY);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
} as const;

const quickNodeApiResponse = (await (
  await fetch("https://api.quicknode.com/v0/chains", requestOptions)
).json()) as {
  data: { slug: string; networks: { slug: string; chain_id: number }[] }[];
};

const quicknodeNetworkMap = quickNodeApiResponse.data.reduce(
  (acc, network) => {
    network.networks.forEach((nw) => {
      if (nw.chain_id) {
        acc[nw.chain_id] = nw.slug;
      }
    });
    return acc;
  },
  {} as Record<number, string>,
);

writeFileSync(
  "src/ecosystem/generated/quicknodeNetworkMap.ts",
  prefixWithGeneratedWarning(
    `export const quicknodeNetworkMap = ${JSON.stringify(quicknodeNetworkMap, null, 2).replace(/"([\d\.]+)"/g, "$1")} as const;`,
  ),
);

const hyperRpcResponse = (await (
  await fetch("https://chains.hyperquery.xyz/active_chains")
).json()) as { name: string; chain_id: number; ecosystem: "evm" }[];

writeFileSync(
  "src/ecosystem/generated/hyperRPC.ts",
  prefixWithGeneratedWarning(
    `export const hyperRPCSupportedNetworks = ${JSON.stringify(
      [
        ...new Set(
          hyperRpcResponse.filter((n) => n.chain_id).map((n) => n.chain_id),
        ),
      ].sort((a, b) => a - b),
      null,
      2,
    ).replace(/"([\d\.]+)"/g, "$1")} as const;`,
  ),
);

const tenderlyResponse = (await (
  await fetch("https://api.tenderly.co/api/v1/supported-networks")
).json()) as {
  network_name: string;
  network_slugs: {
    explorer_slug: string;
    node_rpc_slug: string;
    vnet_rpc_slug: string;
  };
  chain_id: string;
  supported_features: {
    virtual_testnet: boolean;
    node: boolean;
    explorer: boolean;
    simulator: boolean;
    monitoring: boolean;
  };
}[];

writeFileSync(
  "src/ecosystem/generated/tenderly.ts",
  prefixWithGeneratedWarning(
    `export const tenderlyNetworkMap = ${JSON.stringify(
      tenderlyResponse
        .filter((n) => n.chain_id && n.supported_features.node)
        .reduce(
          (acc, n) => {
            acc[Number(n.chain_id)] = n.network_slugs.node_rpc_slug;
            return acc;
          },
          {} as Record<number, string>,
        ),
      null,
      2,
    ).replace(/"([\d\.]+)"/g, "$1")} as const;\n\n` +
      `export const tenderlyExplorerMap = ${JSON.stringify(
        tenderlyResponse
          .filter((n) => n.chain_id && n.supported_features.explorer)
          .reduce(
            (acc, n) => {
              acc[Number(n.chain_id)] = n.network_slugs.explorer_slug;
              return acc;
            },
            {} as Record<number, string>,
          ),
        null,
        2,
      ).replace(/"([\d\.]+)"/g, "$1")} as const;`,
  ),
);
