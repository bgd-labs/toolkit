import { EventSource } from "eventsource";
import {
  Account,
  Address,
  Chain,
  Client,
  decodeAbiParameters,
  decodeFunctionData,
  Hex,
  HttpTransport,
  keccak256,
  SendTransactionReturnType,
  toBytes,
  toHex,
  TransactionRequest,
  WalletClient,
} from "viem";
import { getBlockNumber } from "viem/actions";

export type BundleParams = {
  inclusion: {
    block: number;
    maxBlock: number;
  };
  body: Array<{ hash: string } | { tx: string; canRevert: boolean }>;
  privacy?: {
    hints: Array<
      | "calldata"
      | "contract_address"
      | "logs"
      | "function_selector"
      | "hash"
      | "tx_hash"
      | "full"
    >;
    builders?: Array<string>;
  };
  validity: {
    refund: Array<{
      bodyIdx: number;
      percent: number;
    }>;
    refundConfig: Array<{
      address: string;
      percent: number;
    }>;
  };
  metadata?: {
    originId?: string;
  };
};

/**
 * Enhances requests with the X-Flashbots-Signature required by the flashbots relay.
 * @param account
 * @param relay
 * @returns
 */
export function flashbotsOnFetchRequest(
  account: Account,
  relay = "https://relay.flashbots.net",
) {
  return async function (request: Request, init: RequestInit) {
    if (
      (init.body as string).includes("eth_sendPrivateTransaction") ||
      (init.body as string).includes("mev_simBundle") ||
      (init.body as string).includes("mev_sendBundle")
    ) {
      if (!account.signMessage)
        throw new Error("Account must support `signMessage`");
      const signature = await account.signMessage({
        message: keccak256(toBytes(init.body?.toString()!)),
      });
      return {
        ...init,
        url: relay,
        headers: {
          "X-Flashbots-Signature": `${account.address}:${signature}`,
        },
      };
    }
  };
}

export function flashbotsClientExtension<
  T extends WalletClient<HttpTransport<undefined, false>, Chain, Account>,
>(client: T) {
  return {
    async sendPrivateTransaction(
      args: TransactionRequest,
      preferences = {
        fast: true,
        privacy: {
          hints: ["hash"],
          builders: ["flashbots", "beaverbuild.org", "Titan", "rsync"],
        },
      },
      maxBlockNumber?: bigint,
    ) {
      const request = await client.prepareTransactionRequest(args);
      const signedTx = await client.signTransaction(request);
      (await client.request({
        method: "eth_sendPrivateTransaction" as any,
        params: [
          {
            tx: signedTx,
            maxBlockNumber: toHex((await getBlockNumber(client)) + 100n),
            preferences,
            ...(maxBlockNumber ? { maxBlockNumber } : {}),
          },
        ] as any,
      })) as SendTransactionReturnType;
      return keccak256(signedTx);
    },
    async simBundle(
      bundleParams: BundleParams,
      simOptions?: {
        /* SimBundleOptions */
        parentBlock?: number | string; // Block used for simulation state. Defaults to latest block.
        blockNumber?: number; // default = parentBlock.number + 1
        coinbase?: string; // default = parentBlock.coinbase
        timestamp?: number; // default = parentBlock.timestamp + 12
        gasLimit?: number; // default = parentBlock.gasLimit
        baseFee?: bigint; // default = parentBlock.baseFeePerGas
        timeout?: number; // default = 5 (defined in seconds)
      },
    ) {
      (await client.request({
        method: "mev_simBundle" as any,
        params: [
          {
            version: "beta-1",
            ...bundleParams,
            ...(simOptions ? { simOptions } : {}),
          },
        ] as any,
      })) as SendTransactionReturnType;
    },
    async sendBundle(bundleParams: BundleParams) {
      (await client.request({
        method: "mev_sendBundle" as any,
        params: [
          {
            version: "v0.1",
            ...bundleParams,
          },
        ] as any,
      })) as SendTransactionReturnType;
    },
  };
}

export function onMevHandler(
  callback: (event: {}) => void,
  streamUrl = "https://mev-share.flashbots.net",
) {
  const events = new EventSource(streamUrl);

  events.onmessage = (event) => {
    callback(JSON.parse(event.data));
  };
  return events;
}

// called on public price updates
const transmit_signature = "0xb1dc65a4";
// called on private updates
const forward_signature = "0x6fadcf72";

export function priceUpdateDecoder(receiver: Address, calldata: Hex) {
  if (calldata.startsWith(forward_signature)) {
    const forwardParams = decodeFunctionData({
      abi: [
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "bytes", name: "data", type: "bytes" },
          ],
          name: "forward",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      data: calldata,
    });
    receiver = forwardParams.args[0] as Address;
    calldata = forwardParams.args[1] as Hex;
  }
  if (calldata.startsWith(transmit_signature)) {
    try {
      const transmitParams = decodeFunctionData({
        abi: [
          {
            inputs: [
              {
                internalType: "bytes32[3]",
                name: "reportContext",
                type: "bytes32[3]",
              },
              { internalType: "bytes", name: "report", type: "bytes" },
              { internalType: "bytes32[]", name: "rs", type: "bytes32[]" },
              { internalType: "bytes32[]", name: "ss", type: "bytes32[]" },
              { internalType: "bytes32", name: "rawVs", type: "bytes32" },
            ],
            name: "transmit",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        data: calldata,
      });
      console.log(transmitParams);
      const report = decodeAbiParameters(
        [
          { name: "observationsTimestamp", type: "uint32" },
          { name: "rawObservers", type: "bytes32" },
          { name: "observations", type: "int192[]" },
          { name: "juelsPerFeeCoin", type: "int192" },
        ],
        transmitParams.args![1] as Hex,
      ) as any;
      console.log("report", report);

      if (report[2].length) {
        return {
          receiver,
          answer: report[2][Math.floor(report[2].length / 2)] as bigint,
        };
      }
    } catch (e) {
      console.log("could not decode event (which probably is fine)");
    }
  }
}
