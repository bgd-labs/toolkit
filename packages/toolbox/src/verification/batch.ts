import type { Address } from "viem";
import type { ExplorerName } from "../ecosystem/explorers";
import {
  migrateVerification,
  type MigrateVerificationParams,
  type MigrateVerificationResult,
  type MigrationEndpoint,
} from "./migrate";
import {
  validateVerification,
  type ValidateVerificationParams,
  type ValidateVerificationResult,
} from "./validate-verification";

/**
 * A contract in a migrate batch: either a single address (used on both sides) or
 * `{ from, to }` to point at different addresses on the source and target.
 */
export type MigrateBatchContract = string | { from?: Address; to?: Address };

/**
 * Batch config for {@link migrateVerificationBatch}. `from`/`to` are the shared
 * endpoints (chain/explorer/keys); each entry in `contracts` supplies the
 * address(es). Designed to round-trip through JSON so it can live in a file.
 */
export type MigrateBatchConfig = {
  from: Omit<MigrationEndpoint, "address">;
  to: Omit<MigrationEndpoint, "address">;
  wait?: boolean;
  pollIntervalMs?: number;
  pollTimeoutMs?: number;
  contracts: MigrateBatchContract[];
};

/**
 * Expands a {@link MigrateBatchConfig} into one {@link MigrateVerificationParams}
 * per contract. Pure (no network) so it is unit-testable. A string entry reuses
 * the same address on both sides; `{ from, to }` overrides either side (and a
 * lone `from` or `to` is mirrored to the other).
 */
export function expandMigrateConfig(
  config: MigrateBatchConfig,
): MigrateVerificationParams[] {
  if (!config?.from || !config?.to) {
    throw new Error("migrate batch config requires `from` and `to` endpoints");
  }
  if (!Array.isArray(config.contracts) || config.contracts.length === 0) {
    throw new Error("migrate batch config requires a non-empty `contracts` array");
  }
  return config.contracts.map((entry, i) => {
    const fromAddress =
      typeof entry === "string" ? entry : (entry.from ?? entry.to);
    const toAddress =
      typeof entry === "string" ? entry : (entry.to ?? entry.from);
    if (!fromAddress || !toAddress) {
      throw new Error(`contracts[${i}] needs a \`from\` and/or \`to\` address`);
    }
    return {
      from: { ...config.from, address: fromAddress as Address },
      to: { ...config.to, address: toAddress as Address },
      wait: config.wait,
      pollIntervalMs: config.pollIntervalMs,
      pollTimeoutMs: config.pollTimeoutMs,
    };
  });
}

/**
 * Runs every migration in a {@link MigrateBatchConfig} sequentially (explorers
 * rate-limit writes), returning one result per contract.
 */
export async function migrateVerificationBatch(
  config: MigrateBatchConfig,
  opts?: { onLog?: (message: string) => void },
): Promise<MigrateVerificationResult[]> {
  const jobs = expandMigrateConfig(config);
  const results: MigrateVerificationResult[] = [];
  for (const job of jobs) {
    results.push(await migrateVerification({ ...job, onLog: opts?.onLog }));
  }
  return results;
}

/**
 * A contract in a validate batch: either a bare address (using the config
 * defaults for chain/explorer) or an object overriding any of those fields.
 */
export type ValidateBatchContract =
  | string
  | {
      address: Address;
      chainId?: number;
      explorer?: ExplorerName;
      apiKey?: string;
      apiUrl?: string;
    };

/**
 * Batch config for {@link validateVerificationBatch}. `defaults` are applied to
 * any entry that does not set the field itself.
 */
export type ValidateBatchConfig = {
  defaults?: {
    chainId?: number;
    explorer?: ExplorerName;
    apiKey?: string;
    apiUrl?: string;
  };
  contracts: ValidateBatchContract[];
};

/**
 * Expands a {@link ValidateBatchConfig} into one {@link ValidateVerificationParams}
 * per contract, merging each entry over `defaults`. Pure (no network).
 */
export function expandValidateConfig(
  config: ValidateBatchConfig,
): ValidateVerificationParams[] {
  if (!Array.isArray(config?.contracts) || config.contracts.length === 0) {
    throw new Error("validate batch config requires a non-empty `contracts` array");
  }
  const d = config.defaults ?? {};
  return config.contracts.map((entry, i) => {
    const c = (
      typeof entry === "string" ? { address: entry } : entry
    ) as Exclude<ValidateBatchContract, string>;
    if (!c.address) throw new Error(`contracts[${i}] needs an \`address\``);
    const chainId = c.chainId ?? d.chainId;
    if (chainId === undefined) {
      throw new Error(
        `contracts[${i}] (${c.address}) needs a \`chainId\` (set it on the entry or in \`defaults\`)`,
      );
    }
    return {
      chainId,
      address: c.address as Address,
      explorer: c.explorer ?? d.explorer,
      apiKey: c.apiKey ?? d.apiKey,
      apiUrl: c.apiUrl ?? d.apiUrl,
    };
  });
}

/**
 * Runs every check in a {@link ValidateBatchConfig} sequentially, returning one
 * result per contract.
 */
export async function validateVerificationBatch(
  config: ValidateBatchConfig,
): Promise<ValidateVerificationResult[]> {
  const jobs = expandValidateConfig(config);
  const results: ValidateVerificationResult[] = [];
  for (const job of jobs) {
    results.push(await validateVerification(job));
  }
  return results;
}
