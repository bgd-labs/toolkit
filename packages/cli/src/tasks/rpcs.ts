import { Command, Option } from "@commander-js/extra-typings";
import { ChainId, getNetworkEnv, getRPCUrl } from "@bgd-labs/toolbox";

/**
 * Logs a list of rpcs to be used in your foundry project
 * @param program
 */
export function registerRpcs(program: Command) {
  program
    .command("rpcs")
    .description("generate a list of rpcs to be used in foundry projects")
    .addOption(
      new Option("--alchemyApiKey <string>", "defaults to env.ALCHEMY_API_KEY"),
    )
    .addOption(
      new Option(
        "--quicknodeToken <string>",
        "defaults to env.QUICKNODE_TOKEN",
      ),
    )
    .addOption(
      new Option(
        "--quicknodeEndpointName <string>",
        "defaults to env.QUICKNODE_ENDPOINT_NAME",
      ),
    )
    .action(
      async ({ alchemyApiKey, quicknodeToken, quicknodeEndpointName }) => {
        let env = "";
        let toml = "";
        Object.entries(ChainId).map(([key, chainId]) => {
          const networkEnv = getNetworkEnv(chainId);
          const rpc = getRPCUrl(chainId, {
            alchemyKey: alchemyApiKey || process.env.ALCHEMY_API_KEY,
            quicknodeToken: quicknodeToken || process.env.QUICKNODE_TOKEN,
            quicknodeEndpointName:
              quicknodeEndpointName || process.env.QUICKNODE_ENDPOINT_NAME,
          });
          env += `${networkEnv}=${rpc || ""}\n`;
          toml += `${key}="\${${networkEnv}}"\n`;
        });

        console.log("### .env ###");
        console.log(env);

        console.log("### foundry toml ###");
        console.log(toml);
      },
    );
}
