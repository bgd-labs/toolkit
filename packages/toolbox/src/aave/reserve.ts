import { getBits } from "../math/binary";

export type ReserveConfiguration = {
  ltv: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  decimals: number;
  active: boolean;
  frozen: boolean;
  borrowingEnabled: boolean;
  // deprecated in 3.1
  // stableRateBorrowingEnabled: boolean;
  paused: boolean;
  borrowingInIsolation: boolean;
  siloedBorrowingEnabled: boolean;
  flashloaningEnabled: boolean;
  reserveFactor: number;
  borrowCap: bigint;
  supplyCap: bigint;
  liquidationProtocolFee: number;
  // deprecated in 3.2
  // eModeCategory: bigint;
  // deprecated in 3.4
  // unbackedMintCap: bigint;
  debtCeiling: bigint;
  virtualAccountingEnabled: boolean;
};

/**
 * ReserveConfiguration is a tightly packed struct that contains the configuration of a reserve
 * @param data
 * @returns the decoded ReserveConfiguration
 */
export function decodeReserveConfiguration(data: bigint): ReserveConfiguration {
  const ltv = getBits(data, 0n, 15n);
  const liquidationThreshold = getBits(data, 16n, 31n);
  const liquidationBonus = getBits(data, 32n, 47n);
  const decimals = getBits(data, 48n, 55n);
  const active = getBits(data, 56n, 56n);
  const frozen = getBits(data, 57n, 57n);
  const borrowingEnabled = getBits(data, 58n, 58n);
  // const stableRateBorrowingEnabled = getBits(data, 59n, 59n);
  const paused = getBits(data, 60n, 60n);
  const borrowingInIsolation = getBits(data, 61n, 61n);
  const siloedBorrowingEnabled = getBits(data, 62n, 62n);
  const flashloaningEnabled = getBits(data, 63n, 63n);
  const reserveFactor = getBits(data, 64n, 79n);
  const borrowCap = getBits(data, 80n, 115n);
  const supplyCap = getBits(data, 116n, 151n);
  const liquidationProtocolFee = Number(getBits(data, 152n, 167n));
  // const eModeCategory = getBits(data, 168n, 175n);
  // const unbackedMintCap = getBits(data, 176n, 211n);
  const debtCeiling = getBits(data, 212n, 251n);
  const virtualAccountingEnabled = getBits(data, 252n, 252n);

  return {
    ltv: Number(ltv),
    liquidationThreshold: Number(liquidationThreshold),
    liquidationBonus: Number(liquidationBonus),
    decimals: Number(decimals),
    active: !!active,
    frozen: !!frozen,
    borrowingEnabled: !!borrowingEnabled,
    // stableRateBorrowingEnabled: !!stableRateBorrowingEnabled,
    paused: !!paused,
    borrowingInIsolation: !!borrowingInIsolation,
    reserveFactor: Number(reserveFactor),
    borrowCap,
    supplyCap,
    liquidationProtocolFee: Number(liquidationProtocolFee),
    // eModeCategory,
    // unbackedMintCap,
    debtCeiling,
    siloedBorrowingEnabled: !!siloedBorrowingEnabled,
    flashloaningEnabled: !!flashloaningEnabled,
    virtualAccountingEnabled: !!virtualAccountingEnabled,
  };
}

export function decodeReserveConfigurationV2(data: bigint) {
  const ltv = getBits(data, 0n, 15n);
  const liquidationThreshold = getBits(data, 16n, 31n);
  const liquidationBonus = getBits(data, 32n, 47n);
  const decimals = getBits(data, 48n, 55n);
  const active = Number(getBits(data, 56n, 56n));
  const frozen = Number(getBits(data, 57n, 57n));
  const borrowingEnabled = Number(getBits(data, 58n, 58n));
  const stableBorrowingEnabled = Number(getBits(data, 59n, 59n));
  const reserveFactor = getBits(data, 64n, 79n);
  return {
    ltv,
    liquidationThreshold,
    liquidationBonus,
    decimals,
    active: !!active,
    frozen: !!frozen,
    borrowingEnabled: !!borrowingEnabled,
    stableBorrowingEnabled: !!stableBorrowingEnabled,
    reserveFactor,
  };
}
