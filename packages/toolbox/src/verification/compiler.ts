import type {
  ISolidityCompiler,
  SolidityJsonInput,
  SolidityOutput,
} from "@ethereum-sourcify/lib-sourcify";
import solc from "solc";

type SolcSnapshot = { compile: (input: string) => string };

/**
 * Creates an {@link ISolidityCompiler} backed by the pure-js `solc` package.
 *
 * Each requested compiler version is fetched on demand from
 * `binaries.soliditylang.org` via `solc.loadRemoteVersion` and cached in
 * memory for the lifetime of the process, so repeated compilations (e.g. the
 * edited-contract pass lib-sourcify runs to locate the cbor auxdata) only
 * download the compiler once.
 */
export function createSolcCompiler(): ISolidityCompiler {
  const cache = new Map<string, Promise<SolcSnapshot>>();

  function loadVersion(version: string): Promise<SolcSnapshot> {
    // solc.loadRemoteVersion expects the full build identifier as it appears in
    // the soljson binary list, e.g. `v0.8.19+commit.7dd6d404`.
    const normalized = version.startsWith("v") ? version : `v${version}`;
    let cached = cache.get(normalized);
    if (!cached) {
      cached = new Promise<SolcSnapshot>((resolve, reject) => {
        solc.loadRemoteVersion(
          normalized,
          (err: Error | null, snapshot: SolcSnapshot) => {
            if (err) reject(err);
            else resolve(snapshot);
          },
        );
      });
      cache.set(normalized, cached);
    }
    return cached;
  }

  return {
    async compile(
      version: string,
      solcJsonInput: SolidityJsonInput,
    ): Promise<SolidityOutput> {
      const snapshot = await loadVersion(version);
      const output = snapshot.compile(JSON.stringify(solcJsonInput));
      return JSON.parse(output) as SolidityOutput;
    },
  };
}
