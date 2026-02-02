import { getBytecode, getLogs, getStorageAt } from "viem/actions";
import { erc1967_ImplementationSlot } from "./constants";
import {
  AbiEvent,
  Address,
  Client,
  fromHex,
  GetLogsReturnType,
  Hex,
} from "viem";

export function getImplementationSlot(client: Client, address: Address) {
  return getStorageAt(client, { address, slot: erc1967_ImplementationSlot });
}

interface GetLogsRecursiveArgs<TAbiEvents extends AbiEvent[]> {
  client: Client;
  events: TAbiEvents;
  address: Address | Address[];
  fromBlock: bigint;
  toBlock: bigint;
}

/**
 * fetches logs recursively
 */
export async function getLogsRecursive<TAbiEvents extends AbiEvent[]>({
  client,
  events,
  address,
  fromBlock,
  toBlock,
}: GetLogsRecursiveArgs<TAbiEvents>): Promise<
  GetLogsReturnType<undefined, TAbiEvents>
> {
  if (fromBlock <= toBlock) {
    try {
      const logs = await getLogs(client, {
        fromBlock,
        toBlock,
        events,
        address,
      });
      return logs;
    } catch (error: any) {
      // for alchemy part of the details string contains sth like: [0x8d01be, 0x948ce4]
      const rangeMatch = (error.details as string)?.match(/.*\[(.*),\s*(.*)\]/);
      if (rangeMatch?.length === 3) {
        console.log(error.details);
        const maxBlock = fromHex(rangeMatch[2] as Hex, "bigint");
        console.log(
          `Alchemy range error, retrying via ${fromBlock}:${maxBlock}`,
        );
        const arr1 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock,
          toBlock: maxBlock,
        });
        const midBlock = BigInt(maxBlock + toBlock) >> BigInt(1);

        console.log(`Via ${maxBlock + BigInt(1)}:${midBlock}`);
        const arr2 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock: maxBlock + BigInt(1),
          toBlock: midBlock,
        });
        console.log(`And via ${midBlock + BigInt(1)}:${toBlock}`);
        const arr3 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock: midBlock + BigInt(1),
          toBlock,
        });

        return arr1.concat(arr2).concat(arr3);
      } else {
        // divide & conquer when issue/limit is now known
        const midBlock = BigInt(fromBlock + toBlock) >> BigInt(1);
        const arr1 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock,
          toBlock: midBlock,
        });
        const arr2 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock: midBlock + BigInt(1),
          toBlock,
        });
        return arr1.concat(arr2);
      }
    }
  }
  return [];
}

interface GetContractDeploymentBlockArgs {
  client: Client;
  contractAddress: Address;
  fromBlock: bigint;
  toBlock: bigint;
  maxDelta: bigint;
}

/**
 * In some cases it's important to know when a contract was first seen onChain.
 * This data is hard to obtain, as it's not indexed data.
 * On way of doing it is recursively checking on an archive node when the code was first seen.
 * @param client a viem Client
 * @param fromBlock a block on which the contract is not yet deployed
 * @param toBlock a block on which the contract is deployed
 * @param contractAddress address of the contract
 * @param maxDelta the maximum block distance between the returned block and the deployment block
 * @returns a blockNumber on which the contract is not yet deployed with a max delta to when it was deployed
 */
export async function getContractDeploymentBlock({
  client,
  contractAddress,
  fromBlock,
  toBlock,
  maxDelta,
}: GetContractDeploymentBlockArgs) {
  if (fromBlock == toBlock) return fromBlock;
  if (fromBlock < toBlock) {
    const midBlock = BigInt(fromBlock + toBlock) >> BigInt(1);
    const codeMid = await getBytecode(client, {
      blockNumber: midBlock,
      address: contractAddress,
    });
    if (!codeMid) {
      if (toBlock - midBlock > maxDelta) {
        return getContractDeploymentBlock({
          client,
          contractAddress,
          fromBlock: midBlock,
          toBlock,
          maxDelta,
        });
      } else {
        return midBlock;
      }
    }
    return getContractDeploymentBlock({
      client,
      contractAddress,
      fromBlock,
      toBlock: midBlock,
      maxDelta,
    });
  }
  throw new Error("Could not find contract deployment block");
}
