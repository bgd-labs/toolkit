import { keccak256, toBytes, zeroHash } from "viem";

const makeRoleHash = (roleName: string) => keccak256(toBytes(roleName));

export const KNOWN_ROLES = {
  [makeRoleHash("PAUSE_ROLE")]: "PAUSE_ROLE",
  [makeRoleHash("ASSET_PROTECTION_ROLE")]: "ASSET_PROTECTION_ROLE",
  [makeRoleHash("POOL_ADMIN")]: "POOL_ADMIN",
  [makeRoleHash("EMERGENCY_ADMIN")]: "EMERGENCY_ADMIN",
  [makeRoleHash("RISK_ADMIN")]: "RISK_ADMIN",
  [makeRoleHash("FLASH_BORROWER")]: "FLASH_BORROWER",
  [makeRoleHash("BRIDGE")]: "BRIDGE",
  [makeRoleHash("ASSET_LISTING_ADMIN")]: "ASSET_LISTING_ADMIN",
  [makeRoleHash("EMODE_AGENT")]: "EMODE_AGENT",
  [makeRoleHash("ISOLATED_COLLATERAL_SUPPLIER")]:
    "ISOLATED_COLLATERAL_SUPPLIER",
  [zeroHash]: "DEFAULT_ADMIN",
  [makeRoleHash("COVERAGE_MANAGER")]: "COVERAGE_MANAGER",
  [makeRoleHash("PAUSE_GUARDIAN")]: "PAUSE_GUARDIAN",
  [makeRoleHash("RESCUE_GUARDIAN")]: "RESCUE_GUARDIAN",
};
