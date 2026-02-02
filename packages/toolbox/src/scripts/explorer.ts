import { writeFileSync } from "node:fs";
import { ExplorerConfig } from "../ecosystem/explorers";
import { prefixWithGeneratedWarning } from "./common";

type RouteScanResponse = {
  items: {
    workspace: string;
    chainId: string;
  }[];
};

type Explorers = Record<number, ExplorerConfig>;

async function getRoutescan() {
  const result = await fetch(
    "https://cdn-canary.routescan.io/api/evm/all/explorers",
  );
  const data = (await result.json()) as RouteScanResponse;
  const formatted: Explorers = data.items.reduce((acc, d) => {
    if (!Number.isNaN(Number(d.chainId)))
      acc[Number(d.chainId)] = {
        api: `https://api.routescan.io/v2/network/${d.workspace}/evm/${d.chainId}/etherscan`,
        explorer: `${d.chainId}.routescan.io`,
      };
    return acc;
  }, {} as Explorers);
  writeFileSync(
    "src/ecosystem/generated/routescanExplorers.ts",
    prefixWithGeneratedWarning(
      `export const routescanExplorers = ${JSON.stringify(formatted, null, 2).replace(/"([^"]+)":/g, "$1:")} as const;`,
    ),
  );
}

type EtherscanResponse = {
  result: {
    blockexplorer: string;
    chainid: string;
    apiurl: string;
  }[];
};
async function getEtherscan() {
  const result = await fetch("https://api.etherscan.io/v2/chainlist");
  const data = (await result.json()) as EtherscanResponse;
  const formatted: Explorers = data.result.reduce((acc, d) => {
    acc[Number(d.chainid)] = {
      api: "https://api.etherscan.io/v2/api",
      explorer: d.blockexplorer,
    };
    return acc;
  }, {} as Explorers);
  writeFileSync(
    "src/ecosystem/generated/etherscanExplorers.ts",
    prefixWithGeneratedWarning(
      `export const etherscanExplorers = ${JSON.stringify(formatted, null, 2).replace(/"([^"]+)":/g, "$1:")} as const;`,
    ),
  );
}

type BlockscoutResponse = Record<
  string,
  { name: string; explorers: { url: string; hostedBy: string }[] }
>;
async function getBlockscout() {
  const result = await fetch("https://chains.blockscout.com/api/chains");
  const data = (await result.json()) as BlockscoutResponse;
  const formatted: Explorers = Object.keys(data).reduce((acc, chainId) => {
    acc[Number(chainId)] = {
      api: `${data[chainId].explorers[0].url.replace(/\/$/, "")}/api`,
      explorer: data[chainId].explorers[0].url,
    };
    return acc;
  }, {} as Explorers);
  writeFileSync(
    "src/ecosystem/generated/blockscoutExplorers.ts",
    prefixWithGeneratedWarning(
      `export const blockscoutExplorers = ${JSON.stringify(formatted, null, 2).replace(/"([^"]+)":/g, "$1:")} as const;`,
    ),
  );
}

getRoutescan();
getEtherscan();
getBlockscout();
