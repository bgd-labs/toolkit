import { Address, Client, getContract } from "viem";
import { IPoolAddressesProvider_ABI } from "../../abis/IPoolAddressesProvider";
import { aaveAddressesProvider_IncentivesControllerSlot } from "../constants";
import { IRewardsController_ABI } from "../../abis/IRewardsController";
import { IERC20_ABI, IERC20Metadata_ABI, IPool_ABI } from "../../abis";
import { decodeReserveConfiguration } from "../reserve";
import { readContract } from "viem/actions";

/**
 * Fetch all pool addresses that are considered immutable
 * @returns
 */
export async function fetchImmutablePoolAddresses(
  client: Client,
  poolAddressesProvider: Address,
) {
  const addressProviderContract = getContract({
    address: poolAddressesProvider,
    abi: IPoolAddressesProvider_ABI,
    client,
  });
  const [pool, configurator, oracle, aclAdmin, incentivesController] =
    await Promise.all([
      addressProviderContract.read.getPool(),
      addressProviderContract.read.getPoolConfigurator(),
      addressProviderContract.read.getPriceOracle(),
      addressProviderContract.read.getACLAdmin(),
      addressProviderContract.read.getAddress([
        aaveAddressesProvider_IncentivesControllerSlot,
      ]),
    ]);

  const incentivesControllerContract = getContract({
    address: incentivesController,
    abi: IRewardsController_ABI,
    client,
  });

  const emissionManager =
    await incentivesControllerContract.read.getEmissionManager();

  return {
    pool,
    configurator,
    oracle,
    aclAdmin,
    incentivesController,
    emissionManager,
  };
}

/**
 * Fetch all pool addresses that are considered mutable
 * @returns
 */
export async function fetchMutablePoolAddresses(
  client: Client,
  poolAddressesProvider: Address,
) {
  const addressProviderContract = getContract({
    address: poolAddressesProvider,
    abi: IPoolAddressesProvider_ABI,
    client,
  });

  const [oracleSentinel, aclAdmin, pdp] = await Promise.all([
    addressProviderContract.read.getPriceOracleSentinel(),
    addressProviderContract.read.getACLAdmin(),
    addressProviderContract.read.getPoolDataProvider(),
  ]);
  return { oracleSentinel, aclAdmin, pdp };
}

/**
 * Returns all the addresses from the PoolAddressesProvider that can be considered immutable.
 * @param client
 * @param poolAddressesProvider
 */
export async function fetchPoolAddresses(
  client: Client,
  poolAddressesProvider: Address,
) {
  return {
    ...(await fetchImmutablePoolAddresses(client, poolAddressesProvider)),
    ...(await fetchMutablePoolAddresses(client, poolAddressesProvider)),
  };
}

export async function getReserveTokens(client: Client, pool: Address) {
  const poolContract = getContract({
    address: pool,
    abi: IPool_ABI,
    client,
  });
  const reserves = await poolContract.read.getReservesList();
  const tokens = await Promise.all(
    reserves.map((r) => {
      return Promise.all([
        poolContract.read.getReserveAToken([r]),
        poolContract.read.getReserveVariableDebtToken([r]),
        r === "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"
          ? "MKR"
          : readContract(client, {
              abi: IERC20Metadata_ABI,
              functionName: "symbol",
              address: r,
            }),
      ]);
    }),
  );
  return reserves.map((r, i) => ({
    reserve: r,
    aToken: tokens[i][0],
    variableDebtToken: tokens[i][1],
    symbol: tokens[i][2],
  }));
}

/**
 * Returns all the reserves of a pool with the aToken/vToken and the decoded reserve configuration.
 * @param client
 * @param pool
 * @returns
 */
export async function getReserveConfigurations(
  client: Client,
  pool: Address,
  reserves: { reserve: Address }[],
) {
  const poolContract = getContract({
    address: pool,
    abi: IPool_ABI,
    client,
  });
  const configs = await Promise.all(
    reserves.map((r) => {
      return Promise.all([poolContract.read.getConfiguration([r.reserve])]);
    }),
  );
  const aggregated = reserves.map((r, i) => ({
    ...r,
    ...decodeReserveConfiguration(configs[i][0].data),
  }));
  return {
    reserves: aggregated,
  };
}
