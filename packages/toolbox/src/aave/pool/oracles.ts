import { Address, Client, getContract } from "viem";
import { IAaveOracle_ABI } from "../../abis/IAaveOracle";

const getOracleContract = (client: Client, oracle: Address) => {
  return getContract({
    abi: [
      {
        inputs: [],
        name: "aggregator",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "BASE_TO_USD_AGGREGATOR",
        outputs: [
          {
            internalType: "contract IChainlinkAggregator",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ASSET_TO_USD_AGGREGATOR",
        outputs: [
          {
            internalType: "contract IChainlinkAggregator",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ASSET_TO_PEG",
        outputs: [
          {
            internalType: "contract IChainlinkAggregator",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "PEG_TO_BASE",
        outputs: [
          {
            internalType: "contract IChainlinkAggregator",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: oracle,
    client,
  });
};

type OracleType = "Vanilla" | "Capo" | "Unsupported";
/**
 * This method fetches detailed oracle information, that usually is only relevant for very specific usecases.
 * @param client
 * @param param1
 */
export async function fetchOraclesDetailed(
  client: Client,
  { aaveOracle, reserves }: { aaveOracle: Address; reserves: Address[] },
) {
  const oracleContract = getContract({
    abi: IAaveOracle_ABI,
    address: aaveOracle,
    client,
  });
  const oracles = await Promise.all(
    reserves.map((reserve) => oracleContract.read.getSourceOfAsset([reserve])),
  );
  const enhancedOracleData = await Promise.all(
    reserves.map(async (reserve, ix) => {
      const oracleContract = getOracleContract(client, oracles[ix]);
      try {
        const aggregator = await oracleContract.read.aggregator();
        return {
          aggregators: [aggregator],
          reserve,
          oracle: oracles[ix],
          type: "Vanilla",
        };
      } catch (e) {
        try {
          const baseToUsd = await oracleContract.read.BASE_TO_USD_AGGREGATOR();

          return {
            reserve,
            baseToUsd,
            aggregators: [
              await getOracleContract(client, baseToUsd).read.aggregator(),
            ],
            oracle: oracles[ix],
            type: "Unsupported",
          };
        } catch (e) {
          try {
            const assetToUsd =
              await oracleContract.read.ASSET_TO_USD_AGGREGATOR();
            return {
              reserve,
              assetToUsd,
              aggregators: [
                await getOracleContract(client, assetToUsd).read.aggregator(),
              ],
              type: "Capo",
              oracle: oracles[ix],
            };
          } catch (e) {
            try {
              const [assetToPeg, pegToBase] = await Promise.all([
                oracleContract.read.ASSET_TO_PEG(),
                oracleContract.read.PEG_TO_BASE(),
              ]);
              return {
                reserve,
                pegToBase,
                assetToPeg,
                aggregators: [
                  await getOracleContract(client, assetToPeg).read.aggregator(),
                  await getOracleContract(client, pegToBase).read.aggregator(),
                ],
                oracle: oracles[ix],
                type: "Unsupported",
              };
            } catch (e) {
              // GHO AND sDAI
            }
          }
        }
      }
      return {
        reserve,
        oracle: oracles[ix],
      };
    }),
  );
  return enhancedOracleData;
}

export async function fetchLatestPrices(
  client: Client,
  { aaveOracle, reserves }: { aaveOracle: Address; reserves: Address[] },
) {
  const oracleContract = getContract({
    abi: IAaveOracle_ABI,
    address: aaveOracle,
    client,
  });
  const prices = await oracleContract.read.getAssetsPrices([reserves]);
  return prices.map((p, ix) => ({ latestAnswer: p, underlying: reserves[ix] }));
}
