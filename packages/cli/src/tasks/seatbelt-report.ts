import { IPayloadsControllerCore_ABI } from "@bgd-labs/aave-address-book/abis";
import { getAddressBookReferences } from "@bgd-labs/aave-address-book/utils";
import {
  getMdContractName,
  getPayloadsController,
  makePayloadExecutableOnTestClient,
  renderTenderlyReport,
  tenderly_createVnet,
} from "@bgd-labs/toolbox";
import { Command, Option } from "@commander-js/extra-typings";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  Address,
  encodeFunctionData,
  Hex,
  isAddress,
  parseAbi,
  zeroAddress,
} from "viem";
import { toAccount } from "viem/accounts";
import { readContract } from "viem/actions";

export function registerSeatbeltReport(program: Command) {
  program
    .command("seatbelt-report")
    .description("generates a seatbelt report for the payload")
    .addOption(new Option("-c,--chainId <number>").makeOptionMandatory())
    .addOption(new Option("--pi,--payloadId <number>"))
    .addOption(new Option("--pa, --payloadAddress <address>"))
    .addOption(new Option("--pb,--payloadBytecode <hex>"))
    .addOption(new Option("--pcd,--payloadCalldata <hex>"))
    .addOption(
      new Option("--pc, --payloadsController <address>").makeOptionMandatory(),
    )
    .addOption(
      new Option("-o, --output <output path>").default("./reports/seatbelt/"),
    )
    .addOption(
      new Option(
        "-t, --tenderlyAccessToken <string>",
        "defaults to env.TENDERLY_ACCESS_TOKEN",
      ),
    )
    .addOption(
      new Option(
        "-a, --tenderlyAccountSlug <string>",
        "defaults to env.TENDERLY_ACCOUNT_SLUG",
      ),
    )
    .addOption(
      new Option(
        "-p, --tenderlyProjectSlug <string>",
        "defaults to env.TENDERLY_PROJECT_SLUG",
      ),
    )
    .addOption(
      new Option(
        "-e, --etherscanApiKey <string>",
        "defaults to env.ETHERSCAN_API_KEY",
      ),
    )
    .action(
      async ({
        chainId,
        tenderlyAccessToken,
        tenderlyAccountSlug,
        tenderlyProjectSlug,
        output,
        payloadId,
        payloadAddress,
        payloadBytecode,
        payloadCalldata,
        payloadsController,
      }) => {
        const vnet = await tenderly_createVnet(
          {
            baseChainId: Number(chainId),
            forkChainId: 3030,
            slug: `${Math.floor(Math.random() * 1000)}acli-bgd-labs-vnet-${chainId}`,
            displayName: "seatbelt",
          },
          {
            accessToken:
              tenderlyAccessToken || process.env.TENDERLY_ACCESS_TOKEN!,
            accountSlug:
              tenderlyAccountSlug || process.env.TENDERLY_ACCOUNT_SLUG!,
            projectSlug:
              tenderlyProjectSlug || process.env.TENDERLY_PROJECT_SLUG!,
          },
        );
        const controllerContract = getPayloadsController(
          vnet.walletClient,
          payloadsController as Address,
        );

        // the current "count" will be the id after creation
        let currentId: number = 0;

        // in case the controller is permissioned we fetch the manager
        let sender: Address = zeroAddress;
        try {
          sender = await readContract(vnet.testClient, {
            address: controllerContract.address,
            abi: parseAbi([
              "function payloadsManager() external view returns (address)",
            ]),
            functionName: "payloadsManager",
          });
        } catch (e) {}
        if (payloadId) {
          currentId = Number(payloadId);
        }
        if (payloadBytecode) {
          vnet.testClient.setCode({
            address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
            bytecode: payloadBytecode as Hex,
          });
          payloadAddress = "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8";
        }
        if (payloadCalldata) {
          currentId = await controllerContract.read.getPayloadsCount();
          await vnet.walletClient.sendTransaction({
            account: toAccount(sender),
            chain: vnet.walletClient.chain,
            to: payloadsController as Address,
            data: payloadCalldata as Hex
          });
        }
        if (payloadAddress) {
          currentId = await controllerContract.read.getPayloadsCount();
          const payload = {
            target: payloadAddress as Address,
            accessLevel: 1,
            callData: "0x",
            withDelegateCall: true,
            signature: "execute()",
            value: 0n,
          } as const;
          await controllerContract.write.createPayload([[payload]], {
            account: toAccount(sender),
            chain: vnet.walletClient.chain,
          });
        }

        await makePayloadExecutableOnTestClient(
          vnet.testClient,
          payloadsController as Address,
          currentId as number,
        );

        // simulate executing the payload
        const simResult = await vnet.simulate({
          network_id: chainId.toString(),
          from: sender,
          to: payloadsController,
          input: encodeFunctionData({
            abi: IPayloadsControllerCore_ABI,
            functionName: "executePayload",
            args: [currentId],
          }),
          block_number: null,
          transaction_index: 0,
          gas: 30_000_000,
          gas_price: "0",
          value: "0",
          access_list: [],
          generate_access_list: true,
          save: true,
          source: "dashboard",
        });

        // after we simulate the execution, we also execute it
        // this way when we query the chain, we can access data as if it was already executed
        await controllerContract.write.executePayload([currentId], {
          account: toAccount(sender),
          chain: vnet.walletClient.chain,
        });

        const report = await renderTenderlyReport({
          client: vnet.walletClient,
          sim: simResult,
          payloadId: currentId,
          payload: await controllerContract.read.getPayloadById([currentId]),
          onchainLogs: {} as any,
          config: {
            etherscanApiKey: process.env.ETHERSCAN_API_KEY!,
          },
          getContractName: (sim, address) => {
            const references = getAddressBookReferences(
              address,
              Number(sim.simulation.network_id),
            );
            if (references.length > 0)
              return flagAsKnown(
                getMdContractName(sim.contracts, address),
                references[0],
              );
            return getMdContractName(sim.contracts, address);
          },
        });

        const filePath = `${output}/${chainId}_${payloadsController}`;
        mkdirSync(filePath, { recursive: true });
        writeFileSync(`${filePath}/${currentId}.md`, report.report);
        // await vnet.delete();
      },
    );
}

function flagAsKnown(value: string, reference: string) {
  return `${value} [:ghost:](https://github.com/bgd-labs/aave-address-book  "${reference}")`;
}
