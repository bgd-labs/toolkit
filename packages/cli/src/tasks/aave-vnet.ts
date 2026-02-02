import { Command, Option } from "@commander-js/extra-typings";
import {
  getNonFinalizedPayloads,
  getPayloadsController,
  makePayloadExecutableOnTestClient,
  tenderly_createVnet,
} from "@bgd-labs/toolbox";
import { checkbox, select, Separator, input } from "@inquirer/prompts";
import * as addresses from "@bgd-labs/aave-address-book";
import { Address, parseAbi, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { toAccount } from "viem/accounts";

enum DialogOptions {
  PAYLOAD_ID,
  PAYLOAD_ADDRESS,
  PAYLOAD_ARTIFACT,
  EXIT,
  DELETE,
}

export function registerAaveVNet(program: Command) {
  program
    .command("aave-vnet")
    .description("creates a tenderly virtual testnet and execute payloads")
    .addOption(new Option("-c,--chainId <number>").makeOptionMandatory())
    .addOption(
      new Option(
        "-t, --tenderlyAccessToken <string>",
        "defaults to env.TENDERLY_ACCESS_TOKEN",
      ),
    )
    .addOption(new Option("--pc, --payloadsController <address>"))
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
    .action(
      async ({
        chainId,
        payloadsController,
        tenderlyAccessToken,
        tenderlyAccountSlug,
        tenderlyProjectSlug,
      }) => {
        const vnet = await tenderly_createVnet(
          {
            baseChainId: Number(chainId),
            forkChainId: 3030,
            slug: `${Math.floor(Math.random() * 1000)}acli-bgd-labs-vnet-${chainId}`,
            displayName: "bgd-labs cli vnet",
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
        console.info("Virtual testnet created!");
        console.info("RPC:", vnet.vnet.rpcs[0].url);
        const controllerAddress = payloadsController
          ? (payloadsController as Address)
          : findPayloadsController(Number(chainId))!;
        const controllerContract = getPayloadsController(
          vnet.walletClient,
          controllerAddress,
        );
        while (true) {
          const answer = await select({
            message: "What do you want to do?",
            choices: [
              {
                name: "Execute a registered payload",
                value: DialogOptions.PAYLOAD_ID,
              },
              {
                name: "Execute a deployed (but not registered) payload",
                value: DialogOptions.PAYLOAD_ADDRESS,
              },
              {
                name: "Execute a local payload.",
                value: DialogOptions.PAYLOAD_ARTIFACT,
              },
              new Separator(),
              {
                name: "Exit (this will keep the vnet open - you can delete it via tenderly ui)",
                value: DialogOptions.EXIT,
              },
              {
                name: "Exit and delete",
                value: DialogOptions.DELETE,
              },
            ],
          });
          switch (answer) {
            case DialogOptions.PAYLOAD_ID:
              const payloadIds = await getNonFinalizedPayloads(
                vnet.testClient,
                controllerAddress,
              );
              const answer = await checkbox({
                message: "Select the payloads you want to execute",
                choices: payloadIds.map((id) => ({
                  name: String(id),
                  value: String(id),
                })),
              });
              for (const id of answer) {
                await makePayloadExecutableOnTestClient(
                  vnet.testClient,
                  controllerAddress,
                  Number(id),
                );
                await controllerContract.write.executePayload([Number(id)]);
                console.info(`Payload ${id} executed`);
              }
              break;
            case DialogOptions.PAYLOAD_ADDRESS:
              const address = await input({
                message: "Enter the payload address",
              });
              const currentId =
                await controllerContract.read.getPayloadsCount();

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

              await controllerContract.write.createPayload([
                [
                  {
                    target: address as Address,
                    accessLevel: 1,
                    callData: "0x",
                    withDelegateCall: true,
                    signature: "execute()",
                    value: 0n,
                  },
                ],
              ], {
                account: toAccount(sender),
                chain: vnet.walletClient.chain,
              });
              await makePayloadExecutableOnTestClient(
                vnet.testClient,
                controllerAddress,
                currentId,
              );
              await controllerContract.write.executePayload([currentId]);
              break;
            case DialogOptions.EXIT:
              process.exit(0);
            case DialogOptions.DELETE:
              await vnet.delete();
              console.info("Virtual testnet deleted!");
              process.exit(0);
          }
        }
      },
    );
}

export function findPayloadsController(chainId: number): Address | void {
  const key = Object.keys(addresses).find(
    (key) =>
      (addresses[key as keyof typeof addresses] as any).CHAIN_ID === chainId &&
      (addresses[key as keyof typeof addresses] as any).PAYLOADS_CONTROLLER,
  );
  if (key)
    return (addresses[key as keyof typeof addresses] as any)
      .PAYLOADS_CONTROLLER;
}
