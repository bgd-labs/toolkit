const SCALING_FACTOR = 10n ** 18n;
const PERCENTAGE_FACTOR = 100_00n;
const FLAT_EMISSION_LIQUIDITY_BOUND = 120_00n;
const FLAT_EMISSION_BPS = 80_00n;

export function getEmissionPerSecondScaled(
  maxEmissionPerSecondScaled: bigint,
  targetLiquidity: bigint,
  totalAssets: bigint,
): bigint {
  const targetLiquidityExcess =
    (targetLiquidity * FLAT_EMISSION_LIQUIDITY_BOUND) / PERCENTAGE_FACTOR;
  const flatEmission =
    (maxEmissionPerSecondScaled * FLAT_EMISSION_BPS) / PERCENTAGE_FACTOR;

  if (totalAssets <= targetLiquidity) {
    // Slope curve
    const emissionDecrease =
      (maxEmissionPerSecondScaled * totalAssets * SCALING_FACTOR) /
      targetLiquidity;
    return (
      ((2n * maxEmissionPerSecondScaled * SCALING_FACTOR - emissionDecrease) *
        totalAssets) /
      targetLiquidity
    );
  } else if (totalAssets < targetLiquidityExcess) {
    // Linear decrease
    return (
      (maxEmissionPerSecondScaled -
        ((maxEmissionPerSecondScaled - flatEmission) *
          (totalAssets - targetLiquidity)) /
          (targetLiquidityExcess - targetLiquidity)) *
      SCALING_FACTOR
    );
  } else {
    // Flat emission
    return flatEmission * SCALING_FACTOR;
  }
}

export function calculateAccruedRewards({
  accrued,
  userIndex,
  reserveIndex,
  userBalance,
  emissionPerSecond,
  lastUpdateTimestamp,
  distributionEnd,
  totalSupply,
  currentTimestamp,
}: {
  accrued: bigint;
  userIndex: bigint;
  reserveIndex: bigint;
  userBalance: bigint;
  emissionPerSecond: bigint;
  lastUpdateTimestamp: bigint;
  distributionEnd: bigint;
  totalSupply: bigint;
  currentTimestamp: bigint;
}): bigint {
  const SCALING_FACTOR = 10n ** 18n;
  const DEAD_SHARES = 10n ** 6n;

  // Simulate index increase since last on-chain update
  let currentIndex = reserveIndex;
  if (lastUpdateTimestamp < distributionEnd) {
    const effectiveEnd =
      currentTimestamp > distributionEnd ? distributionEnd : currentTimestamp;
    const timeDelta = effectiveEnd - lastUpdateTimestamp;
    const effectiveSupply =
      totalSupply < DEAD_SHARES ? DEAD_SHARES : totalSupply;
    const emissionPerSecondScaled = emissionPerSecond * SCALING_FACTOR;
    const indexIncrease =
      (emissionPerSecondScaled * timeDelta) / effectiveSupply;
    currentIndex += indexIncrease;
  }

  const pending = (userBalance * (currentIndex - userIndex)) / SCALING_FACTOR;
  return accrued + pending;
}
