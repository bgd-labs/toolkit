// JS implementation of https://github.com/bgd-labs/aave-v3-origin/blob/main/src/contracts/protocol/libraries/math/WadRayMath.sol
export const WAD = 10n ** 18n;
export const HALF_WAD = WAD / 2n;

export const RAY = 10n ** 27n;
export const HALF_RAY = RAY / 2n;

export const WAD_RAY_RATIO = 10n ** 9n;

export function rayMul(a: bigint, b: bigint): bigint {
  return (a * b + HALF_RAY) / RAY;
}

export function rayDiv(a: bigint, b: bigint): bigint {
  const halfB = b / 2n;

  return (halfB + a * RAY) / b;
}

export function rayToWad(a: bigint): bigint {
  const halfRatio = WAD_RAY_RATIO / 2n;

  return (halfRatio + a) / WAD_RAY_RATIO;
}

export function wadToRay(a: bigint): bigint {
  return a * WAD_RAY_RATIO;
}

export function wadDiv(a: bigint, b: bigint): bigint {
  const halfB = b / 2n;

  return (halfB + a * WAD) / b;
}
