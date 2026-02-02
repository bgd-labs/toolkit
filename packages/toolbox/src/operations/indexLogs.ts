import type { AbiEvent, Address, Client, Log } from "viem";
import { getLogsRecursive } from "../ecosystem/rpc-helpers";

export type IndexerTopicState<T extends {} = {}> = {
  // the address to monitor
  address: Address;
  // the last indexed block number
  lastIndexedBlockNumber: bigint;
  // the abi to monitor on the Address
  abi: AbiEvent;
  // (optional) endBlock
  endBlock?: bigint | null;
} & T;

export interface GenericIndexerArgs<T extends {} = {}> {
  client: Client;
  // A function that always returns the current state of the indexer topics
  getIndexerState: () =>
    | Promise<IndexerTopicState<T>[]>
    | IndexerTopicState<T>[];
  // A function that return updated topics
  updateIndexerState: (
    newState: IndexerTopicState<T>[],
  ) => void | Promise<void>;
  // The actual log processing: e.g. write to redis, postgres or directly to some external service, or all of them
  // For dynamic topics, simply insert them into the indexer state from within the processing
  processLogs: (
    eventLogs: Log<unknown, unknown, false, AbiEvent>[],
  ) => void | Promise<void>;
  chunkSize?: bigint;
}

function chunkCalls(from: bigint, to: bigint, maxSize: bigint) {
  const chunks: { from: bigint; to: bigint }[] = [];
  let current = from;
  while (current < to) {
    const end = Math.min(Number(current + maxSize), Number(to));
    chunks.push({ from: current, to: BigInt(end) });
    current = BigInt(end);
  }
  return chunks;
}

export function genericIndexer<T extends {} = {}>(args: GenericIndexerArgs<T>) {
  return async function (latestBlock: bigint) {
    // TODO: consider endBlock
    const topicCache = await args.getIndexerState();
    const groups = new Map<bigint, IndexerTopicState[]>();
    for (const top of topicCache) {
      if (!groups.has(top.lastIndexedBlockNumber)) {
        groups.set(top.lastIndexedBlockNumber, []);
      }
      groups.get(top.lastIndexedBlockNumber)!.push(top);
    }

    const sortedGroups = Array.from(groups).sort(
      (a, b) => Number(a[0]) - Number(b[0]),
    );
    const sequences: {
      fromBlock: bigint;
      toBlock: bigint;
      address: Address[];
      events: AbiEvent[];
    }[] = [];
    sortedGroups.forEach(([lastIndexed, grp], ix) => {
      const nextBlock = sortedGroups[ix + 1]?.[0] || latestBlock;
      const prevSequence =
        sequences.length > 0
          ? sequences[sequences.length - 1]
          : { events: [], address: [] };
      const events = Array.from(
        new Set([
          ...grp.map((g) => JSON.stringify(g.abi)),
          ...prevSequence.events.map((e) => JSON.stringify(e)),
        ]),
      ).map((e) => JSON.parse(e));
      const addresses = Array.from(
        new Set([...grp.map((g) => g.address), ...prevSequence.address]),
      );
      const chunks = args.chunkSize
        ? chunkCalls(lastIndexed, nextBlock, args.chunkSize)
        : [{ from: lastIndexed, to: nextBlock }];

      chunks.forEach(({ from, to }) => {
        sequences.push({
          fromBlock: from,
          toBlock: to,
          address: addresses,
          events,
        });
      });
    });
    await Promise.all(
      sequences.map(async (sequence) => {
        const logs = await getLogsRecursive({
          client: args.client,
          events: sequence.events,
          address: sequence.address,
          fromBlock: sequence.fromBlock,
          toBlock: sequence.toBlock,
        });

        await args.processLogs(logs);
      }),
    );
    // for (const sequence of sequences) {
    //   const logs = await getLogsRecursive({
    //     client: args.client,
    //     events: sequence.events,
    //     address: sequence.address,
    //     fromBlock: sequence.fromBlock,
    //     toBlock: sequence.toBlock,
    //   });

    //   await args.processLogs(logs);
    // }

    await args.updateIndexerState(
      topicCache.map((t) => ({
        ...t,
        lastIndexedBlockNumber: latestBlock,
      })),
    );
  };
}
