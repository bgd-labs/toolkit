import { describe, expect, it } from "vitest";
import { genericIndexer, IndexerTopicState } from "./indexLogs";
import { getClient } from "../ecosystem/rpcs";
import { AaveV3Ethereum } from "@bgd-labs/aave-address-book";
import { getContract } from "viem";
import { IPool_ABI, IPoolConfigurator_ABI } from "../abis";
import { getBlockNumber } from "viem/actions";

describe.skipIf(process.env.CI)("operations:indexLogs", () => {
  it("should process all the logs", { timeout: 30000 }, async () => {
    const client = getClient(1, {
      providerConfig: { alchemyKey: process.env.ALCHEMY_API_KEY },
    });
    const poolContract = getContract({
      client,
      abi: IPool_ABI,
      address: AaveV3Ethereum.POOL,
    });
    const correctReserves = await poolContract.read.getReservesList();
    const initialTopicCache: IndexerTopicState[] = [
      {
        lastIndexedBlockNumber: 0n,
        abi: IPoolConfigurator_ABI.find(
          (i) => i.name === "ReserveInitialized",
        )!,
        address: AaveV3Ethereum.POOL_CONFIGURATOR,
      },
    ];

    const indexer = genericIndexer({
      client,
      getIndexerState: () => {
        return initialTopicCache;
      },
      updateIndexerState: (updatedTopics) => {
        expect(updatedTopics.length).toBe(1);
        expect(updatedTopics[0].address).toBe(initialTopicCache[0].address);
        expect(updatedTopics[0].lastIndexedBlockNumber).not.toBe(0n);
      },
      processLogs: (logs) => {
        expect(logs.length).toBe(correctReserves.length);
      },
    });
    await indexer(await getBlockNumber(client));
  });
});
