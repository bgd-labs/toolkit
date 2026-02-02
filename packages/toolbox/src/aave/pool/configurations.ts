import { Address, Client } from "viem";
import {
  IPool_ABI,
  IAToken_ABI,
  IDefaultInterestRateStrategyV2_ABI,
} from "../../abis";
import { readContract } from "viem/actions";
import { decodeReserveConfiguration } from "../reserve";

/**
 * Fetches the complete configuration and state for an Aave reserve asset.
 *
 * This function aggregates data from multiple contract calls to provide a comprehensive
 * view of a reserve's configuration, including:
 * - Reserve configuration (LTV, liquidation threshold, etc.)
 * - Token addresses (aToken, variable debt token, interest rate strategy)
 * - Current indexes and rates
 * - Scaled supply balances
 * - Available liquidity
 * - Interest rate parameters
 * - Virtual accounting data (deficit, virtual balance)
 * - Liquidation grace period
 *
 * @param client - A viem client instance configured for the target network
 * @param poolAddress - The address of the Aave Pool contract
 * @param reserve - The address of the underlying reserve asset (e.g., USDC, WETH)
 * @returns An object containing the complete reserve configuration and state
 *
 * @remarks
 * The "complete" prefix is intentional as "reserve configuration" on Aave refers to
 * a specific subset of data (the packed configuration bitmap). This function returns
 * a much broader dataset.
 *
 * The returned types are more accurate than event emissions. While events emit most
 * values as uint256 or uint128 (parsed as bigint by viem), this function returns
 * correctly typed values. For example, LTV can never exceed 1e4, so it's different to what is emitted on events, but **more correct**.
 * On event emission most values are emitted as uin256 or uint128 so they all are parsed as bigint by viem.
 * In reality, most values have tighter bounds though. E.g. Ltv can never exceed 1e4, so it perfectly fits into a js number.
 */
export async function getCompleteReserveConfiguration(
  client: Client,
  poolAddress: Address,
  reserve: Address,
) {
  const [
    reserveData,
    deficit,
    virtualUnderlyingBalance,
    liquidationGracePeriod,
  ] = await Promise.all([
    readContract(client, {
      address: poolAddress,
      abi: IPool_ABI,
      functionName: "getReserveData",
      args: [reserve],
    }),
    readContract(client, {
      address: poolAddress,
      abi: IPool_ABI,
      functionName: "getReserveDeficit",
      args: [reserve],
    }),
    readContract(client, {
      address: poolAddress,
      abi: IPool_ABI,
      functionName: "getVirtualUnderlyingBalance",
      args: [reserve],
    }),
    readContract(client, {
      address: poolAddress,
      abi: IPool_ABI,
      functionName: "getLiquidationGracePeriod",
      args: [reserve],
    }),
  ]);

  const [
    scaledATokenTotalSupply,
    scaledVTokenTotalSupply,
    availableLiquidity,
    irParams,
  ] = await Promise.all([
    readContract(client, {
      address: reserveData.aTokenAddress,
      abi: IAToken_ABI,
      functionName: "scaledTotalSupply",
    }),
    readContract(client, {
      address: reserveData.variableDebtTokenAddress,
      abi: IAToken_ABI,
      functionName: "scaledTotalSupply",
    }),
    readContract(client, {
      address: reserve,
      abi: IAToken_ABI,
      functionName: "balanceOf",
      args: [reserveData.aTokenAddress],
    }),
    readContract(client, {
      address: reserveData.interestRateStrategyAddress,
      abi: IDefaultInterestRateStrategyV2_ABI,
      functionName: "getInterestRateDataBps",
      args: [reserve],
    }),
  ]);

  const config = decodeReserveConfiguration(reserveData.configuration.data);
  return {
    ...reserveData,
    ...config,
    deficit,
    virtualUnderlyingBalance,
    liquidationGracePeriod,
    scaledATokenTotalSupply,
    scaledVTokenTotalSupply,
    availableLiquidity,
    ...irParams,
  };
}
