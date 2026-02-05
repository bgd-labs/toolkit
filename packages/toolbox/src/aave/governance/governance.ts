import {
  AbiStateMutability,
  Address,
  Client,
  ContractFunctionReturnType,
  fromHex,
  getContract,
  GetContractReturnType,
  Hex,
  TestClient,
  toHex,
} from "viem";
import { getBlock, getStorageAt } from "viem/actions";
import { getSolidityStorageSlotUint } from "../../math/slot";
import { setBits } from "../../math/binary";
import { IGovernance_ABI } from "../../abis";

export type Proposal = ContractFunctionReturnType<
  typeof IGovernance_ABI,
  AbiStateMutability,
  "getProposal"
>;

export enum ProposalState {
  Null = 0, // proposal does not exists
  Created = 1, // created, waiting for a cooldown to initiate the balances snapshot
  Active = 2, // balances snapshot set, voting in progress
  Queued = 3, // voting results submitted, but proposal is under grace period when guardian can cancel it
  Executed = 4, // results sent to the execution chain(s)
  Failed = 5, // voting was not successful
  Cancelled = 6, // got cancelled by guardian, or because proposition power of creator dropped below allowed minimum
  Expired = 7,
}

export const HUMAN_READABLE_PROPOSAL_STATE = {
  [ProposalState.Null]: "Null",
  [ProposalState.Created]: "Created",
  [ProposalState.Active]: "Active",
  [ProposalState.Queued]: "Queued",
  [ProposalState.Executed]: "Executed",
  [ProposalState.Failed]: "Failed",
  [ProposalState.Cancelled]: "Cancelled",
  [ProposalState.Expired]: "Expired",
};

export type GovernanceContract = GetContractReturnType<
  typeof IGovernance_ABI,
  Client
>;

export function getGovernance<T extends Client>(
  client: T,
  address: Hex,
): GovernanceContract {
  return getContract({
    abi: IGovernance_ABI,
    client,
    address,
  });
}

export async function makeProposalExecutableOnTestClient(
  client: TestClient,
  governance: Address,
  proposalId: bigint,
) {
  const currentBlock = await getBlock(client);
  // 7n is the base slot of the proposal mapping
  const proposalSlot = getSolidityStorageSlotUint(7n, proposalId);
  const data = await getStorageAt(client, {
    address: governance,
    slot: proposalSlot,
  });
  let manipulatedStorage = fromHex(data!, { to: "bigint" });
  // set queued
  manipulatedStorage = setBits(
    manipulatedStorage,
    0n,
    8n,
    ProposalState.Queued,
  );
  // set creation time
  manipulatedStorage = setBits(
    manipulatedStorage,
    16n,
    56n,
    currentBlock.timestamp - 2592000n, // (await governanceContract.read.PROPOSAL_EXPIRATION_TIME())
  );
  return client.setStorageAt({
    address: governance,
    // 3 is the slot of the payloads mapping
    index: proposalSlot,
    value: toHex(manipulatedStorage, { size: 32 }),
  });
}

export function isProposalFinal(state: ProposalState) {
  return ![
    ProposalState.Queued,
    ProposalState.Created,
    ProposalState.Active,
  ].includes(state);
}

export async function getNonFinalizedProposals<T extends Client>(
  client: T,
  governanceAddress: Address,
): Promise<bigint[]> {
  const goverannceContract = getGovernance(client, governanceAddress);
  const proposalsCount = await goverannceContract.read.getProposalsCount();
  const nonFinalProposals: bigint[] = [];
  for (let proposalId = proposalsCount - 1n; proposalId != 0n; proposalId--) {
    const proposal = await goverannceContract.read.getProposal([proposalId]);
    if (isProposalFinal(proposal.state)) nonFinalProposals.push(proposalId);
    // If the payload was created longer then expiration time in the past we no longer care
    if (proposal.creationTime < Date.now() / 1000 - 2592000) break;
  }
  return nonFinalProposals;
}
