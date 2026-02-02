import {
  decodeAbiParameters,
  decodeFunctionData,
  Hex,
  parseEventLogs,
} from "viem";
import { onMevHandler } from "../ecosystem/flashbots";
import { IAuthorizedForwarder_ABI } from "../abis/IAuthorizedForwarder";
import { IDualAggregator_ABI } from "../abis/IDualAggregator";

function decode(calldata: Hex) {
  const forwardParams = decodeFunctionData({
    abi: IAuthorizedForwarder_ABI,
    data: calldata,
  });
  const transmitParams = decodeFunctionData({
    abi: IDualAggregator_ABI,
    data: forwardParams.args![1] as Hex,
  });
  const abi = [
    { name: "observationsTimestamp", type: "uint32" },
    { name: "rawObservers", type: "bytes32" },
    { name: "observations", type: "int192[]" },
    { name: "juelsPerFeeCoin", type: "int192" },
  ];
  const report = decodeAbiParameters(
    abi,
    transmitParams.args![1] as Hex,
  ) as any;
  return report[2][Math.floor(report[2].length / 2)];
}

function exampleDecoder(event: any) {
  if (event.txs) return event.txs.map(exampleDecoder);
  if (event.logs) {
    const matchingLogs = parseEventLogs({
      logs: event.logs,
      abi: IDualAggregator_ABI,
    });
    if (matchingLogs.length > 0) {
      console.log("logs", matchingLogs);
    }
  }
  if (event.functionSelector === "0x6fadcf72") {
    console.log("saw function selector", event);
    console.log(decode(event.calldata));
  }
}
const stream = onMevHandler((message) => exampleDecoder(message));
