export function calculateAccruedRewards({
  accrued,
  userIndex,
  reserveIndex,
  userBalance,
  emissionPerSecondScaled,
  lastUpdateTimestamp,
  distributionEnd,
  totalSupply,
  currentTimestamp,
  decimalsScaling,
}: {
  accrued: bigint;
  userIndex: bigint;
  reserveIndex: bigint;
  userBalance: bigint;
  emissionPerSecondScaled: bigint;
  lastUpdateTimestamp: bigint;
  distributionEnd: bigint;
  totalSupply: bigint;
  currentTimestamp: bigint;
  decimalsScaling: number; // 18 - rewardToken.decimals()
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
    const indexIncrease =
      (emissionPerSecondScaled * timeDelta) / effectiveSupply;
    currentIndex += indexIncrease;
  }

  const pending = (userBalance * (currentIndex - userIndex)) / SCALING_FACTOR;
  return (accrued + pending) / 10n ** BigInt(decimalsScaling);
}
