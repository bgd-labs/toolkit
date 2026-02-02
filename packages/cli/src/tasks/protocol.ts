import { Command, Option } from "@commander-js/extra-typings";
import {
  fetchPoolAddresses,
  getClient,
  getReserveTokens,
  getReserveConfigurations,
} from "@bgd-labs/toolbox";
import { AaveV3Ethereum } from "@bgd-labs/aave-address-book";

export function registerProtocol(program: Command) {
  program
    .command("protocol")
    .description("generated the storage diff between any two files")
    .action(async () => {
      const mainnetClient = getClient(1, {
        providerConfig: { alchemyKey: process.env.ALCHEMY_API_KEY },
      });
      const contracts = await fetchPoolAddresses(
        mainnetClient,
        AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
      );
      const reserveTokens = await getReserveTokens(
        mainnetClient,
        contracts.pool,
      );
      const reserveConfigs = await getReserveConfigurations(
        mainnetClient,
        contracts.pool,
        reserveTokens,
      );
      console.log(reserveConfigs);
    });
}
