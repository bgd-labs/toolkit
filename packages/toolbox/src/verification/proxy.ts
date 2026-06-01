import { getAddress, type Address, type Client } from "viem";
import { getImplementationSlot } from "../ecosystem/rpc-helpers";

/** Extracts the implementation address from an EIP-1967 storage slot value. */
export function slotToAddress(slot: string | undefined): Address | undefined {
  if (!slot || BigInt(slot) === 0n) return undefined;
  return getAddress(`0x${slot.slice(-40)}`);
}

/**
 * Resolves the implementation behind a (possible) proxy. The on-chain EIP-1967
 * slot is the source of truth when a `client` is available; otherwise we fall
 * back to the explorer's own proxy hint (`Proxy` / `Implementation`), which
 * also covers the non-standard proxies an explorer happens to recognise.
 *
 * Returns `undefined` when the address is not a proxy.
 */
export async function resolveImplementation(params: {
  address: Address;
  client?: Client;
  explorerSource?: { Proxy?: string; Implementation?: string };
}): Promise<Address | undefined> {
  if (params.client) {
    const fromSlot = slotToAddress(
      await getImplementationSlot(params.client, params.address),
    );
    if (fromSlot) return fromSlot;
  }
  const reported = params.explorerSource?.Implementation;
  const isProxy = params.explorerSource?.Proxy === "1";
  if (isProxy && reported && BigInt(reported) !== 0n) {
    return getAddress(reported);
  }
  return undefined;
}
