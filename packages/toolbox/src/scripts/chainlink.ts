import { zeroAddress, type Address } from "viem";
import { ChainId } from "../ecosystem/chainIds";
import { writeFileSync } from "node:fs";
import { prefixWithGeneratedWarning } from "./common";

const baseUrl = "https://reference-data-directory.vercel.app/";

const chainToJson = {
  [ChainId.mainnet]: "mainnet",
  [ChainId.bnb]: "bsc-mainnet",
  [ChainId.polygon]: "matic-mainnet",
  [ChainId.gnosis]: "xdai-mainnet",
  [ChainId.avalanche]: "avalanche-mainnet",
  [ChainId.arbitrum]: "ethereum-mainnet-arbitrum-1",
  [ChainId.optimism]: "ethereum-mainnet-optimism-1",
  [ChainId.metis]: "ethereum-mainnet-andromeda-1",
  [ChainId.base]: "ethereum-mainnet-base-1",
  [ChainId.celo]: "celo-mainnet",
  [ChainId.scroll]: "ethereum-mainnet-scroll-1",
  [ChainId.linea]: "ethereum-mainnet-linea-1",
  [ChainId.zksync]: "ethereum-mainnet-zksync-1",
  [ChainId.soneium]: "soneium-mainnet",
  [ChainId.sonic]: "sonic-mainnet",
  [ChainId.mantle]: "ethereum-mainnet-mantle-1",
};

(async function getPriceFeeds() {
  const feeds = await Promise.all(
    Object.keys(chainToJson).map(async (key) => {
      const response = await fetch(
        `${baseUrl}feeds-${chainToJson[key as unknown as keyof typeof chainToJson]}.json`,
      );
      return response.json() as unknown as {
        contractAddress: Address;
        proxyAddress: Address;
        path: string;
        // seems to be always svr
        secondaryProxyAddress?: Address;
        decimals: number;
        name: string;
      }[];
    }),
  );
  const formattedFeeds = Object.keys(chainToJson).reduce(
    (acc, key, ix) => {
      acc[key as unknown as number] = feeds[ix]
        .map((f) => {
          let name = f.name;
          if (/.*-shared-svr/.test(f.path)) {
            name = `SVR ${name}`;
          } else if (/.*-svr/.test(f.path)) {
            name = `AAVE SVR ${name}`;
          }
          return {
            contractAddress: f.contractAddress,
            proxyAddress: f.proxyAddress,
            decimals: f.decimals,
            name: name,
            ...(f.secondaryProxyAddress
              ? { secondaryProxyAddress: f.secondaryProxyAddress }
              : {}),
          };
        })
        .filter((feed) => feed.contractAddress !== zeroAddress);
      return acc;
    },
    {} as Record<
      number,
      {
        contractAddress: Address;
        proxyAddress: Address;
        secondaryProxyAddress?: Address;
        decimals: number;
        name: string;
      }[]
    >,
  );
  writeFileSync(
    "src/ecosystem/generated/chainlinkFeeds.ts",
    prefixWithGeneratedWarning(
      `export const chainlinkFeeds = ${JSON.stringify(formattedFeeds, null, 2)} as const;`,
    ),
  );
})();
